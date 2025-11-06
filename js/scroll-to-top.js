/**
 * Scroll to Top Button - Messad Estudio
 * Funcionalidad del botón para volver arriba
 */

(function() {
    'use strict';

    // Crear el botón dinámicamente
    function createScrollButton() {
        const button = document.createElement('button');
        button.className = 'scroll-to-top';
        button.setAttribute('aria-label', 'Volver arriba');
        button.setAttribute('title', 'Volver arriba');
        button.setAttribute('type', 'button');
        document.body.appendChild(button);
        return button;
    }

    // Mostrar/ocultar botón basado en scroll
    function toggleButtonVisibility(button) {
        const scrollThreshold = 300; // Mostrar después de 300px de scroll

        if (window.pageYOffset > scrollThreshold) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    }

    // Scroll suave hacia arriba
    function scrollToTop() {
        // Usar scroll behavior smooth si está disponible
        if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            // Fallback para navegadores que no soportan smooth scroll
            const scrollStep = -window.pageYOffset / (500 / 15);
            const scrollInterval = setInterval(function() {
                if (window.pageYOffset !== 0) {
                    window.scrollBy(0, scrollStep);
                } else {
                    clearInterval(scrollInterval);
                }
            }, 15);
        }
    }

    // Inicializar
    function init() {
        // Crear botón
        const scrollButton = createScrollButton();

        // Event listener para scroll
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            // Throttle scroll event para mejor performance
            if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
            }
            scrollTimeout = window.requestAnimationFrame(function() {
                toggleButtonVisibility(scrollButton);
            });
        }, { passive: true });

        // Event listener para click en el botón
        scrollButton.addEventListener('click', function(e) {
            e.preventDefault();
            scrollToTop();
        });

        // Check inicial por si la página ya tiene scroll al cargar
        toggleButtonVisibility(scrollButton);
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
