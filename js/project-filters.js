// Sistema de Filtrado de Proyectos - Messad Estudio
// Filtrado con animaciones smooth y transiciones elegantes

(function() {
    'use strict';

    // Configuración
    const CONFIG = {
        animationDuration: 400,
        filterDelay: 150,
        defaultFilter: 'all'
    };

    // Estado
    let currentFilter = CONFIG.defaultFilter;
    let isAnimating = false;

    /**
     * Inicializar el sistema de filtros
     */
    function initFilters() {
        const filterContainer = document.querySelector('.project-filters');
        if (!filterContainer) {
            console.warn('No se encontró contenedor de filtros');
            return;
        }

        // Agregar event listeners a los botones de filtro
        const filterButtons = filterContainer.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', handleFilterClick);
        });

        // Inicializar contadores
        updateFilterCounts();

        console.log('✅ Sistema de filtros inicializado');
    }

    /**
     * Manejar clic en botón de filtro
     */
    function handleFilterClick(e) {
        e.preventDefault();

        if (isAnimating) return;

        const button = e.currentTarget;
        const filter = button.getAttribute('data-filter');

        if (filter === currentFilter) return;

        // Actualizar UI de botones
        updateActiveButton(button);

        // Aplicar filtro con animación
        applyFilter(filter);
    }

    /**
     * Actualizar botón activo
     */
    function updateActiveButton(activeButton) {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        });

        activeButton.classList.add('active');
        activeButton.setAttribute('aria-pressed', 'true');
    }

    /**
     * Aplicar filtro con animación
     */
    async function applyFilter(filter) {
        isAnimating = true;
        currentFilter = filter;

        const projects = document.querySelectorAll('.single-portfolio');
        const projectsArray = Array.from(projects);

        // Fase 1: Fade out todos los proyectos
        await fadeOutProjects(projectsArray);

        // Fase 2: Filtrar proyectos
        const { visible, hidden } = filterProjects(projectsArray, filter);

        // Fase 3: Reorganizar y fade in proyectos visibles
        await fadeInProjects(visible, hidden);

        // Actualizar contador
        updateResultCount(visible.length);

        isAnimating = false;
    }

    /**
     * Fade out de proyectos
     */
    function fadeOutProjects(projects) {
        return new Promise(resolve => {
            projects.forEach((project, index) => {
                setTimeout(() => {
                    project.style.opacity = '0';
                    project.style.transform = 'scale(0.9)';
                }, index * 30);
            });

            setTimeout(resolve, projects.length * 30 + CONFIG.animationDuration);
        });
    }

    /**
     * Filtrar proyectos según categoría
     */
    function filterProjects(projects, filter) {
        const visible = [];
        const hidden = [];

        projects.forEach(project => {
            const categories = project.getAttribute('data-category');
            const size = project.getAttribute('data-size');

            let shouldShow = false;

            if (filter === 'all') {
                shouldShow = true;
            } else if (filter === 'residencial' || filter === 'comercial' || filter === 'vivienda' || filter === 'institucional') {
                shouldShow = categories && categories.includes(filter);
            } else if (filter === 'small' || filter === 'medium' || filter === 'large') {
                shouldShow = size === filter;
            }

            if (shouldShow) {
                visible.push(project);
            } else {
                hidden.push(project);
            }
        });

        return { visible, hidden };
    }

    /**
     * Fade in de proyectos visibles
     */
    function fadeInProjects(visible, hidden) {
        return new Promise(resolve => {
            // Ocultar proyectos no visibles
            hidden.forEach(project => {
                project.style.display = 'none';
            });

            // Mostrar y animar proyectos visibles
            visible.forEach((project, index) => {
                project.style.display = 'block';

                setTimeout(() => {
                    project.style.opacity = '1';
                    project.style.transform = 'scale(1)';
                }, index * 50 + CONFIG.filterDelay);
            });

            setTimeout(resolve, visible.length * 50 + CONFIG.filterDelay + CONFIG.animationDuration);
        });
    }

    /**
     * Actualizar contador de resultados
     */
    function updateResultCount(count) {
        const counter = document.querySelector('.results-count');
        if (counter) {
            const text = count === 1 ? 'proyecto' : 'proyectos';
            counter.textContent = `${count} ${text}`;

            // Animación del contador
            counter.style.transform = 'scale(1.1)';
            setTimeout(() => {
                counter.style.transform = 'scale(1)';
            }, 200);
        }
    }

    /**
     * Actualizar contadores de cada filtro
     */
    function updateFilterCounts() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projects = document.querySelectorAll('.single-portfolio');

        filterButtons.forEach(btn => {
            const filter = btn.getAttribute('data-filter');

            if (filter === 'all') {
                const count = projects.length;
                updateButtonCount(btn, count);
            } else {
                const count = Array.from(projects).filter(project => {
                    const categories = project.getAttribute('data-category');
                    const size = project.getAttribute('data-size');

                    if (filter === 'small' || filter === 'medium' || filter === 'large') {
                        return size === filter;
                    } else {
                        return categories && categories.includes(filter);
                    }
                }).length;

                updateButtonCount(btn, count);
            }
        });
    }

    /**
     * Actualizar contador en botón
     */
    function updateButtonCount(button, count) {
        const countSpan = button.querySelector('.count');
        if (countSpan) {
            countSpan.textContent = count;
        }
    }

    /**
     * Búsqueda de proyectos
     */
    function initSearch() {
        const searchInput = document.querySelector('.project-search');
        if (!searchInput) return;

        let searchTimeout;

        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);

            searchTimeout = setTimeout(() => {
                const searchTerm = e.target.value.toLowerCase().trim();
                searchProjects(searchTerm);
            }, 300);
        });
    }

    /**
     * Buscar proyectos por término
     */
    function searchProjects(term) {
        const projects = document.querySelectorAll('.single-portfolio');
        let visibleCount = 0;

        projects.forEach(project => {
            const title = project.querySelector('h3')?.textContent.toLowerCase() || '';
            const category = project.querySelector('.cat')?.textContent.toLowerCase() || '';
            const dataCategory = project.getAttribute('data-category') || '';

            const matches = !term ||
                           title.includes(term) ||
                           category.includes(term) ||
                           dataCategory.includes(term);

            if (matches) {
                project.style.display = 'block';
                setTimeout(() => {
                    project.style.opacity = '1';
                    project.style.transform = 'scale(1)';
                }, 50);
                visibleCount++;
            } else {
                project.style.opacity = '0';
                project.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    project.style.display = 'none';
                }, CONFIG.animationDuration);
            }
        });

        updateResultCount(visibleCount);
    }

    /**
     * Agregar estilos CSS inline para transiciones
     */
    function addTransitionStyles() {
        const projects = document.querySelectorAll('.single-portfolio');
        projects.forEach(project => {
            project.style.transition = `opacity ${CONFIG.animationDuration}ms ease, transform ${CONFIG.animationDuration}ms ease`;
            project.style.opacity = '1';
            project.style.transform = 'scale(1)';
        });

        // Estilos para contador
        const counter = document.querySelector('.results-count');
        if (counter) {
            counter.style.transition = 'transform 200ms ease';
        }
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initFilters();
            initSearch();
            addTransitionStyles();
        });
    } else {
        initFilters();
        initSearch();
        addTransitionStyles();
    }

    // Exportar funciones para uso externo
    window.ProjectFilters = {
        init: initFilters,
        applyFilter: applyFilter,
        search: searchProjects
    };

})();
