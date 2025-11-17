/**
 * FiMp4fx - Popup Script
 * User interface logic for the extension popup
 */

// DOM elements
const hostStatus = document.getElementById('host-status');
const ffmpegStatus = document.getElementById('ffmpeg-status');
const testConnectionBtn = document.getElementById('test-connection-btn');
const checkFFmpegBtn = document.getElementById('check-ffmpeg-btn');
const convertBtn = document.getElementById('convert-btn');
const inputPath = document.getElementById('input-path');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history-btn');

/**
 * Update host status display
 */
function updateHostStatus(connected) {
    hostStatus.textContent = connected ? 'Connected ✓' : 'Disconnected ✗';
    hostStatus.className = 'status-value ' + (connected ? 'status-connected' : 'status-disconnected');
}

/**
 * Update FFmpeg status display
 */
function updateFFmpegStatus(available, version = null) {
    if (available) {
        ffmpegStatus.textContent = 'Available ✓';
        ffmpegStatus.className = 'status-value status-connected';
        ffmpegStatus.title = version || '';
    } else {
        ffmpegStatus.textContent = 'Not Found ✗';
        ffmpegStatus.className = 'status-value status-disconnected';
        ffmpegStatus.title = 'FFmpeg is required for conversions';
    }
}

/**
 * Show loading state on button
 */
function setButtonLoading(button, loading) {
    if (loading) {
        button.disabled = true;
        button.dataset.originalText = button.textContent;
        button.innerHTML = '<span class="loading"></span> Working...';
    } else {
        button.disabled = false;
        button.textContent = button.dataset.originalText || button.textContent;
    }
}

/**
 * Send message to background script
 */
