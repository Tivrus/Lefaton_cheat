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
            s.beginPath();
            s.arc(this.position.x + this.parallaxOffsetX, this.position.y + this.parallaxOffsetY, g.particleRadius / 2, 0, 2 * Math.PI, !0);
            s.closePath();
            s.fill();
            s.beginPath();
            for (var a = z.length - 1; a > this.stackPos; a--) {
                var b = z[a], c = this.position.x - b.position.x, d = this.position.y - b.position.y, e = Math.sqrt(c * c + d * d).toFixed(2);
                // Рисование линий между близкими частицами
                e < g.proximity && (s.moveTo(this.position.x + this.parallaxOffsetX, this.position.y + this.parallaxOffsetY), g.curvedLines ? s.quadraticCurveTo(Math.max(b.position.x, b.position.x), Math.min(b.position.y, b.position.y), b.position.x + b.parallaxOffsetX, b.position.y + b.parallaxOffsetY) : s.lineTo(b.position.x + b.parallaxOffsetX, b.position.y + b.parallaxOffsetY));
             }
            s.stroke();
            s.closePath();
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

            this.position.x += this.speed.x;
            this.position.y += this.speed.y;
        };

        // Установка позиции в стеке
        n.prototype.setStackPos = function(a) {
            this.stackPos = a;
        };

        h();

        return {
            option: o,
            destroy: p,
            start: m,
            pause: l
        };
    }

    var e = "particleground", f = a.jQuery;

    // Главная функция инициализации
    a[e] = function(a, b) {
        return new d(a, b);
    };

    // Значения по умолчанию
    a[e].defaults = {
        minSpeedX: .1,
        maxSpeedX: .7,
        minSpeedY: .1,
        maxSpeedY: .7,
        directionX: "center",
        directionY: "center",
        density: 1e4,
        dotColor: "#666666",
        lineColor: "#666666",
        particleRadius: 7,
        lineWidth: 1,
        curvedLines: !1,
        proximity: 100,
        parallax: !0,
        parallaxMultiplier: 5,
        onInit: function() {},
        onDestroy: function() {}
    };

    // Интеграция с jQuery
    f && (f.fn[e] = function(a) {
        if ("string" == typeof arguments[0]) {
            var b, c = arguments[0], g = Array.prototype.slice.call(arguments, 1);
            return this.each(function() {
                f.data(this, "plugin_" + e) && "function" == typeof f.data(this, "plugin_" + e)[c] && (b = f.data(this, "plugin_" + e)[c].apply(this, g));
            }), void 0 !== b ? b : this;
        }
        return "object" != typeof a && a ? void 0 : this.each(function() {
            f.data(this, "plugin_" + e) || f.data(this, "plugin_" + e, new d(this, a));
        });
    });
}(window, document);

// Store particle references for customization
let particlegroundForeground;
let particlegroundBackground;

// Function to initialize with custom colors from local storage
function initParticlesWithCustomSettings() {
    // Get saved settings
    const customSettings = localStorage.getItem('customSettings');
    let starColor = '#FFFFFF';
    let starSpeed = 50;
    let starDensity = 50;
    
    if (customSettings) {
        try {
            const settings = JSON.parse(customSettings);
            starColor = settings.starColor || starColor;
            starSpeed = parseInt(settings.starSpeed || starSpeed);
            starDensity = parseInt(settings.starDensity || starDensity);
            console.log("Loading custom settings:", settings);
        } catch (e) {
            console.error("Error parsing custom settings:", e);
        }
    }
    
    // Преобразуем значения в соответствии с новой логикой
    const normalizedSpeed = starSpeed / 100;
    
    // Инвертируем плотность: больше значение = больше частиц
    const fgDensity = 50000 - (starDensity * 200); // 50000 при 0, 10000 при 200
    const bgDensity = 30000 - (starDensity * 120); // 30000 при 0, 6000 при 200
    
    // Устанавливаем скорость в зависимости от значения ползунка
    let fgMinSpeed, fgMaxSpeed, bgMinSpeed, bgMaxSpeed;
    
    if (normalizedSpeed <= 0.01) {
        // Полная остановка при значении 0
        fgMinSpeed = 0;
        fgMaxSpeed = 0;
        bgMinSpeed = 0;
        bgMaxSpeed = 0;
    } else {
        // Нормальная скорость
        fgMinSpeed = 0.05 + (normalizedSpeed * 0.2);
        fgMaxSpeed = 0.15 + (normalizedSpeed * 0.2);
        bgMinSpeed = 0.0375 + (normalizedSpeed * 0.2);
        bgMaxSpeed = 0.075 + (normalizedSpeed * 0.2);
    }

    // Initialize foreground particles with custom settings
    particlegroundForeground = particleground(document.getElementById('particles-foreground'), {
        dotColor: starColor,
        lineColor: hexToRgba(starColor, 0.08),
        minSpeedX: fgMinSpeed,
        maxSpeedX: fgMaxSpeed,
        minSpeedY: fgMinSpeed,
        maxSpeedY: fgMaxSpeed,
        density: fgDensity,
        curvedLines: true,
        proximity: 150,
        parallaxMultiplier: 50,
        particleRadius: 4,
    });

    // Initialize background particles with custom settings
    particlegroundBackground = particleground(document.getElementById('particles-background'), {
        dotColor: hexToRgba(starColor, 0.5),
        lineColor: hexToRgba(starColor, 0.08),
        minSpeedX: bgMinSpeed,
        maxSpeedX: bgMaxSpeed,
        minSpeedY: bgMinSpeed,
        maxSpeedY: bgMaxSpeed,
        density: bgDensity,
        curvedLines: true,
        proximity: 20,
        parallaxMultiplier: 20,
        particleRadius: 2,
    });
    
    // Make references available to customize.js
    window.particlegroundForeground = particlegroundForeground;
    window.particlegroundBackground = particlegroundBackground;
    
    // Make option function available globally
    window.setParticleOption = function(target, optionName, value) {
        if (target === 'foreground' && window.particlegroundForeground) {
            window.particlegroundForeground.option(optionName, value);
        } else if (target === 'background' && window.particlegroundBackground) {
            window.particlegroundBackground.option(optionName, value);
        }
    };
    
    // If setupParticlegroundRefs function exists, call it
    if (window.setupParticlegroundRefs) {
        window.setupParticlegroundRefs(particlegroundForeground, particlegroundBackground);
    }
    
    console.log("Particles initialized with custom settings", {starColor, starSpeed, starDensity});
}

