/**
 * utils.js - Utility functions for Lefaton Cheat
 * Contains common functionality used across the application
 */

// Color manipulation utilities
/**
 * Converts hex color to rgba format with specified alpha
 * @param {string} hex - Hex color code (e.g. #7c5cff)
 * @param {number} alpha - Alpha value between 0 and 1
 * @returns {string} RGBA color string
 */
function hexToRgba(hex, alpha = 1) {
    if (!hex) return "rgba(124, 92, 255, " + alpha + ")";
    
    try {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } catch (e) {
        console.error("Error parsing color:", hex, e);
        return "rgba(124, 92, 255, " + alpha + ")";
    }
}

/**
 * Lightens a color by the specified percentage
 * @param {string} color - Hex color code
 * @param {number} percent - Percentage to lighten
 * @returns {string} Lightened hex color
 */
function lightenColor(color, percent) {
    if (!color) return "#9b82ff";
    
    try {
        const num = parseInt(color.slice(1), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        
        return "#" + (
            0x1000000 + 
            (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
            (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
            (B < 255 ? (B < 1 ? 0 : B) : 255)
        ).toString(16).slice(1);
    } catch (e) {
        console.error("Error lightening color:", color, e);
        return "#9b82ff";
    }
}

/**
 * Darkens a color by the specified percentage
 * @param {string} color - Hex color code
 * @param {number} percent - Percentage to darken (positive value)
 * @returns {string} Darkened hex color
 */
function darkenColor(color, percent) {
    return lightenColor(color, -percent);
}

/**
 * Updates the RGB values of accent color in CSS variables
 * @param {string} hexColor - Hex color code
 */
function updateAccentColorRGB(hexColor) {
    if (!hexColor) return;
    
    // Convert HEX to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Set data attribute for CSS selector
    document.documentElement.setAttribute('data-accent-color', hexColor);
    
    // Update variable directly
    document.documentElement.style.setProperty('--accent-color-rgb', `${r}, ${g}, ${b}`);
}

/**
 * Calculates distance between two hex colors
 * @param {string} color1 - First hex color
 * @param {string} color2 - Second hex color
 * @returns {number} Color distance value
 */
function colorDistance(color1, color2) {
    // Convert to RGB
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return 99999;
    
    // Calculate Euclidean distance
    return Math.sqrt(
        Math.pow(rgb1.r - rgb2.r, 2) +
        Math.pow(rgb1.g - rgb2.g, 2) +
        Math.pow(rgb1.b - rgb2.b, 2)
    );
}

/**
 * Converts hex color to RGB object
 * @param {string} hex - Hex color code
 * @returns {Object|null} Object with r, g, b properties or null
 */
function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });
    
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// DOM and UI utilities
/**
 * Shows a temporary success message
 * @param {HTMLElement} parent - Parent element to append message to
 * @param {string} message - Message text
 * @param {number} duration - Duration to show message in ms
 */
function showSuccessMessage(parent, message, duration = 3000) {
    // Remove existing success message
    const existingMessage = parent.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create success message element
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = message;
    
    // Apply styles
    successMessage.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
    successMessage.style.color = '#4CAF50';
    successMessage.style.padding = '15px';
    successMessage.style.borderRadius = '8px';
    successMessage.style.marginTop = '15px';
    successMessage.style.textAlign = 'center';
    
    // Add to the container
    parent.appendChild(successMessage);
    
    // Remove after specified duration
    setTimeout(() => {
        successMessage.remove();
    }, duration);
}

/**
 * Dispatches a custom event for settings changes
 * @param {Object} settings - Settings object to include in event
 */
function dispatchSettingsChanged(settings = null) {
    const event = new CustomEvent('customSettingsChanged', {
        detail: {
            settings: settings,
            timestamp: new Date().getTime()
        }
    });
    window.dispatchEvent(event);
}

// Export functions for modules that support it
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        hexToRgba,
        lightenColor,
        darkenColor,
        updateAccentColorRGB,
        colorDistance,
        hexToRgb,
        showSuccessMessage,
        dispatchSettingsChanged
    };
} 