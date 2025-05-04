/**
 * theme.js - Theme management for Lefaton Cheat
 * Handles light/dark mode switching and applying theme-specific styles
 */

/**
 * Initializes theme switcher
 */
function initializeThemeSwitcher() {
    document.addEventListener('DOMContentLoaded', function() {
        // Look for theme toggle in header dropdown first, then fallback to other locations
        const themeSwitch = document.getElementById('theme-checkbox') || document.getElementById('checkbox');
        
        if (!themeSwitch) {
            console.warn('Theme switch checkbox not found');
            return;
        }
        
        // Set the default theme to dark if not already set
        const currentTheme = localStorage.getItem('theme') || 'dark';
        
        // Apply the saved theme or default theme
        applyTheme(currentTheme);
        
        // Set the checkbox state based on the theme
        // For dark theme, the checkbox should be unchecked
        // For light theme, the checkbox should be checked
        themeSwitch.checked = currentTheme === 'light';
        
        // Event listener for theme switch
        themeSwitch.addEventListener('change', function(e) {
            const newTheme = e.target.checked ? 'light' : 'dark';
            applyTheme(newTheme);
            
            // Notify about theme change
            dispatchThemeChanged(newTheme);
        }, false);
    });
}

/**
 * Applies theme to the site
 * @param {string} theme - Theme name ('light' or 'dark')
 */
function applyTheme(theme) {
    // Set theme attribute
    document.documentElement.setAttribute('data-theme', theme);
    
    // Save theme preference
    localStorage.setItem('theme', theme);
    
    // Update particle colors for theme
    updateParticleColors(theme);
    
    // Apply custom theme-specific colors
    applyCustomThemeColors(theme);
}

/**
 * Updates particle colors based on theme
 * @param {string} theme - Theme name ('light' or 'dark')
 */
function updateParticleColors(theme) {
    try {
        if (window.pJSDom && window.pJSDom.length > 0) {
            const particleColor = theme === 'light' ? '#7c5cff' : '#ffffff';
            const particleOpacity = theme === 'light' ? 0.6 : 0.8;
            const lineColor = theme === 'light' ? '#7c5cff' : '#ffffff';
            
            // Update background particles
            if (window.pJSDom[0] && window.pJSDom[0].pJS) {
                window.pJSDom[0].pJS.particles.color.value = particleColor;
                window.pJSDom[0].pJS.particles.opacity.value = particleOpacity;
                window.pJSDom[0].pJS.particles.line_linked.color = lineColor;
                window.pJSDom[0].pJS.fn.particlesRefresh();
            }
            
            // Update foreground particles if they exist
            if (window.pJSDom[1] && window.pJSDom[1].pJS) {
                window.pJSDom[1].pJS.particles.color.value = particleColor;
                window.pJSDom[1].pJS.particles.opacity.value = particleOpacity;
                window.pJSDom[1].pJS.particles.line_linked.color = lineColor;
                window.pJSDom[1].pJS.fn.particlesRefresh();
            }
        }
    } catch(e) {
        console.error("Error updating particle colors:", e);
    }
}

/**
 * Applies custom theme colors from settings
 * @param {string} theme - Theme name ('light' or 'dark')
 */
function applyCustomThemeColors(theme) {
    const customSettings = localStorage.getItem('customSettings');
    if (customSettings) {
        try {
            const settings = JSON.parse(customSettings);
            
            // Set default accent color
            const defaultAccentColor = '#7c5cff';
            
            // Apply saved colors using CSS variables
            if (settings.headerColor) {
                document.documentElement.style.setProperty('--header-color', settings.headerColor);
                document.documentElement.style.setProperty('--accent-color', settings.headerColor);
                
                // Update gradient for buttons and elements
                const lighterColor = lightenColor(settings.headerColor, 20);
                document.documentElement.style.setProperty('--gradient-primary', 
                    `linear-gradient(135deg, ${settings.headerColor}, ${lighterColor})`);
                
                
                // Update glow color
                document.documentElement.style.setProperty('--glow-color', hexToRgba(settings.headerColor, 0.3));
            } else {
                // Set default values if nothing saved
                document.documentElement.style.setProperty('--header-color', defaultAccentColor);
                document.documentElement.style.setProperty('--accent-color', defaultAccentColor);
            }
            
            if (settings.backgroundColor) {
                // Apply different background colors for light/dark mode
                const baseBackgroundColor = settings.backgroundColor;
                if (theme === 'light' && isColorDark(baseBackgroundColor)) {
                    // If in light mode but saved color is dark, use a lighter variant
                    document.documentElement.style.setProperty('--background-color', lightenColor(baseBackgroundColor, 70));
                } else if (theme === 'dark' && !isColorDark(baseBackgroundColor)) {
                    // If in dark mode but saved color is light, use a darker variant
                    document.documentElement.style.setProperty('--background-color', darkenColor(baseBackgroundColor, 70));
                } else {
                    document.documentElement.style.setProperty('--background-color', baseBackgroundColor);
                }
                
                // Set gradient background colors
                const darkerBg = darkenColor(settings.backgroundColor, 15);
                const lighterBg = lightenColor(settings.backgroundColor, 15);
                
                document.documentElement.style.setProperty('--gradient-start', lighterBg);
                document.documentElement.style.setProperty('--gradient-end', darkerBg);
            }
            
            if (settings.textColor) {
                document.documentElement.style.setProperty('--text-color', settings.textColor);
            }
        } catch (e) {
            console.error("Error applying custom theme colors:", e);
        }
    }
}

/**
 * Checks if a color is dark
 * @param {string} color - Hex color to check
 * @returns {boolean} True if color is dark
 */
function isColorDark(color) {
    // Convert hex to RGB
    const rgb = hexToRgb(color);
    if (!rgb) return true; // Default to true for safety
    
    // Calculate relative luminance
    // Formula: 0.299*R + 0.587*G + 0.114*B
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    
    // Return true if luminance is less than 0.5 (dark color)
    return luminance < 0.5;
}

/**
 * Dispatches a custom event for theme changes
 * @param {string} theme - New theme value
 */
function dispatchThemeChanged(theme) {
    const event = new CustomEvent('themeChanged', {
        detail: {
            theme: theme,
            timestamp: new Date().getTime()
        }
    });
    window.dispatchEvent(event);
}

// Initialize theme switcher when script loads
initializeThemeSwitcher();

// Listen for settings changes that may affect theme
window.addEventListener('customSettingsChanged', function(event) {
    if (event.detail && event.detail.settings && event.detail.settings.theme) {
        applyTheme(event.detail.settings.theme);
    } else {
        // If no theme in settings, get current theme
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        applyCustomThemeColors(currentTheme);
    }
});

// Export functions for modules that support it
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeThemeSwitcher,
        applyTheme,
        updateParticleColors,
        applyCustomThemeColors,
        isColorDark,
        dispatchThemeChanged
    };
} 