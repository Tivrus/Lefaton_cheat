/**
 * background.js - Background effects for Lefaton Cheat
 * Manages particle effects, stars, gradients and other background styles
 */

/**
 * Initialize background based on settings
 * @param {string} bgType - Background type (stars, particles, gradient)
 * @param {Object} settings - Settings object
 */
function initializeBackground(bgType, settings) {
    if (!settings) {
        settings = getSavedSettings();
    }
    
    if (!bgType) {
        bgType = settings.background || 'stars';
    }
    
    // Set background type attribute
    document.documentElement.setAttribute('data-background', bgType);
    
    if (bgType === 'gradient') {
        // Apply gradient background
        applyGradientBackground(settings.headerColor, settings.backgroundColor);
    } else {
        // Reset background
        resetBackground(settings.backgroundColor);
        
        // Initialize particles
        if (bgType === 'stars') {
            initializeParticlesBackground('stars', settings);
        } else if (bgType === 'particles') {
            initializeParticlesBackground('particles', settings);
        }
    }
}

/**
 * Apply gradient background
 * @param {string} color1 - Primary color (header/accent)
 * @param {string} color2 - Secondary color (background)
 */
function applyGradientBackground(color1, color2) {
    if (!color1) color1 = '#7c5cff';
    if (!color2) color2 = '#000000';
    
    document.body.style.background = `linear-gradient(135deg, ${color1}, ${color2})`;
    document.body.style.backgroundAttachment = 'fixed';
    
    // Hide particle elements
    const particlesElements = document.querySelectorAll('#particles-background, #particles-foreground');
    particlesElements.forEach(el => {
        if (el) el.style.display = 'none';
    });
}

/**
 * Reset background to solid color
 * @param {string} backgroundColor - Background color
 */
function resetBackground(backgroundColor) {
    if (!backgroundColor) backgroundColor = '#000000';
    
    document.body.style.background = backgroundColor;
    document.body.style.backgroundAttachment = 'initial';
    
    // Show particle elements
    const particlesElements = document.querySelectorAll('#particles-background, #particles-foreground');
    particlesElements.forEach(el => {
        if (el) el.style.display = 'block';
    });
}

/**
 * Initialize particles background
 * @param {string} type - Particles type ('stars' or 'particles')
 * @param {Object} settings - Settings object
 */
function initializeParticlesBackground(type, settings) {
    if (typeof particlesJS === 'undefined') {
        console.error('particlesJS library not loaded');
        return;
    }
    
    const starSpeed = parseFloat(settings.starSpeed || 5) / 100 * 6;
    
    if (type === 'stars') {
        particlesJS("particles-background", {
            "particles": {
                "number": {
                    "value": 100,
                    "density": { "enable": true, "value_area": 800 }
                },
                "color": {
                    "value": settings.textColor || '#FFFFFF'
                },
                "shape": {
                    "type": "circle",
                    "stroke": { "width": 0, "color": "#000000" }
                },
                "opacity": {
                    "value": 0.8,
                    "random": true,
                    "anim": { "enable": true, "speed": 1, "opacity_min": 0.1, "sync": false }
                },
                "size": {
                    "value": 2,
                    "random": true,
                    "anim": { "enable": true, "speed": 2, "size_min": 0.1, "sync": false }
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
                    "onhover": { "enable": true, "mode": "bubble" },
                    "onclick": { "enable": true, "mode": "repulse" },
                    "resize": true
                },
                "modes": {
                    "bubble": { "distance": 150, "size": 4, "duration": 2, "opacity": 1, "speed": 3 },
                    "repulse": { "distance": 200, "duration": 0.4 }
                }
            },
            "retina_detect": true
        });
    } else if (type === 'particles') {
        particlesJS("particles-background", {
            "particles": {
                "number": {
                    "value": 80,
                    "density": { "enable": true, "value_area": 800 }
                },
                "color": {
                    "value": settings.accentColor || '#7c5cff'
                },
                "shape": {
                    "type": "circle",
                    "stroke": { "width": 0, "color": "#000000" }
                },
                "opacity": {
                    "value": 0.6,
                    "random": false,
                    "anim": { "enable": false, "speed": 1, "opacity_min": 0.1, "sync": false }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": { "enable": false, "speed": 40, "size_min": 0.1, "sync": false }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": settings.accentColor || '#7c5cff',
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
                    "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": { "enable": true, "mode": "grab" },
                    "onclick": { "enable": true, "mode": "push" },
                    "resize": true
                },
                "modes": {
                    "grab": { "distance": 140, "line_linked": { "opacity": 1 } },
                    "push": { "particles_nb": 4 }
                }
            },
            "retina_detect": true
        });
    }
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
 * Initialize particles when document is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get settings and initialize background
    const settings = getSavedSettings();
    initializeBackground(settings.background, settings);
    
    // Listen for theme changes
    document.documentElement.addEventListener('data-theme', function() {
        const theme = document.documentElement.getAttribute('data-theme');
        updateParticleColors(theme);
    });
    
    // Listen for settings changes
    window.addEventListener('customSettingsChanged', function(event) {
        if (event.detail && event.detail.settings) {
            initializeBackground(event.detail.settings.background, event.detail.settings);
        } else {
            // Try to update particles based on current theme
            const theme = document.documentElement.getAttribute('data-theme') || 'dark';
            updateParticleColors(theme);
        }
    });
});

