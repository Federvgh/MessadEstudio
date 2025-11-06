/**
 * ACCESSIBILITY ENHANCEMENTS
 * Mejoras de accesibilidad para navegación por teclado y screen readers
 */

(function() {
    'use strict';

    // ==========================================
    // 1. DETECT KEYBOARD NAVIGATION
    // ==========================================

    function detectKeyboardUser() {
        // Agregar clase cuando usuario usa Tab
        window.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('user-is-tabbing');
            }
        });

        // Remover clase cuando usuario usa mouse
        window.addEventListener('mousedown', function() {
            document.body.classList.remove('user-is-tabbing');
        });
    }

    // ==========================================
    // 2. FOCUS TRAP FOR MODALS
    // ==========================================

    function trapFocusInModal(modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        modal.addEventListener('keydown', function(e) {
            if (e.key !== 'Tab') return;

            // Si Shift+Tab en primer elemento, ir al último
            if (e.shiftKey && document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            }
            // Si Tab en último elemento, ir al primero
            else if (!e.shiftKey && document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        });
    }

    // ==========================================
    // 3. ESCAPE KEY TO CLOSE MODALS
    // ==========================================

    function enableEscapeToClose() {
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                // Cerrar modal de login
                const loginModal = document.getElementById('loginModal');
                if (loginModal && loginModal.style.display !== 'none') {
                    const closeBtn = document.getElementById('closeLoginModal');
                    if (closeBtn) closeBtn.click();
                }

                // Cerrar mobile menu
                const mobileMenu = document.querySelector('.site-mobile-menu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    const menuToggle = document.querySelector('.js-menu-toggle');
                    if (menuToggle) menuToggle.click();
                }
            }
        });
    }

    // ==========================================
    // 4. DROPDOWN KEYBOARD NAVIGATION
    // ==========================================

    function enhanceDropdownNavigation() {
        const dropdowns = document.querySelectorAll('.has-children > a');

        dropdowns.forEach(function(dropdown) {
            dropdown.addEventListener('keydown', function(e) {
                const parentLi = this.closest('.has-children');
                const submenu = parentLi.querySelector('.dropdown');

                if (!submenu) return;

                // Enter o Space para abrir/cerrar
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    submenu.classList.toggle('active');
                    this.setAttribute('aria-expanded',
                        submenu.classList.contains('active') ? 'true' : 'false'
                    );
                }

                // Flecha abajo para abrir y enfocar primer item
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    submenu.classList.add('active');
                    this.setAttribute('aria-expanded', 'true');

                    const firstLink = submenu.querySelector('a');
                    if (firstLink) firstLink.focus();
                }

                // Flecha arriba para cerrar
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    submenu.classList.remove('active');
                    this.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // ==========================================
    // 5. SKIP LINK SMOOTH SCROLL
    // ==========================================

    function enhanceSkipLink() {
        const skipLink = document.querySelector('.skip-to-main');
        if (!skipLink) return;

        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const mainContent = document.getElementById('main-content');

            if (mainContent) {
                // Hacer elemento focusable temporalmente
                mainContent.setAttribute('tabindex', '-1');
                mainContent.focus();

                // Scroll suave
                mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });

                // Remover tabindex después de focus
                mainContent.addEventListener('blur', function() {
                    mainContent.removeAttribute('tabindex');
                }, { once: true });
            }
        });
    }

    // ==========================================
    // 6. ANNOUNCE PAGE CHANGES (SPA-like)
    // ==========================================

    function createLiveRegion() {
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('role', 'status');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);

        return liveRegion;
    }

    function announceToScreenReader(message) {
        let liveRegion = document.getElementById('live-region');
        if (!liveRegion) {
            liveRegion = createLiveRegion();
        }

        // Clear y luego anunciar (para forzar re-lectura)
        liveRegion.textContent = '';
        setTimeout(function() {
            liveRegion.textContent = message;
        }, 100);
    }

    // ==========================================
    // 7. IMPROVE FORM ACCESSIBILITY
    // ==========================================

    function enhanceFormAccessibility() {
        const forms = document.querySelectorAll('form');

        forms.forEach(function(form) {
            // Asociar labels con inputs
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(function(input) {
                const id = input.id;
                if (!id) return;

                const label = form.querySelector(`label[for="${id}"]`);
                if (!label) {
                    console.warn(`Input #${id} no tiene label asociado`);
                }
            });

            // Anunciar errores de validación
            form.addEventListener('submit', function(e) {
                const invalidInputs = form.querySelectorAll(':invalid');
                if (invalidInputs.length > 0) {
                    const firstInvalid = invalidInputs[0];
                    const label = form.querySelector(`label[for="${firstInvalid.id}"]`);
                    const fieldName = label ? label.textContent : 'Un campo';

                    announceToScreenReader(
                        `Error de validación: ${fieldName} es requerido o tiene un formato inválido.`
                    );

                    // Focus en primer campo inválido
                    firstInvalid.focus();
                }
            });
        });
    }

    // ==========================================
    // 8. ACCESSIBLE CAROUSEL CONTROLS
    // ==========================================

    function enhanceCarouselAccessibility() {
        const carousels = document.querySelectorAll('[data-carousel]');

        carousels.forEach(function(carousel) {
            // Agregar ARIA roles
            carousel.setAttribute('role', 'region');
            carousel.setAttribute('aria-roledescription', 'carousel');
            carousel.setAttribute('aria-label', 'Galería de proyectos');

            // Pausar animaciones con Space
            carousel.addEventListener('keydown', function(e) {
                if (e.key === ' ') {
                    e.preventDefault();
                    const playPauseBtn = carousel.querySelector('[data-play-pause]');
                    if (playPauseBtn) playPauseBtn.click();
                }
            });
        });
    }

    // ==========================================
    // 9. HANDLE DYNAMIC CONTENT LOADING
    // ==========================================

    function observeDynamicContent() {
        // Observar cambios en el DOM para anunciar contenido nuevo
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(function(node) {
                        // Si se agrega contenido con data-announce
                        if (node.nodeType === 1 && node.hasAttribute('data-announce')) {
                            const message = node.getAttribute('data-announce');
                            announceToScreenReader(message);
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // ==========================================
    // 10. IMPROVE MOBILE MENU ACCESSIBILITY
    // ==========================================

    function enhanceMobileMenuAccessibility() {
        const menuToggle = document.querySelector('.js-menu-toggle');
        const mobileMenu = document.querySelector('.site-mobile-menu');

        if (!menuToggle || !mobileMenu) return;

        // Agregar ARIA attributes
        menuToggle.setAttribute('aria-label', 'Abrir menú de navegación');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-controls', 'mobile-menu');

        mobileMenu.setAttribute('id', 'mobile-menu');

        // Actualizar ARIA en toggle
        menuToggle.addEventListener('click', function() {
            const isExpanded = mobileMenu.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
            menuToggle.setAttribute('aria-label',
                isExpanded ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
            );

            // Focus en primer link cuando se abre
            if (isExpanded) {
                const firstLink = mobileMenu.querySelector('a');
                if (firstLink) {
                    setTimeout(function() {
                        firstLink.focus();
                    }, 300);
                }
            }
        });
    }

    // ==========================================
    // 11. INITIALIZE ALL ENHANCEMENTS
    // ==========================================

    function initAccessibility() {
        console.log('🔍 Inicializando mejoras de accesibilidad...');

        detectKeyboardUser();
        enableEscapeToClose();
        enhanceDropdownNavigation();
        enhanceSkipLink();
        enhanceFormAccessibility();
        enhanceCarouselAccessibility();
        observeDynamicContent();
        enhanceMobileMenuAccessibility();

        // Trap focus en modals cuando se abren
        const modals = document.querySelectorAll('.modal');
        modals.forEach(function(modal) {
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.attributeName === 'style') {
                        const isVisible = modal.style.display !== 'none';
                        if (isVisible) {
                            trapFocusInModal(modal);
                            // Focus en primer elemento focusable
                            const firstFocusable = modal.querySelector(
                                'button, [href], input, select, textarea'
                            );
                            if (firstFocusable) {
                                setTimeout(function() {
                                    firstFocusable.focus();
                                }, 100);
                            }
                        }
                    }
                });
            });

            observer.observe(modal, { attributes: true });
        });

        console.log('✅ Mejoras de accesibilidad inicializadas');
    }

    // ==========================================
    // INITIALIZE ON DOM READY
    // ==========================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAccessibility);
    } else {
        initAccessibility();
    }

    // Exponer función para anuncios desde otros scripts
    window.announceToScreenReader = announceToScreenReader;

})();
