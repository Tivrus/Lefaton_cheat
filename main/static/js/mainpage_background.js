// Самовызывающаяся функция, создающая эффект частиц
!function(a, b) {
    "use strict";

    // Функция глубокого копирования объектов
    function c(a) {
        a = a || {};
        for (var b = 1; b < arguments.length; b++) {
            var c = arguments[b];
            if (c) {
                for (var d in c) {
                    c.hasOwnProperty(d) && ("object" == typeof c[d] ? deepExtend(a[d], c[d]) : a[d] = c[d]);
                }
            }
        }
        return a;
    }

    // Основная функция создания эффекта частиц
    function d(d, g) {
        // Инициализация canvas и частиц
        function h() { 
            if (y) {
                r = b.createElement("canvas");
                r.className = "pg-canvas";
                r.style.display = "block";
                d.insertBefore(r, d.firstChild);
                s = r.getContext("2d");
                i(); // Установка начальных параметров canvas
                for (var c = Math.round(r.width * r.height / g.density), e = 0; c > e; e++) {
                    var f = new n;
                    f.setStackPos(e);
                    z.push(f);
                }
                a.addEventListener("resize", function() { k(); }, !1);
                j();
                q("onInit");
            }
        }

        // Установка начальных параметров canvas
        function i() {
            r.width = d.offsetWidth;
            r.height = d.offsetHeight; // Use window.innerHeight instead of document.body.scrollHeight
            s.fillStyle = g.dotColor; // Цвет точек
            s.strokeStyle = g.lineColor; // Цвет линий
            s.lineWidth = g.lineWidth; // Толщина линий
        }

        // Основной цикл анимации
        function j() {
            if (y) {
                u = a.innerWidth;
                v = a.innerHeight;
                s.clearRect(0, 0, r.width, r.height); // Очистка canvas
                for (var b = 0; b < z.length; b++) {
                    z[b].updatePosition(); // Обновление позиции каждой частицы
                }
                for (var b = 0; b < z.length; b++) {
                    z[b].draw(); // Отрисовка каждой частицы
                }
                G || (t = requestAnimationFrame(j)); // Планирование следующего кадра
            }
        }

        // Обработчик изменения размера окна
        function k() {
            i();
            for (var a = d.offsetWidth, b = d.offsetHeight, c = z.length - 1; c >= 0; c--) {
                // Удаление частиц, вышедших за пределы видимости
                (z[c].position.x > a || z[c].position.y > b) && z.splice(c, 1);
            }
            var e = Math.round(r.width * r.height / g.density);
            if (e > z.length) {
                // Добавление новых частиц при необходимости
                for (; e > z.length;) {
                    var f = new n;
                    z.push(f);
                }
            } else if (e < z.length) {
                z.splice(e); // Удаление лишних частиц
            }
            for (c = z.length - 1; c >= 0; c--) {
                z[c].setStackPos(c); // Обновление позиций в стеке
            }
        }

        // Пауза анимации
        function l() {
            G = !0;
        }

        // Возобновление анимации
        function m() {
            G = !1;
            j();
        }

        // Конструктор частицы
        function n() {
            this.stackPos;
            this.active = !0;
            this.layer = Math.ceil(3 * Math.random()); // Слой для параллакса
            this.parallaxOffsetX = 0;
            this.parallaxOffsetY = 0;
            this.position = { x: Math.ceil(Math.random() * r.width), y: Math.ceil(Math.random() * r.height) }; // Начальная позиция
            this.speed = {};
            this.size = Math.random() * 2 + 1; // Randomize particle size for more visual interest

            // Установка скорости по X
            switch (g.directionX) {
                case "left":
                    this.speed.x = +(-g.maxSpeedX + Math.random() * g.maxSpeedX - g.minSpeedX).toFixed(2);
                    break;
                case "right":
                    this.speed.x = +(Math.random() * g.maxSpeedX + g.minSpeedX).toFixed(2);
                    break;
                default:
                    this.speed.x = +(-g.maxSpeedX / 2 + Math.random() * g.maxSpeedX).toFixed(2);
                    this.speed.x += this.speed.x > 0 ? g.minSpeedX : -g.minSpeedX;
            }

            // Установка скорости по Y
            switch (g.directionY) {
                case "up":
                    this.speed.y = +(-g.maxSpeedY + Math.random() * g.maxSpeedY - g.minSpeedY).toFixed(2);
                    break;
                case "down":
                    this.speed.y = +(Math.random() * g.maxSpeedY + g.minSpeedY).toFixed(2);
                    break;
                default:
                    this.speed.y = +(-g.maxSpeedY / 2 + Math.random() * g.maxSpeedY).toFixed(2);
                    this.speed.x += this.speed.y > 0 ? g.minSpeedY : -g.minSpeedY;
            }
            
            // Assign a random opacity to each particle for depth effect
            this.opacity = Math.random() * 0.5 + 0.3;
        }

        // Геттер/сеттер опций
        function o(a, b) {
            return b ? void(g[a] = b) : g[a];
        }

        // Уничтожение эффекта
        function p() {
            console.log("destroy");
            r.parentNode.removeChild(r);
            q("onDestroy");
            f && f(d).removeData("plugin_" + e);
        }

        // Вызов пользовательских функций обратного вызова
        function q(a) {
            void 0 !== g[a] && g[a].call(d);
        }

        var r, s, t, u, v, w, x, y = !!b.createElement("canvas").getContext, z = [], A = 0, B = 0, C = !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i), D = !!a.DeviceOrientationEvent, E = 0, F = 0, G = !1;

            
        // Метод отрисовки частицы
        n.prototype.draw = function() {
            // Set the particle's opacity to create depth effect
            s.globalAlpha = this.opacity;
            
            // Draw the particle with its custom size
            s.beginPath();
            s.arc(this.position.x + this.parallaxOffsetX, this.position.y + this.parallaxOffsetY, 
                 (g.particleRadius / 2) * this.size, 0, 2 * Math.PI, !0);
            s.closePath();
            s.fill();
            
            // Reset opacity for lines
            s.globalAlpha = 0.7;
            
            // Draw connecting lines
            s.beginPath();
            for (var a = z.length - 1; a > this.stackPos; a--) {
                var b = z[a], c = this.position.x - b.position.x, d = this.position.y - b.position.y, e = Math.sqrt(c * c + d * d).toFixed(2);
                // Рисование линий между близкими частицами
                if (e < g.proximity) {
                    // Calculate line opacity based on distance
                    var lineOpacity = 1 - (e / g.proximity);
                    s.strokeStyle = g.lineColor.replace('rgba(', 'rgba(').replace(')', ',' + lineOpacity + ')');
                    
                    s.moveTo(this.position.x + this.parallaxOffsetX, this.position.y + this.parallaxOffsetY);
                    g.curvedLines ? s.quadraticCurveTo(Math.max(b.position.x, b.position.x), 
                                                     Math.min(b.position.y, b.position.y), 
                                                     b.position.x + b.parallaxOffsetX, 
                                                     b.position.y + b.parallaxOffsetY) 
                                 : s.lineTo(b.position.x + b.parallaxOffsetX, b.position.y + b.parallaxOffsetY);
                }
             }
            s.stroke();
            s.closePath();
            
            // Reset global alpha
            s.globalAlpha = 1;
        };

        // Метод обновления позиции частицы
        n.prototype.updatePosition = function() {
            if (g.parallax) {
                if (D && !C) {
                    var a = (u - 0) / 60;
                    w = (E - -30) * a + 0;
                    var b = (v - 0) / 60;
                    x = (F - -30) * b + 0;
                 } else {
                    w = A;
                    x = B;
                }

                this.parallaxTargX = (w - u / 2) / (g.parallaxMultiplier * this.layer);
                this.parallaxOffsetX += (this.parallaxTargX - this.parallaxOffsetX) / 10;
                this.parallaxTargY = (x - v / 2) / (g.parallaxMultiplier * this.layer);
                this.parallaxOffsetY += (this.parallaxTargY - this.parallaxOffsetY) / 10;
            }

            var c = d.offsetWidth, e = d.offsetHeight;
            // Обработка выхода за границы по X
            switch (g.directionX) {
                case "left":
                    this.position.x + this.speed.x + this.parallaxOffsetX < 0 && (this.position.x = c - this.parallaxOffsetX);
                    break;
                case "right":
                    this.position.x + this.speed.x + this.parallaxOffsetX > c && (this.position.x = 0 - this.parallaxOffsetX);
                    break;
                default:
                    (this.position.x + this.speed.x + this.parallaxOffsetX > c || this.position.x + this.speed.x + this.parallaxOffsetX < 0) && (this.speed.x = -this.speed.x);
            }

            // Обработка выхода за границы по Y
            switch (g.directionY) {
                case "up":
                    this.position.y + this.speed.y + this.parallaxOffsetY < 0 && (this.position.y = e - this.parallaxOffsetY);
                    break;
                case "down":
                    this.position.y + this.speed.y + this.parallaxOffsetY > e && (this.position.y = 0 - this.parallaxOffsetY);
                    break;
                default:
                    (this.position.y + this.speed.y + this.parallaxOffsetY > e || this.position.y + this.speed.y + this.parallaxOffsetY < 0) && (this.speed.y = -this.speed.y);
            }

            // Обновление позиции
            this.position.x += this.speed.x;
            this.position.y += this.speed.y;
        };

        // Установка позиции в стеке
        n.prototype.setStackPos = function(a) {
            this.stackPos = a;
        };

        // Подготовка параметров и вызов h()
        h();

        // Публичные методы и свойства
        var H = {
            option: o, destroy: p, start: m, pause: l
        };

        return H;
    }

    // Поддержка AMD и CommonJS
    var e = "particleground";
    a[e] = function(a, b) {
        return new d(a, b);
    };

    a[e].defaults = {
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

    function initParticles() {
        // Check if we're in light or dark theme
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        
        // Set particle colors based on theme
        const particleColor = currentTheme === 'light' ? 'rgba(124, 92, 255, 0.6)' : 'rgba(255, 255, 255, 0.8)';
        const lineColor = currentTheme === 'light' ? 'rgba(124, 92, 255, 0.3)' : 'rgba(255, 255, 255, 0.5)';
        
        // Background particles (slower, more distant)
        a.particleground(document.getElementById('particles-background'), {
            dotColor: particleColor,
            lineColor: lineColor,
            minSpeedX: 0.05,
            maxSpeedX: 0.25,
            minSpeedY: 0.05,
            maxSpeedY: 0.25,
            density: 15000, // Increased density
            particleRadius: 6,  // Slightly smaller particles
            lineWidth: 0.5, // Thinner lines
            proximity: 120,
            parallaxMultiplier: 20  // More pronounced parallax effect
        });
        
        // Foreground particles (faster, closer)
        a.particleground(document.getElementById('particles-foreground'), {
            dotColor: particleColor,
            lineColor: lineColor,
            minSpeedX: 0.1,
            maxSpeedX: 0.35,
            minSpeedY: 0.1,
            maxSpeedY: 0.35,
            density: 30000, // Lower density for fewer particles
            particleRadius: 4, // Smaller particles
            lineWidth: 0.5, // Thinner lines
            proximity: 100,
            parallaxMultiplier: 8 // Less pronounced parallax effect
        });
    }

    // Initialize particles when document is ready
    document.addEventListener('DOMContentLoaded', function() {
        initParticles();
        
        // Listen for theme changes and reinitialize particles
        window.addEventListener('customSettingsChanged', function() {
            // Need to destroy existing particles first
            try {
                if (window.pJSDom && window.pJSDom.length > 0) {
                    window.pJSDom.forEach(function(instance) {
                        instance.pJS.fn.vendors.destroypJS();
                    });
                    window.pJSDom = [];
                }
            } catch(e) {
                console.error("Error destroying particles:", e);
            }
            
            // Reinitialize after a short delay
            setTimeout(initParticles, 100);
        });
    });

    // Update particles when the theme changes
    document.addEventListener('DOMContentLoaded', function() {
        // Observe data-theme attribute changes 
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'data-theme') {
                    // Try to update particle colors through pJS API
                    try {
                        const theme = document.documentElement.getAttribute('data-theme');
                        const particleColor = theme === 'light' ? 'rgba(124, 92, 255, 0.6)' : 'rgba(255, 255, 255, 0.8)';
                        const lineColor = theme === 'light' ? 'rgba(124, 92, 255, 0.3)' : 'rgba(255, 255, 255, 0.5)';
                        
                        if (window.pJSDom && window.pJSDom.length > 0) {
                            // Update background particles
                            if (window.pJSDom[0] && window.pJSDom[0].pJS) {
                                window.pJSDom[0].pJS.particles.color.value = particleColor;
                                window.pJSDom[0].pJS.particles.line_linked.color = lineColor;
                                window.pJSDom[0].pJS.fn.particlesRefresh();
                            }
                            
                            // Update foreground particles
                            if (window.pJSDom[1] && window.pJSDom[1].pJS) {
                                window.pJSDom[1].pJS.particles.color.value = particleColor;
                                window.pJSDom[1].pJS.particles.line_linked.color = lineColor;
                                window.pJSDom[1].pJS.fn.particlesRefresh();
                            }
                        }
                    } catch(e) {
                        console.error("Error updating particle colors:", e);
                    }
                }
            });
        });
        
        observer.observe(document.documentElement, { attributes: true });
    });

    // Background initialization for all pages
    document.addEventListener('DOMContentLoaded', function() {
        // Загрузить сохраненные настройки
        loadSavedSettings();
        
        // Инициализировать фон
        initializeBackground();
    });

    // Загрузка сохраненных настроек
    function loadSavedSettings() {
        const savedSettingsStr = localStorage.getItem('customSettings');
        let settings = null;
        
        // Если есть сохраненные настройки, применяем их
        if (savedSettingsStr) {
            try {
                settings = JSON.parse(savedSettingsStr);
                applyCustomSettings(settings);
            } catch (e) {
                console.error('Error parsing saved settings:', e);
                settings = getDefaultSettings();
            }
        } else {
            // Если настроек нет, используем значения по умолчанию
            settings = getDefaultSettings();
        }
        
        return settings;
    }

    // Получение настроек по умолчанию
    function getDefaultSettings() {
        return {
            headerColor: '#7c5cff',
            backgroundColor: '#000000',
            accentColor: '#7c5cff',
            textColor: '#FFFFFF',
            titleSize: '100',
            subtitleSize: '100',
            bodyTextSize: '100',
            waveSpeed: '5',
            starSpeed: '5',
            background: 'stars',
            theme: 'dark'
        };
    }

    // Применение сохраненных настроек к странице
    function applyCustomSettings(settings) {
        if (!settings) return;
        
        // Применяем цвета
        if (settings.headerColor) {
            document.documentElement.style.setProperty('--header-color', settings.headerColor);
            document.documentElement.style.setProperty('--wave-color-1', hexToRgba(settings.headerColor, 0.7));
            document.documentElement.style.setProperty('--wave-color-2', hexToRgba(settings.headerColor, 0.5));
            document.documentElement.style.setProperty('--wave-color-3', hexToRgba(settings.headerColor, 0.3));
            document.documentElement.style.setProperty('--wave-color-4', settings.headerColor);
        }
        
        if (settings.backgroundColor) {
            document.body.style.backgroundColor = settings.backgroundColor;
        }
        
        if (settings.accentColor) {
            document.documentElement.style.setProperty('--accent-color', settings.accentColor);
            document.documentElement.style.setProperty('--accent-hover', lightenColor(settings.accentColor, 20));
            updateAccentColorRGB(settings.accentColor);
        }
        
        if (settings.textColor) {
            document.documentElement.style.setProperty('--text-color', settings.textColor);
        }
        
        // Применяем размеры текста
        if (settings.titleSize) {
            const titleFontSize = 24 + ((parseInt(settings.titleSize) / 100) * 20);
            document.documentElement.style.setProperty('--title-font-size', titleFontSize + 'px');
        }
        
        if (settings.subtitleSize) {
            const subtitleFontSize = 16 + ((parseInt(settings.subtitleSize) / 100) * 8);
            document.documentElement.style.setProperty('--subtitle-font-size', subtitleFontSize + 'px');
        }
        
        if (settings.bodyTextSize) {
            const bodyFontSize = 14 + ((parseInt(settings.bodyTextSize) / 100) * 6);
            document.documentElement.style.setProperty('--body-font-size', bodyFontSize + 'px');
        }
        
        // Применяем анимации
        if (settings.waveSpeed) {
            const waveSpeed = parseInt(settings.waveSpeed);
            const normalizedWaveSpeed = waveSpeed / 100;
            
            if (waveSpeed === 0) {
                // Останавливаем анимацию волн
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
        }
        
        // Применяем тему
        if (settings.theme) {
            document.documentElement.setAttribute('data-theme', settings.theme);
        }
        
        // Применяем фон
        if (settings.background) {
            document.documentElement.setAttribute('data-background', settings.background);
            
            // Инициализируем фон в зависимости от типа
            initializeBackground(settings.background, settings);
        }
    }

    // Инициализация фона
    function initializeBackground(bgType, settings) {
        if (!settings) {
            settings = loadSavedSettings();
        }
        
        if (!bgType) {
            bgType = settings.background || 'stars';
        }
        
        // Устанавливаем тип фона
        document.documentElement.setAttribute('data-background', bgType);
        
        if (bgType === 'gradient') {
            // Применяем градиентный фон
            applyGradientBackground(settings.headerColor, settings.backgroundColor);
        } else {
            // Сбрасываем фон
            resetBackground(settings.backgroundColor);
            
            // Инициализируем частицы
            if (bgType === 'stars') {
                initializeParticlesBackground('stars', settings);
            } else if (bgType === 'particles') {
                initializeParticlesBackground('particles', settings);
            }
        }
    }

    // Функция для применения градиентного фона
    function applyGradientBackground(color1, color2) {
        if (!color1) color1 = '#7c5cff';
        if (!color2) color2 = '#000000';
        
        document.body.style.background = `linear-gradient(135deg, ${color1}, ${color2})`;
        document.body.style.backgroundAttachment = 'fixed';
        
        // Скрываем частицы
        const particlesElements = document.querySelectorAll('#particles-background, #particles-foreground');
        particlesElements.forEach(el => {
            if (el) el.style.display = 'none';
        });
    }

    // Функция для сброса фона
    function resetBackground(backgroundColor) {
        if (!backgroundColor) backgroundColor = '#000000';
        
        document.body.style.background = backgroundColor;
        document.body.style.backgroundAttachment = 'initial';
        
        // Показываем частицы
        const particlesElements = document.querySelectorAll('#particles-background, #particles-foreground');
        particlesElements.forEach(el => {
            if (el) el.style.display = 'block';
        });
    }

    // Функция для инициализации фона с частицами
    function initializeParticlesBackground(type, settings) {
        if (typeof particlesJS === 'undefined') return;
        
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

    // Утилитарные функции
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

    // Функция обновления RGB значения для CSS
    function updateAccentColorRGB(hexColor) {
        if (!hexColor) return;
        
        // Конвертация HEX в RGB
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        
        // Установка data-атрибута для CSS селектора
        document.documentElement.setAttribute('data-accent-color', hexColor);
        
        // Прямое обновление переменной
        document.documentElement.style.setProperty('--accent-color-rgb', `${r}, ${g}, ${b}`);
    }
}(window, document);