// Particleground setup
(function(a, b) {
    "use strict";

    // Deep copy function
    function deepExtend(a, b) {
        a = a || {};
        for (var c in b) {
            if (b.hasOwnProperty(c)) {
                if (typeof b[c] === "object") {
                    a[c] = deepExtend(a[c], b[c]);
                } else {
                    a[c] = b[c];
                }
            }
        }
        return a;
    }

    // Main particleground function
    function particleground(el, options) {
        // Initialize canvas and particles
        let canvas, ctx, animationFrame;
        let width, height;
        let particles = [];
        let isPaused = false;
        let canvasSupport = !!b.createElement("canvas").getContext;
        
        // Default options
        let defaults = {
            minSpeedX: 0.1,
            maxSpeedX: 0.7,
            minSpeedY: 0.1,
            maxSpeedY: 0.7,
            directionX: "center",
            directionY: "center",
            density: 10000,
            dotColor: "rgba(255, 255, 255, 0.8)",
            lineColor: "rgba(255, 255, 255, 0.5)",
            particleRadius: 7,
            lineWidth: 1,
            curvedLines: false,
            proximity: 100,
            parallax: true,
            parallaxMultiplier: 5,
            onInit: function() {},
            onDestroy: function() {}
        };
        
        // Merge options with defaults
        options = deepExtend(defaults, options);
        
        // Initialize if canvas is supported
        if (canvasSupport) {
            init();
        }
        
        // Methods and internal functions
        function init() {
            canvas = b.createElement("canvas");
            canvas.className = "pg-canvas";
            canvas.style.display = "block";
            el.insertBefore(canvas, el.firstChild);
            ctx = canvas.getContext("2d");
            
            resize();
            
            // Create particles
            for (let i = 0; i < Math.round(canvas.width * canvas.height / options.density); i++) {
                let p = new Particle();
                p.setStackPos(i);
                particles.push(p);
            }
            
            // Listen for window resize
            a.addEventListener("resize", resize, false);
            
            // Start animation
            animate();
            
            // Call init callback
            if (typeof options.onInit === 'function') {
                options.onInit.call(el);
            }
        }
        
        // Resize canvas and recalculate particle positions
        function resize() {
            width = el.offsetWidth;
            height = el.offsetHeight;
            canvas.width = width;
            canvas.height = height;
            ctx.fillStyle = options.dotColor;
            ctx.strokeStyle = options.lineColor;
            ctx.lineWidth = options.lineWidth;
        }
        
        // Animation loop
        function animate() {
            if (!isPaused) {
                ctx.clearRect(0, 0, width, height);
                
                // Update particle positions
                for (let i = 0; i < particles.length; i++) {
                    particles[i].updatePosition();
                }
                
                // Draw particles and connecting lines
                for (let i = 0; i < particles.length; i++) {
                    particles[i].draw();
                }
                
                animationFrame = requestAnimationFrame(animate);
            }
        }
        
        // Particle constructor
        function Particle() {
            this.stackPos;
            this.active = true;
            this.layer = Math.ceil(3 * Math.random());
            this.parallaxOffsetX = 0;
            this.parallaxOffsetY = 0;
            this.position = {
                x: Math.random() * width,
                y: Math.random() * height
            };
            this.speed = {};
            this.size = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.3;
            
            // Direction setup
            switch (options.directionX) {
                case "left":
                    this.speed.x = +(-options.maxSpeedX + Math.random() * options.maxSpeedX - options.minSpeedX).toFixed(2);
                    break;
                case "right":
                    this.speed.x = +(Math.random() * options.maxSpeedX + options.minSpeedX).toFixed(2);
                    break;
                default:
                    this.speed.x = +(-options.maxSpeedX / 2 + Math.random() * options.maxSpeedX).toFixed(2);
                    this.speed.x += this.speed.x > 0 ? options.minSpeedX : -options.minSpeedX;
            }
            
            switch (options.directionY) {
                case "up":
                    this.speed.y = +(-options.maxSpeedY + Math.random() * options.maxSpeedY - options.minSpeedY).toFixed(2);
                    break;
                case "down":
                    this.speed.y = +(Math.random() * options.maxSpeedY + options.minSpeedY).toFixed(2);
                    break;
                default:
                    this.speed.y = +(-options.maxSpeedY / 2 + Math.random() * options.maxSpeedY).toFixed(2);
                    this.speed.y += this.speed.y > 0 ? options.minSpeedY : -options.minSpeedY;
            }
        }
        
        // Update particle position
        Particle.prototype.updatePosition = function() {
            // Handle parallax
            if (options.parallax) {
                this.parallaxTargX = (width / 2 - this.position.x) / (options.parallaxMultiplier * this.layer);
                this.parallaxOffsetX += (this.parallaxTargX - this.parallaxOffsetX) / 10;
                this.parallaxTargY = (height / 2 - this.position.y) / (options.parallaxMultiplier * this.layer);
                this.parallaxOffsetY += (this.parallaxTargY - this.parallaxOffsetY) / 10;
            }
            
            // Handle boundaries
            switch (options.directionX) {
                case "left":
                    if (this.position.x + this.speed.x + this.parallaxOffsetX < 0) {
                        this.position.x = width - this.parallaxOffsetX;
                    }
                    break;
                case "right":
                    if (this.position.x + this.speed.x + this.parallaxOffsetX > width) {
                        this.position.x = 0 - this.parallaxOffsetX;
                    }
                    break;
                default:
                    if (this.position.x + this.speed.x + this.parallaxOffsetX > width || 
                        this.position.x + this.speed.x + this.parallaxOffsetX < 0) {
                        this.speed.x = -this.speed.x;
                    }
            }
            
            switch (options.directionY) {
                case "up":
                    if (this.position.y + this.speed.y + this.parallaxOffsetY < 0) {
                        this.position.y = height - this.parallaxOffsetY;
                    }
                    break;
                case "down":
                    if (this.position.y + this.speed.y + this.parallaxOffsetY > height) {
                        this.position.y = 0 - this.parallaxOffsetY;
                    }
                    break;
                default:
                    if (this.position.y + this.speed.y + this.parallaxOffsetY > height || 
                        this.position.y + this.speed.y + this.parallaxOffsetY < 0) {
                        this.speed.y = -this.speed.y;
                    }
            }
            
            // Update position
            this.position.x += this.speed.x;
            this.position.y += this.speed.y;
        };
        
        // Draw particle and connecting lines
        Particle.prototype.draw = function() {
            // Set opacity
            ctx.globalAlpha = this.opacity;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(
                this.position.x + this.parallaxOffsetX,
                this.position.y + this.parallaxOffsetY,
                options.particleRadius / 2 * this.size,
                0, Math.PI * 2, true
            );
            ctx.closePath();
            ctx.fill();
            
            // Draw connecting lines
            ctx.globalAlpha = 0.7;
            ctx.beginPath();
            
            for (let i = particles.length - 1; i > this.stackPos; i--) {
                let p2 = particles[i];
                
                // Calculate distance
                let dx = this.position.x - p2.position.x;
                let dy = this.position.y - p2.position.y;
                let dist = Math.sqrt(dx * dx + dy * dy).toFixed(2);
                
                // Draw line if close enough
                if (dist < options.proximity) {
                    ctx.moveTo(
                        this.position.x + this.parallaxOffsetX,
                        this.position.y + this.parallaxOffsetY
                    );
                    
                    if (options.curvedLines) {
                        ctx.quadraticCurveTo(
                            Math.max(p2.position.x, p2.position.x),
                            Math.min(p2.position.y, p2.position.y),
                            p2.position.x + p2.parallaxOffsetX,
                            p2.position.y + p2.parallaxOffsetY
                        );
                    } else {
                        ctx.lineTo(
                            p2.position.x + p2.parallaxOffsetX,
                            p2.position.y + p2.parallaxOffsetY
                        );
                    }
                }
            }
            
            ctx.stroke();
            ctx.closePath();
            
            // Reset global alpha
            ctx.globalAlpha = 1;
        };
        
        // Set stack position
        Particle.prototype.setStackPos = function(i) {
            this.stackPos = i;
        };
        
        // Public API
        return {
            option: function(key, val) {
                if (val) {
                    options[key] = val;
                } else {
                    return options[key];
                }
            },
            
            destroy: function() {
                // Cancel animation
                cancelAnimationFrame(animationFrame);
                
                // Remove canvas
                canvas.parentNode.removeChild(canvas);
                
                // Call destroy callback
                if (typeof options.onDestroy === 'function') {
                    options.onDestroy.call(el);
                }
            },
            
            pause: function() {
                isPaused = true;
            },
            
            resume: function() {
                isPaused = false;
                animate();
            }
        };
    }
    
    // Add to global namespace
    a.particleground = function(el, options) {
        return new particleground(el, options);
    };
    
    // Set default options
    a.particleground.defaults = {
        minSpeedX: 0.1,
        maxSpeedX: 0.7,
        minSpeedY: 0.1,
        maxSpeedY: 0.7,
        directionX: "center",
        directionY: "center",
        density: 10000,
        dotColor: "rgba(255, 255, 255, 0.8)",
        lineColor: "rgba(255, 255, 255, 0.5)",
        particleRadius: 7,
        lineWidth: 1,
        curvedLines: false,
        proximity: 100,
        parallax: true,
        parallaxMultiplier: 5,
        onInit: function() {},
        onDestroy: function() {}
    };
}(window, document));

// Export functions for modules that support it
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeBackground,
        applyGradientBackground,
        resetBackground,
        initializeParticlesBackground,
        updateParticleColors
    };
} 