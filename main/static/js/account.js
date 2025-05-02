// Account page functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Account page script loaded');
    
    // Initialize Pickr color pickers
    const accentColorPickr = Pickr.create({
        el: '#accent-color-picker',
        theme: 'nano',
        useAsButton: true,
        default: getCustomSettingValue('accentColor') || '#7c5cff',
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
    
    const bgColorPickr = Pickr.create({
        el: '#bg-color-picker',
        theme: 'nano',
        useAsButton: true,
        default: getCustomSettingValue('backgroundColor') || '#000000',
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
    
    // Initialize sliders
    initializeSliders();
    
    // Save Pickr values when changed
    accentColorPickr.on('save', (color) => {
        if (!color) return;
        const hexColor = color.toHEXA().toString();
        updateCustomSettings('accentColor', hexColor);
        
        // Visual preview of changes (will be fully applied on reload)
        const root = document.documentElement;
        root.style.setProperty('--accent-color', hexColor);
        root.style.setProperty('--accent-hover', lightenColor(hexColor, 20));
        root.style.setProperty('--accent-color-semi', hexToRgba(hexColor, 0.3));
        
        // Update relevant UI elements
        document.querySelectorAll('input[type="range"]').forEach(slider => {
            slider.style.backgroundImage = `linear-gradient(to right, ${hexColor}, ${hexColor})`;
        });
        
        accentColorPickr.hide();
    });
    
    bgColorPickr.on('save', (color) => {
        if (!color) return;
        const hexColor = color.toHEXA().toString();
        updateCustomSettings('backgroundColor', hexColor);
        
        // Visual preview (will be fully applied on reload)
        document.body.style.backgroundColor = hexColor;
        
        bgColorPickr.hide();
    });
    
    // Handle sliders and input changes
    function initializeSliders() {
        const sliders = {
            'elementSize': { defaultValue: 50, valueSuffix: '%' },
            'elementSpacing': { defaultValue: 50, valueSuffix: 'px' },
            'borderRadius': { defaultValue: 50, valueSuffix: 'px' },
        };
        
        Object.keys(sliders).forEach(sliderId => {
            const slider = document.getElementById(sliderId);
            const valueInput = document.getElementById(`${sliderId}Value`);
            
            if (!slider || !valueInput) return;
            
            // Initialize with saved value or default
            const savedValue = getCustomSettingValue(sliderId) || sliders[sliderId].defaultValue;
            slider.value = savedValue;
            valueInput.value = savedValue;
            
            // Update value on slider change
            slider.addEventListener('input', function() {
                valueInput.value = this.value;
                updateCustomSettings(sliderId, parseInt(this.value));
                
                // Apply visual preview if needed
                applySliderPreview(sliderId, this.value);
            });
            
            // Update slider when input value changes
            valueInput.addEventListener('change', function() {
                let value = parseInt(this.value);
                
                // Validate range
                if (isNaN(value)) value = sliders[sliderId].defaultValue;
                if (value < 0) value = 0;
                if (value > 100) value = 100;
                
                // Update UI
                this.value = value;
                slider.value = value;
                
                // Save setting
                updateCustomSettings(sliderId, value);
                
                // Apply visual preview if needed
                applySliderPreview(sliderId, value);
            });
            
            // Also handle input event for real-time validation
            valueInput.addEventListener('input', function() {
                if (this.value === '') return;
                
                let value = parseInt(this.value);
                if (isNaN(value)) return;
                
                // Limit to 0-100 while typing
                if (value < 0) this.value = 0;
                if (value > 100) this.value = 100;
            });
        });
    }
    
    function applySliderPreview(sliderId, value) {
        // Apply real-time preview effects based on slider ID
        // Will be limited since full changes require CSS recalculation
        const root = document.documentElement;
        
        switch(sliderId) {
            case 'elementSize':
                // Preview change to some elements as example
                document.querySelectorAll('.card, .stat-card, .activity-item, .product-card').forEach(el => {
                    const scale = 0.8 + (value / 250); // Scale from 0.8 to 1.2
                    el.style.transform = `scale(${scale})`;
                });
                break;
                
            case 'elementSpacing':
                // Spacing preview is harder to do with inline styles, just save the value
                break;
                
            case 'borderRadius':
                // Preview border radius changes
                const radius = value / 2; // Convert 0-100 to 0-50px
                document.querySelectorAll('.card, .btn, .stat-card, .activity-item, .product-card, input, select, button').forEach(el => {
                    el.style.borderRadius = radius + 'px';
                });
                break;
        }
    }
    
    // Navigation between sections
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.account-section');
    
    console.log('Nav items found:', navItems.length);
    console.log('Sections found:', sections.length);
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Get the section to show
            const sectionToShow = this.getAttribute('data-section');
            console.log('Clicked section:', sectionToShow);
            
            // Remove active class from all nav items and sections
            navItems.forEach(navItem => navItem.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked nav item
            this.classList.add('active');
            
            // Show the corresponding section
            const targetSection = document.getElementById(sectionToShow);
            if (targetSection) {
                targetSection.classList.add('active');
                console.log('Section activated:', sectionToShow);
            } else {
                console.error('Target section not found:', sectionToShow);
            }
            
            // Update URL hash for direct access to sections
            window.location.hash = sectionToShow;
        });
    });
    
    // Check if URL has a hash to navigate to a specific section
    if (window.location.hash) {
        const sectionId = window.location.hash.substring(1);
        const navItem = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
        if (navItem) {
            navItem.click();
        }
    }
    
    // Avatar change functionality
    const avatarContainer = document.querySelector('.avatar-container');
    if (avatarContainer) {
        avatarContainer.addEventListener('click', function() {
            // In a real implementation, this would open a file picker
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';
            
            fileInput.addEventListener('change', function(e) {
                if (e.target.files && e.target.files[0]) {
                    const avatar = document.querySelector('.user-avatar');
                    if (avatar) {
                        // This would upload the file to the server in a real implementation
                        // For now, just show a preview
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            avatar.src = e.target.result;
                        };
                        reader.readAsDataURL(e.target.files[0]);
                    }
                }
            });
            
            document.body.appendChild(fileInput);
            fileInput.click();
            
            // Clean up
            setTimeout(() => {
                document.body.removeChild(fileInput);
            }, 1000);
        });
    }
    
    // Settings form submission
    const settingsForm = document.querySelector('#settings .settings-form');
    if (settingsForm) {
        console.log('Settings form found');
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Settings form submitted');
            
            // Get form values
            const displayName = document.getElementById('display-name')?.value;
            const email = document.getElementById('email')?.value;
            const language = document.getElementById('language')?.value;
            const currency = document.getElementById('currency')?.value;
            
            // Save language and currency settings
            if (language) localStorage.setItem('language', language);
            if (currency) localStorage.setItem('currency', currency);
            
            // Simple validation
            if (displayName && email) {
                // Show success message
                showSuccessMessage(settingsForm, 'Настройки успешно сохранены!');
            } else {
                alert('Пожалуйста, заполните все обязательные поля.');
            }
        });
    } else {
        console.error('Settings form not found');
    }
    
    // Direct button listeners - ensures all buttons are clickable
    document.querySelectorAll('button').forEach(button => {
        console.log('Button found:', button.textContent || button.className);
        
        // Remove any existing event listeners by cloning the button
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Add click logging to debug button clicks
        newButton.addEventListener('click', function(e) {
            console.log('Button clicked:', this.textContent || this.className);
        });
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
            
            // Reset Pickr instances to adapt to new theme
            if (typeof accentColorPickr !== 'undefined' && typeof bgColorPickr !== 'undefined') {
                setTimeout(() => {
                    accentColorPickr.setColor(getCustomSettingValue('accentColor') || '#7c5cff');
                    bgColorPickr.setColor(getCustomSettingValue('backgroundColor') || '#000000');
                }, 100);
            }
        });
    }
    
    // Background type selection
    const backgroundOptions = document.querySelectorAll('.background-option');
    backgroundOptions.forEach(option => {
        option.addEventListener('click', function() {
            const bgType = this.getAttribute('data-background');
            console.log('Background type selected:', bgType);
            
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
    
    // Advanced customization button
    const advancedCustomizeBtn = document.querySelector('.advanced-customize-btn');
    if (advancedCustomizeBtn) {
        console.log('Advanced customize button found');
        advancedCustomizeBtn.addEventListener('click', function(e) {
            console.log('Advanced customize button clicked');
            e.preventDefault();
            
            // Save current settings before navigating
            const accentColor = document.getElementById('accentColor')?.value || '#FFA600';
            const backgroundColor = document.getElementById('backgroundColor')?.value || '#000000';
            
            const settings = {
                accentColor: accentColor,
                backgroundColor: backgroundColor,
                theme: document.documentElement.getAttribute('data-theme') || 'dark',
                background: document.documentElement.getAttribute('data-background') || 'stars'
            };
            
            localStorage.setItem('customSettings', JSON.stringify(settings));
            
            // Navigate to the customize page
            window.location.href = '/customize';
        });
    } else {
        console.error('Advanced customize button not found');
    }
    
    // Save appearance settings button
    const saveAppearanceBtn = document.getElementById('save-appearance');
    if (saveAppearanceBtn) {
        console.log('Save appearance button found');
        saveAppearanceBtn.addEventListener('click', function(e) {
            console.log('Save appearance button clicked');
            
            // Get values from color pickers
            const accentColor = accentColorPickr ? accentColorPickr.getColor().toHEXA().toString() : '#7c5cff';
            const backgroundColor = bgColorPickr ? bgColorPickr.getColor().toHEXA().toString() : '#000000';
            
            // Get values from sliders
            const elementSize = parseInt(document.getElementById('elementSize')?.value || 50);
            const elementSpacing = parseInt(document.getElementById('elementSpacing')?.value || 50);
            const borderRadius = parseInt(document.getElementById('borderRadius')?.value || 50);
            
            // Create settings object with all settings
            const settings = {
                accentColor: accentColor,
                backgroundColor: backgroundColor,
                theme: document.documentElement.getAttribute('data-theme') || 'dark',
                background: document.documentElement.getAttribute('data-background') || 'stars',
                elementSize: elementSize,
                elementSpacing: elementSpacing,
                borderRadius: borderRadius
            };
            
            // Save settings to localStorage
            localStorage.setItem('customSettings', JSON.stringify(settings));
            
            // Show success message with reload button
            const successMsg = document.createElement('div');
            successMsg.className = 'success-message';
            successMsg.innerHTML = `
                <div>Настройки внешнего вида сохранены!</div>
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
            const buttonsContainer = saveAppearanceBtn.closest('.buttons-container');
            buttonsContainer.parentNode.insertBefore(successMsg, buttonsContainer.nextSibling);
            
            // Add click handler for reload button
            document.getElementById('reload-page').addEventListener('click', function() {
                window.location.reload();
            });
            
            // Notify other scripts about the settings change
            dispatchSettingsChanged();
        });
    } else {
        console.error('Save appearance button not found');
    }
    
    // Reset appearance settings button
    const resetAppearanceBtn = document.getElementById('reset-appearance');
    if (resetAppearanceBtn) {
        resetAppearanceBtn.addEventListener('click', function(e) {
            console.log('Reset appearance button clicked');
            // Reset to default settings
            const defaultSettings = {
                accentColor: '#7c5cff',
                backgroundColor: '#000000',
                theme: 'dark',
                background: 'stars',
                elementSize: 50,
                elementSpacing: 50,
                borderRadius: 50
            };
            
            // Update color pickers with default values
            if (typeof accentColorPickr !== 'undefined') {
                accentColorPickr.setColor(defaultSettings.accentColor);
            }
            
            if (typeof bgColorPickr !== 'undefined') {
                bgColorPickr.setColor(defaultSettings.backgroundColor);
            }
            
            // Reset slider values
            document.getElementById('elementSize').value = defaultSettings.elementSize;
            document.getElementById('elementSizeValue').value = defaultSettings.elementSize;
            
            document.getElementById('elementSpacing').value = defaultSettings.elementSpacing;
            document.getElementById('elementSpacingValue').value = defaultSettings.elementSpacing;
            
            document.getElementById('borderRadius').value = defaultSettings.borderRadius;
            document.getElementById('borderRadiusValue').value = defaultSettings.borderRadius;
            
            // Reset background option
            backgroundOptions.forEach(opt => {
                opt.classList.remove('active');
                if (opt.getAttribute('data-background') === defaultSettings.background) {
                    opt.classList.add('active');
                }
            });
            
            // Apply theme
            document.documentElement.setAttribute('data-theme', defaultSettings.theme);
            document.documentElement.setAttribute('data-background', defaultSettings.background);
            
            // Reset theme toggle
            if (themeToggle) {
                themeToggle.checked = defaultSettings.theme === 'light';
            }
            
            // Save default settings
            localStorage.setItem('customSettings', JSON.stringify(defaultSettings));
            
            // Apply default theme for preview
            document.documentElement.style.setProperty('--accent-color', defaultSettings.accentColor);
            document.documentElement.style.setProperty('--accent-hover', lightenColor(defaultSettings.accentColor, 20));
            document.body.style.backgroundColor = defaultSettings.backgroundColor;
            
            // Show success message
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
            const buttonsContainer = resetAppearanceBtn.closest('.buttons-container');
            buttonsContainer.parentNode.insertBefore(successMsg, buttonsContainer.nextSibling);
            
            // Add click handler for reload button
            document.getElementById('reload-page').addEventListener('click', function() {
                window.location.reload();
            });
            
            // Reset previews of slider changes
            document.querySelectorAll('.card, .stat-card, .activity-item, .product-card').forEach(el => {
                el.style.transform = '';
            });
            
            document.querySelectorAll('.card, .btn, .stat-card, .activity-item, .product-card, input, select, button').forEach(el => {
                el.style.borderRadius = '';
            });
            
            // Reinitialize particles
            if (typeof particlesJS !== 'undefined') {
                initializeStars();
            }
            
            // Notify other scripts about the settings change
            dispatchSettingsChanged();
        });
    }
    
    // Specific button handlers
    
    // File upload handling for support section
    const fileInput = document.getElementById('support-files');
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            const fileList = document.querySelector('.file-list');
            if (!fileList) return;
            
            fileList.innerHTML = '';
            
            if (this.files.length > 0) {
                for (let i = 0; i < this.files.length; i++) {
                    const file = this.files[i];
                    const fileItem = document.createElement('div');
                    fileItem.className = 'file-item';
                    
                    // Determine icon based on file type
                    let icon = 'fa-file';
                    if (file.type.includes('image')) {
                        icon = 'fa-file-image';
                    } else if (file.type.includes('pdf')) {
                        icon = 'fa-file-pdf';
                    } else if (file.type.includes('zip') || file.type.includes('rar')) {
                        icon = 'fa-file-archive';
                    }
                    
                    fileItem.innerHTML = `
                        <i class="fas ${icon}"></i>
                        <span>${file.name}</span>
                        <button type="button" class="remove-file"><i class="fas fa-times"></i></button>
                    `;
                    
                    fileList.appendChild(fileItem);
                }
                
                // Add event listeners to remove buttons
                document.querySelectorAll('.remove-file').forEach(btn => {
                    btn.addEventListener('click', function() {
                        this.closest('.file-item').remove();
                    });
                });
            }
        });
    }
    
    // Support form submission
    const sendSupportBtn = document.getElementById('send-support');
    if (sendSupportBtn) {
        console.log('Support form button found');
        sendSupportBtn.addEventListener('click', function(e) {
            console.log('Support form button clicked');
            e.preventDefault();
            
            const supportTopic = document.getElementById('support-topic')?.value;
            const supportMessage = document.getElementById('support-message')?.value;
            
            if (!supportTopic) {
                alert('Пожалуйста, выберите тему обращения.');
                return;
            }
            
            if (!supportMessage) {
                alert('Пожалуйста, опишите вашу проблему.');
                return;
            }
            
            // Show success message
            const parent = this.closest('.settings-form');
            showSuccessMessage(parent, 'Ваше обращение отправлено! Мы свяжемся с вами в ближайшее время.');
            
            // Reset form
            document.getElementById('support-topic').value = '';
            document.getElementById('support-message').value = '';
            
            const fileList = document.querySelector('.file-list');
            if (fileList) fileList.innerHTML = '';
        });
    } else {
        console.error('Support form button not found');
    }
    
    // View ticket buttons
    document.querySelectorAll('.ticket-view-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            console.log('Ticket view button clicked');
            e.preventDefault();
            const ticketInfo = this.closest('.ticket-item').querySelector('.ticket-info h4').textContent;
            alert(`Просмотр обращения: ${ticketInfo}\n\nВ реальной имплементации здесь откроется история переписки по данному обращению.`);
        });
    });
    
    // Change password button
    const changePasswordBtn = document.getElementById('change-password');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', function(e) {
            console.log('Change password button clicked');
            e.preventDefault();
            
            const currentPassword = document.getElementById('current-password')?.value;
            const newPassword = document.getElementById('new-password')?.value;
            const confirmPassword = document.getElementById('confirm-password')?.value;
            
            if (!currentPassword || !newPassword || !confirmPassword) {
                alert('Пожалуйста, заполните все поля.');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                alert('Новый пароль и подтверждение пароля не совпадают.');
                return;
            }
            
            // Show success message
            const parent = this.closest('.settings-form');
            showSuccessMessage(parent, 'Пароль успешно изменен!');
            
            // Reset form
            document.getElementById('current-password').value = '';
            document.getElementById('new-password').value = '';
            document.getElementById('confirm-password').value = '';
        });
    }
    
    // End session button
    document.querySelectorAll('.session-end-btn:not([disabled])').forEach(btn => {
        btn.addEventListener('click', function(e) {
            console.log('End session button clicked');
            e.preventDefault();
            
            if (confirm('Вы уверены, что хотите завершить эту сессию?')) {
                this.closest('.session-item').remove();
                
                // Show temporary success message
                const sessionsList = document.querySelector('.sessions-list');
                if (sessionsList) {
                    const successMsg = document.createElement('div');
                    successMsg.className = 'success-message';
                    successMsg.textContent = 'Сессия успешно завершена';
                    successMsg.style.marginTop = '10px';
                    
                    sessionsList.appendChild(successMsg);
                    
                    setTimeout(() => {
                        successMsg.remove();
                    }, 3000);
                }
            }
        });
    });
    
    // Library download and update buttons
    const addLibraryButtonListeners = () => {
        document.querySelectorAll('.library-download-btn, .library-update-btn').forEach(btn => {
            console.log('Library button found:', btn.className);
            
            // Remove existing listeners
            const newBtn = btn.cloneNode(true);
            if (btn.parentNode) {
                btn.parentNode.replaceChild(newBtn, btn);
            }
            
            newBtn.addEventListener('click', function(e) {
                console.log('Library button clicked:', this.className);
                e.preventDefault();
                const action = this.classList.contains('library-download-btn') ? 'скачивание' : 'обновление';
                const productItem = this.closest('.library-item');
                const productName = productItem?.querySelector('h4')?.textContent || 'продукта';
                
                // Create a loading indicator
                this.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${action === 'скачивание' ? 'Скачивание...' : 'Обновление...'}`;
                this.disabled = true;
                
                // Simulate download/update process
                setTimeout(() => {
                    this.innerHTML = action === 'скачивание' ? 'Скачать' : 'Обновить';
                    this.disabled = false;
                    
                    // Show success message
                    const successMsg = document.createElement('div');
                    successMsg.className = 'success-message';
                    successMsg.style.fontSize = '12px';
                    successMsg.style.marginTop = '8px';
                    successMsg.textContent = `${action.charAt(0).toUpperCase() + action.slice(1)} ${productName} успешно завершено`;
                    
                    const actionContainer = this.closest('.library-item-actions');
                    if (actionContainer) {
                        actionContainer.appendChild(successMsg);
                        
                        setTimeout(() => {
                            successMsg.remove();
                        }, 3000);
                    }
                }, 2000);
            });
        });
    };
    
    // Purchase buttons
    const addPurchaseButtonListeners = () => {
        document.querySelectorAll('.purchase-download-btn, .purchase-extend-btn').forEach(btn => {
            console.log('Purchase button found:', btn.className);
            
            // Remove existing listeners
            const newBtn = btn.cloneNode(true);
            if (btn.parentNode) {
                btn.parentNode.replaceChild(newBtn, btn);
            }
            
            newBtn.addEventListener('click', function(e) {
                console.log('Purchase button clicked:', this.className);
                e.preventDefault();
                const action = this.classList.contains('purchase-download-btn') ? 'скачивание' : 'продление';
                const productItem = this.closest('.purchase-item');
                const productName = productItem?.querySelector('h4')?.textContent || 'продукта';
                
                if (action === 'скачивание') {
                    // Simulate download start
                    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Скачивание...';
                    this.disabled = true;
                    
                    setTimeout(() => {
                        this.innerHTML = 'Скачать';
                        this.disabled = false;
                        alert(`Скачивание ${productName} завершено.`);
                    }, 2000);
                } else {
                    // For extension, redirect to payment page
                    if (confirm(`Вы хотите продлить подписку на ${productName}?`)) {
                        alert('В реальной имплементации здесь произойдет переход на страницу оплаты продления.');
                    }
                }
            });
        });
    };
    
    // Product card buttons
    const addProductButtonListeners = () => {
        document.querySelectorAll('.product-btn').forEach(btn => {
            console.log('Product button found:', btn.getAttribute('href'));
            
            // Remove existing listeners
            const newBtn = btn.cloneNode(true);
            if (btn.parentNode) {
                btn.parentNode.replaceChild(newBtn, btn);
            }
            
            newBtn.addEventListener('click', function(e) {
                console.log('Product button clicked:', this.getAttribute('href'));
                e.preventDefault();
                const productCard = this.closest('.product-card');
                const productName = productCard?.querySelector('h3')?.textContent || 'продукта';
                const href = this.getAttribute('href') || '#';
                
                alert(`Переход на страницу ${productName}: ${href}`);
                // In a real implementation, this would navigate to the product page
                // window.location.href = href;
            });
        });
    };
    
    // Feedback form in the contact section
    const sendFeedbackBtn = document.getElementById('send-feedback');
    if (sendFeedbackBtn) {
        console.log('Feedback form button found');
        sendFeedbackBtn.addEventListener('click', function(e) {
            console.log('Feedback form button clicked');
            e.preventDefault();
            
            const feedbackType = document.getElementById('feedback-type')?.value;
            const feedbackMessage = document.getElementById('feedback-message')?.value;
            
            if (!feedbackType) {
                alert('Пожалуйста, выберите тип обращения.');
                return;
            }
            
            if (!feedbackMessage) {
                alert('Пожалуйста, введите ваше сообщение.');
                return;
            }
            
            // Show success message
            const parent = this.closest('.feedback-form');
            showSuccessMessage(parent, 'Спасибо за ваше сообщение! Мы обязательно его рассмотрим.');
            
            // Reset form
            document.getElementById('feedback-type').value = '';
            document.getElementById('feedback-message').value = '';
        });
    } else {
        console.error('Feedback form button not found');
    }
    
    // Contact links
    document.querySelectorAll('.contact-link').forEach(link => {
        link.addEventListener('click', function(e) {
            console.log('Contact link clicked:', this.getAttribute('href'));
            
            // For links that open email clients, don't prevent default
            if (!this.hasAttribute('target')) {
                return;
            }
            
            // For external links that open in new tab, don't prevent default
            if (this.getAttribute('target') === '_blank') {
                return;
            }
            
            e.preventDefault();
            const href = this.getAttribute('href');
            
            if (href.startsWith('https://') || href.startsWith('http://')) {
                window.open(href, '_blank');
            } else {
                window.location.href = href;
            }
        });
    });
    
    // Call initial setup for all button types
    addLibraryButtonListeners();
    addPurchaseButtonListeners();
    addProductButtonListeners();
    
    // Helper function to show success message
    function showSuccessMessage(parent, message) {
        if (!parent) {
            console.error('Parent element for success message not found');
            return;
        }
        
        // Remove existing success messages
        const existingMessages = document.querySelectorAll('.success-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = message;
        successMessage.style.color = '#4CAF50';
        successMessage.style.fontWeight = 'bold';
        successMessage.style.marginTop = '15px';
        successMessage.style.padding = '10px';
        successMessage.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
        successMessage.style.borderRadius = '8px';
        successMessage.style.textAlign = 'center';
        
        // Add to the parent
        parent.appendChild(successMessage);
        
        // Remove after 3 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 3000);
    }
    
    // Helper function to update custom settings
    function updateCustomSettings(key, value) {
        const settings = getCustomSettings();
        settings[key] = value;
        localStorage.setItem('customSettings', JSON.stringify(settings));
        
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
            case 'accentColor':
                document.documentElement.style.setProperty('--accent-color', value);
                document.documentElement.style.setProperty('--accent-hover', lightenColor(value, 20));
                document.documentElement.style.setProperty('--accent-color-semi', hexToRgba(value, 0.3));
                break;
            case 'backgroundColor':
                document.body.style.backgroundColor = value;
                break;
            case 'elementSize':
                document.documentElement.style.setProperty('--element-size-factor', value/100);
                break;
            case 'elementSpacing':
                document.documentElement.style.setProperty('--element-spacing', value/2 + 'px');
                break;
            case 'borderRadius':
                document.documentElement.style.setProperty('--border-radius', value/2 + 'px');
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
                        "speed": 1,
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
            const accentColor = getCustomSettingValue('accentColor') || '#7c5cff';
            
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
                        "value": accentColor
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
                        "color": accentColor,
                        "opacity": 0.4,
                        "width": 1
                    },
                    "move": {
                        "enable": true,
                        "speed": 3,
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
    
    console.log('Account page initialization completed');
}); 