// Convert hex color to rgba
function hexToRgba(hex, alpha = 1) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Обработчик загрузки DOM
document.addEventListener("DOMContentLoaded", function () {
    initParticlesWithCustomSettings();
    
    const particlesBackground = document.getElementById("particles-background");
    const particlesForeground = document.getElementById("particles-foreground");
  
    function resizeDivs() {
        // Use window height for particle backgrounds since they're now fixed position
        const windowHeight = window.innerHeight;
        particlesBackground.style.height = `${windowHeight}px`;
        particlesForeground.style.height = `${windowHeight}px`;
        
        // Also update canvas size if needed
        if (window.particlegroundForeground && window.particlegroundBackground) {
            // Trigger a resize event to update the particles
            window.dispatchEvent(new Event('resize'));
        }
    }
  
    resizeDivs(); // Первоначальная установка высоты
    window.addEventListener("resize", resizeDivs);
});

function n() {
    var e = t ? screen.width : window.innerWidth;
    window.isMobile && !t && (e = document.documentElement.clientWidth);
    for (var n = document.querySelectorAll('.r:not([data-record-type="396"]):not([data-record-type="1003"])'), i = [], o = 0; o < n.length; o++) {
        var r = n[o]
          , a = getComputedStyle(r);
        "none" !== a.display && "hidden" !== a.visibility && "0" !== a.opacity && i.push(r)
    }
    for (var l = 0; l < i.length; l++)
        for (var d = i[l], s = d.querySelectorAll('div:not([data-auto-correct-mobile-width="false"]):not(.tn-elem):not(.tn-atom):not(.tn-atom__sbs-anim-wrapper):not(.tn-atom__prx-wrapper):not(.tn-atom__videoiframe):not(.tn-atom__sticky-wrapper):not(.t-store__relevants__container):not(.t-slds__items-wrapper):not(.js-product-controls-wrapper):not(.js-product-edition-option):not(.t-product__option-variants)'), c = 0; c < s.length; c++) {
            var u = s[c];
            d.style.wordBreak = "";
            var m = t_outerWidth(u);
            if (m > e) {
                if ("yes" === u.getAttribute("[data-customstyle]") && "false" === u.parentNode.getAttribute("[data-auto-correct-mobile-width]"))
                    return;
                console.log("Block not optimized for mobile width. Block width:" + m + " Block id:" + d.getAttribute("id")),
                console.log(u),
                d.style.overflow = "auto",
                d.style.wordBreak = m - 3 > e ? "break-word" : ""
            }
        }
}