async function sendMessage(message) {
    try {
        const response = await browser.runtime.sendMessage(message);
        return response;
    } catch (error) {
        console.error('Error sending message:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Show notification
 */
function showNotification(title, message, isError = false) {
    // For now, just log to console
    // In production, you might want to show in-popup notifications
    console.log(`[${isError ? 'ERROR' : 'INFO'}] ${title}: ${message}`);

    // Also show browser notification
    browser.notifications.create({
        type: "basic",
        iconUrl: browser.runtime.getURL("icons/icon-48.png"),
        title: title,
        message: message
    });
}

/**
 * Test connection to native host
 */
async function testConnection() {
    console.log('Testing connection...');
    setButtonLoading(testConnectionBtn, true);

    try {
        const response = await sendMessage({ type: 'test_connection' });

        if (response.success) {
            updateHostStatus(true);
            showNotification('Connection Test', 'Native host is responding correctly!');
        } else {
            updateHostStatus(false);
            showNotification('Connection Test', 'Failed to connect to native host', true);
        }
    } catch (error) {
        console.error('Connection test failed:', error);
        updateHostStatus(false);
        showNotification('Connection Test', 'Error: ' + error.message, true);
    } finally {
        setButtonLoading(testConnectionBtn, false);
    }
}

/**
 * Check FFmpeg availability
 */
async function checkFFmpeg() {
    console.log('Checking FFmpeg...');
    setButtonLoading(checkFFmpegBtn, true);

    try {
        const response = await sendMessage({ type: 'check_ffmpeg' });

        if (response.success) {
            // Status will be updated via message listener
            showNotification('FFmpeg Check', 'Checking FFmpeg availability...');
        } else {
            showNotification('FFmpeg Check', 'Failed to check FFmpeg status', true);
        }
    } catch (error) {
        console.error('FFmpeg check failed:', error);
        showNotification('FFmpeg Check', 'Error: ' + error.message, true);
    } finally {
        setButtonLoading(checkFFmpegBtn, false);
    }
}

/**
 * Start manual conversion
 */
async function startConversion() {
    const path = inputPath.value.trim();

    if (!path) {
        showNotification('Conversion Error', 'Please enter a file path', true);
        return;
    }

    if (!path.toLowerCase().endsWith('.webm')) {
        showNotification('Conversion Error', 'File must be a .webm file', true);
        return;
    }

    console.log('Starting conversion for:', path);
    setButtonLoading(convertBtn, true);

    try {
        const response = await sendMessage({
            type: 'convert_file',
            inputPath: path
        });

        if (response.success) {
            showNotification('Conversion Started', 'Converting: ' + path);
            inputPath.value = ''; // Clear input on success
        } else {
            showNotification('Conversion Error', response.error || 'Failed to start conversion', true);
        }
    } catch (error) {
        console.error('Conversion failed:', error);
        showNotification('Conversion Error', 'Error: ' + error.message, true);
    } finally {
        setButtonLoading(convertBtn, false);
    }
}

/**
 * Get initial status from background script
 */
async function getStatus() {
    try {
        const response = await sendMessage({ type: 'get_status' });
        console.log('Status:', response);

        if (response) {
            updateHostStatus(response.connected);
        }
    } catch (error) {
        console.error('Failed to get status:', error);
        updateHostStatus(false);
    }
}

/**
 * Listen for messages from background script
 */
browser.runtime.onMessage.addListener((message) => {
    console.log('Received message in popup:', message);

    switch (message.type) {
        case 'ffmpeg_status':
            updateFFmpegStatus(message.data.available, message.data.version);
            break;

        case 'conversion_result':
            if (message.data.success) {
                showNotification(
                    'Conversion Complete',
                    'File converted: ' + message.data.output_path
                );
            } else {
                showNotification(
                    'Conversion Failed',
                    message.data.error || 'Unknown error',
                    true
                );
            }
            // Refresh history
            loadHistory();
            break;

        default:
            console.log('Unknown message type:', message.type);
    }
});

/**
 * Load and display conversion history
 */
async function loadHistory() {
    try {
        const response = await sendMessage({ type: 'get_history' });
        const history = response.history || [];

        historyList.innerHTML = '';

        history.forEach(entry => {
            const item = document.createElement('div');
            item.className = 'history-item' + (entry.success ? '' : ' error');

            const time = new Date(entry.timestamp).toLocaleString();

            if (entry.success) {
                item.innerHTML = `
                    <div class="history-filename">✓ ${entry.filename}</div>
                    <div class="history-time">${time}</div>
                    <div class="history-path" data-path="${entry.folderPath}">
                        📁 Open folder: ${entry.folderPath}
                    </div>
                `;

                // Add click handler to open folder
                const pathElement = item.querySelector('.history-path');
                pathElement.addEventListener('click', () => {
                    browser.downloads.showDefaultFolder();
                });
            } else {
                item.innerHTML = `
                    <div class="history-filename">✗ ${entry.filename}</div>
                    <div class="history-time">${time}</div>
                    <div class="history-error">${entry.error}</div>
                `;
            }

            historyList.appendChild(item);
        });
    } catch (error) {
        console.error('Failed to load history:', error);
    }
}

/**
 * Clear conversion history
 */
async function clearHistory() {
    if (confirm('Clear all conversion history?')) {
        try {
            await sendMessage({ type: 'clear_history' });
            historyList.innerHTML = '';
            showNotification('History Cleared', 'Conversion history has been cleared');
        } catch (error) {
            console.error('Failed to clear history:', error);
        }
    }
}

/**
 * Event listeners
 */
testConnectionBtn.addEventListener('click', testConnection);
checkFFmpegBtn.addEventListener('click', checkFFmpeg);
convertBtn.addEventListener('click', startConversion);
clearHistoryBtn.addEventListener('click', clearHistory);

// Allow Enter key in input field
inputPath.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        startConversion();
    }
});

/**
 * Initialize on load
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Popup loaded');

    // Get initial status
    getStatus();

    // Load conversion history
    loadHistory();

    // Check FFmpeg after a short delay
    setTimeout(() => {
        checkFFmpeg();
    }, 500);
});

console.log('FiMp4fx popup script loaded');
