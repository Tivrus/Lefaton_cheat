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
        
        // Apply theme-specific particle colors
        updateParticleColors(e.target.checked ? 'light' : 'dark');
    }
    
    // Event listener for theme switch
    themeSwitch.addEventListener('change', switchTheme, false);
    
    // Function to update particle colors based on theme
    function updateParticleColors(theme) {
        try {
            if (window.pJSDom && window.pJSDom.length > 0) {
                const particleColor = theme === 'light' ? '#7c5cff' : '#ffffff';
                const particleOpacity = theme === 'light' ? 0.6 : 0.8;
                
                // Update background particles
                if (window.pJSDom[0] && window.pJSDom[0].pJS) {
                    window.pJSDom[0].pJS.particles.color.value = particleColor;
                    window.pJSDom[0].pJS.particles.opacity.value = particleOpacity;
                    window.pJSDom[0].pJS.particles.line_linked.color = particleColor;
                    window.pJSDom[0].pJS.fn.particlesRefresh();
                }
                
                // Update foreground particles if they exist
                if (window.pJSDom[1] && window.pJSDom[1].pJS) {
                    window.pJSDom[1].pJS.particles.color.value = particleColor;
                    window.pJSDom[1].pJS.particles.opacity.value = particleOpacity;
                    window.pJSDom[1].pJS.particles.line_linked.color = particleColor;
                    window.pJSDom[1].pJS.fn.particlesRefresh();
                }
            }
        } catch (e) {
            console.error("Error updating particle colors:", e);
        }
    }
    
    // Function to apply custom theme colors from localStorage
    function applyCustomTheme() {
        const customSettings = localStorage.getItem('customSettings');
        if (customSettings) {
            try {
                const settings = JSON.parse(customSettings);
                console.log("Applying custom settings:", settings);
                
                // Set default accent color to match the new design
                const defaultAccentColor = '#7c5cff';
                
                // Apply saved colors using CSS variables
                if (settings.headerColor) {
                    document.documentElement.style.setProperty('--header-color', settings.headerColor);
                    document.documentElement.style.setProperty('--accent-color', settings.headerColor);
                    
                    // Update gradient for buttons and elements
                    const lighterColor = adjustColorBrightness(settings.headerColor, 20);
                    document.documentElement.style.setProperty('--gradient-primary', 
                        `linear-gradient(135deg, ${settings.headerColor}, ${lighterColor})`);
                    
                    // Update wave colors with transparency
                    document.documentElement.style.setProperty('--wave-color-1', hexToRgba(settings.headerColor, 0.7)); 
                    document.documentElement.style.setProperty('--wave-color-2', hexToRgba(settings.headerColor, 0.5));
                    document.documentElement.style.setProperty('--wave-color-3', hexToRgba(settings.headerColor, 0.3));
                    document.documentElement.style.setProperty('--wave-color-4', settings.headerColor);
                    
                    // Update glow color
                    document.documentElement.style.setProperty('--glow-color', hexToRgba(settings.headerColor, 0.3));
                } else {
                    // Set default values if nothing saved
                    document.documentElement.style.setProperty('--header-color', defaultAccentColor);
                    document.documentElement.style.setProperty('--accent-color', defaultAccentColor);
                }
                
                if (settings.backgroundColor) {
                    const darkerBg = adjustColorBrightness(settings.backgroundColor, -15);
                    const lighterBg = adjustColorBrightness(settings.backgroundColor, 15);
                    
                    document.documentElement.style.setProperty('--background-color', settings.backgroundColor);
                    document.documentElement.style.setProperty('--gradient-start', lighterBg);
                    document.documentElement.style.setProperty('--gradient-end', darkerBg);
                }
                
                if (settings.textColor) {
                    document.documentElement.style.setProperty('--text-color', settings.textColor);
                }
                
                // Apply font sizes
                if (settings.titleSize) {
                    const fontSize = 32 + ((parseInt(settings.titleSize) / 100) * 20);
                    document.documentElement.style.setProperty('--title-font-size', fontSize + 'px');
                }
                
                if (settings.subtitleSize) {
                    const fontSize = 18 + ((parseInt(settings.subtitleSize) / 100) * 14);
                    document.documentElement.style.setProperty('--subtitle-font-size', fontSize + 'px');
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
    
    // Helper function to adjust color brightness
    function adjustColorBrightness(hex, percent) {
        if (!hex) return '#7c5cff';
        
        try {
            // Convert hex to RGB
            let r = parseInt(hex.slice(1, 3), 16);
            let g = parseInt(hex.slice(3, 5), 16);
            let b = parseInt(hex.slice(5, 7), 16);
            
            // Adjust brightness
            r = Math.max(0, Math.min(255, r + (percent / 100) * 255));
            g = Math.max(0, Math.min(255, g + (percent / 100) * 255));
            b = Math.max(0, Math.min(255, b + (percent / 100) * 255));
            
            // Convert back to hex
            return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
        } catch (e) {
            console.error("Error adjusting color brightness:", hex, e);
            return '#7c5cff';
        }
    }
    
    // Apply custom theme when page loads
    applyCustomTheme();
    
    // Also update particles based on current theme
    updateParticleColors(currentTheme);
    
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