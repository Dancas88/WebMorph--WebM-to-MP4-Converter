/**
 * WebMorph - Simplified Popup
 */

// DOM elements
const hostStatus = document.getElementById('host-status');
const ffmpegStatus = document.getElementById('ffmpeg-status');
const setupText = document.getElementById('setup-text');
const setupLink = document.getElementById('setup-link');
const openSettingsBtn = document.getElementById('open-settings-btn');

/**
 * Apply theme based on system preference or saved preference
 */
async function applyTheme() {
    try {
        // Check saved theme preference
        const result = await browser.storage.local.get('theme');
        let theme = result.theme;

        // If no saved preference, use system preference
        if (!theme) {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                theme = 'dark';
            } else {
                theme = 'light';
            }
        }

        // Apply theme
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    } catch (error) {
        console.error('Failed to apply theme:', error);
    }
}

/**
 * Update status displays
 */
function updateStatus(connected, ffmpegAvailable) {
    // Native Host
    if (connected) {
        hostStatus.textContent = 'Ready';
        hostStatus.className = 'status-badge status-ok';
    } else {
        hostStatus.textContent = 'Not Found';
        hostStatus.className = 'status-badge status-error';
        setupText.style.display = 'block';
    }

    // FFmpeg
    if (ffmpegAvailable) {
        ffmpegStatus.textContent = 'Ready';
        ffmpegStatus.className = 'status-badge status-ok';
    } else if (ffmpegAvailable === false) {
        ffmpegStatus.textContent = 'Not Found';
        ffmpegStatus.className = 'status-badge status-error';
        setupText.style.display = 'block';
    }
}

/**
 * Get status from background
 */
async function checkStatus() {
    try {
        // Check native host connection
        const statusResponse = await browser.runtime.sendMessage({ type: 'get_status' });
        const connected = statusResponse.connected;

        // Check FFmpeg
        await browser.runtime.sendMessage({ type: 'check_ffmpeg' });

        updateStatus(connected, null);

        // Listen for FFmpeg response
        setTimeout(() => {
            // FFmpeg status will arrive via onMessage listener
        }, 500);

    } catch (error) {
        console.error('Status check failed:', error);
        updateStatus(false, false);
    }
}

/**
 * Listen for messages from background
 */
browser.runtime.onMessage.addListener((message) => {
    if (message.type === 'ffmpeg_status') {
        const available = message.data.available;

        // Update FFmpeg status
        if (available) {
            ffmpegStatus.textContent = 'Ready';
            ffmpegStatus.className = 'status-badge status-ok';
        } else {
            ffmpegStatus.textContent = 'Not Found';
            ffmpegStatus.className = 'status-badge status-error';
            setupText.style.display = 'block';
        }

        // Check if native host is also ok
        const hostOk = hostStatus.textContent === 'Ready';
        if (hostOk && available) {
            setupText.style.display = 'none';
        }
    }
});

/**
 * Open setup instructions
 */
setupLink.addEventListener('click', (e) => {
    e.preventDefault();
    browser.tabs.create({
        url: browser.runtime.getURL('setup.html')
    });
});

/**
 * Open settings page
 */
openSettingsBtn.addEventListener('click', () => {
    browser.runtime.openOptionsPage();
});

/**
 * Initialize
 */
document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    checkStatus();
});
