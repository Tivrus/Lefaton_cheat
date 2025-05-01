// Settings Manager for Language and Currency

document.addEventListener('DOMContentLoaded', function() {
    // Language selection
    const languageOptions = document.querySelectorAll('.language-option');
    const currentLang = localStorage.getItem('language') || 'ru'; // Default to Russian
    
    // Mark the active language
    languageOptions.forEach(option => {
        const lang = option.getAttribute('data-lang');
        if (lang === currentLang) {
            option.classList.add('active');
        }
        
        // Language selection handler
        option.addEventListener('click', function() {
            const selectedLang = this.getAttribute('data-lang');
            localStorage.setItem('language', selectedLang);
            
            // Update active class
            languageOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // In a real implementation, you would update the UI text here
            // For now, we'll just reload the page
            // location.reload();
            
            // Show notification
            showNotification(`Язык изменен на ${selectedLang === 'ru' ? 'Русский' : 'English'}`);
        });
    });
    
    // Currency selection
    const currencyOptions = document.querySelectorAll('.currency-option');
    const currentCurrency = localStorage.getItem('currency') || 'rub'; // Default to Rubles
    
    // Mark the active currency
    currencyOptions.forEach(option => {
        const currency = option.getAttribute('data-currency');
        if (currency === currentCurrency) {
            option.classList.add('active');
        }
        
        // Currency selection handler
        option.addEventListener('click', function() {
            const selectedCurrency = this.getAttribute('data-currency');
            localStorage.setItem('currency', selectedCurrency);
            
            // Update active class
            currencyOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // In a real implementation, you would update price displays
            // But for now we'll just show a notification
            const currencySymbols = {
                'rub': '₽',
                'usd': '$',
                'eur': '€'
            };
            
            showNotification(`Валюта изменена на ${currencySymbols[selectedCurrency]}`);
        });
    });
    
    // Notification function
    function showNotification(message) {
        // Create notification element if it doesn't exist
        let notification = document.querySelector('.settings-notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.classList.add('settings-notification');
            document.body.appendChild(notification);
            
            // Add styles if they don't exist
            if (!document.getElementById('notification-styles')) {
                const style = document.createElement('style');
                style.id = 'notification-styles';
                style.textContent = `
                    .settings-notification {
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
                    
                    .settings-notification.visible {
                        transform: translateY(0);
                        opacity: 1;
                    }
                `;
                document.head.appendChild(style);
            }
        }
        
        // Set message and show notification
        notification.textContent = message;
        setTimeout(() => notification.classList.add('visible'), 10);
        
        // Hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('visible');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
}); 