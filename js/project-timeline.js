// Timeline de Proyectos - Messad Estudio
// Visualización de proceso paso a paso con animaciones

(function() {
    'use strict';

    /**
     * Inicializar timeline de proyectos
     */
    function initProjectTimeline() {
        const timeline = document.querySelector('.project-timeline');

        if (!timeline) {
            console.warn('No se encontró el timeline de proyectos');
            return;
        }

        // Setup animaciones al scroll
        setupScrollAnimations();

        // Setup interactividad
        setupTimelineInteractions();

        console.log('✅ Timeline de proyectos inicializado');
    }

    /**
     * Configurar animaciones al scroll
     */
    function setupScrollAnimations() {
        const timelineItems = document.querySelectorAll('.timeline-item');

        if (timelineItems.length === 0) return;

        // Intersection Observer para animaciones
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    // Animar progreso si existe
                    const progressBar = entry.target.querySelector('.timeline-progress-fill');
                    if (progressBar) {
                        const progress = progressBar.getAttribute('data-progress') || '0';
                        setTimeout(() => {
                            progressBar.style.width = progress + '%';
                        }, 300);
                    }
                }
            });
        }, observerOptions);

        timelineItems.forEach(item => {
            observer.observe(item);
        });
    }

    /**
     * Configurar interacciones del timeline
     */
    function setupTimelineInteractions() {
        const timelineItems = document.querySelectorAll('.timeline-item');

        timelineItems.forEach((item, index) => {
            const header = item.querySelector('.timeline-header');

            if (!header) return;

            // Click para expandir/colapsar detalles
            header.addEventListener('click', () => {
                toggleTimelineItem(item);
            });

            // Soporte para teclado
            header.setAttribute('role', 'button');
            header.setAttribute('tabindex', '0');
            header.setAttribute('aria-expanded', 'false');

            header.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleTimelineItem(item);
                }
            });
        });
    }

    /**
     * Toggle item del timeline
     */
    function toggleTimelineItem(item) {
        const header = item.querySelector('.timeline-header');
        const details = item.querySelector('.timeline-details');

        if (!details) return;

        const isExpanded = item.classList.contains('expanded');

        if (isExpanded) {
            // Colapsar
            item.classList.remove('expanded');
            header.setAttribute('aria-expanded', 'false');
            details.style.maxHeight = '0';
        } else {
            // Expandir
            item.classList.add('expanded');
            header.setAttribute('aria-expanded', 'true');

            const scrollHeight = details.scrollHeight;
            details.style.maxHeight = scrollHeight + 'px';

            // Scroll suave al elemento
            setTimeout(() => {
                const rect = item.getBoundingClientRect();
                const isFullyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

                if (!isFullyVisible) {
                    item.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }
            }, 300);
        }
    }

    /**
     * Expandir todos los items del timeline
     */
    function expandAll() {
        const timelineItems = document.querySelectorAll('.timeline-item');

        timelineItems.forEach(item => {
            const header = item.querySelector('.timeline-header');
            const details = item.querySelector('.timeline-details');

            if (!item.classList.contains('expanded') && details) {
                item.classList.add('expanded');
                if (header) header.setAttribute('aria-expanded', 'true');
                details.style.maxHeight = details.scrollHeight + 'px';
            }
        });
    }

    /**
     * Colapsar todos los items del timeline
     */
    function collapseAll() {
        const timelineItems = document.querySelectorAll('.timeline-item');

        timelineItems.forEach(item => {
            const header = item.querySelector('.timeline-header');
            const details = item.querySelector('.timeline-details');

            if (item.classList.contains('expanded') && details) {
                item.classList.remove('expanded');
                if (header) header.setAttribute('aria-expanded', 'false');
                details.style.maxHeight = '0';
            }
        });
    }

    /**
     * Activar step del timeline
     */
    function activateStep(stepIndex) {
        const timelineItems = document.querySelectorAll('.timeline-item');

        timelineItems.forEach((item, index) => {
            if (index < stepIndex) {
                item.classList.add('completed');
                item.classList.remove('active');
            } else if (index === stepIndex) {
                item.classList.add('active');
                item.classList.remove('completed');
            } else {
                item.classList.remove('active', 'completed');
            }
        });
    }

    /**
     * Calcular tiempo total estimado
     */
    function calculateTotalTime() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        let totalDays = 0;

        timelineItems.forEach(item => {
            const duration = item.getAttribute('data-duration');
            if (duration) {
                totalDays += parseInt(duration);
            }
        });

        return totalDays;
    }

    /**
     * Mostrar tiempo total estimado
     */
    function displayTotalTime() {
        const totalDays = calculateTotalTime();
        const totalTimeElement = document.querySelector('.timeline-total-time');

        if (totalTimeElement) {
            const weeks = Math.ceil(totalDays / 7);
            const months = Math.ceil(totalDays / 30);

            totalTimeElement.innerHTML = `
                <strong>Tiempo total estimado:</strong>
                ${totalDays} días (~${weeks} semanas / ~${months} meses)
            `;
        }
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initProjectTimeline();
            displayTotalTime();
        });
    } else {
        initProjectTimeline();
        displayTotalTime();
    }

    // Exportar funciones para uso externo
    window.ProjectTimeline = {
        init: initProjectTimeline,
        expandAll: expandAll,
        collapseAll: collapseAll,
        activateStep: activateStep,
        calculateTotalTime: calculateTotalTime
    };

})();
