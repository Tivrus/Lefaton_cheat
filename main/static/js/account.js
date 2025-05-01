// Account page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Navigation between sections
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.account-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Get the section to show
            const sectionToShow = this.getAttribute('data-section');
            
            // Remove active class from all nav items and sections
            navItems.forEach(navItem => navItem.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked nav item
            this.classList.add('active');
            
            // Show the corresponding section
            const targetSection = document.getElementById(sectionToShow);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
    
    // Avatar change functionality
    const avatarContainer = document.querySelector('.avatar-container');
    if (avatarContainer) {
        avatarContainer.addEventListener('click', function() {
            // In a real implementation, this would open a file picker
            // For now, we'll just show an alert
            alert('В реальной имплементации это открыло бы окно выбора файла для загрузки нового аватара.');
        });
    }
    
    // Settings form submission
    const settingsForm = document.querySelector('.settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real implementation, this would save the settings to the server
            // For now, just show a success message
            
            // Get form values
            const displayName = document.getElementById('display-name').value;
            const email = document.getElementById('email').value;
            const language = document.getElementById('language').value;
            const currency = document.getElementById('currency').value;
            
            // Save language and currency settings
            localStorage.setItem('language', language);
            localStorage.setItem('currency', currency);
            
            // Simple validation
            if (!displayName || !email) {
                alert('Пожалуйста, заполните все обязательные поля.');
                return;
            }
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Настройки успешно сохранены!';
            successMessage.style.color = '#4CAF50';
            successMessage.style.fontWeight = 'bold';
            successMessage.style.marginTop = '15px';
            successMessage.style.padding = '10px';
            successMessage.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
            successMessage.style.borderRadius = '8px';
            successMessage.style.textAlign = 'center';
            
            // Add to the form
            settingsForm.appendChild(successMessage);
            
            // Remove after 3 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 3000);
        });
    }
    
    // Initialize color pickers
    if (typeof $.fn.spectrum !== 'undefined') {
        $(".color-picker").spectrum({
            preferredFormat: "hex",
            showInput: true,
            showInitial: true,
            showPalette: true,
            palette: [
                ["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
                ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
                ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
                ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
                ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
                ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
                ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
                ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
            ],
            change: function(color) {
                const id = $(this).attr('id');
                updateCustomSettings(id, color.toHexString());
            }
        });
    }
    
    // Handle range sliders for font sizes
    const rangeSliders = document.querySelectorAll('input[type="range"]');
    rangeSliders.forEach(slider => {
        const valueDisplay = document.getElementById(`${slider.id}-value`);
        if (valueDisplay) {
            // Update value display when slider changes
            slider.addEventListener('input', function() {
                if (slider.id.includes('size')) {
                    valueDisplay.textContent = `${slider.value}%`;
                } else {
                    valueDisplay.textContent = slider.value;
                }
                
                // Update settings based on slider type
                updateCustomSettings(slider.id, slider.value);
            });
            
            // Set initial value from localStorage if available
            const savedValue = getCustomSettingValue(slider.id);
            if (savedValue) {
                slider.value = savedValue;
                if (slider.id.includes('size')) {
                    valueDisplay.textContent = `${savedValue}%`;
                } else {
                    valueDisplay.textContent = savedValue;
                }
            }
        }
    });
    
    // Handle theme toggle in the appearance section
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        // Set initial state based on current theme
        const currentTheme = localStorage.getItem('theme') || 'dark';
        themeToggle.checked = currentTheme === 'light';
        
        // Update theme when toggled
        themeToggle.addEventListener('change', function() {
            const newTheme = this.checked ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Also update the header theme toggle if it exists
            const headerThemeToggle = document.getElementById('theme-checkbox');
            if (headerThemeToggle) {
                headerThemeToggle.checked = this.checked;
            }
        });
    }
    
    // Background type selection
    const backgroundOptions = document.querySelectorAll('.background-option');
    backgroundOptions.forEach(option => {
        option.addEventListener('click', function() {
            const bgType = this.getAttribute('data-background');
            
            // Remove active class from all options
            backgroundOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Set the background type
            document.documentElement.setAttribute('data-background', bgType);
            
            // Update settings
            updateCustomSettings('background', bgType);
            
            // Apply background specific settings
            if (bgType === 'gradient') {
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
                
                // Reinitialize particles if needed
                if (typeof particlesJS !== 'undefined') {
                    // Reinitialize based on background type
                    if (bgType === 'stars') {
                        initializeStars();
                    } else if (bgType === 'particles') {
                        initializeParticles();
                    }
                }
            }
        });
        
        // Set active class based on saved setting or default to stars
        const savedBgType = getCustomSettingValue('background') || 'stars';
        if (option.getAttribute('data-background') === savedBgType) {
            option.classList.add('active');
            document.documentElement.setAttribute('data-background', savedBgType);
        }
    });
    
    // Save appearance settings button
    const saveAppearanceBtn = document.getElementById('save-appearance');
    if (saveAppearanceBtn) {
        saveAppearanceBtn.addEventListener('click', function() {
            // Save current settings to localStorage
            localStorage.setItem('customSettings', JSON.stringify(getCustomSettings()));
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Настройки внешнего вида сохранены!';
            successMessage.style.color = '#4CAF50';
            successMessage.style.fontWeight = 'bold';
            successMessage.style.marginTop = '15px';
            successMessage.style.padding = '10px';
            successMessage.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
            successMessage.style.borderRadius = '8px';
            successMessage.style.textAlign = 'center';
            
            // Find the parent to add the message to
            const parent = saveAppearanceBtn.parentNode;
            parent.insertBefore(successMessage, saveAppearanceBtn.nextSibling);
            
            // Remove after 3 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 3000);
            
            // Notify other scripts about the settings change
            dispatchSettingsChanged();
        });
    }
    
    // Reset appearance settings button
    const resetAppearanceBtn = document.getElementById('reset-appearance');
    if (resetAppearanceBtn) {
        resetAppearanceBtn.addEventListener('click', function() {
            // Reset to default settings
            const defaultSettings = {
                headerColor: '#FFA600',
                backgroundColor: '#000000',
                textColor: '#FFFFFF',
                accentColor: '#FFA600',
                titleSize: '100',
                subtitleSize: '100',
                bodyTextSize: '100',
                waveSpeed: '50',
                starSpeed: '50',
                background: 'stars'
            };
            
            // Apply default settings to inputs
            for (const [key, value] of Object.entries(defaultSettings)) {
                const input = document.getElementById(key);
                if (input) {
                    if (input.type === 'range') {
                        input.value = value;
                        const valueDisplay = document.getElementById(`${input.id}-value`);
                        if (valueDisplay) {
                            if (key.includes('Size')) {
                                valueDisplay.textContent = `${value}%`;
                            } else {
                                valueDisplay.textContent = value;
                            }
                        }
                    } else if (key === 'background') {
                        // Reset background option
                        backgroundOptions.forEach(opt => {
                            opt.classList.remove('active');
                            if (opt.getAttribute('data-background') === value) {
                                opt.classList.add('active');
                            }
                        });
                        document.documentElement.setAttribute('data-background', value);
                    } else if (input.classList.contains('color-picker')) {
                        // Reset color picker
                        $(input).spectrum('set', value);
                    }
                }
            }
            
            // Save default settings
            localStorage.setItem('customSettings', JSON.stringify(defaultSettings));
            
            // Apply default theme
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            
            if (themeToggle) {
                themeToggle.checked = false;
            }
            
            const headerThemeToggle = document.getElementById('theme-checkbox');
            if (headerThemeToggle) {
                headerThemeToggle.checked = false;
            }
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Настройки сброшены до значений по умолчанию!';
            successMessage.style.color = '#4CAF50';
            successMessage.style.fontWeight = 'bold';
            successMessage.style.marginTop = '15px';
            successMessage.style.padding = '10px';
            successMessage.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
            successMessage.style.borderRadius = '8px';
            successMessage.style.textAlign = 'center';
            
            // Find the parent to add the message to
            const parent = resetAppearanceBtn.parentNode;
            parent.insertBefore(successMessage, resetAppearanceBtn.nextSibling);
            
            // Remove after 3 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 3000);
            
            // Reinitialize particles
            if (typeof particlesJS !== 'undefined') {
                initializeStars();
            }
            
            // Notify other scripts about the settings change
            dispatchSettingsChanged();
        });
    }
    
    // Helper function to update custom settings
    function updateCustomSettings(key, value) {
        const settings = getCustomSettings();
        settings[key] = value;
        
        // Apply the setting immediately for visual feedback
        applyCustomSetting(key, value);
    }
    
    // Helper function to get custom settings
    function getCustomSettings() {
        const savedSettings = localStorage.getItem('customSettings');
        return savedSettings ? JSON.parse(savedSettings) : {};
    }
    
    // Helper function to get a specific custom setting value
    function getCustomSettingValue(key) {
        const settings = getCustomSettings();
        return settings[key];
    }
    
    // Helper function to apply a single custom setting
    function applyCustomSetting(key, value) {
        switch(key) {
            case 'headerColor':
                document.documentElement.style.setProperty('--header-color', value);
                document.documentElement.style.setProperty('--wave-color-1', hexToRgba(value, 0.7));
                document.documentElement.style.setProperty('--wave-color-2', hexToRgba(value, 0.5));
                document.documentElement.style.setProperty('--wave-color-3', hexToRgba(value, 0.3));
                document.documentElement.style.setProperty('--wave-color-4', value);
                break;
            case 'backgroundColor':
                document.body.style.backgroundColor = value;
                break;
            case 'textColor':
                document.documentElement.style.setProperty('--text-color', value);
                break;
            case 'accentColor':
                document.documentElement.style.setProperty('--accent-color', value);
                document.documentElement.style.setProperty('--accent-hover', lightenColor(value, 20));
                break;
            case 'titleSize':
                const titleFontSize = 24 + ((parseInt(value) / 100) * 20);
                document.documentElement.style.setProperty('--title-font-size', titleFontSize + 'px');
                break;
            case 'subtitleSize':
                const subtitleFontSize = 16 + ((parseInt(value) / 100) * 8);
                document.documentElement.style.setProperty('--subtitle-font-size', subtitleFontSize + 'px');
                break;
            case 'bodyTextSize':
                const bodyFontSize = 14 + ((parseInt(value) / 100) * 6);
                document.documentElement.style.setProperty('--body-font-size', bodyFontSize + 'px');
                break;
            case 'waveSpeed':
                const waveSpeed = parseInt(value);
                const normalizedWaveSpeed = waveSpeed / 100;
                
                if (normalizedWaveSpeed === 0) {
                    // Stop waves animation
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
                break;
            case 'starSpeed':
                // Update particles speed if particles.js is loaded
                if (typeof pJSDom !== 'undefined' && pJSDom.length > 0) {
                    const speed = parseInt(value) / 100 * 2; // Scale to 0-2 range
                    
                    pJSDom.forEach(function(particle) {
                        // Update particle speed
                        particle.pJS.particles.move.speed = speed;
                        
                        // Redraw particles
                        particle.pJS.fn.particlesRefresh();
                    });
                }
                break;
        }
    }
    
    // Helper function to convert hex to rgba
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
    
    // Helper function to lighten a color
    function lightenColor(color, percent) {
        if (!color) return "#FFB733";
        
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
            return "#FFB733";
        }
    }
    
    // Initialize stars particle effect
    function initializeStars() {
        if (typeof particlesJS !== 'undefined') {
            const starSpeed = parseInt(getCustomSettingValue('starSpeed') || 50) / 100 * 2;
            
            particlesJS("particles-background", {
                "particles": {
                    "number": {
                        "value": 100,
                        "density": {
                            "enable": true,
                            "value_area": 800
                        }
                    },
                    "color": {
                        "value": "#ffffff"
                    },
                    "shape": {
                        "type": "circle",
                        "stroke": {
                            "width": 0,
                            "color": "#000000"
                        }
                    },
                    "opacity": {
                        "value": 0.8,
                        "random": true,
                        "anim": {
                            "enable": true,
                            "speed": 1,
                            "opacity_min": 0.1,
                            "sync": false
                        }
                    },
                    "size": {
                        "value": 2,
                        "random": true,
                        "anim": {
                            "enable": true,
                            "speed": 2,
                            "size_min": 0.1,
                            "sync": false
                        }
                    },
                    "line_linked": {
                        "enable": false
                    },
                    "move": {
                        "enable": true,
                        "speed": starSpeed,
                        "direction": "none",
                        "random": true,
                        "straight": false,
                        "out_mode": "out",
                        "bounce": false
                    }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                        "onhover": {
                            "enable": true,
                            "mode": "bubble"
                        },
                        "onclick": {
                            "enable": true,
                            "mode": "repulse"
                        },
                        "resize": true
                    },
                    "modes": {
                        "bubble": {
                            "distance": 150,
                            "size": 4,
                            "duration": 2,
                            "opacity": 1,
                            "speed": 3
                        },
                        "repulse": {
                            "distance": 200,
                            "duration": 0.4
                        }
                    }
                },
                "retina_detect": true
            });
        }
    }
    
    // Initialize regular particles effect
    function initializeParticles() {
        if (typeof particlesJS !== 'undefined') {
            const starSpeed = parseInt(getCustomSettingValue('starSpeed') || 50) / 100 * 6;
            
            particlesJS("particles-background", {
                "particles": {
                    "number": {
                        "value": 80,
                        "density": {
                            "enable": true,
                            "value_area": 800
                        }
                    },
                    "color": {
                        "value": "#ff9800"
                    },
                    "shape": {
                        "type": "circle",
                        "stroke": {
                            "width": 0,
                            "color": "#000000"
                        }
                    },
                    "opacity": {
                        "value": 0.6,
                        "random": false,
                        "anim": {
                            "enable": false,
                            "speed": 1,
                            "opacity_min": 0.1,
                            "sync": false
                        }
                    },
                    "size": {
                        "value": 3,
                        "random": true,
                        "anim": {
                            "enable": false,
                            "speed": 40,
                            "size_min": 0.1,
                            "sync": false
                        }
                    },
                    "line_linked": {
                        "enable": true,
                        "distance": 150,
                        "color": "#ff9800",
                        "opacity": 0.4,
                        "width": 1
                    },
                    "move": {
                        "enable": true,
                        "speed": starSpeed,
                        "direction": "none",
                        "random": false,
                        "straight": false,
                        "out_mode": "out",
                        "bounce": false,
                        "attract": {
                            "enable": false,
                            "rotateX": 600,
                            "rotateY": 1200
                        }
                    }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                        "onhover": {
                            "enable": true,
                            "mode": "grab"
                        },
                        "onclick": {
                            "enable": true,
                            "mode": "push"
                        },
                        "resize": true
                    },
                    "modes": {
                        "grab": {
                            "distance": 140,
                            "line_linked": {
                                "opacity": 1
                            }
                        },
                        "push": {
                            "particles_nb": 4
                        }
                    }
                },
                "retina_detect": true
            });
        }
    }
    
    // Apply custom theme when page loads
    function applyCustomTheme() {
        const customSettings = getCustomSettings();
        if (Object.keys(customSettings).length > 0) {
            // Apply each setting
            for (const [key, value] of Object.entries(customSettings)) {
                applyCustomSetting(key, value);
            }
            
            // Initialize background according to saved setting
            const bgType = customSettings.background || 'stars';
            document.documentElement.setAttribute('data-background', bgType);
            
            if (bgType === 'gradient') {
                // Hide particles for gradient background
                const particlesElements = document.querySelectorAll('#particles-background, #particles-foreground');
                particlesElements.forEach(el => {
                    if (el) el.style.display = 'none';
                });
            } else if (typeof particlesJS !== 'undefined') {
                // Initialize particles based on background type
                if (bgType === 'stars') {
                    initializeStars();
                } else if (bgType === 'particles') {
                    initializeParticles();
                }
            }
        }
    }
    
    // Create and dispatch a custom event for settings changes
    function dispatchSettingsChanged() {
        const event = new CustomEvent('customSettingsChanged', {
            detail: {
                timestamp: new Date().getTime()
            }
        });
        window.dispatchEvent(event);
    }
    
    // Apply current theme and settings
    applyCustomTheme();
    
    // Animation for activity items on hover
    const activityItems = document.querySelectorAll('.activity-item');
    activityItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.3s ease';
            this.style.transform = 'translateX(5px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
}); 