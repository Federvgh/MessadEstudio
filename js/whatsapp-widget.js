// Widget de WhatsApp Flotante - Messad Estudio
// Botón flotante elegante con animaciones y mensajes contextuales

(function() {
    'use strict';

    // Configuración
    const CONFIG = {
        phoneNumber: '5492924392327', // Formato internacional sin símbolos
        defaultMessage: '¡Hola! Me gustaría consultar sobre sus servicios de arquitectura.',
        position: 'bottom-right', // 'bottom-right' o 'bottom-left'
        showDelay: 2000, // Mostrar después de 2 segundos
        pulseInterval: 5000, // Pulsar cada 5 segundos
        tooltipDelay: 3000 // Mostrar tooltip después de 3 segundos
    };

    // Mensajes contextuales según la página
    const contextualMessages = {
        'index.html': '¡Hola! Me gustaría consultar sobre sus servicios de arquitectura.',
        'projects.html': '¡Hola! Quisiera información sobre sus proyectos.',
        'services.html': '¡Hola! Me interesa conocer más sobre sus servicios.',
        'contact.html': '¡Hola! Quisiera contactarlos.',
        'solicitar-analisis.html': '¡Hola! Tengo consultas sobre el análisis de mi terreno.',
        'about.html': '¡Hola! Me gustaría conocer más sobre el estudio.'
    };

    /**
     * Inicializar widget de WhatsApp
     */
    function initWhatsAppWidget() {
        createWhatsAppButton();
        setupEventListeners();
        scheduleAnimations();

        console.log('✅ Widget de WhatsApp inicializado');
    }

    /**
     * Crear botón de WhatsApp
     */
    function createWhatsAppButton() {
        // Verificar si ya existe
        if (document.getElementById('whatsapp-widget')) return;

        // Crear contenedor
        const widget = document.createElement('div');
        widget.id = 'whatsapp-widget';
        widget.className = `whatsapp-widget ${CONFIG.position}`;
        widget.setAttribute('role', 'button');
        widget.setAttribute('aria-label', 'Contactar por WhatsApp');
        widget.setAttribute('tabindex', '0');

        // SVG del ícono de WhatsApp
        widget.innerHTML = `
            <div class="whatsapp-button">
                <svg viewBox="0 0 32 32" class="whatsapp-icon">
                    <path fill="currentColor" d="M16 0c-8.837 0-16 7.163-16 16 0 2.825 0.737 5.607 2.137 8.048l-2.137 7.952 7.933-2.127c2.42 1.37 5.173 2.127 8.067 2.127 8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 29.467c-2.482 0-4.908-0.646-7.07-1.87l-0.507-0.292-4.713 1.262 1.262-4.669-0.292-0.508c-1.207-2.100-1.847-4.507-1.847-6.957 0-7.51 6.11-13.62 13.62-13.62s13.62 6.11 13.62 13.62-6.11 13.62-13.62 13.62zM21.305 19.26c-0.346-0.174-2.049-1.007-2.366-1.123-0.316-0.117-0.547-0.174-0.776 0.174s-0.892 1.123-1.094 1.347c-0.201 0.223-0.402 0.25-0.748 0.076-0.346-0.174-1.461-0.537-2.785-1.711-1.030-0.913-1.725-2.040-1.927-2.387-0.201-0.346-0.021-0.533 0.152-0.707 0.156-0.155 0.346-0.402 0.52-0.603 0.174-0.201 0.232-0.346 0.348-0.575 0.117-0.23 0.058-0.431-0.029-0.603-0.087-0.174-0.776-1.87-1.063-2.565-0.280-0.672-0.56-0.58-0.776-0.591-0.201-0.010-0.431-0.012-0.661-0.012s-0.603 0.087-0.92 0.431c-0.316 0.346-1.206 1.179-1.206 2.873s1.235 3.333 1.406 3.561c0.174 0.23 2.384 3.697 5.846 5.067 0.817 0.323 1.455 0.516 1.952 0.661 0.817 0.262 1.561 0.225 2.15 0.137 0.655-0.097 2.049-0.835 2.335-1.642 0.288-0.807 0.288-1.501 0.201-1.642-0.087-0.145-0.316-0.23-0.661-0.402z"/>
                </svg>
                <span class="pulse-ring"></span>
                <span class="pulse-ring-2"></span>
            </div>
            <div class="whatsapp-tooltip">
                <span class="tooltip-text">¿Necesitas ayuda? Escríbenos</span>
                <span class="tooltip-arrow"></span>
            </div>
        `;

        // Agregar al body
        document.body.appendChild(widget);

        // Mostrar con delay
        setTimeout(() => {
            widget.classList.add('show');
        }, CONFIG.showDelay);
    }

    /**
     * Configurar event listeners
     */
    function setupEventListeners() {
        const widget = document.getElementById('whatsapp-widget');
        if (!widget) return;

        // Click en el botón
        widget.addEventListener('click', handleWhatsAppClick);

        // Enter key
        widget.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleWhatsAppClick();
            }
        });

        // Hover effects
        widget.addEventListener('mouseenter', () => {
            widget.classList.add('hover');
        });

        widget.addEventListener('mouseleave', () => {
            widget.classList.remove('hover');
        });

        // Mostrar tooltip después de un delay
        setTimeout(() => {
            showTooltip();
        }, CONFIG.tooltipDelay);
    }

    /**
     * Manejar click en botón de WhatsApp
     */
    function handleWhatsAppClick() {
        const message = getContextualMessage();
        const whatsappUrl = generateWhatsAppUrl(message);

        // Abrir WhatsApp
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

        // Track en Google Analytics (si está configurado)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'whatsapp_click', {
                'event_category': 'engagement',
                'event_label': window.location.pathname
            });
        }

        // Animación de click
        const widget = document.getElementById('whatsapp-widget');
        widget.classList.add('clicked');

        setTimeout(() => {
            widget.classList.remove('clicked');
        }, 300);
    }

    /**
     * Obtener mensaje contextual según la página
     */
    function getContextualMessage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        return contextualMessages[currentPage] || CONFIG.defaultMessage;
    }

    /**
     * Generar URL de WhatsApp
     */
    function generateWhatsAppUrl(message) {
        const encodedMessage = encodeURIComponent(message);

        // Detectar si es móvil o desktop
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
            return `whatsapp://send?phone=${CONFIG.phoneNumber}&text=${encodedMessage}`;
        } else {
            return `https://web.whatsapp.com/send?phone=${CONFIG.phoneNumber}&text=${encodedMessage}`;
        }
    }

    /**
     * Mostrar tooltip
     */
    function showTooltip() {
        const widget = document.getElementById('whatsapp-widget');
        if (!widget) return;

        const tooltip = widget.querySelector('.whatsapp-tooltip');
        if (!tooltip) return;

        tooltip.classList.add('show');

        // Ocultar después de 5 segundos
        setTimeout(() => {
            tooltip.classList.remove('show');
        }, 5000);
    }

    /**
     * Programar animaciones periódicas
     */
    function scheduleAnimations() {
        // Pulsar el botón cada X segundos
        setInterval(() => {
            const widget = document.getElementById('whatsapp-widget');
            if (!widget) return;

            widget.classList.add('pulse-animation');

            setTimeout(() => {
                widget.classList.remove('pulse-animation');
            }, 1000);
        }, CONFIG.pulseInterval);
    }

    /**
     * Ocultar widget (útil para ciertas páginas)
     */
    function hideWidget() {
        const widget = document.getElementById('whatsapp-widget');
        if (widget) {
            widget.style.display = 'none';
        }
    }

    /**
     * Mostrar widget
     */
    function showWidget() {
        const widget = document.getElementById('whatsapp-widget');
        if (widget) {
            widget.style.display = 'flex';
        }
    }

    /**
     * Actualizar número de teléfono
     */
    function updatePhoneNumber(newNumber) {
        CONFIG.phoneNumber = newNumber;
    }

    /**
     * Actualizar mensaje por defecto
     */
    function updateDefaultMessage(newMessage) {
        CONFIG.defaultMessage = newMessage;
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWhatsAppWidget);
    } else {
        initWhatsAppWidget();
    }

    // Exportar funciones para uso externo
    window.WhatsAppWidget = {
        init: initWhatsAppWidget,
        hide: hideWidget,
        show: showWidget,
        updatePhone: updatePhoneNumber,
        updateMessage: updateDefaultMessage
    };

})();
