// Carrusel de Testimonios - Messad Estudio
// Carrusel responsive con autoplay y controles táctiles

(function() {
    'use strict';

    // Configuración
    const CONFIG = {
        autoplay: true,
        autoplayInterval: 5000,
        animationDuration: 500,
        swipeThreshold: 50
    };

    let currentIndex = 0;
    let testimonials = [];
    let autoplayTimer = null;
    let touchStartX = 0;
    let touchEndX = 0;

    /**
     * Inicializar carrusel de testimonios
     */
    function initTestimonialsCarousel() {
        const carousel = document.querySelector('.testimonials-carousel');

        if (!carousel) {
            console.warn('No se encontró el carrusel de testimonios');
            return;
        }

        // Soporte para ambas estructuras de HTML
        testimonials = Array.from(carousel.querySelectorAll('.testimonial-card'));
        if (testimonials.length === 0) {
            testimonials = Array.from(carousel.querySelectorAll('.testimonial-item'));
        }

        if (testimonials.length === 0) {
            console.warn('No se encontraron testimonios');
            return;
        }

        // Setup inicial
        setupCarousel();
        setupControls();
        setupTouchEvents();
        setupIndicators();

        // Mostrar el primer testimonio
        showTestimonial(0);

        // Iniciar autoplay si está habilitado
        const autoplayAttr = carousel.getAttribute('data-autoplay');
        const autoplayEnabled = autoplayAttr === 'true' || CONFIG.autoplay;

        if (autoplayEnabled) {
            const interval = carousel.getAttribute('data-interval');
            if (interval) {
                CONFIG.autoplayInterval = parseInt(interval);
            }
            startAutoplay();
        }

        console.log('✅ Carrusel de testimonios inicializado con', testimonials.length, 'testimonios');
    }

    /**
     * Configurar carrusel
     */
    function setupCarousel() {
        testimonials.forEach((testimonial, index) => {
            testimonial.style.display = 'none';
            testimonial.style.opacity = '0';
            testimonial.setAttribute('data-index', index);
        });
    }

    /**
     * Configurar controles
     */
    function setupControls() {
        // Soporte para ambas estructuras de HTML
        const prevBtn = document.querySelector('.carousel-control.prev') || document.querySelector('.testimonial-prev');
        const nextBtn = document.querySelector('.carousel-control.next') || document.querySelector('.testimonial-next');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                stopAutoplay();
                previousTestimonial();
                if (CONFIG.autoplay) startAutoplay();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                stopAutoplay();
                nextTestimonial();
                if (CONFIG.autoplay) startAutoplay();
            });
        }
    }

    /**
     * Configurar eventos táctiles
     */
    function setupTouchEvents() {
        const carousel = document.querySelector('.testimonials-carousel');

        if (!carousel) return;

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }

    /**
     * Manejar swipe
     */
    function handleSwipe() {
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > CONFIG.swipeThreshold) {
            stopAutoplay();

            if (diff > 0) {
                // Swipe izquierda - siguiente
                nextTestimonial();
            } else {
                // Swipe derecha - anterior
                previousTestimonial();
            }

            if (CONFIG.autoplay) startAutoplay();
        }
    }

    /**
     * Configurar indicadores
     */
    function setupIndicators() {
        // Soporte para ambas estructuras de HTML
        const indicatorsContainer = document.querySelector('.carousel-indicators') || document.querySelector('.testimonial-indicators');

        if (!indicatorsContainer) return;

        // Limpiar indicadores existentes
        indicatorsContainer.innerHTML = '';

        // Solo crear indicadores si el contenedor está vacío
        if (indicatorsContainer.children.length === 0) {
            // Crear indicadores
            testimonials.forEach((_, index) => {
                const indicator = document.createElement('button');
                indicator.className = 'indicator'; // Clase genérica que funciona con ambas estructuras
                indicator.setAttribute('aria-label', `Ver testimonio ${index + 1}`);
                indicator.setAttribute('data-index', index);

                indicator.addEventListener('click', () => {
                    stopAutoplay();
                    showTestimonial(index);
                    if (CONFIG.autoplay) startAutoplay();
                });

                indicatorsContainer.appendChild(indicator);
            });
        } else {
            // Si ya existen indicadores, solo agregar event listeners
            const existingIndicators = indicatorsContainer.querySelectorAll('.indicator');
            existingIndicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    stopAutoplay();
                    showTestimonial(index);
                    if (CONFIG.autoplay) startAutoplay();
                });
            });
        }

        // Activar el primer indicador
        updateIndicators(0);
    }

    /**
     * Actualizar indicadores
     */
    function updateIndicators(index) {
        // Soporte para ambas clases de indicadores
        const indicators = document.querySelectorAll('.indicator, .testimonial-indicator');

        indicators.forEach((indicator, i) => {
            if (i === index) {
                indicator.classList.add('active');
                indicator.setAttribute('aria-current', 'true');
            } else {
                indicator.classList.remove('active');
                indicator.removeAttribute('aria-current');
            }
        });
    }

    /**
     * Mostrar testimonio
     */
    function showTestimonial(index) {
        if (index < 0 || index >= testimonials.length) return;

        const current = testimonials[currentIndex];
        const next = testimonials[index];

        // Ocultar actual
        current.style.opacity = '0';

        setTimeout(() => {
            current.style.display = 'none';

            // Mostrar siguiente
            next.style.display = 'block';

            setTimeout(() => {
                next.style.opacity = '1';
            }, 50);

        }, CONFIG.animationDuration);

        currentIndex = index;
        updateIndicators(index);

        // Actualizar contador si existe
        updateCounter();
    }

    /**
     * Actualizar contador
     */
    function updateCounter() {
        const counter = document.querySelector('.testimonial-counter');

        if (counter) {
            counter.textContent = `${currentIndex + 1} / ${testimonials.length}`;
        }
    }

    /**
     * Siguiente testimonio
     */
    function nextTestimonial() {
        const nextIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(nextIndex);
    }

    /**
     * Testimonio anterior
     */
    function previousTestimonial() {
        const prevIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        showTestimonial(prevIndex);
    }

    /**
     * Iniciar autoplay
     */
    function startAutoplay() {
        stopAutoplay();

        autoplayTimer = setInterval(() => {
            nextTestimonial();
        }, CONFIG.autoplayInterval);
    }

    /**
     * Detener autoplay
     */
    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }

    /**
     * Pausar autoplay al hacer hover
     */
    function setupHoverPause() {
        const carousel = document.querySelector('.testimonials-carousel');

        if (!carousel) return;

        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', () => {
            if (CONFIG.autoplay) startAutoplay();
        });
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initTestimonialsCarousel();
            setupHoverPause();
        });
    } else {
        initTestimonialsCarousel();
        setupHoverPause();
    }

    // Exportar funciones para uso externo
    window.TestimonialsCarousel = {
        init: initTestimonialsCarousel,
        next: nextTestimonial,
        previous: previousTestimonial,
        goto: showTestimonial,
        startAutoplay: startAutoplay,
        stopAutoplay: stopAutoplay
    };

})();
