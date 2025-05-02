/**
 * settings.js - Settings management for Lefaton Cheat
 * Manages loading, saving, and accessing user settings
 */

// Default settings
const DEFAULT_SETTINGS = {
    headerColor: '#7c5cff',
    backgroundColor: '#000000',
    accentColor: '#7c5cff',
    textColor: '#FFFFFF',
    titleSize: '100',
    subtitleSize: '100',
    bodyTextSize: '100',
    waveSpeed: '5',
    starSpeed: '5',
    background: 'stars',
    theme: 'dark'
};

/**
 * Retrieves default settings
 * @returns {Object} Default settings object
 */
function getDefaultSettings() {
    return Object.assign({}, DEFAULT_SETTINGS);
}

/**
 * Gets saved settings from localStorage, falls back to defaults
 * @returns {Object} Settings object
 */
function getSavedSettings() {
    const savedSettingsStr = localStorage.getItem('customSettings');
    let settings = null;
    
    if (savedSettingsStr) {
        try {
            settings = JSON.parse(savedSettingsStr);
        } catch (e) {
            console.error('Error parsing saved settings:', e);
            settings = getDefaultSettings();
        }
    } else {
        settings = getDefaultSettings();
    }
    
    return settings;
}

/**
 * Gets a specific setting value
 * @param {string} key - Setting key to retrieve
 * @returns {*} Setting value or undefined
 */
function getSettingValue(key) {
    const settings = getSavedSettings();
    return settings[key] !== undefined ? settings[key] : DEFAULT_SETTINGS[key];
}

/**
 * Updates a specific setting
 * @param {string} key - Setting key to update
 * @param {*} value - New value
 */
function updateSetting(key, value) {
    const settings = getSavedSettings();
    settings[key] = value;
    localStorage.setItem('customSettings', JSON.stringify(settings));
}

/**
 * Updates multiple settings at once
 * @param {Object} newSettings - Object with settings to update
 */
function updateSettings(newSettings) {
    const settings = getSavedSettings();
    const updatedSettings = Object.assign(settings, newSettings);
    localStorage.setItem('customSettings', JSON.stringify(updatedSettings));
}

/**
 * Saves current settings to localStorage
 * @param {Object} settings - Settings object to save
 */
function saveSettings(settings) {
    localStorage.setItem('customSettings', JSON.stringify(settings));
    
    // Dispatch event to notify other components
    if (typeof dispatchSettingsChanged === 'function') {
        dispatchSettingsChanged(settings);
    } else {
        // Fallback if utils.js is not loaded
        const event = new CustomEvent('customSettingsChanged', {
            detail: {
                settings: settings,
                timestamp: new Date().getTime()
            }
        });
        window.dispatchEvent(event);
    }
}

/**
 * Resets all settings to default values
 * @returns {Object} Default settings
 */
function resetSettings() {
    const defaultSettings = getDefaultSettings();
    localStorage.setItem('customSettings', JSON.stringify(defaultSettings));
    
    // Dispatch event for settings change
    if (typeof dispatchSettingsChanged === 'function') {
        dispatchSettingsChanged(defaultSettings);
    }
    
    return defaultSettings;
}

/**
 * Applies settings to the UI elements
 * @param {Object} settings - Settings object to apply
 */
function applySettings(settings) {
    if (!settings) {
        settings = getSavedSettings();
    }
    
    // Apply colors
    if (settings.headerColor) {
        document.documentElement.style.setProperty('--header-color', settings.headerColor);
        document.documentElement.style.setProperty('--wave-color-1', hexToRgba(settings.headerColor, 0.7));
        document.documentElement.style.setProperty('--wave-color-2', hexToRgba(settings.headerColor, 0.5));
        document.documentElement.style.setProperty('--wave-color-3', hexToRgba(settings.headerColor, 0.3));
        document.documentElement.style.setProperty('--wave-color-4', settings.headerColor);
    }
    
    if (settings.backgroundColor) {
        document.body.style.backgroundColor = settings.backgroundColor;
    }
    
    if (settings.accentColor) {
        document.documentElement.style.setProperty('--accent-color', settings.accentColor);
        document.documentElement.style.setProperty('--accent-hover', lightenColor(settings.accentColor, 20));
        updateAccentColorRGB(settings.accentColor);
    }
    
    if (settings.textColor) {
        document.documentElement.style.setProperty('--text-color', settings.textColor);
    }
    
    // Apply text sizes
    if (settings.titleSize) {
        const titleFontSize = 24 + ((parseInt(settings.titleSize) / 100) * 20);
        document.documentElement.style.setProperty('--title-font-size', titleFontSize + 'px');
    }
    
    if (settings.subtitleSize) {
        const subtitleFontSize = 16 + ((parseInt(settings.subtitleSize) / 100) * 8);
        document.documentElement.style.setProperty('--subtitle-font-size', subtitleFontSize + 'px');
    }
    
    if (settings.bodyTextSize) {
        const bodyFontSize = 14 + ((parseInt(settings.bodyTextSize) / 100) * 6);
        document.documentElement.style.setProperty('--body-font-size', bodyFontSize + 'px');
    }
    
    // Apply animation settings
    if (settings.waveSpeed) {
        const waveSpeed = parseInt(settings.waveSpeed);
        const normalizedWaveSpeed = waveSpeed / 100;
        
        if (waveSpeed === 0) {
            // Stop wave animation
            document.documentElement.style.setProperty('--wave-animation-duration', '0s');
            
            const parallaxUses = document.querySelectorAll('.parallax > use');
            parallaxUses.forEach((use) => {
                use.style.animationPlayState = 'paused';
                use.style.animationDuration = '0s';
            });
        } else {
            const baseSpeed = 25; // seconds
            const newSpeed = baseSpeed / (normalizedWaveSpeed * 2 + 0.5);
            document.documentElement.style.setProperty('--wave-animation-duration', newSpeed + 's');
            
            const parallaxUses = document.querySelectorAll('.parallax > use');
            parallaxUses.forEach((use, index) => {
                const baseDurations = [7, 7, 10, 10, 13, 13, 20, 20];
                const duration = baseDurations[index % baseDurations.length] || 10;
                use.style.animationPlayState = 'running';
                use.style.animationDuration = (duration / (normalizedWaveSpeed * 2 + 0.5)) + 's';
            });
        }
    }
    
    // Apply theme
    if (settings.theme) {
        document.documentElement.setAttribute('data-theme', settings.theme);
    }
    
    // Apply background
    if (settings.background) {
        document.documentElement.setAttribute('data-background', settings.background);
    }
}

// Initialize settings when page loads
document.addEventListener('DOMContentLoaded', function() {
    applySettings(getSavedSettings());
});

// Export functions for modules that support it
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getDefaultSettings,
        getSavedSettings,
        getSettingValue,
        updateSetting,
        updateSettings,
        saveSettings,
        resetSettings,
        applySettings
    };
} 