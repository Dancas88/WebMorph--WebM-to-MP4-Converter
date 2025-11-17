/**
 * WebMorph - Options/Settings Page
 */

// Default settings
const DEFAULT_SETTINGS = {
    theme: 'system',
    autoConvert: true,
    quality: 'medium',
    customCrf: 23,
    customPreset: 'medium',
    outputFormat: 'mp4',
    deleteOriginal: true,
    outputFolder: '',
    showNotifications: true,
    showBadge: true,
    customArgs: ''
};

// DOM elements
const themeSelect = document.getElementById('theme-select');
const autoConvertToggle = document.getElementById('auto-convert-toggle');
const qualityOptions = document.querySelectorAll('input[name="quality"]');
const customQualityInputs = document.getElementById('custom-quality-inputs');
const customCrf = document.getElementById('custom-crf');
const customPreset = document.getElementById('custom-preset');
const outputFormat = document.getElementById('output-format');
const deleteOriginalToggle = document.getElementById('delete-original-toggle');
const outputFolder = document.getElementById('output-folder');
const notificationsToggle = document.getElementById('notifications-toggle');
const badgeToggle = document.getElementById('badge-toggle');
const customArgs = document.getElementById('custom-args');
const resetBtn = document.getElementById('reset-btn');
const saveBar = document.getElementById('save-bar');
const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');

let originalSettings = {};
let hasUnsavedChanges = false;

/**
 * Apply theme
 */
function applyTheme(theme) {
    let effectiveTheme = theme;

    // If system, detect system preference
    if (theme === 'system') {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            effectiveTheme = 'dark';
        } else {
            effectiveTheme = 'light';
        }
    }

    // Apply theme
    if (effectiveTheme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
}

/**
 * Load settings from storage
 */
async function loadSettings() {
    try {
        const result = await browser.storage.local.get('settings');
        const settings = result.settings || DEFAULT_SETTINGS;

        // Store original settings for comparison
        originalSettings = JSON.parse(JSON.stringify(settings));

        // Apply settings to UI
        themeSelect.value = settings.theme || DEFAULT_SETTINGS.theme;
        applyTheme(settings.theme || DEFAULT_SETTINGS.theme);

        autoConvertToggle.checked = settings.autoConvert !== false;

        const qualityValue = settings.quality || DEFAULT_SETTINGS.quality;
        const qualityRadio = document.querySelector(`input[name="quality"][value="${qualityValue}"]`);
        if (qualityRadio) {
            qualityRadio.checked = true;
            updateQualitySelection();
        }

        customCrf.value = settings.customCrf || DEFAULT_SETTINGS.customCrf;
        customPreset.value = settings.customPreset || DEFAULT_SETTINGS.customPreset;
        outputFormat.value = settings.outputFormat || DEFAULT_SETTINGS.outputFormat;
        deleteOriginalToggle.checked = settings.deleteOriginal !== false;
        outputFolder.value = settings.outputFolder || '';
        notificationsToggle.checked = settings.showNotifications !== false;
        badgeToggle.checked = settings.showBadge !== false;
        customArgs.value = settings.customArgs || '';

    } catch (error) {
        console.error('Failed to load settings:', error);
    }
}

/**
 * Get current settings from UI
 */
function getCurrentSettings() {
    const selectedQuality = document.querySelector('input[name="quality"]:checked');

    return {
        theme: themeSelect.value,
        autoConvert: autoConvertToggle.checked,
        quality: selectedQuality ? selectedQuality.value : 'medium',
        customCrf: parseInt(customCrf.value) || 23,
        customPreset: customPreset.value,
        outputFormat: outputFormat.value,
        deleteOriginal: deleteOriginalToggle.checked,
        outputFolder: outputFolder.value.trim(),
        showNotifications: notificationsToggle.checked,
        showBadge: badgeToggle.checked,
        customArgs: customArgs.value.trim()
    };
}

/**
 * Check if settings have changed
 */
function checkForChanges() {
    const currentSettings = getCurrentSettings();
    const changed = JSON.stringify(currentSettings) !== JSON.stringify(originalSettings);

    if (changed !== hasUnsavedChanges) {
        hasUnsavedChanges = changed;
        saveBar.classList.toggle('visible', changed);
    }
}

/**
 * Save settings
 */
async function saveSettings() {
    try {
        const settings = getCurrentSettings();

        await browser.storage.local.set({ settings });

        // Update original settings
        originalSettings = JSON.parse(JSON.stringify(settings));
        hasUnsavedChanges = false;
        saveBar.classList.remove('visible');

        // Show success notification
        browser.notifications.create({
            type: "basic",
            iconUrl: browser.runtime.getURL("icons/icon-48.png"),
            title: "Settings Saved",
            message: "Your preferences have been saved successfully"
        });

    } catch (error) {
        console.error('Failed to save settings:', error);
        alert('Failed to save settings: ' + error.message);
    }
}

/**
 * Reset settings to defaults
 */
async function resetSettings() {
    if (!confirm('Are you sure you want to reset all settings to their default values?')) {
        return;
    }

    try {
        await browser.storage.local.set({ settings: DEFAULT_SETTINGS });

        // Reload UI
        await loadSettings();

        hasUnsavedChanges = false;
        saveBar.classList.remove('visible');

        browser.notifications.create({
            type: "basic",
            iconUrl: browser.runtime.getURL("icons/icon-48.png"),
            title: "Settings Reset",
            message: "All settings have been reset to defaults"
        });

    } catch (error) {
        console.error('Failed to reset settings:', error);
        alert('Failed to reset settings: ' + error.message);
    }
}

/**
 * Update quality selection UI
 */
function updateQualitySelection() {
    // Update radio button styling
    document.querySelectorAll('.radio-option').forEach(option => {
        const radio = option.querySelector('input[type="radio"]');
        if (radio.checked) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });

    // Show/hide custom quality inputs
    const customRadio = document.querySelector('input[name="quality"][value="custom"]');
    if (customRadio && customRadio.checked) {
        customQualityInputs.classList.add('visible');
    } else {
        customQualityInputs.classList.remove('visible');
    }
}

/**
 * Event listeners
 */

// Theme change
themeSelect.addEventListener('change', () => {
    applyTheme(themeSelect.value);
    checkForChanges();
});

// Quality options
qualityOptions.forEach(radio => {
    radio.addEventListener('change', () => {
        updateQualitySelection();
        checkForChanges();
    });
});

// All input changes
[
    autoConvertToggle,
    customCrf,
    customPreset,
    outputFormat,
    deleteOriginalToggle,
    outputFolder,
    notificationsToggle,
    badgeToggle,
    customArgs
].forEach(element => {
    element.addEventListener('change', checkForChanges);
    element.addEventListener('input', checkForChanges);
});

// Save and cancel buttons
saveBtn.addEventListener('click', saveSettings);
cancelBtn.addEventListener('click', async () => {
    await loadSettings();
    hasUnsavedChanges = false;
    saveBar.classList.remove('visible');
});

// Reset button
resetBtn.addEventListener('click', resetSettings);

// Prevent accidental navigation away with unsaved changes
window.addEventListener('beforeunload', (e) => {
    if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// Listen for system theme changes
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (themeSelect.value === 'system') {
            applyTheme('system');
        }
    });
}

/**
 * Initialize
 */
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    updateQualitySelection();
});

console.log('WebMorph options script loaded');
