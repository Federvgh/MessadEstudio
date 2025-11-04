// Sistema de Validación de Formulario - Messad Estudio
// Validación en tiempo real con feedback visual elegante

(function() {
    'use strict';

    // Configuración
    const CONFIG = {
        debounceDelay: 500,
        minNameLength: 3,
        minSubjectLength: 5,
        minMessageLength: 10,
        emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phoneRegex: /^[\d\s\-\+\(\)]+$/
    };

    // Estado del formulario
    const formState = {
        name: { valid: false, touched: false },
        email: { valid: false, touched: false },
        phone: { valid: true, touched: false }, // Opcional
        subject: { valid: false, touched: false },
        message: { valid: false, touched: false }
    };

    let debounceTimers = {};

    /**
     * Inicializar validación de formularios
     */
    function initFormValidation() {
        const forms = document.querySelectorAll('form[action*="formspree"]');

        forms.forEach(form => {
            setupFormValidation(form);
            setupFormSubmission(form);
        });

        console.log('✅ Sistema de validación de formularios inicializado');
    }

    /**
     * Configurar validación para un formulario
     */
    function setupFormValidation(form) {
        const fields = {
            name: form.querySelector('[name="name"]'),
            email: form.querySelector('[name="email"]'),
            phone: form.querySelector('[name="phone"]'),
            subject: form.querySelector('[name="subject"]'),
            message: form.querySelector('[name="message"]')
        };

        // Agregar event listeners
        Object.keys(fields).forEach(fieldName => {
            const field = fields[fieldName];
            if (!field) return;

            // Validación en tiempo real (con debounce)
            field.addEventListener('input', (e) => {
                clearTimeout(debounceTimers[fieldName]);

                debounceTimers[fieldName] = setTimeout(() => {
                    validateField(fieldName, e.target.value, e.target);
                }, CONFIG.debounceDelay);
            });

            // Marcar como touched al hacer blur
            field.addEventListener('blur', (e) => {
                formState[fieldName].touched = true;
                validateField(fieldName, e.target.value, e.target);
            });

            // Limpiar error al hacer focus
            field.addEventListener('focus', (e) => {
                clearFieldError(e.target);
            });
        });
    }

    /**
     * Validar un campo específico
     */
    function validateField(fieldName, value, element) {
        let isValid = false;
        let errorMessage = '';

        switch(fieldName) {
            case 'name':
                isValid = value.trim().length >= CONFIG.minNameLength;
                errorMessage = isValid ? '' : `El nombre debe tener al menos ${CONFIG.minNameLength} caracteres`;
                break;

            case 'email':
                isValid = CONFIG.emailRegex.test(value);
                errorMessage = isValid ? '' : 'Ingresa un email válido';
                break;

            case 'phone':
                // El teléfono es opcional, pero si tiene contenido, validar formato
                isValid = !value || CONFIG.phoneRegex.test(value);
                errorMessage = isValid ? '' : 'Ingresa un teléfono válido';
                break;

            case 'subject':
                isValid = value.trim().length >= CONFIG.minSubjectLength;
                errorMessage = isValid ? '' : `El asunto debe tener al menos ${CONFIG.minSubjectLength} caracteres`;
                break;

            case 'message':
                isValid = value.trim().length >= CONFIG.minMessageLength;
                errorMessage = isValid ? '' : `El mensaje debe tener al menos ${CONFIG.minMessageLength} caracteres`;
                break;
        }

        // Actualizar estado
        formState[fieldName].valid = isValid;

        // Mostrar feedback solo si el campo ha sido tocado
        if (formState[fieldName].touched) {
            if (isValid) {
                showFieldSuccess(element);
            } else {
                showFieldError(element, errorMessage);
            }
        }

        // Actualizar estado del botón de envío
        updateSubmitButton();

        return isValid;
    }

    /**
     * Mostrar error en campo
     */
    function showFieldError(element, message) {
        const formGroup = element.closest('.mb-3') || element.parentElement;

        // Remover estados previos
        element.classList.remove('is-valid');
        element.classList.add('is-invalid');

        // Buscar o crear div de error
        let errorDiv = formGroup.querySelector('.invalid-feedback');

        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            formGroup.appendChild(errorDiv);
        }

        errorDiv.textContent = message;
        errorDiv.style.display = 'block';

        // Animación sutil
        element.style.transition = 'border-color 0.3s ease';
    }

    /**
     * Mostrar éxito en campo
     */
    function showFieldSuccess(element) {
        const formGroup = element.closest('.mb-3') || element.parentElement;

        // Remover estados previos
        element.classList.remove('is-invalid');
        element.classList.add('is-valid');

        // Ocultar mensaje de error
        const errorDiv = formGroup.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }

        // Crear o actualizar feedback de éxito
        let successDiv = formGroup.querySelector('.valid-feedback');

        if (!successDiv) {
            successDiv = document.createElement('div');
            successDiv.className = 'valid-feedback';
            formGroup.appendChild(successDiv);
        }

        successDiv.textContent = '✓ Correcto';
        successDiv.style.display = 'block';
    }

    /**
     * Limpiar error de campo
     */
    function clearFieldError(element) {
        element.classList.remove('is-invalid', 'is-valid');

        const formGroup = element.closest('.mb-3') || element.parentElement;
        const errorDiv = formGroup.querySelector('.invalid-feedback');
        const successDiv = formGroup.querySelector('.valid-feedback');

        if (errorDiv) errorDiv.style.display = 'none';
        if (successDiv) successDiv.style.display = 'none';
    }

    /**
     * Actualizar estado del botón de envío
     */
    function updateSubmitButton() {
        const submitBtn = document.querySelector('input[type="submit"]');
        if (!submitBtn) return;

        // Verificar si todos los campos requeridos son válidos
        const isFormValid = formState.name.valid &&
                           formState.email.valid &&
                           formState.subject.valid &&
                           formState.message.valid;

        submitBtn.disabled = !isFormValid;

        if (isFormValid) {
            submitBtn.classList.remove('btn-secondary');
            submitBtn.classList.add('btn-primary');
            submitBtn.style.opacity = '1';
        } else {
            submitBtn.classList.remove('btn-primary');
            submitBtn.classList.add('btn-secondary');
            submitBtn.style.opacity = '0.6';
        }
    }

    /**
     * Configurar envío del formulario
     */
    function setupFormSubmission(form) {
        const submitBtn = form.querySelector('input[type="submit"]');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validar todos los campos antes de enviar
            const isValid = validateAllFields(form);

            if (!isValid) {
                showFormError('Por favor completa todos los campos correctamente');
                return;
            }

            // Mostrar loading
            showSubmitLoading(submitBtn, true);

            try {
                // Enviar formulario
                const formData = new FormData(form);
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    showFormSuccess(form);

                    // Track en Google Analytics (si está configurado)
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'form_submission', {
                            'event_category': 'engagement',
                            'event_label': 'contact_form'
                        });
                    }
                } else {
                    throw new Error('Error al enviar el formulario');
                }

            } catch (error) {
                console.error('Error al enviar formulario:', error);
                showFormError('Hubo un error al enviar tu mensaje. Por favor intenta nuevamente o contáctanos por WhatsApp.');
            } finally {
                showSubmitLoading(submitBtn, false);
            }
        });
    }

    /**
     * Validar todos los campos del formulario
     */
    function validateAllFields(form) {
        const fields = {
            name: form.querySelector('[name="name"]'),
            email: form.querySelector('[name="email"]'),
            phone: form.querySelector('[name="phone"]'),
            subject: form.querySelector('[name="subject"]'),
            message: form.querySelector('[name="message"]')
        };

        let allValid = true;

        Object.keys(fields).forEach(fieldName => {
            const field = fields[fieldName];
            if (!field) return;

            formState[fieldName].touched = true;
            const isValid = validateField(fieldName, field.value, field);

            if (!isValid && fieldName !== 'phone') { // phone es opcional
                allValid = false;
            }
        });

        return allValid;
    }

    /**
     * Mostrar estado de loading en botón de envío
     */
    function showSubmitLoading(button, show) {
        const originalValue = button.getAttribute('data-original-value') || button.value;

        if (!button.hasAttribute('data-original-value')) {
            button.setAttribute('data-original-value', originalValue);
        }

        if (show) {
            button.disabled = true;
            button.value = 'Enviando...';
            button.style.position = 'relative';

            // Agregar spinner
            const spinner = document.createElement('span');
            spinner.className = 'spinner-border spinner-border-sm me-2';
            spinner.setAttribute('role', 'status');
            spinner.setAttribute('aria-hidden', 'true');
            spinner.id = 'submit-spinner';

            const buttonText = document.createTextNode(' Enviando...');
            button.value = '';

        } else {
            button.disabled = false;
            button.value = originalValue;

            // Remover spinner
            const spinner = document.getElementById('submit-spinner');
            if (spinner) spinner.remove();
        }
    }

    /**
     * Mostrar mensaje de éxito
     */
    function showFormSuccess(form) {
        // Ocultar formulario
        form.style.display = 'none';

        // Crear o mostrar mensaje de éxito
        let successMessage = document.querySelector('.form-success-message');

        if (!successMessage) {
            successMessage = document.createElement('div');
            successMessage.className = 'form-success-message alert alert-success';
            successMessage.innerHTML = `
                <h4 class="alert-heading">¡Mensaje enviado! ✓</h4>
                <p>Gracias por contactarnos. Responderemos tu consulta a la brevedad.</p>
                <hr>
                <p class="mb-0">También puedes contactarnos por WhatsApp para una respuesta más rápida.</p>
            `;
            form.parentElement.appendChild(successMessage);
        }

        successMessage.style.display = 'block';

        // Scroll al mensaje
        successMessage.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        // Animación de entrada
        successMessage.style.opacity = '0';
        successMessage.style.transform = 'translateY(-20px)';

        setTimeout(() => {
            successMessage.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            successMessage.style.opacity = '1';
            successMessage.style.transform = 'translateY(0)';
        }, 100);
    }

    /**
     * Mostrar mensaje de error del formulario
     */
    function showFormError(message) {
        // Crear o mostrar mensaje de error
        let errorMessage = document.querySelector('.form-error-message');

        if (!errorMessage) {
            errorMessage = document.createElement('div');
            errorMessage.className = 'form-error-message alert alert-danger alert-dismissible fade show';
            errorMessage.setAttribute('role', 'alert');
            errorMessage.innerHTML = `
                <strong>Error:</strong> <span class="error-text"></span>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            `;

            const form = document.querySelector('form[action*="formspree"]');
            form.parentElement.insertBefore(errorMessage, form);
        }

        errorMessage.querySelector('.error-text').textContent = message;
        errorMessage.style.display = 'block';

        // Auto-hide después de 5 segundos
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);

        // Scroll al mensaje
        errorMessage.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFormValidation);
    } else {
        initFormValidation();
    }

    // Exportar funciones para uso externo
    window.FormValidation = {
        init: initFormValidation,
        validateField: validateField
    };

})();
