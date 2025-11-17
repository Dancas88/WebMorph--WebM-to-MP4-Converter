/**
 * WebMorph - Background Script
 * Handles communication with native messaging host and manages conversions
 */

const NATIVE_HOST_NAME = "com.fimp4fx.webm_converter";

// Native messaging port
let nativePort = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 2000; // 2 seconds
let reconnectTimer = null;

// Conversion queue and status
let conversionQueue = [];
let activeConversions = new Map();
let conversionHistory = []; // Stores last conversions

/**
 * Initialize native messaging connection
 */
function connectToNativeHost() {
    // Don't try to connect if already connected
    if (nativePort !== null) {
        console.log("Already connected to native host");
        return true;
    }

    console.log("Connecting to native host:", NATIVE_HOST_NAME);

    try {
        nativePort = browser.runtime.connectNative(NATIVE_HOST_NAME);

        nativePort.onMessage.addListener((message) => {
            console.log("Received from native host:", message);
            handleNativeMessage(message);

            // Reset reconnect attempts on successful message
            reconnectAttempts = 0;
        });

        nativePort.onDisconnect.addListener(() => {
            console.error("Disconnected from native host");
            if (browser.runtime.lastError) {
                console.error("Error:", browser.runtime.lastError.message);
            }

            const wasConnected = nativePort !== null;
            nativePort = null;

            // Attempt to reconnect if we were previously connected and haven't exceeded max attempts
            if (wasConnected && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                reconnectAttempts++;
                console.log(`Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);

                // Clear any existing reconnect timer
                if (reconnectTimer) {
                    clearTimeout(reconnectTimer);
                }

                // Schedule reconnect
                reconnectTimer = setTimeout(() => {
                    connectToNativeHost();
                }, RECONNECT_DELAY);
            } else if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
                console.error("Max reconnection attempts reached. Please check native host installation.");
                reconnectAttempts = 0; // Reset for manual retry
            }
        });

        console.log("Connected to native host successfully");
        reconnectAttempts = 0; // Reset counter on successful connection
        return true;
    } catch (error) {
        console.error("Failed to connect to native host:", error);
        nativePort = null;
        return false;
    }
}

/**
 * Send message to native host
 */
function sendToNativeHost(message) {
    if (!nativePort) {
        console.log("Native port not connected, attempting to connect...");
        if (!connectToNativeHost()) {
            console.error("Failed to establish connection");
            return false;
        }

        // Wait a moment for connection to establish
        // Note: This is synchronous, but the connection should be immediate
        if (!nativePort) {
            console.error("Connection failed - native port still null");
            return false;
        }
    }

    try {
        console.log("Sending to native host:", message);
        nativePort.postMessage(message);
        return true;
    } catch (error) {
        console.error("Error sending message:", error);
        nativePort = null; // Reset port on error
        return false;
    }
}

/**
 * Handle messages from native host
 */
function handleNativeMessage(message) {
    const action = message.action;

    switch (action) {
        case 'pong':
            console.log("Native host is alive:", message);
            break;

        case 'ffmpeg_status':
            console.log("FFmpeg status:", message);
            // Broadcast status to popup if open
            browser.runtime.sendMessage({
                type: 'ffmpeg_status',
                data: message
            }).catch(() => {
                // Popup might not be open, that's ok
            });
            break;

        case 'convert_result':
            handleConversionResult(message);
            break;

        default:
            console.log("Unknown action from native host:", message);
    }
}

/**
 * Handle conversion result from native host
 */
async function handleConversionResult(result) {
    console.log("Conversion result:", result);

    // Load settings to check notification and badge preferences
    const storageResult = await browser.storage.local.get('settings');
    const settings = storageResult.settings || {};
    const showNotifications = settings.showNotifications !== false;
    const showBadge = settings.showBadge !== false;

    if (result.success) {
        // Extract filename and folder from path
        const fullPath = result.output_path;
        const filename = fullPath.split(/[\\/]/).pop();
        const folderPath = fullPath.substring(0, fullPath.lastIndexOf(/[\\/]/.exec(fullPath)[0]));
        const deletedMsg = result.deleted_original ? '\n(Original WebM deleted)' : '';

        // Show success notification with path info
        if (showNotifications) {
            const notificationId = `conversion-success-${Date.now()}`;
            browser.notifications.create(notificationId, {
                type: "basic",
                iconUrl: browser.runtime.getURL("icons/icon-48.png"),
                title: "✅ Conversion Completed",
                message: `File: ${filename}${deletedMsg}\n\nClick to open folder: ${folderPath}`
            });

            // Store the path for when user clicks notification
            browser.notifications.onClicked.addListener(function openFolder(notifId) {
                if (notifId === notificationId) {
                    // Open the download folder
                    browser.downloads.showDefaultFolder();

                    // Remove this listener after use
                    browser.notifications.onClicked.removeListener(openFolder);
                }
            });
        }

        // Update badge to show success
        if (showBadge) {
            browser.browserAction.setBadgeText({ text: "✓" });
            browser.browserAction.setBadgeBackgroundColor({ color: "#10b981" });

            // Clear badge after 5 seconds
            setTimeout(() => {
                browser.browserAction.setBadgeText({ text: "" });
            }, 5000);
        }

        // Update active conversions
        const inputPath = result.input_path || 'unknown';
        activeConversions.delete(inputPath);

        // Add to history
        const historyEntry = {
            timestamp: Date.now(),
            filename: filename,
            outputPath: fullPath,
            folderPath: folderPath,
            success: true,
            deletedOriginal: result.deleted_original
        };
        conversionHistory.unshift(historyEntry); // Add to beginning

        // Keep only last 20 conversions
        if (conversionHistory.length > 20) {
            conversionHistory = conversionHistory.slice(0, 20);
        }

        // Save to storage
        browser.storage.local.set({ conversionHistory: conversionHistory });

    } else {
        // Show error notification
        if (showNotifications) {
            browser.notifications.create({
                type: "basic",
                iconUrl: browser.runtime.getURL("icons/icon-48.png"),
                title: "❌ Conversion Failed",
                message: result.error || "Unknown error occurred"
            });
        }

        // Update badge to show error
        if (showBadge) {
            browser.browserAction.setBadgeText({ text: "✗" });
            browser.browserAction.setBadgeBackgroundColor({ color: "#ef4444" });

            // Clear badge after 5 seconds
            setTimeout(() => {
                browser.browserAction.setBadgeText({ text: "" });
            }, 5000);
        }

        // Add error to history
        const historyEntry = {
            timestamp: Date.now(),
            filename: result.input_path ? result.input_path.split(/[\\/]/).pop() : 'unknown',
            error: result.error,
            success: false
        };
        conversionHistory.unshift(historyEntry);

        // Keep only last 20 conversions
        if (conversionHistory.length > 20) {
            conversionHistory = conversionHistory.slice(0, 20);
        }

        // Save to storage
        browser.storage.local.set({ conversionHistory: conversionHistory });
    }

    // Broadcast to popup if open
    browser.runtime.sendMessage({
        type: 'conversion_result',
        data: result
    }).catch(() => {
        // Popup might not be open, that's ok
    });
}

/**
 * Start a conversion with settings from storage
 */
async function startConversion(inputPath, outputPath = null) {
    console.log(`Starting conversion: ${inputPath}`);

    // Load settings
    const result = await browser.storage.local.get('settings');
    const settings = result.settings || {};

    // Check if auto-convert is disabled
    if (settings.autoConvert === false) {
        console.log("Auto-conversion is disabled");
        return false;
    }

    // Show badge if enabled
    if (settings.showBadge !== false) {
        browser.browserAction.setBadgeText({ text: "..." });
        browser.browserAction.setBadgeBackgroundColor({ color: "#3b82f6" });
    }

    // Build conversion parameters based on settings
    const conversionParams = {
        action: 'convert',
        input_path: inputPath,
        output_path: outputPath
    };

    // Add quality settings
    const quality = settings.quality || 'medium';
    if (quality === 'custom') {
        conversionParams.crf = settings.customCrf || 23;
        conversionParams.preset = settings.customPreset || 'medium';
    } else {
        // Preset quality levels
        const qualityMap = {
            low: { crf: 28, preset: 'fast' },
            medium: { crf: 23, preset: 'medium' },
            high: { crf: 18, preset: 'slow' }
        };
        const qualitySettings = qualityMap[quality] || qualityMap.medium;
        conversionParams.crf = qualitySettings.crf;
        conversionParams.preset = qualitySettings.preset;
    }

    // Add output format
    conversionParams.output_format = settings.outputFormat || 'mp4';

    // Add custom output folder if specified
    if (settings.outputFolder) {
        conversionParams.output_folder = settings.outputFolder;
    }

    // Add custom FFmpeg arguments if specified
    if (settings.customArgs) {
        conversionParams.custom_args = settings.customArgs;
    }

    // Add delete original flag
    conversionParams.delete_original = settings.deleteOriginal !== false;

    // Track active conversion
    activeConversions.set(inputPath, {
        startTime: Date.now(),
        status: 'converting'
    });

    // Send to native host
    const success = sendToNativeHost(conversionParams);

    if (!success) {
        if (settings.showNotifications !== false) {
            browser.notifications.create({
                type: "basic",
                iconUrl: browser.runtime.getURL("icons/icon-48.png"),
                title: "Conversion Error",
                message: "Failed to communicate with native host"
            });
        }
        activeConversions.delete(inputPath);
    }

    return success;
}

/**
 * Check FFmpeg availability
 */
function checkFFmpeg() {
    console.log("Checking FFmpeg availability");
    return sendToNativeHost({ action: 'check_ffmpeg' });
}

/**
 * Test native host connection
 */
function testConnection() {
    console.log("Testing native host connection");
    return sendToNativeHost({ action: 'ping' });
}

/**
 * Handle messages from popup
 */
browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    console.log("Received message from popup:", message);

    switch (message.type) {
        case 'test_connection':
            const connected = testConnection();
            sendResponse({ success: connected });
            break;

        case 'check_ffmpeg':
            const checked = checkFFmpeg();
            sendResponse({ success: checked });
            break;

        case 'convert_file':
            const started = startConversion(message.inputPath, message.outputPath);
            sendResponse({ success: started });
            break;

        case 'get_status':
            sendResponse({
                connected: nativePort !== null,
                activeConversions: Array.from(activeConversions.entries())
            });
            break;

        case 'get_history':
            sendResponse({
                history: conversionHistory
            });
            break;

        case 'clear_history':
            conversionHistory = [];
            browser.storage.local.set({ conversionHistory: [] });
            sendResponse({ success: true });
            break;

        default:
            console.warn("Unknown message type:", message.type);
            sendResponse({ success: false, error: 'Unknown message type' });
    }

    return true; // Keep channel open for async response
});

/**
 * Initialize on startup
 */
console.log("WebMorph background script loaded");

// Load conversion history from storage
browser.storage.local.get('conversionHistory').then((data) => {
    if (data.conversionHistory) {
        conversionHistory = data.conversionHistory;
        console.log(`Loaded ${conversionHistory.length} conversions from history`);
    }
});

// Try to connect to native host on startup
const initialConnection = connectToNativeHost();

if (initialConnection) {
    // Check FFmpeg after connection is established (only if connected)
    setTimeout(() => {
        if (nativePort !== null) {
            checkFFmpeg();
        }
    }, 500);
}

console.log("WebMorph initialized");

/**
 * FASE 2: Download Interception
 * Automatically intercept and convert WebM downloads
 */

// Track downloads being processed
let downloadQueue = new Map();

/**
 * Listen for new downloads
 */
browser.downloads.onCreated.addListener(async (downloadItem) => {
    console.log("Download created:", downloadItem);

    // Check if it's a WebM file
    const filename = downloadItem.filename || '';
    const isWebM = filename.toLowerCase().endsWith('.webm');

    if (isWebM) {
        console.log("WebM download detected:", filename);

        // Load settings to check if auto-convert is enabled
        const result = await browser.storage.local.get('settings');
        const settings = result.settings || {};

        // Check if auto-convert is disabled
        if (settings.autoConvert === false) {
            console.log("Auto-conversion is disabled, skipping");
            return;
        }

        // Store download info
        downloadQueue.set(downloadItem.id, {
            id: downloadItem.id,
            filename: filename,
            startTime: Date.now(),
            status: 'downloading'
        });

        // Show notification if enabled
        if (settings.showNotifications !== false) {
            browser.notifications.create({
                type: "basic",
                iconUrl: browser.runtime.getURL("icons/icon-48.png"),
                title: "WebM Download Detected",
                message: `Will convert: ${filename.split(/[\\/]/).pop()}`
            });
        }
    }
});

/**
 * Listen for download completion
 */
browser.downloads.onChanged.addListener((delta) => {
    // Check if this download is in our queue
    if (!downloadQueue.has(delta.id)) {
        return;
    }

    const downloadInfo = downloadQueue.get(delta.id);

    // Download completed
    if (delta.state && delta.state.current === 'complete') {
        console.log("WebM download completed:", downloadInfo.filename);

        // Get full download info to get the path
        browser.downloads.search({ id: delta.id }).then((downloads) => {
            if (downloads.length === 0) {
                console.error("Download not found:", delta.id);
                return;
            }

            const download = downloads[0];
            const fullPath = download.filename;

            console.log("Starting automatic conversion:", fullPath);

            // Update status
            downloadInfo.status = 'converting';

            // Start conversion
            startConversion(fullPath);

            // Clean up queue after a delay
            setTimeout(() => {
                downloadQueue.delete(delta.id);
            }, 60000); // Keep for 1 minute
        });
    }

    // Download failed
    if (delta.error) {
        console.error("Download failed:", downloadInfo.filename, delta.error);
        downloadQueue.delete(delta.id);
    }
});

console.log("Download interception enabled");
