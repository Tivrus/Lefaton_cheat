// Theme Switcher

document.addEventListener('DOMContentLoaded', function() {
    // Look for theme toggle in header dropdown first, then fallback to other locations
    const themeSwitch = document.getElementById('theme-checkbox') || document.getElementById('checkbox');
    
    if (!themeSwitch) {
        console.error('Theme switch checkbox not found');
        return;
    }
    
    // Set the default theme to dark if not already set
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    // Apply the saved theme or default theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Set the checkbox state based on the theme
    // For dark theme, the checkbox should be unchecked
    // For light theme, the checkbox should be checked
    themeSwitch.checked = currentTheme === 'light';
    
    // Function to switch themes
    function switchTheme(e) {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    }
    
    // Event listener for theme switch
    themeSwitch.addEventListener('change', switchTheme, false);
    
    // Function to apply custom theme colors from localStorage
    function applyCustomTheme() {
        const customSettings = localStorage.getItem('customSettings');
        if (customSettings) {
            try {
                const settings = JSON.parse(customSettings);
                console.log("Applying custom settings:", settings);
                
                // Apply saved colors using CSS variables
                if (settings.headerColor) {
                    document.documentElement.style.setProperty('--header-color', settings.headerColor);
                    // Update wave colors with transparency
                    document.documentElement.style.setProperty('--wave-color-1', hexToRgba(settings.headerColor, 0.7)); // 70% opacity
                    document.documentElement.style.setProperty('--wave-color-2', hexToRgba(settings.headerColor, 0.5)); // 50% opacity
                    document.documentElement.style.setProperty('--wave-color-3', hexToRgba(settings.headerColor, 0.3)); // 30% opacity
                    document.documentElement.style.setProperty('--wave-color-4', settings.headerColor);
                }
                
                if (settings.backgroundColor) {
                    document.body.style.backgroundColor = settings.backgroundColor;
                }
                
                if (settings.textColor) {
                    document.documentElement.style.setProperty('--text-color', settings.textColor);
                    // Apply to main text elements
                    const mainTexts = document.querySelectorAll('.main_title, .main_subtitle, p, h1, h2, h3, h4, h5, h6');
                    mainTexts.forEach(el => {
                        if (el) el.style.color = settings.textColor;
                    });
                }
                
                // Apply font sizes
                if (settings.titleSize) {
                    const fontSize = 24 + ((parseInt(settings.titleSize) / 100) * 36);
                    document.documentElement.style.setProperty('--title-font-size', fontSize + 'px');
                    
                    const mainTitle = document.querySelector('.main_title');
                    if (mainTitle) {
                        mainTitle.style.fontSize = fontSize + 'px';
                    }
                }
                
                if (settings.subtitleSize) {
                    const fontSize = 16 + ((parseInt(settings.subtitleSize) / 100) * 14);
                    document.documentElement.style.setProperty('--subtitle-font-size', fontSize + 'px');
                    
                    const subtitle = document.querySelector('.main_subtitle');
                    if (subtitle) {
                        subtitle.style.fontSize = fontSize + 'px';
                    }
                }
                
                // Apply body text size if available
                if (settings.bodyTextSize) {
                    const fontSize = 14 + ((parseInt(settings.bodyTextSize) / 100) * 10);
                    document.documentElement.style.setProperty('--body-font-size', fontSize + 'px');
                }
                
                // Apply animation speeds
                if (settings.waveSpeed) {
                    const normalizedSpeed = parseFloat(settings.waveSpeed) / 100;
                    
                    if (normalizedSpeed === 0) {
                        // Полная остановка волн при значении 0
                        document.documentElement.style.setProperty('--wave-animation-duration', '0s');
                        
                        const parallaxUses = document.querySelectorAll('.parallax > use');
                        parallaxUses.forEach((use) => {
                            use.style.animationPlayState = 'paused';
                            use.style.animationDuration = '0s';
                        });
                    } else {
                        const baseSpeed = 25; // Base animation duration in seconds
                        const newSpeed = baseSpeed / (normalizedSpeed * 2 + 0.5);
                        document.documentElement.style.setProperty('--wave-animation-duration', newSpeed + 's');
                        
                        const parallaxUses = document.querySelectorAll('.parallax > use');
                        parallaxUses.forEach((use, index) => {
                            const baseDurations = [7, 7, 10, 10, 13, 13, 20, 20];
                            const duration = baseDurations[index % baseDurations.length] || 10;
                            use.style.animationPlayState = 'running';
                            use.style.animationDuration = (duration / (normalizedSpeed * 2 + 0.5)) + 's';
                        });
                    }
                }
                
                // Apply background type
                if (settings.background) {
                    document.documentElement.setAttribute('data-background', settings.background);
                    
                    // Apply background-specific styles
                    if (settings.background === 'gradient') {
                        // Hide particles
                        const particlesElements = document.querySelectorAll('#particles-background, #particles-foreground');
                        particlesElements.forEach(el => {
                            if (el) el.style.display = 'none';
                        });
                    } else {
                        // Show particles
                        const particlesElements = document.querySelectorAll('#particles-background, #particles-foreground');
                        particlesElements.forEach(el => {
                            if (el) el.style.display = 'block';
                        });
                    }
                }
                
                // Dispatch event to notify other scripts of settings changes
                dispatchSettingsChanged();
            } catch (e) {
                console.error("Error applying custom settings:", e);
            }
        }
    }
    
    // Helper function for color manipulations
    function hexToRgba(hex, alpha = 1) {
        if (!hex) return "rgba(255, 166, 0, " + alpha + ")"; 
        
        try {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        } catch (e) {
            console.error("Error parsing color:", hex, e);
            return "rgba(255, 166, 0, " + alpha + ")";
        }
    }
    
    // Apply custom theme when page loads
    applyCustomTheme();
    
    // Create and dispatch a custom event for settings changes
    function dispatchSettingsChanged() {
        const event = new CustomEvent('customSettingsChanged', {
            detail: {
                timestamp: new Date().getTime()
            }
        });
        window.dispatchEvent(event);
    }
}); 