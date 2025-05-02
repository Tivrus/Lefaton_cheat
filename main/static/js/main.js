/**
 * main.js - Main initialization script for Lefaton Cheat
 * Initializes all required modules and sets up event listeners
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Lefaton Cheat initialized');
    
    // Initialize theme
    if (typeof initializeThemeSwitcher === 'function') {
        initializeThemeSwitcher();
    }
    
    // Load settings
    const settings = typeof getSavedSettings === 'function' ? 
        getSavedSettings() : 
        JSON.parse(localStorage.getItem('customSettings')) || {};
    
    // Apply settings
    if (typeof applySettings === 'function') {
        applySettings(settings);
    }
    
    // Initialize background effects
    if (typeof initializeBackground === 'function') {
        initializeBackground(settings.background, settings);
    }
    
    // Initialize dropdown menus
    initializeDropdowns();
    
    // Initialize animations
    initializeAnimations();
    
    // Setup global event listeners
    setupEventListeners();
});

/**
 * Initializes all dropdown menus
 */
function initializeDropdowns() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const dropdown = this.nextElementSibling;
            
            // Close all other dropdowns
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                if (menu !== dropdown) {
                    menu.classList.remove('show');
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('show');
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });
}

/**
 * Initialize animations for UI elements
 */
function initializeAnimations() {
    // Add entrance animations to cards
    const cards = document.querySelectorAll('.card, .feature-card, .product-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('animated', 'fadeInUp');
    });
    
    // Add hover animations to buttons
    const buttons = document.querySelectorAll('.btn, .feature-card, .nav-item');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.classList.add('pulse');
        });
        button.addEventListener('mouseleave', function() {
            this.classList.remove('pulse');
        });
    });
    
    // Apply scroll animations
    document.addEventListener('scroll', function() {
        const scrollElements = document.querySelectorAll('.scroll-animate');
        scrollElements.forEach(element => {
            if (isElementInViewport(element)) {
                element.classList.add('in-view');
            }
        });
    });
}

/**
 * Sets up global event listeners
 */
function setupEventListeners() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const mobileMenu = document.querySelector('.mobile-menu');
            if (mobileMenu) {
                mobileMenu.classList.toggle('open');
                this.classList.toggle('active');
            }
        });
    }
    
    // Listen for settings changes and update UI
    window.addEventListener('customSettingsChanged', function(event) {
        if (event.detail && event.detail.settings) {
            console.log('Settings changed:', event.detail.timestamp);
            
            // Apply new settings to UI
            if (typeof applySettings === 'function') {
                applySettings(event.detail.settings);
            }
        }
    });
    
    // Listen for theme changes
    window.addEventListener('themeChanged', function(event) {
        if (event.detail && event.detail.theme) {
            console.log('Theme changed to:', event.detail.theme);
            
            // Apply theme-specific changes
            const theme = event.detail.theme;
            document.documentElement.setAttribute('data-theme', theme);
            
            // Update UI elements for the theme
            if (typeof updateParticleColors === 'function') {
                updateParticleColors(theme);
            }
        }
    });
}

/**
 * Checks if element is in viewport
 * @param {HTMLElement} el - Element to check
 * @returns {boolean} True if element is in viewport
 */
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
} 