// Customization functionality

document.addEventListener('DOMContentLoaded', function() {
    // References to elements
    const headerColorInput = document.getElementById('header-color');
    const headerColorIndicator = document.getElementById('header-color-indicator');
    const backgroundColorInput = document.getElementById('background-color');
    const backgroundColorIndicator = document.getElementById('background-color-indicator');
    const starColorInput = document.getElementById('star-color');
    const starColorIndicator = document.getElementById('star-color-indicator');
    const textColorInput = document.getElementById('text-color');
    const textColorIndicator = document.getElementById('text-color-indicator');
    
    const starSpeedInput = document.getElementById('star-speed');
    const starSpeedValue = document.getElementById('star-speed-value');
    const waveSpeedInput = document.getElementById('wave-speed');
    const waveSpeedValue = document.getElementById('wave-speed-value');
    const starDensityInput = document.getElementById('star-density');
    const starDensityValue = document.getElementById('star-density-value');
    
    const backgroundOptions = document.querySelectorAll('.background-option');
    const saveButton = document.getElementById('save-customize');
    const resetButton = document.getElementById('reset-customize');
    
    // Font size options
    const titleSizeInput = document.getElementById('title-size');
    const titleSizeValue = document.getElementById('title-size-value');
    const subtitleSizeInput = document.getElementById('subtitle-size');
    const subtitleSizeValue = document.getElementById('subtitle-size-value');
    const bodyTextSizeInput = document.getElementById('body-text-size');
    const bodyTextSizeValue = document.getElementById('body-text-value');
    
    // Color palette swatches
    const colorPalettes = document.querySelectorAll('.color-palette');
    
    // Get all editable value spans
    const editableValues = document.querySelectorAll('.editable-value');
    
    // Make value spans editable on click
    editableValues.forEach(span => {
        span.addEventListener('click', function() {
            const currentValue = this.textContent;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentValue;
            input.className = 'inline-edit';
            input.style.width = (this.offsetWidth + 10) + 'px';
            
            // Get associated range input
            const rangeId = this.id.replace('-value', '');
            const rangeInput = document.getElementById(rangeId);
            
            input.addEventListener('blur', function() {
                finishEditing(this, span, rangeInput);
            });
            
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    finishEditing(this, span, rangeInput);
                }
                
                // Only allow numbers, decimal point, and control keys
                const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
                if (allowedKeys.includes(e.key)) return;
                
                // Check if input is number or decimal point
                if (!/^[0-9.]$/.test(e.key)) {
                    e.preventDefault();
                }
                
                // Don't allow multiple decimal points
                if (e.key === '.' && this.value.includes('.')) {
                    e.preventDefault();
                }
            });
            
            this.innerHTML = '';
            this.appendChild(input);
            input.focus();
            input.select();
        });
    });
    
    // Function to finish editing and validate input
    function finishEditing(input, span, rangeInput) {
        let newValue = parseFloat(input.value);
        const originalValue = parseFloat(rangeInput.value);
        const min = parseFloat(rangeInput.min);
        const max = parseFloat(rangeInput.max);
        
        // Validate input
        if (isNaN(newValue) || newValue < min || newValue > max) {
            newValue = originalValue;
        }
        
        // Round to 1 decimal place
        newValue = Math.round(newValue * 10) / 10;
        
        // Update span and range input
        span.textContent = newValue;
        rangeInput.value = newValue;
        
        // Trigger the range input event to apply the change
        const event = new Event('input', { bubbles: true });
        rangeInput.dispatchEvent(event);
    }
    
    // Load saved settings
    loadSettings();
    
    // Initialize color indicators
    updateColorIndicator(headerColorInput, headerColorIndicator);
    updateColorIndicator(backgroundColorInput, backgroundColorIndicator);
    updateColorIndicator(starColorInput, starColorIndicator);
    updateColorIndicator(textColorInput, textColorIndicator);
    
    // Color picker event listeners
    headerColorInput.addEventListener('input', function() {
        updateColorIndicator(headerColorInput, headerColorIndicator);
        applyHeaderColor(this.value);
        updateCustomPalette();
    });
    
    backgroundColorInput.addEventListener('input', function() {
        updateColorIndicator(backgroundColorInput, backgroundColorIndicator);
        // Применяем цвет к градиенту за звездами, а не к body
        document.documentElement.style.setProperty('--background-color', this.value);
        
        // Фон уже применяется через CSS переменную, дополнительных действий не требуется
        updateCustomPalette();
    });
    
    starColorInput.addEventListener('input', function() {
        updateColorIndicator(starColorInput, starColorIndicator);
        applyStarColor(this.value);
        updateCustomPalette();
    });
    
    textColorInput.addEventListener('input', function() {
        updateColorIndicator(textColorInput, textColorIndicator);
        document.documentElement.style.setProperty('--text-color', this.value);
        updateCustomPalette();
    });
    
    // Color palette selection
    colorPalettes.forEach(palette => {
        palette.addEventListener('click', function() {
            // Remove active class from all palettes
            colorPalettes.forEach(p => p.classList.remove('active'));
            // Add active class to the clicked palette
            this.classList.add('active');
            
            const colors = this.getAttribute('data-colors').split(',');
            
            if (colors.length >= 4) {
                headerColorInput.value = colors[0];
                backgroundColorInput.value = colors[1];
                starColorInput.value = colors[2];
                textColorInput.value = colors[3];
                
                // Update indicators and apply colors
                updateColorIndicator(headerColorInput, headerColorIndicator);
                updateColorIndicator(backgroundColorInput, backgroundColorIndicator);
                updateColorIndicator(starColorInput, starColorIndicator);
                updateColorIndicator(textColorInput, textColorIndicator);
                
                // Apply the colors immediately
                applyHeaderColor(colors[0]);
                
                // Применяем цвет фона через CSS переменную
                document.documentElement.style.setProperty('--background-color', colors[1]);
                
                applyStarColor(colors[2]);
                applyTextColor(colors[3]);
                
                // Save the new settings
                saveSettings();
            }
        });
    });
    
    // Range input event listeners
    starSpeedInput.addEventListener('input', function() {
        starSpeedValue.textContent = this.value;
        applyStarSpeed(this.value);
    });
    
    waveSpeedInput.addEventListener('input', function() {
        waveSpeedValue.textContent = this.value;
        applyWaveSpeed(this.value);
    });
    
    starDensityInput.addEventListener('input', function() {
        starDensityValue.textContent = this.value;
        applyStarDensity(this.value);
    });
    
    // Font size sliders
    if (titleSizeInput && titleSizeValue) {
        titleSizeInput.addEventListener('input', function() {
            titleSizeValue.textContent = this.value;
            applyTitleSize(this.value);
        });
    }
    
    if (subtitleSizeInput && subtitleSizeValue) {
        subtitleSizeInput.addEventListener('input', function() {
            subtitleSizeValue.textContent = this.value;
            applySubtitleSize(this.value);
        });
    }
    
    if (bodyTextSizeInput && bodyTextSizeValue) {
        bodyTextSizeInput.addEventListener('input', function() {
            bodyTextSizeValue.textContent = this.value;
            applyBodyTextSize(this.value);
        });
    }
    
    // Background option event listeners
    backgroundOptions.forEach(option => {
        option.addEventListener('click', function() {
            backgroundOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            applyBackground(this.getAttribute('data-background'));
        });
    });
    
    // Save settings
    saveButton.addEventListener('click', function() {
        saveSettings();
        showNotification('Настройки сохранены');
    });
    
    // Reset settings
    resetButton.addEventListener('click', function() {
        resetSettings();
        showNotification('Настройки сброшены');
    });
    
    // Helper functions
    function updateColorIndicator(input, indicator) {
        indicator.style.backgroundColor = input.value;
    }
    
    function applyHeaderColor(color) {
        document.documentElement.style.setProperty('--header-color', color);
        // Update wave colors
        document.documentElement.style.setProperty('--wave-color-1', color + 'B3'); // 70% opacity
        document.documentElement.style.setProperty('--wave-color-2', color + '80'); // 50% opacity
        document.documentElement.style.setProperty('--wave-color-3', color + '4D'); // 30% opacity
        document.documentElement.style.setProperty('--wave-color-4', color);
    }
    
    function applyStarColor(color) {
        // Convert color to proper format for particles
        const dotColor = convertHexToRgba(color, 0.8);
        const lineColor = convertHexToRgba(color, 0.3);
        
        // Apply to any existing particles
        const particlesBg = document.getElementById('particles-background');
        const particlesFg = document.getElementById('particles-foreground');
        
        if (particlesBg && window.pJSDom && window.pJSDom.length > 0) {
            // Background particles
            if (window.pJSDom[0] && window.pJSDom[0].pJS) {
                window.pJSDom[0].pJS.particles.color.value = dotColor;
                window.pJSDom[0].pJS.particles.line_linked.color = lineColor;
                window.pJSDom[0].pJS.fn.particlesRefresh();
            }
            
            // Foreground particles
            if (window.pJSDom[1] && window.pJSDom[1].pJS) {
                window.pJSDom[1].pJS.particles.color.value = dotColor;
                window.pJSDom[1].pJS.particles.line_linked.color = lineColor;
                window.pJSDom[1].pJS.fn.particlesRefresh();
            }
        }
        
        // Save for future initializations
        document.documentElement.style.setProperty('--star-color', color);
        document.documentElement.style.setProperty('--star-color-transparent', convertHexToRgba(color, 0.5));
    }
    
    function applyTextColor(color) {
        // Устанавливаем CSS переменную для цвета текста
        document.documentElement.style.setProperty('--text-color', color);
        
        // Принудительное применение цвета к важным элементам
        const importantTextElements = document.querySelectorAll('header section, .main_title, .main_subtitle, .customize-title, h2');
        importantTextElements.forEach(el => {
            el.style.color = color;
        });
        
        // Сохраняем настройку
        const settings = JSON.parse(localStorage.getItem('customSettings') || '{}');
        settings.textColor = color;
        localStorage.setItem('customSettings', JSON.stringify(settings));
    }
    
    function hexToRgba(hex, alpha = 1) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    function applyStarSpeed(speed) {
        // Convert the range value to appropriate speeds for particles
        const normalizedSpeed = parseFloat(speed) / 100;
        
        // Default base speeds
        const baseMaxSpeed = 0.7;
        const baseMinSpeed = 0.1;
        
        // Calculate new speeds
        let maxSpeed, minSpeed;
        
        if (normalizedSpeed === 0) {
            // If speed is 0, stop all movement
            maxSpeed = 0;
            minSpeed = 0;
        } else {
            // Otherwise scale the speed based on the input
            maxSpeed = baseMaxSpeed * (normalizedSpeed * 3);  // Up to 3x the base speed
            minSpeed = baseMinSpeed * (normalizedSpeed * 2);  // Up to 2x the base min speed
        }
        
        // Apply to any existing particles
        if (window.pJSDom && window.pJSDom.length > 0) {
            // Apply to background particles
            if (window.pJSDom[0] && window.pJSDom[0].pJS) {
                window.pJSDom[0].pJS.particles.move.speed = maxSpeed;
                window.pJSDom[0].pJS.fn.particlesRefresh();
            }
            
            // Apply to foreground particles
            if (window.pJSDom[1] && window.pJSDom[1].pJS) {
                window.pJSDom[1].pJS.particles.move.speed = maxSpeed * 1.5; // Foreground moves faster
                window.pJSDom[1].pJS.fn.particlesRefresh();
            }
        }
        
        // Also update CSS variable for future initializations
        document.documentElement.style.setProperty('--star-speed', speed);
    }
    
    function applyWaveSpeed(speed) {
        // Update wave animation speed by adjusting animation-duration
        const baseSpeed = 25; // Base animation duration in seconds
        const normalizedSpeed = parseFloat(speed) / 100;
        
        if (normalizedSpeed === 0) {
            // Полная остановка волн при значении 0
            document.documentElement.style.setProperty('--wave-animation-duration', '0s');
            
            // Остановка анимации для каждого элемента
            const parallaxUses = document.querySelectorAll('.parallax > use');
            parallaxUses.forEach((use) => {
                use.style.animationPlayState = 'paused';
                use.style.animationDuration = '0s';
            });
        } else {
            const newSpeed = baseSpeed / (normalizedSpeed * 2 + 0.5); // Range: 50s (slow) to 10s (fast)
            document.documentElement.style.setProperty('--wave-animation-duration', newSpeed + 's');
            
            // Если нужно напрямую изменить анимацию
            const parallaxUses = document.querySelectorAll('.parallax > use');
            
            // Store original durations if not already stored
            parallaxUses.forEach((use, index) => {
                if (!use.dataset.baseDuration) {
                    // Store original duration based on its position
                    const baseDurations = [7, 7, 10, 10, 13, 13, 20, 20];
                    use.dataset.baseDuration = baseDurations[index] || 10;
                }
                
                // Apply new duration based on speed
                use.style.animationPlayState = 'running';
                use.style.animationDuration = (parseFloat(use.dataset.baseDuration) / (normalizedSpeed * 2 + 0.5)) + 's';
            });
        }
    }
    
    function applyStarDensity(density) {
        document.documentElement.style.setProperty('--star-density', density);
        
        // Инвертируем логику плотности: больше значение = больше частиц
        // Максимальное значение 200, минимальное 10
        const normalizedDensity = parseInt(density);
        
        // Direct modification of particle density in mainpage_background.js
        if (window.particlegroundForeground) {
            // Меньшее значение density создает больше частиц
            // Поэтому мы используем обратно пропорциональную зависимость
            // Инвертируем шкалу: чем больше значение, тем больше частиц
            const invertedDensity = 50000 - (normalizedDensity * 200); // 50000 при 0, 10000 при 200
            window.particlegroundForeground.option('density', invertedDensity);
        }
        
        if (window.particlegroundBackground) {
            // Background particles slightly less dense
            const invertedDensity = 30000 - (normalizedDensity * 120); // 30000 при 0, 6000 при 200
            window.particlegroundBackground.option('density', invertedDensity);
        }
        
        // Сохраняем настройки
        const settings = JSON.parse(localStorage.getItem('customSettings') || '{}');
        settings.starDensity = density;
        localStorage.setItem('customSettings', JSON.stringify(settings));
        
        // Принудительно перерисовываем частицы
        window.dispatchEvent(new Event('resize'));
    }
    
    function applyTitleSize(size) {
        // Преобразуем размер в пикселы: от 24px (при 0) до 60px (при 100)
        const fontSize = 24 + ((parseInt(size) / 100) * 36);
        document.documentElement.style.setProperty('--title-font-size', fontSize + 'px');
        
        // Применяем к элементам с классом main_title
        const mainTitles = document.querySelectorAll('.main_title, h1');
        mainTitles.forEach(title => {
            if (title) {
                title.style.fontSize = fontSize + 'px';
            }
        });
        
        // Сохраняем настройку
        const settings = JSON.parse(localStorage.getItem('customSettings') || '{}');
        settings.titleSize = size;
        localStorage.setItem('customSettings', JSON.stringify(settings));
    }
    
    function applySubtitleSize(size) {
        // Преобразуем размер в пикселы: от 16px (при 0) до 30px (при 100)
        const fontSize = 16 + ((parseInt(size) / 100) * 14);
        document.documentElement.style.setProperty('--subtitle-font-size', fontSize + 'px');
        
        // Применяем к элементам с классом main_subtitle
        const subtitles = document.querySelectorAll('.main_subtitle, h2:not(.customize-section h2)');
        subtitles.forEach(subtitle => {
            if (subtitle) {
                subtitle.style.fontSize = fontSize + 'px';
            }
        });
        
        // Сохраняем настройку
        const settings = JSON.parse(localStorage.getItem('customSettings') || '{}');
        settings.subtitleSize = size;
        localStorage.setItem('customSettings', JSON.stringify(settings));
    }
    
    function applyBodyTextSize(size) {
        // Преобразуем размер в пикселы: от 14px (при 0) до 24px (при 100)
        const fontSize = 14 + ((parseInt(size) / 100) * 10);
        document.documentElement.style.setProperty('--body-font-size', fontSize + 'px');
        
        // Применяем к обычному тексту
        const bodyText = document.querySelectorAll('p, .body-text, span:not(.editable-value), label');
        bodyText.forEach(text => {
            if (text) {
                text.style.fontSize = fontSize + 'px';
            }
        });
        
        // Сохраняем настройку
        const settings = JSON.parse(localStorage.getItem('customSettings') || '{}');
        settings.bodyTextSize = size;
        localStorage.setItem('customSettings', JSON.stringify(settings));
    }
    
    function applyBackground(backgroundType) {
        // First remove all existing background classes
        document.documentElement.removeAttribute('data-background');
        
        // Apply the selected background type
        document.documentElement.setAttribute('data-background', backgroundType);
        
        if (backgroundType === 'gradient') {
            // Hide stars/particles
            const particlesBg = document.getElementById('particles-background');
            const particlesFg = document.getElementById('particles-foreground');
            
            if (particlesBg) particlesBg.style.display = 'none';
            if (particlesFg) particlesFg.style.display = 'none';
            
            // Create gradient background based on current color
            const baseColor = backgroundColorInput.value;
            const gradient = createGradientFromColor(baseColor);
            document.body.style.background = gradient;
            document.body.style.backgroundSize = '400% 400%';
            document.body.style.animation = 'gradient 15s ease infinite';
        } else {
            // Show stars/particles
            const particlesBg = document.getElementById('particles-background');
            const particlesFg = document.getElementById('particles-foreground');
            
            if (particlesBg) particlesBg.style.display = 'block';
            if (particlesFg) particlesFg.style.display = 'block';
            
            // Reset body background
            document.body.style.background = backgroundColorInput.value;
            document.body.style.backgroundSize = '';
            document.body.style.animation = '';
            
            // Apply specific background settings
            if (backgroundType === 'particles') {
                // Reinitialize particles with different density and behavior
                if (window.particlesJS) {
                    try {
                        // Destroy current particles if they exist
                        if (window.pJSDom && window.pJSDom.length > 0) {
                            window.pJSDom[0].pJS.fn.vendors.destroypJS();
                            window.pJSDom = [];
                        }
                        
                        // Initialize new particle system with improved settings
                        initParticlesWithCustomSettings('particles');
                    } catch (e) {
                        console.error("Error reinitializing particles:", e);
                    }
                }
            } else if (backgroundType === 'stars') {
                // Standard stars background
                if (window.particlesJS) {
                    try {
                        // Destroy current particles if they exist
                        if (window.pJSDom && window.pJSDom.length > 0) {
                            window.pJSDom[0].pJS.fn.vendors.destroypJS();
                            window.pJSDom = [];
                        }
                        
                        // Initialize standard star system
                        initParticlesWithCustomSettings('stars');
                    } catch (e) {
                        console.error("Error reinitializing stars:", e);
                    }
                }
            }
        }
    }
    
    // Add new function to initialize particles with current settings
    function initParticlesWithCustomSettings(type) {
        // Get current settings
        const starColor = starColorInput.value;
        const starSpeed = parseFloat(starSpeedInput.value) / 100;
        const starDensity = parseInt(starDensityInput.value);
        
        // Default base speeds
        const baseMaxSpeed = 0.7;
        const baseMinSpeed = 0.1;
        
        // Calculate speeds
        let maxSpeed = baseMaxSpeed * (starSpeed * 3);
        let minSpeed = baseMinSpeed * (starSpeed * 2);
        
        if (starSpeed === 0) {
            maxSpeed = 0;
            minSpeed = 0;
        }
        
        // Convert colors
        const dotColor = convertHexToRgba(starColor, 0.8);
        const lineColor = convertHexToRgba(starColor, 0.3);
        
        // Configure particles based on type
        let bgConfig, fgConfig;
        
        if (type === 'particles') {
            // More dynamic particles configuration
            bgConfig = {
                particles: {
                    number: { value: Math.round(starDensity * 0.7), density: { enable: true, value_area: 800 } },
                    color: { value: dotColor },
                    shape: { type: "circle", stroke: { width: 0, color: "#000000" } },
                    opacity: { value: 0.8, random: true, anim: { enable: true, speed: 1, opacity_min: 0, sync: false } },
                    size: { value: 3, random: true, anim: { enable: false, speed: 4, size_min: 0.3, sync: false } },
                    line_linked: { enable: true, distance: 150, color: lineColor, opacity: 0.3, width: 1 },
                    move: { 
                        enable: true, speed: maxSpeed, direction: "none", random: true, 
                        straight: false, out_mode: "out", bounce: false, 
                        attract: { enable: false, rotateX: 600, rotateY: 1200 } 
                    },
                },
                interactivity: {
                    detect_on: "canvas",
                    events: {
                        onhover: { enable: true, mode: "grab" },
                        onclick: { enable: true, mode: "push" },
                        resize: true
                    },
                    modes: {
                        grab: { distance: 140, line_linked: { opacity: 1 } },
                        bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
                        repulse: { distance: 200, duration: 0.4 },
                        push: { particles_nb: 4 },
                        remove: { particles_nb: 2 }
                    }
                },
                retina_detect: true
            };
            
            fgConfig = JSON.parse(JSON.stringify(bgConfig));
            fgConfig.particles.number.value = Math.round(starDensity * 0.3);
            fgConfig.particles.move.speed = maxSpeed * 1.5;
            fgConfig.particles.size.value = 2;
            fgConfig.particles.opacity.value = 0.4;
        } else {
            // Standard stars configuration
            bgConfig = {
                particles: {
                    number: { value: Math.round(starDensity * 0.7), density: { enable: true, value_area: 800 } },
                    color: { value: dotColor },
                    shape: { type: "circle", stroke: { width: 0, color: "#000000" } },
                    opacity: { value: 0.8, random: true, anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false } },
                    size: { value: 2, random: true, anim: { enable: false, speed: 40, size_min: 0.1, sync: false } },
                    line_linked: { enable: false },
                    move: {
                        enable: true, speed: maxSpeed, direction: "none", random: true,
                        straight: false, out_mode: "out", bounce: false,
                        attract: { enable: false, rotateX: 600, rotateY: 1200 }
                    }
                },
                interactivity: {
                    detect_on: "canvas",
                    events: {
                        onhover: { enable: true, mode: "bubble" },
                        onclick: { enable: true, mode: "repulse" },
                        resize: true
                    },
                    modes: {
                        grab: { distance: 400, line_linked: { opacity: 1 } },
                        bubble: { distance: 250, size: 3, duration: 2, opacity: 0.8, speed: 3 },
                        repulse: { distance: 150, duration: 0.4 },
                        push: { particles_nb: 4 },
                        remove: { particles_nb: 2 }
                    }
                },
                retina_detect: true
            };
            
            fgConfig = JSON.parse(JSON.stringify(bgConfig));
            fgConfig.particles.number.value = Math.round(starDensity * 0.3);
            fgConfig.particles.size.value = 1;
            fgConfig.particles.move.speed = maxSpeed * 1.5;
            fgConfig.particles.opacity.value = 0.4;
        }
        
        // Initialize particles
        particlesJS("particles-background", bgConfig);
        particlesJS("particles-foreground", fgConfig);
    }

    // Helper function to convert hex to rgba for particles
    function convertHexToRgba(hex, alpha = 1) {
        if (!hex) return `rgba(255, 255, 255, ${alpha})`;
        
        try {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        } catch (e) {
            console.error("Error converting hex to rgba:", e);
            return `rgba(255, 255, 255, ${alpha})`;
        }
    }
    
    function saveSettings() {
        // Get all current values
        const settings = {
            headerColor: headerColorInput.value,
            backgroundColor: backgroundColorInput.value,
            starColor: starColorInput.value,
            textColor: textColorInput.value,
            titleSize: titleSizeInput.value,
            subtitleSize: subtitleSizeInput.value,
            bodyTextSize: bodyTextSizeInput ? bodyTextSizeInput.value : '50',
            starSpeed: starSpeedInput.value,
            waveSpeed: waveSpeedInput.value,
            starDensity: starDensityInput.value
        };
        
        // Get selected background type
        const activeBackground = document.querySelector('.background-option.active');
        if (activeBackground) {
            settings.background = activeBackground.getAttribute('data-background');
        }
        
        // Save to localStorage
        localStorage.setItem('customSettings', JSON.stringify(settings));
        
        // Dispatch an event that settings have changed
        const event = new CustomEvent('customSettingsChanged', {
            detail: {
                timestamp: new Date().getTime(),
                settings: settings
            }
        });
        window.dispatchEvent(event);
    }
    
    function loadSettings() {
        const savedSettings = localStorage.getItem('customSettings');
        
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            
            // Apply saved colors
            headerColorInput.value = settings.headerColor || '#FFA600';
            backgroundColorInput.value = settings.backgroundColor || '#050525';
            starColorInput.value = settings.starColor || '#FFFFFF';
            textColorInput.value = settings.textColor || '#FFFFFF';
            
            // Apply saved sliders
            starSpeedInput.value = settings.starSpeed || 5;
            starSpeedValue.textContent = settings.starSpeed || 5;
            waveSpeedInput.value = settings.waveSpeed || 2;
            waveSpeedValue.textContent = settings.waveSpeed || 2;
            starDensityInput.value = settings.starDensity || 150;
            starDensityValue.textContent = settings.starDensity || 150;
            
            // Apply font sizes if they exist
            if (titleSizeInput && settings.titleSize) {
                titleSizeInput.value = settings.titleSize;
                titleSizeValue.textContent = settings.titleSize;
            }
            
            if (subtitleSizeInput && settings.subtitleSize) {
                subtitleSizeInput.value = settings.subtitleSize;
                subtitleSizeValue.textContent = settings.subtitleSize;
            }
            
            if (bodyTextSizeInput && settings.bodyTextSize) {
                bodyTextSizeInput.value = settings.bodyTextSize;
                bodyTextSizeValue.textContent = settings.bodyTextSize;
            }
            
            // Update custom palette colors
            if (document.querySelector('.custom-palette')) {
                document.getElementById('custom-header-color').style.backgroundColor = headerColorInput.value;
                document.getElementById('custom-bg-color').style.backgroundColor = backgroundColorInput.value;
                document.getElementById('custom-star-color').style.backgroundColor = starColorInput.value;
                document.getElementById('custom-text-color').style.backgroundColor = textColorInput.value;
            }
            
            // Apply saved background
            const activeBackground = settings.background || 'stars';
            document.querySelector(`[data-background="${activeBackground}"]`)?.classList.add('active');
            
            // Determine if using custom colors or one of the predefined palettes
            if (settings.usingCustomColors) {
                // Activate custom palette
                colorPalettes.forEach(p => p.classList.remove('active'));
                document.querySelector('.custom-palette')?.classList.add('active');
            } else {
                // Try to find a matching predefined palette
                let foundMatchingPalette = false;
                colorPalettes.forEach(palette => {
                    if (palette.classList.contains('custom-palette')) return;
                    
                    const colors = palette.getAttribute('data-colors').split(',');
                    if (colors.length >= 4 && 
                        colors[0] === settings.headerColor &&
                        colors[1] === settings.backgroundColor &&
                        colors[2] === settings.starColor &&
                        colors[3] === settings.textColor) {
                        // Match found, activate this palette
                        colorPalettes.forEach(p => p.classList.remove('active'));
                        palette.classList.add('active');
                        foundMatchingPalette = true;
                    }
                });
                
                // If no matching palette found, activate custom
                if (!foundMatchingPalette) {
                    colorPalettes.forEach(p => p.classList.remove('active'));
                    document.querySelector('.custom-palette')?.classList.add('active');
                }
            }
            
            // Apply all settings visually
            applyHeaderColor(headerColorInput.value);
            // Применяем цвет к градиенту фона
            document.documentElement.style.setProperty('--background-color', settings.backgroundColor);
            
            applyStarColor(starColorInput.value);
            applyTextColor(textColorInput.value);
            applyStarSpeed(starSpeedInput.value);
            applyWaveSpeed(waveSpeedInput.value);
            applyStarDensity(starDensityInput.value);
            
            if (settings.titleSize) applyTitleSize(settings.titleSize);
            if (settings.subtitleSize) applySubtitleSize(settings.subtitleSize);
            if (settings.bodyTextSize) applyBodyTextSize(settings.bodyTextSize);
            
            applyBackground(activeBackground);
        } else {
            // Set default active background if no settings found
            document.querySelector('[data-background="stars"]')?.classList.add('active');
        }
    }
    
    function resetSettings() {
        // Default values
        headerColorInput.value = '#FFA600';
        backgroundColorInput.value = '#050525';
        starColorInput.value = '#FFFFFF';
        textColorInput.value = '#FFFFFF';
        
        starSpeedInput.value = 5;
        starSpeedValue.textContent = 5;
        waveSpeedInput.value = 2;
        waveSpeedValue.textContent = 2;
        starDensityInput.value = 150;
        starDensityValue.textContent = 150;
        
        // Reset font sizes
        if (titleSizeInput) {
            titleSizeInput.value = 50;
            titleSizeValue.textContent = 50;
        }
        
        if (subtitleSizeInput) {
            subtitleSizeInput.value = 50;
            subtitleSizeValue.textContent = 50;
        }
        
        if (bodyTextSizeInput) {
            bodyTextSizeInput.value = 50;
            bodyTextSizeValue.textContent = 50;
        }
        
        // Update color indicators
        updateColorIndicator(headerColorInput, headerColorIndicator);
        updateColorIndicator(backgroundColorInput, backgroundColorIndicator);
        updateColorIndicator(starColorInput, starColorIndicator);
        updateColorIndicator(textColorInput, textColorIndicator);
        
        // Update custom palette
        if (document.querySelector('.custom-palette')) {
            document.getElementById('custom-header-color').style.backgroundColor = headerColorInput.value;
            document.getElementById('custom-bg-color').style.backgroundColor = backgroundColorInput.value;
            document.getElementById('custom-star-color').style.backgroundColor = starColorInput.value;
            document.getElementById('custom-text-color').style.backgroundColor = textColorInput.value;
        }
        
        // Reset background selection
        backgroundOptions.forEach(opt => opt.classList.remove('active'));
        document.querySelector('[data-background="stars"]')?.classList.add('active');
        
        // Активируем стандартную палитру
        colorPalettes.forEach(p => p.classList.remove('active'));
        document.querySelector('[data-colors="#FFA600,#050525,#FFFFFF,#FFFFFF"]')?.classList.add('active');
        
        // Apply default settings visually
        applyHeaderColor(headerColorInput.value);
        
        // Применяем цвет к градиенту фона
        document.documentElement.style.setProperty('--background-color', backgroundColorInput.value);
        
        applyStarColor(starColorInput.value);
        applyTextColor(textColorInput.value);
        applyStarSpeed(starSpeedInput.value);
        applyWaveSpeed(waveSpeedInput.value);
        applyStarDensity(starDensityInput.value);
        
        if (titleSizeInput) applyTitleSize(50);
        if (subtitleSizeInput) applySubtitleSize(50);
        if (bodyTextSizeInput) applyBodyTextSize(50);
        
        applyBackground('stars');
        
        // Clear saved settings
        localStorage.removeItem('customSettings');
    }
    
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.classList.add('customize-notification');
        notification.textContent = message;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Add visible class for animation
        setTimeout(() => notification.classList.add('visible'), 10);
        
        // Remove after animation
        setTimeout(() => {
            notification.classList.remove('visible');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
    
    // Add notification styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .customize-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--header-color, #ffa600);
            color: #000;
            padding: 15px 25px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 1000;
            font-weight: bold;
        }
        
        .customize-notification.visible {
            transform: translateY(0);
            opacity: 1;
        }
        
        .inline-edit {
            padding: 2px 5px;
            border: 1px solid rgba(255, 166, 0, 0.5);
            border-radius: 3px;
            background: rgba(0, 0, 0, 0.2);
            color: white;
            text-align: center;
        }
        
        .editable-value {
            cursor: text;
            padding: 2px 5px;
            border-radius: 3px;
            transition: background-color 0.2s;
        }
        
        .editable-value:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }
        
        @keyframes gradient {
            0% {
                background-position: 0% 50%;
            }
            50% {
                background-position: 100% 50%;
            }
            100% {
                background-position: 0% 50%;
            }
        }
    `;
    document.head.appendChild(style);

    // Setup connections to particleground in mainpage_background.js
    // Store references to the particleground instances globally
    window.setupParticlegroundRefs = function(foreground, background) {
        window.particlegroundForeground = foreground;
        window.particlegroundBackground = background;
        
        // Apply current settings
        applyStarColor(starColorInput.value);
        applyStarSpeed(starSpeedInput.value);
        applyStarDensity(starDensityInput.value);
    };

    // Inject code to mainpage_background.js to capture references
    if (window.particleground) {
        const originalParticleground = window.particleground;
        window.particleground = function(element, options) {
            const instance = originalParticleground(element, options);
            
            if (element.id === 'particles-foreground') {
                window.particlegroundForeground = instance;
            } else if (element.id === 'particles-background') {
                window.particlegroundBackground = instance;
            }
            
            return instance;
        };
    }

    // Функция для обновления кастомной палитры
    function updateCustomPalette() {
        // Обновляем цвета в кастомной палитре
        document.getElementById('custom-header-color').style.backgroundColor = headerColorInput.value;
        document.getElementById('custom-bg-color').style.backgroundColor = backgroundColorInput.value;
        document.getElementById('custom-star-color').style.backgroundColor = starColorInput.value;
        document.getElementById('custom-text-color').style.backgroundColor = textColorInput.value;
        
        // Делаем кастомную палитру активной
        colorPalettes.forEach(p => p.classList.remove('active'));
        document.querySelector('.custom-palette').classList.add('active');
    }

    // Функция для создания градиента из выбранного цвета
    function createGradientFromColor(color) {
        // Получаем RGB значения из hex
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        
        // Создаем темный оттенок
        const darkerColor = `rgb(${Math.max(0, r-40)}, ${Math.max(0, g-40)}, ${Math.max(0, b-40)})`;
        
        // Создаем более темный оттенок для градиента
        const darkestColor = `rgb(${Math.max(0, r-80)}, ${Math.max(0, g-80)}, ${Math.max(0, b-80)})`;
        
        // Возвращаем градиент
        return `linear-gradient(to bottom, ${darkerColor} 0%, ${color} 50%, ${darkestColor} 100%)`;
    }
}); 