// Initialize particles.js background
document.addEventListener('DOMContentLoaded', function() {
    // Function to get saved settings or use defaults
    function getSettings() {
        const savedSettings = localStorage.getItem('customSettings');
        let settings = {
            starColor: '#FFFFFF',
            backgroundColor: '#000000',
            starSpeed: 50,
            starDensity: 150,
            background: 'stars'
        };
        
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                settings = {
                    ...settings,
                    ...parsed
                };
            } catch (e) {
                console.error("Error parsing saved settings:", e);
            }
        }
        
        return settings;
    }
    
    // Convert hex color to rgba format
    function hexToRgba(hex, alpha = 1) {
        if (!hex) return `rgba(255, 255, 255, ${alpha})`;
        
        try {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        } catch (e) {
            console.error("Error converting color:", hex, e);
            return `rgba(255, 255, 255, ${alpha})`;
        }
    }
    
    // Function to initialize particles with custom settings
    function initParticles() {
        const settings = getSettings();
        const starColor = settings.starColor || '#FFFFFF';
        const starSpeed = parseInt(settings.starSpeed || 50) / 100;
        const starDensity = parseInt(settings.starDensity || 150);
        const backgroundType = settings.background || 'stars';
        
        // Hide particles if gradient background is selected
        if (backgroundType === 'gradient') {
            const particlesBg = document.getElementById('particles-background');
            const particlesFg = document.getElementById('particles-foreground');
            if (particlesBg) particlesBg.style.display = 'none';
            if (particlesFg) particlesFg.style.display = 'none';
            
            // Apply gradient background
            document.documentElement.setAttribute('data-background', 'gradient');
            document.body.style.background = 'linear-gradient(45deg, #12c2e9, #c471ed, #f64f59)';
            document.body.style.backgroundSize = '400% 400%';
            document.body.style.animation = 'gradient 15s ease infinite';
            return;
        }
        
        // Set background type attribute
        document.documentElement.setAttribute('data-background', backgroundType);
        
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
        const dotColor = hexToRgba(starColor, 0.8);
        const lineColor = hexToRgba(starColor, 0.3);
        
        // Configure particles based on background type
        let bgConfig, fgConfig;
        
        if (backgroundType === 'particles') {
            // Interactive particles configuration
            bgConfig = {
                particles: {
                    number: {
                        value: Math.round(starDensity * 0.7),
                        density: { enable: true, value_area: 800 }
                    },
                    color: { value: dotColor },
                    shape: {
                        type: "circle",
                        stroke: { width: 0, color: "#000000" }
                    },
                    opacity: {
                        value: 0.8,
                        random: true,
                        anim: { enable: true, speed: 1, opacity_min: 0, sync: false }
                    },
                    size: {
                        value: 3,
                        random: true,
                        anim: { enable: false, speed: 4, size_min: 0.3, sync: false }
                    },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: lineColor,
                        opacity: 0.3,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: maxSpeed,
                        direction: "none",
                        random: true,
                        straight: false,
                        out_mode: "out",
                        bounce: false,
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
            
            // Foreground config is a slightly modified version of background config
            fgConfig = JSON.parse(JSON.stringify(bgConfig));
            fgConfig.particles.number.value = Math.round(starDensity * 0.3);
            fgConfig.particles.move.speed = maxSpeed * 1.5; // Faster
            fgConfig.particles.size.value = 2; // Smaller
            fgConfig.particles.opacity.value = 0.4; // More transparent
        } else {
            // Standard stars configuration (default)
            bgConfig = {
                particles: {
                    number: {
                        value: Math.round(starDensity * 0.7),
                        density: { enable: true, value_area: 800 }
                    },
                    color: { value: dotColor },
                    shape: {
                        type: "circle",
                        stroke: { width: 0, color: "#000000" }
                    },
                    opacity: {
                        value: 0.8,
                        random: true,
                        anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false }
                    },
                    size: {
                        value: 2,
                        random: true,
                        anim: { enable: false, speed: 40, size_min: 0.1, sync: false }
                    },
                    line_linked: { enable: false },
                    move: {
                        enable: true,
                        speed: maxSpeed,
                        direction: "none",
                        random: true,
                        straight: false,
                        out_mode: "out",
                        bounce: false,
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
            
            // Foreground config
            fgConfig = JSON.parse(JSON.stringify(bgConfig));
            fgConfig.particles.number.value = Math.round(starDensity * 0.3);
            fgConfig.particles.size.value = 1;
            fgConfig.particles.move.speed = maxSpeed * 1.5;
            fgConfig.particles.opacity.value = 0.4;
        }
        
        // Initialize particles.js
        if (window.particlesJS) {
            // Clear any existing particles first
            if (window.pJSDom && window.pJSDom.length > 0) {
                for (let i = 0; i < window.pJSDom.length; i++) {
                    if (window.pJSDom[i].pJS.fn.vendors.destroypJS) {
                        window.pJSDom[i].pJS.fn.vendors.destroypJS();
                    }
                }
                window.pJSDom = [];
            }
            
            // Initialize background particles
            particlesJS("particles-background", bgConfig);
            
            // Initialize foreground particles
            particlesJS("particles-foreground", fgConfig);
        }
    }
    
    // Initialize particles on page load
    initParticles();
    
    // Re-initialize when settings change (triggered by theme-switcher.js)
    window.addEventListener('customSettingsChanged', function() {
        initParticles();
    });
    
    // Re-initialize when window resizes
    window.addEventListener('resize', function() {
        // Debounce the resize event
        if (window.resizeTimeout) {
            clearTimeout(window.resizeTimeout);
        }
        window.resizeTimeout = setTimeout(function() {
            initParticles();
        }, 250);
    });
});