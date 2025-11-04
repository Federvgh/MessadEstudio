// Sistema de FAQ Acordeón - Messad Estudio
// Acordeones expandibles con animaciones smooth

(function() {
    'use strict';

    // Configuración
    const CONFIG = {
        animationDuration: 300,
        allowMultiple: false, // Permitir múltiples acordeones abiertos al mismo tiempo
        scrollOffset: 100 // Offset para el scroll automático
    };

    /**
     * Inicializar acordeones de FAQ
     */
    function initFAQAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');

        if (faqItems.length === 0) {
            console.warn('No se encontraron elementos FAQ');
            return;
        }

        faqItems.forEach((item, index) => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            if (!question || !answer) return;

            // Configurar atributos ARIA para accesibilidad
            const itemId = `faq-${index}`;
            question.setAttribute('id', `${itemId}-question`);
            question.setAttribute('aria-controls', `${itemId}-answer`);
            question.setAttribute('aria-expanded', 'false');
            question.setAttribute('role', 'button');
            question.setAttribute('tabindex', '0');

            answer.setAttribute('id', `${itemId}-answer`);
            answer.setAttribute('aria-labelledby', `${itemId}-question`);
            answer.setAttribute('role', 'region');

            // Establecer altura inicial
            answer.style.maxHeight = '0';
            answer.style.overflow = 'hidden';
            answer.style.transition = `max-height ${CONFIG.animationDuration}ms ease`;

            // Event listeners
            question.addEventListener('click', () => toggleFAQ(item, question, answer));

            // Soporte para teclado
            question.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleFAQ(item, question, answer);
                }
            });
        });

        console.log('✅ Sistema de FAQ inicializado');
    }

    /**
     * Toggle FAQ item
     */
    function toggleFAQ(item, question, answer) {
        const isOpen = item.classList.contains('active');

        // Si no se permite múltiples abiertos, cerrar todos los demás
        if (!CONFIG.allowMultiple && !isOpen) {
            closeAllFAQs();
        }

        if (isOpen) {
            closeFAQ(item, question, answer);
        } else {
            openFAQ(item, question, answer);
        }
    }

    /**
     * Abrir FAQ item
     */
    function openFAQ(item, question, answer) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');

        // Calcular altura del contenido
        const scrollHeight = answer.scrollHeight;
        answer.style.maxHeight = scrollHeight + 'px';

        // Animación del ícono
        const icon = question.querySelector('.faq-icon');
        if (icon) {
            icon.style.transform = 'rotate(180deg)';
        }

        // Scroll suave al elemento si es necesario
        setTimeout(() => {
            const rect = item.getBoundingClientRect();
            const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

            if (!isVisible) {
                const offset = item.offsetTop - CONFIG.scrollOffset;
                window.scrollTo({
                    top: offset,
                    behavior: 'smooth'
                });
            }
        }, CONFIG.animationDuration / 2);
    }

    /**
     * Cerrar FAQ item
     */
    function closeFAQ(item, question, answer) {
        item.classList.remove('active');
        question.setAttribute('aria-expanded', 'false');

        answer.style.maxHeight = '0';

        // Animación del ícono
        const icon = question.querySelector('.faq-icon');
        if (icon) {
            icon.style.transform = 'rotate(0deg)';
        }
    }

    /**
     * Cerrar todos los FAQs
     */
    function closeAllFAQs() {
        const allItems = document.querySelectorAll('.faq-item.active');

        allItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            if (question && answer) {
                closeFAQ(item, question, answer);
            }
        });
    }

    /**
     * Abrir FAQ por índice o ID
     */
    function openFAQByIndex(index) {
        const faqItems = document.querySelectorAll('.faq-item');

        if (index >= 0 && index < faqItems.length) {
            const item = faqItems[index];
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            if (question && answer) {
                openFAQ(item, question, answer);
            }
        }
    }

    /**
     * Filtrar FAQs por categoría
     */
    function filterFAQsByCategory(category) {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');

            if (category === 'all' || itemCategory === category) {
                item.style.display = 'block';
                item.style.opacity = '0';

                setTimeout(() => {
                    item.style.opacity = '1';
                }, 50);
            } else {
                item.style.opacity = '0';

                setTimeout(() => {
                    item.style.display = 'none';
                }, CONFIG.animationDuration);
            }
        });
    }

    /**
     * Búsqueda en FAQs
     */
    function searchFAQs(searchTerm) {
        const faqItems = document.querySelectorAll('.faq-item');
        const term = searchTerm.toLowerCase().trim();

        let visibleCount = 0;

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            const questionText = question?.textContent.toLowerCase() || '';
            const answerText = answer?.textContent.toLowerCase() || '';

            const matches = !term ||
                           questionText.includes(term) ||
                           answerText.includes(term);

            if (matches) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                }, 50);
                visibleCount++;
            } else {
                item.style.opacity = '0';
                setTimeout(() => {
                    item.style.display = 'none';
                }, CONFIG.animationDuration);
            }
        });

        // Actualizar mensaje de "no resultados"
        updateNoResults(visibleCount);
    }

    /**
     * Actualizar mensaje de "no resultados"
     */
    function updateNoResults(count) {
        let noResults = document.querySelector('.faq-no-results');

        if (count === 0) {
            if (!noResults) {
                noResults = document.createElement('div');
                noResults.className = 'faq-no-results text-center py-5';
                noResults.innerHTML = `
                    <p class="text-muted">No se encontraron preguntas que coincidan con tu búsqueda.</p>
                `;

                const faqContainer = document.querySelector('.faq-container');
                if (faqContainer) {
                    faqContainer.appendChild(noResults);
                }
            }
            noResults.style.display = 'block';
        } else {
            if (noResults) {
                noResults.style.display = 'none';
            }
        }
    }

    /**
     * Inicializar búsqueda de FAQs
     */
    function initFAQSearch() {
        const searchInput = document.querySelector('.faq-search-input');

        if (!searchInput) return;

        let searchTimeout;

        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);

            searchTimeout = setTimeout(() => {
                searchFAQs(e.target.value);
            }, 300);
        });
    }

    /**
     * Inicializar filtros de categoría
     */
    function initCategoryFilters() {
        const filterButtons = document.querySelectorAll('.faq-category-filter');

        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();

                // Actualizar botón activo
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filtrar FAQs
                const category = btn.getAttribute('data-category');
                filterFAQsByCategory(category);
            });
        });
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initFAQAccordion();
            initFAQSearch();
            initCategoryFilters();
        });
    } else {
        initFAQAccordion();
        initFAQSearch();
        initCategoryFilters();
    }

    // Exportar funciones para uso externo
    window.FAQAccordion = {
        init: initFAQAccordion,
        open: openFAQByIndex,
        closeAll: closeAllFAQs,
        filter: filterFAQsByCategory,
        search: searchFAQs
    };

})();
