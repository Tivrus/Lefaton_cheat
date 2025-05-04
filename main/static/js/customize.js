/**
 * customize.js - Customization page functionality
 * Handles customization options for Lefaton Cheat
 */

// Обеспечиваем корректную загрузку и применение настроек при загрузке страницы
window.addEventListener('load', function() {
    // Применяем сохраненные настройки сразу после полной загрузки страницы
    const savedSettings = getSavedSettings();
    applySettings(savedSettings);
});

document.addEventListener('DOMContentLoaded', function() {
    console.log('Customize page script loaded');
    
    // Initialize Pickr color pickers
    const headerColorPickr = Pickr.create({
        el: '#header-color-picker',
        theme: 'nano',
        useAsButton: true,
        default: getSettingValue('headerColor') || '#ff9500',
        swatches: [
            '#ff9500',
            '#b485ff', 
            '#5649c0',
            '#ff5c5c',
            '#00bfff',
            '#3498db',
            '#2ecc71',
            '#f1c40f',
            '#e74c3c',
            '#ffffff',
            '#000000'
        ],
        components: {
            preview: true,
            opacity: true,
            hue: true,
            interaction: {
                hex: true,
                rgba: true,
                hsla: false,
                hsva: false,
                cmyk: false,
                input: true,
                clear: false,
                save: true
            }
        }
    });
    
    const bgColorPickr = Pickr.create({
        el: '#bg-color-picker',
        theme: 'nano',
        useAsButton: true,
        default: getSettingValue('backgroundColor') || '#000000',
        swatches: [
            '#000000',
            '#121212',
            '#1a1a1a',
            '#232323',
            '#0c1021',
            '#1e1e2e',
            '#2d2b55',
            '#0e0e18',
            '#ffffff',
            '#f5f5f5'
        ],
        components: {
            preview: true,
            opacity: true,
            hue: true,
            interaction: {
                hex: true,
                rgba: true,
                hsla: false,
                hsva: false,
                cmyk: false,
                input: true,
                clear: false,
                save: true
            }
        }
    });
    
    const accentColorPickr = Pickr.create({
        el: '#accent-color-picker',
        theme: 'nano',
        useAsButton: true,
        default: getSettingValue('accentColor') || '#7c5cff',
        swatches: [
            '#7c5cff',
            '#b485ff', 
            '#5649c0',
            '#ff5c5c',
            '#00bfff',
            '#3498db',
            '#2ecc71',
            '#f1c40f',
            '#e74c3c',
            '#ffffff',
            '#000000'
        ],
        components: {
            preview: true,
            opacity: true,
            hue: true,
            interaction: {
                hex: true,
                rgba: true,
                hsla: false,
                hsva: false,
                cmyk: false,
                input: true,
                clear: false,
                save: true
            }
        }
    });
    
    const textColorPickr = Pickr.create({
        el: '#text-color-picker',
        theme: 'nano',
        useAsButton: true,
        default: getSettingValue('textColor') || '#ffffff',
        swatches: [
            '#ffffff',
            '#f5f5f5',
            '#e0e0e0',
            '#cccccc',
            '#333333',
            '#222222',
            '#111111',
            '#000000'
        ],
        components: {
            preview: true,
            opacity: true,
            hue: true,
            interaction: {
                hex: true,
                rgba: true,
                hsla: false,
                hsva: false,
                cmyk: false,
                input: true,
                clear: false,
                save: true
            }
        }
    });
    
    // Set up color picker change events
    headerColorPickr.on('save', (color) => {
        if (!color) return;
        const hexColor = color.toHEXA().toString();
        // Only update preview, not actual site elements
        updatePreviewColors(hexColor, null, null, null);
        headerColorPickr.hide();
        // Show save reminder
        showSaveReminder();
    });
    
    bgColorPickr.on('save', (color) => {
        if (!color) return;
        const hexColor = color.toHEXA().toString();
        // Only update preview, not actual site elements
        updatePreviewColors(null, hexColor, null, null);
        bgColorPickr.hide();
        // Show save reminder
        showSaveReminder();
    });
    
    accentColorPickr.on('save', (color) => {
        if (!color) return;
        const hexColor = color.toHEXA().toString();
        // Only update preview, not actual site elements
        updatePreviewColors(null, null, hexColor, null);
        accentColorPickr.hide();
        // Show save reminder
        showSaveReminder();
    });
    
    textColorPickr.on('save', (color) => {
        if (!color) return;
        const hexColor = color.toHEXA().toString();
        // Only update preview, not actual site elements
        updatePreviewColors(null, null, null, hexColor);
        textColorPickr.hide();
        // Show save reminder
        showSaveReminder();
    });
    
    // Initialize sliders with numeric inputs
    initializeSliders();
    
    // Initialize the preview
    initializePreview();
    
    // Load saved settings
    loadSavedSettings();
    
    // Initialize color palettes
    initializeColorPalettes();
    
    // Initialize background options
    initializeBackgroundOptions();
    
    // Emphasize the save notice
    enhanceSaveNotice();
    
    // Save settings button
    const saveSettingsBtn = document.getElementById('save-settings');
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', function() {
            // Get values from all inputs
            const settings = getCustomSettingsFromInputs();
            
            // Save settings to localStorage
            saveSettings(settings);
            
            // Apply changes immediately
            applySettings(settings);
            
            // Show success message with reload button
            const successMsg = document.createElement('div');
            successMsg.className = 'success-message';
            successMsg.innerHTML = `
                <div>Настройки успешно сохранены и применены!</div>
                <div style="margin-top: 12px;">Для применения некоторых эффектов желательно <button id="reload-page" style="color: var(--accent-color); background: none; border: none; cursor: pointer; padding: 0; font-weight: bold; text-decoration: underline;">перезагрузить страницу</button></div>
            `;
            
            // Remove existing success messages
            document.querySelectorAll('.success-message').forEach(el => el.remove());
            
            // Add success message
            const buttonsContainer = this.closest('.buttons-container');
            buttonsContainer.parentNode.insertBefore(successMsg, buttonsContainer.nextSibling);
            
            // Add click handler for reload button
            document.getElementById('reload-page').addEventListener('click', function() {
                window.location.reload();
            });
        });
    }
    
    // Reset settings button
    const resetSettingsBtn = document.getElementById('reset-settings');
    if (resetSettingsBtn) {
        resetSettingsBtn.addEventListener('click', function() {
            if (confirm('Вы уверены, что хотите сбросить все настройки до значений по умолчанию?')) {
                // Reset to default settings
                const defaultSettings = resetSettings();
                
                // Update color pickers with default values
                if (typeof headerColorPickr !== 'undefined') {
                    headerColorPickr.setColor(defaultSettings.headerColor);
                }
                
                if (typeof bgColorPickr !== 'undefined') {
                    bgColorPickr.setColor(defaultSettings.backgroundColor);
                }
                
                if (typeof accentColorPickr !== 'undefined') {
                    accentColorPickr.setColor(defaultSettings.accentColor);
                }
                
                if (typeof textColorPickr !== 'undefined') {
                    textColorPickr.setColor(defaultSettings.textColor);
                }
                
                // Update sliders
                const sliders = {
                    'titleSize': { actualValue: 100, displayValue: 50 },
                    'subtitleSize': { actualValue: 100, displayValue: 50 },
                    'bodyTextSize': { actualValue: 100, displayValue: 50 },
                    'waveSpeed': { actualValue: 5, displayValue: 5 },
                    'starSpeed': { actualValue: 5, displayValue: 5 },
                };
                
                Object.keys(sliders).forEach(sliderId => {
                    const slider = document.getElementById(sliderId);
                    const valueInput = document.getElementById(`${sliderId}Value`);
                    
                    if (slider && valueInput) {
                        slider.value = sliders[sliderId].displayValue;
                        valueInput.value = sliders[sliderId].displayValue;
                    }
                });
                
                // Remove active class from all color palettes
                document.querySelectorAll('.color-palette').forEach(palette => {
                    palette.classList.remove('active');
                });
                
                // Add active class to standard palette
                const standardPalette = document.querySelector('.color-palette[data-palette="standard"]');
                if (standardPalette) {
                    standardPalette.classList.add('active');
                }
                
                // Show success message with reload button
                const successMsg = document.createElement('div');
                successMsg.className = 'success-message';
                successMsg.innerHTML = `
                    <div>Настройки сброшены до значений по умолчанию!</div>
                    <div style="margin-top: 8px;">Для применения всех изменений необходимо <button id="reload-page" style="color: var(--accent-color); text-decoration: underline; background: none; border: none; cursor: pointer; padding: 0; font-weight: bold;">перезагрузить страницу</button></div>
                `;
                
                successMsg.style.color = '#4CAF50';
                successMsg.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
                successMsg.style.padding = '15px';
                successMsg.style.borderRadius = '8px';
                successMsg.style.marginTop = '15px';
                successMsg.style.textAlign = 'center';
                
                // Remove existing success messages
                document.querySelectorAll('.success-message').forEach(el => el.remove());
                
                // Add success message
                const buttonsContainer = resetSettingsBtn.closest('.buttons-container');
                buttonsContainer.parentNode.insertBefore(successMsg, buttonsContainer.nextSibling);
                
                // Add click handler for reload button
                document.getElementById('reload-page').addEventListener('click', function() {
                    window.location.reload();
                });
                
                // Update theme
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                
                // Reinitialize background
                if (typeof particlesJS !== 'undefined') {
                    initializeBackground('stars', defaultSettings);
                }
                
                // Update preview
                updatePreview(defaultSettings);
            }
        });
    }
    
    // Function to initialize color palettes
    function initializeColorPalettes() {
        const palettes = document.querySelectorAll('.color-palette');
        
        palettes.forEach(palette => {
            palette.addEventListener('click', function() {
                // Remove active class from all palettes
                palettes.forEach(p => p.classList.remove('active'));
                
                // Add active class to clicked palette
                this.classList.add('active');
                
                // Get colors from data attribute
                const colorsString = this.getAttribute('data-colors');
                if (colorsString) {
                    const colors = colorsString.split(',');
                    applyColorPalette(colors);
                }
            });
        });
    }
    
    // Function to initialize background options
    function initializeBackgroundOptions() {
        const backgroundOptions = document.querySelectorAll('.background-option');
        
        backgroundOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove active class from all options
                backgroundOptions.forEach(opt => opt.classList.remove('active'));
                
                // Add active class to clicked option
                this.classList.add('active');
                
                // Get background type
                const bgType = this.getAttribute('data-background');
                
                // Set the background type
                document.documentElement.setAttribute('data-background', bgType);
                
                // Apply background specific settings
                applyBackgroundSetting(bgType);
                
                // Update preview
                const previewContainer = document.querySelector('.preview-container');
                if (previewContainer) {
                    // Remove existing background classes
                    previewContainer.classList.remove('bg-stars', 'bg-particles', 'bg-gradient');
                    
                    // Add new background class
                    previewContainer.classList.add(`bg-${bgType}`);
                }
            });
        });
        
        // Set active class based on saved setting
        const savedSettings = getSavedSettings();
        const savedBgType = savedSettings.background || 'stars';
        
        backgroundOptions.forEach(option => {
            if (option.getAttribute('data-background') === savedBgType) {
                option.classList.add('active');
                
                // Set the background type in the DOM
                document.documentElement.setAttribute('data-background', savedBgType);
                
                // Apply background specific settings
                applyBackgroundSetting(savedBgType);
            }
        });
    }
    
    // Function to initialize sliders with numeric inputs
    function initializeSliders() {
        const sliders = {
            'titleSize': { defaultValue: 50, valueSuffix: '%', actualMin: 80, actualMax: 120 },
            'subtitleSize': { defaultValue: 50, valueSuffix: '%', actualMin: 80, actualMax: 120 },
            'bodyTextSize': { defaultValue: 50, valueSuffix: '%', actualMin: 80, actualMax: 120 },
            'waveSpeed': { defaultValue: 5, valueSuffix: '', actualMin: 0, actualMax: 100 },
            'starSpeed': { defaultValue: 5, valueSuffix: '', actualMin: 0, actualMax: 100 },
        };
        
        Object.keys(sliders).forEach(sliderId => {
            const slider = document.getElementById(sliderId);
            const valueInput = document.getElementById(`${sliderId}Value`);
            
            if (!slider || !valueInput) return;
            
            // Initialize with saved value or default
                const savedSettings = getSavedSettings();
            const savedValue = savedSettings[sliderId] !== undefined ? 
                convertActualToDisplayValue(parseInt(savedSettings[sliderId]), sliders[sliderId]) : 
                sliders[sliderId].defaultValue;
            
            slider.value = savedValue;
            valueInput.value = savedValue;
            
            // Update value input when slider changes
            slider.addEventListener('input', function() {
                valueInput.value = this.value;
                
                // Update preview in real-time using actual range values
                const actualValue = convertDisplayToActualValue(parseInt(this.value), sliders[sliderId]);
                updatePreviewSliderValue(sliderId, actualValue);
            });
            
            // Update slider when value input changes
            valueInput.addEventListener('input', function() {
                let value = parseInt(this.value);
                if (isNaN(value)) return;
                
                // Limit to 0-100 while typing
                if (value < 0) this.value = 0;
                if (value > 100) this.value = 100;
                
                // Update slider value
                slider.value = this.value;
                
                // Update preview using actual range values
                const actualValue = convertDisplayToActualValue(parseInt(this.value), sliders[sliderId]);
                updatePreviewSliderValue(sliderId, actualValue);
            });
            
            // Handle blur/change event for final validation
            valueInput.addEventListener('change', function() {
                let value = parseInt(this.value);
                
                // Validate range
                if (isNaN(value)) value = sliders[sliderId].defaultValue;
                if (value < 0) value = 0;
                if (value > 100) value = 100;
                
                // Update UI
                this.value = value;
                slider.value = value;
                
                // Update preview using actual range values
                const actualValue = convertDisplayToActualValue(value, sliders[sliderId]);
                updatePreviewSliderValue(sliderId, actualValue);
            });
        });
    }
    
    // Helper function to convert from display value (0-100) to actual value range
    function convertDisplayToActualValue(displayValue, sliderConfig) {
        const { actualMin, actualMax } = sliderConfig;
        // Convert displayValue (0-100) to the actual range
        return actualMin + (displayValue / 100) * (actualMax - actualMin);
    }
    
    // Helper function to convert from actual value to display value (0-100)
    function convertActualToDisplayValue(actualValue, sliderConfig) {
        const { actualMin, actualMax } = sliderConfig;
        // Convert actualValue to display range (0-100)
        return Math.round(((actualValue - actualMin) / (actualMax - actualMin)) * 100);
    }
    
    // Function to apply a specific background setting
    function applyBackgroundSetting(bgType) {
        // Set the background type attribute for CSS selectors
        document.documentElement.setAttribute('data-background', bgType);
        
        // Initialize the appropriate background
        initializeBackground(bgType, getSavedSettings());
    }

    // Function to load saved settings into inputs
    function loadSavedSettings() {
        const savedSettings = getSavedSettings();
        
        // Update color pickers
        if (typeof headerColorPickr !== 'undefined') {
            headerColorPickr.setColor(savedSettings.headerColor || '#ff9500');
        }
        
        if (typeof bgColorPickr !== 'undefined') {
            bgColorPickr.setColor(savedSettings.backgroundColor || '#000000');
        }
        
        if (typeof accentColorPickr !== 'undefined') {
            accentColorPickr.setColor(savedSettings.accentColor || '#ff9500');
        }
        
        if (typeof textColorPickr !== 'undefined') {
            textColorPickr.setColor(savedSettings.textColor || '#FFFFFF');
        }
        
        // Update sliders
        const sliders = {
            'titleSize': { actualMin: 80, actualMax: 120 },
            'subtitleSize': { actualMin: 80, actualMax: 120 },
            'bodyTextSize': { actualMin: 80, actualMax: 120 },
            'waveSpeed': { actualMin: 0, actualMax: 100 },
            'starSpeed': { actualMin: 0, actualMax: 100 },
        };
        
        Object.keys(sliders).forEach(sliderId => {
            if (savedSettings[sliderId] !== undefined) {
                const slider = document.getElementById(sliderId);
                const valueInput = document.getElementById(`${sliderId}Value`);
                
                if (slider && valueInput) {
                    const actualValue = parseInt(savedSettings[sliderId]);
                    const displayValue = convertActualToDisplayValue(actualValue, sliders[sliderId]);
                    
                    slider.value = displayValue;
                    valueInput.value = displayValue;
                }
            }
        });
        
        // Update background type
        const backgroundOptions = document.querySelectorAll('.background-option');
        backgroundOptions.forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-background') === savedSettings.background) {
                option.classList.add('active');
            }
        });
        
        // Find and activate the matching color palette
        findAndActivateMatchingPalette(savedSettings);
        
        // Update preview
        updatePreview(savedSettings);
    }
    
    // Function to get custom settings from inputs
    function getCustomSettingsFromInputs() {
        // Get values from color pickers
        const headerColor = headerColorPickr ? headerColorPickr.getColor().toHEXA().toString() : '#ff9500';
        const backgroundColor = bgColorPickr ? bgColorPickr.getColor().toHEXA().toString() : '#000000';
        const accentColor = accentColorPickr ? accentColorPickr.getColor().toHEXA().toString() : '#7c5cff';
        const textColor = textColorPickr ? textColorPickr.getColor().toHEXA().toString() : '#FFFFFF';
        
        // Get the actual values from sliders (converting from display value to actual value)
        const titleSize = convertDisplayToActualValue(parseInt(document.getElementById('titleSize')?.value || 50), { actualMin: 80, actualMax: 120 });
        const subtitleSize = convertDisplayToActualValue(parseInt(document.getElementById('subtitleSize')?.value || 50), { actualMin: 80, actualMax: 120 });
        const bodyTextSize = convertDisplayToActualValue(parseInt(document.getElementById('bodyTextSize')?.value || 50), { actualMin: 80, actualMax: 120 });
        
        const waveSpeed = document.getElementById('waveSpeed')?.value || 5;
        const starSpeed = document.getElementById('starSpeed')?.value || 5;
        
        // Get background type
        const backgroundType = document.querySelector('.background-option.active')?.getAttribute('data-background') || 'stars';
        
        // Get theme
        const theme = document.documentElement.getAttribute('data-theme') || 'dark';
        
        return {
            headerColor,
            backgroundColor,
            accentColor,
            textColor,
            titleSize: Math.round(titleSize),
            subtitleSize: Math.round(subtitleSize),
            bodyTextSize: Math.round(bodyTextSize),
            waveSpeed,
            starSpeed,
            background: backgroundType,
            theme
        };
    }
    
    // Function to find and activate the matching color palette
    function findAndActivateMatchingPalette(settings) {
        // Remove active class from all palettes
        document.querySelectorAll('.color-palette').forEach(palette => {
            palette.classList.remove('active');
        });
        
        // Compare current settings with palette colors
        if (settings.headerColor && settings.backgroundColor) {
            const palettes = document.querySelectorAll('.color-palette');
            let foundMatch = false;
            
            palettes.forEach(palette => {
                const colorsString = palette.getAttribute('data-colors');
                if (colorsString) {
                    const colors = colorsString.split(',');
                    if (colors.length >= 2 && 
                        colors[0].toLowerCase() === settings.headerColor.toLowerCase() && 
                        colors[1].toLowerCase() === settings.backgroundColor.toLowerCase()) {
                        palette.classList.add('active');
                        foundMatch = true;
                    }
                }
            });
            
            // If no match found, check for approximate match
            if (!foundMatch) {
                let bestMatchPalette = null;
                let closestMatch = 99999;
                
                palettes.forEach(palette => {
                    const colorsString = palette.getAttribute('data-colors');
                    if (colorsString) {
                        const colors = colorsString.split(',');
                        if (colors.length >= 2) {
                            // Calculate color distance
                            const headerDist = colorDistance(settings.headerColor, colors[0]);
                            const bgDist = colorDistance(settings.backgroundColor, colors[1]);
                            const totalDist = headerDist + bgDist;
                            
                            if (totalDist < closestMatch) {
                                closestMatch = totalDist;
                                bestMatchPalette = palette;
                            }
                        }
                    }
                });
                
                // If we found a close match, activate it
                if (bestMatchPalette && closestMatch < 100) {
                    bestMatchPalette.classList.add('active');
                }
            }
        }
    }
    
    // Function to initialize preview
    function initializePreview() {
        // Add event listeners to color pickers for live preview
        const colorInputs = document.querySelectorAll('[data-coloris]');
        colorInputs.forEach(input => {
            input.addEventListener('input', function() {
                const id = this.id;
                const value = this.value;
                
                // Update preview based on color type
                if (id === 'headerColor') {
                    document.querySelector('.preview-header').style.backgroundColor = value;
                } else if (id === 'backgroundColor') {
                    document.querySelector('.preview-container').style.backgroundColor = 
                        hexToRgba(value, 0.7);
                } else if (id === 'accentColor') {
                    document.querySelector('.preview-button').style.backgroundColor = value;
                } else if (id === 'textColor') {
                    document.querySelector('.preview-text').style.color = value;
                }
            });
        });
    }
    
    // Function to update preview with all settings
    function updatePreview(settings) {
        // Update preview colors
        updatePreviewColors(
            settings.headerColor, 
            settings.backgroundColor,
            settings.accentColor,
            settings.textColor
        );
        
        // Update preview sizes
        updatePreviewSize(
            settings.titleSize,
            settings.subtitleSize,
            settings.bodyTextSize
        );
    }
    
    // Function to update preview colors
    function updatePreviewColors(headerColor, bgColor, accentColor, textColor) {
        const previewHeader = document.querySelector('.preview-header');
        const previewContainer = document.querySelector('.preview-container');
        const previewButton = document.querySelector('.preview-button');
        const previewText = document.querySelector('.preview-text');
        const previewTitle = document.querySelector('.preview-title');
        
        if (previewHeader && headerColor) {
            previewHeader.style.backgroundColor = headerColor;
        }
        
        if (previewContainer && bgColor) {
            previewContainer.style.backgroundColor = hexToRgba(bgColor, 0.7);
        }
        
        if (previewButton && accentColor) {
            previewButton.style.backgroundColor = accentColor;
        }
        
        if (previewText && textColor) {
            previewText.style.color = textColor;
        }
        
        if (previewTitle && textColor) {
            previewTitle.style.color = textColor;
        }
    }
    
    // Function to update preview text sizes
    function updatePreviewSize(titleSize, subtitleSize, bodyTextSize) {
        const previewTitle = document.querySelector('.preview-title');
        const previewMenuItems = document.querySelectorAll('.preview-menu-item');
        const previewText = document.querySelector('.preview-text');
        
        if (previewTitle && titleSize) {
            const size = 20 * (parseInt(titleSize) / 100);
            previewTitle.style.fontSize = `${size}px`;
        }
        
        if (previewMenuItems.length && subtitleSize) {
            const size = 14 * (parseInt(subtitleSize) / 100);
            previewMenuItems.forEach(item => {
                item.style.fontSize = `${size}px`;
            });
        }
        
        if (previewText && bodyTextSize) {
            const size = 14 * (parseInt(bodyTextSize) / 100);
            previewText.style.fontSize = `${size}px`;
        }
    }
    
    // Function to update preview based on slider value
    function updatePreviewSliderValue(sliderId, value) {
        if (sliderId === 'titleSize') {
            const previewTitle = document.querySelector('.preview-title');
            if (previewTitle) {
                const size = 20 * (parseInt(value) / 100);
                previewTitle.style.fontSize = `${size}px`;
            }
        } else if (sliderId === 'subtitleSize') {
            const previewMenuItems = document.querySelectorAll('.preview-menu-item');
            if (previewMenuItems.length) {
                const size = 14 * (parseInt(value) / 100);
                previewMenuItems.forEach(item => {
                    item.style.fontSize = `${size}px`;
                });
            }
        } else if (sliderId === 'bodyTextSize') {
            const previewText = document.querySelector('.preview-text');
            if (previewText) {
                const size = 14 * (parseInt(value) / 100);
                previewText.style.fontSize = `${size}px`;
            }
        }
    }
    
    // Function to apply color palette
    function applyColorPalette(colors) {
        if (colors.length >= 4) {
            // Update color pickers
            if (typeof headerColorPickr !== 'undefined') {
                headerColorPickr.setColor(colors[0]);
            }
            
            if (typeof bgColorPickr !== 'undefined') {
                bgColorPickr.setColor(colors[1]);
            }
            
            if (typeof accentColorPickr !== 'undefined') {
                accentColorPickr.setColor(colors[2]);
                // Update RGB values
                updateAccentColorRGB(colors[2]);
            }
            
            if (typeof textColorPickr !== 'undefined') {
                textColorPickr.setColor(colors[3]);
            }
            
            // Apply colors to preview only, not the actual site
            updatePreviewColors(colors[0], colors[1], colors[2], colors[3]);
            
            // Show save reminder
            showSaveReminder();
        }
    }
    
    // Function to show save reminder
    function showSaveReminder() {
        const saveNotice = document.querySelector('.save-notice');
        if (saveNotice) {
            // Добавляем класс для подсветки
            saveNotice.classList.add('highlight-notice');
            
            // Анимация пульсации
            saveNotice.animate([
                { transform: 'scale(1)', boxShadow: '0 0 0 rgba(124, 92, 255, 0.3)' },
                { transform: 'scale(1.03)', boxShadow: '0 0 20px rgba(124, 92, 255, 0.5)' },
                { transform: 'scale(1)', boxShadow: '0 0 0 rgba(124, 92, 255, 0.3)' }
            ], {
                duration: 1000,
                iterations: 3
            });
            
            // Также подсвечиваем кнопку сохранения
            const saveButton = document.getElementById('save-settings');
            if (saveButton) {
                saveButton.animate([
                    { transform: 'translateY(0)', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)' },
                    { transform: 'translateY(-5px)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)' },
                    { transform: 'translateY(0)', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)' }
                ], {
                    duration: 1000,
                    iterations: 3
                });
            }
            
            // Убираем подсветку через 3 секунды
            setTimeout(() => {
                saveNotice.classList.remove('highlight-notice');
            }, 3000);
        }
    }
    
    // Function to enhance save notice
    function enhanceSaveNotice() {
        const saveNotice = document.querySelector('.save-notice');
        if (saveNotice) {
            saveNotice.innerHTML = `
                <i class="fas fa-exclamation-circle"></i>
                <div>
                    <strong>Важно!</strong> Все изменения вступят в силу только после нажатия кнопки <strong>"Сохранить настройки"</strong> и перезагрузки страницы.
                </div>
            `;
        }
    }
}); 