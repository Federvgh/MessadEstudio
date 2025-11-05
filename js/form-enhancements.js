/**
 * Form Enhancements - Messad Estudio Calculadora
 * Validaciones en tiempo real, feedback visual, modals y progress bar
 */

// ==========================================
// 1. VALIDACIONES EN TIEMPO REAL
// ==========================================

class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.fields = {};
        this.initValidation();
    }

    initValidation() {
        if (!this.form) return;

        // Validación de dirección
        this.addFieldValidation('direccion', {
            required: true,
            minLength: 5,
            pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+\s+\d+/,
            message: 'Ingresá calle y número (ej: Belgrano 850)',
            onValidate: (value) => value.trim().length >= 5
        });

        // Validación de email
        this.addFieldValidation('email', {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Ingresá un email válido',
            onValidate: (value) => this.isValidEmail(value)
        });

        // Validación de frente (si se ingresa)
        this.addFieldValidation('frente', {
            required: false,
            min: 5,
            max: 100,
            message: 'El frente debe estar entre 5 y 100 metros',
            onValidate: (value) => !value || (parseFloat(value) >= 5 && parseFloat(value) <= 100)
        });

        // Validación de profundidad (si se ingresa)
        this.addFieldValidation('profundidad', {
            required: false,
            min: 10,
            max: 200,
            message: 'La profundidad debe estar entre 10 y 200 metros',
            onValidate: (value) => !value || (parseFloat(value) >= 10 && parseFloat(value) <= 200)
        });

        // Validación de WhatsApp
        this.addFieldValidation('whatsapp', {
            required: false,
            pattern: /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/,
            message: 'Ingresá un número válido (ej: +54 9 385 123 4567)',
            onValidate: (value) => !value || value.replace(/[^\d]/g, '').length >= 8
        });

        // Calcular superficie automáticamente
        this.addDimensionCalculation();
    }

    addFieldValidation(fieldId, rules) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        this.fields[fieldId] = { element: field, rules, isValid: !rules.required };

        // Validar en tiempo real
        field.addEventListener('input', () => this.validateField(fieldId));
        field.addEventListener('blur', () => this.validateField(fieldId, true));

        // Agregar contenedor de feedback si no existe
        if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('field-feedback')) {
            const feedback = document.createElement('div');
            feedback.className = 'field-feedback invalid-feedback';
            feedback.style.display = 'none';
            field.parentNode.insertBefore(feedback, field.nextSibling);
        }
    }

    validateField(fieldId, showError = false) {
        const field = this.fields[fieldId];
        if (!field) return true;

        const value = field.element.value.trim();
        const rules = field.rules;
        const feedback = field.element.nextElementSibling;

        // Campo vacío
        if (rules.required && !value) {
            field.isValid = false;
            if (showError) {
                this.showFieldError(field.element, feedback, rules.message || 'Este campo es requerido');
            }
            return false;
        }

        // Campo opcional vacío
        if (!rules.required && !value) {
            field.isValid = true;
            this.showFieldSuccess(field.element, feedback);
            return true;
        }

        // Validación personalizada
        if (rules.onValidate && !rules.onValidate(value)) {
            field.isValid = false;
            if (showError || value.length > 0) {
                this.showFieldError(field.element, feedback, rules.message);
            }
            return false;
        }

        // Validación exitosa
        field.isValid = true;
        this.showFieldSuccess(field.element, feedback);
        return true;
    }

    showFieldError(element, feedback, message) {
        element.classList.remove('is-valid');
        element.classList.add('is-invalid');
        feedback.textContent = message;
        feedback.style.display = 'block';
        feedback.classList.remove('valid-feedback');
        feedback.classList.add('invalid-feedback');
    }

    showFieldSuccess(element, feedback) {
        element.classList.remove('is-invalid');
        element.classList.add('is-valid');
        feedback.textContent = '✓ Correcto';
        feedback.style.display = 'block';
        feedback.classList.remove('invalid-feedback');
        feedback.classList.add('valid-feedback');
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    validateAll() {
        let allValid = true;
        Object.keys(this.fields).forEach(fieldId => {
            const isFieldValid = this.validateField(fieldId, true);
            if (!isFieldValid) {
                console.log(`❌ Campo inválido: ${fieldId}`, this.fields[fieldId]);
                allValid = false;
            } else {
                console.log(`✅ Campo válido: ${fieldId}`);
            }
        });
        console.log(`📊 Validación final: ${allValid ? 'ÉXITO' : 'FALLA'}`);
        return allValid;
    }

    addDimensionCalculation() {
        const frenteInput = document.getElementById('frente');
        const profundidadInput = document.getElementById('profundidad');
        const superficieDisplay = document.getElementById('superficie-display');
        const superficieValue = document.getElementById('superficie-calculada');

        if (!frenteInput || !profundidadInput) return;

        const calcularSuperficie = () => {
            const frente = parseFloat(frenteInput.value);
            const profundidad = parseFloat(profundidadInput.value);

            if (frente > 0 && profundidad > 0) {
                const superficie = (frente * profundidad).toFixed(2);
                superficieValue.textContent = `${superficie} m²`;
                superficieDisplay.style.display = 'block';

                // Animación de entrada
                superficieDisplay.style.animation = 'slideIn 0.3s ease-out';
            } else {
                superficieDisplay.style.display = 'none';
            }
        };

        frenteInput.addEventListener('input', calcularSuperficie);
        profundidadInput.addEventListener('input', calcularSuperficie);
    }
}

// ==========================================
// 2. PROGRESS BAR PROFESIONAL
// ==========================================

class ProgressBar {
    constructor() {
        this.createProgressBar();
    }

    createProgressBar() {
        // Crear modal con progress bar
        const modalHTML = `
            <div class="modal fade" id="progressModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-body text-center py-5">
                            <div class="mb-4">
                                <div class="spinner-border text-primary" role="status" style="width: 4rem; height: 4rem;">
                                    <span class="visually-hidden">Cargando...</span>
                                </div>
                            </div>
                            <h4 class="mb-3" id="progressTitle">Procesando tu solicitud...</h4>
                            <p class="text-muted mb-4" id="progressMessage" style="font-size: 0.95rem; line-height: 1.6;">Esto tomará solo unos segundos</p>

                            <div class="progress" style="height: 8px;">
                                <div id="progressBar" class="progress-bar progress-bar-striped progress-bar-animated"
                                     role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>

                            <div class="mt-3">
                                <small class="text-muted" id="progressPercent">0%</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insertar modal en el body
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = modalHTML;
        document.body.appendChild(tempDiv.firstElementChild);

        this.modal = new bootstrap.Modal(document.getElementById('progressModal'));
        this.progressBar = document.getElementById('progressBar');
        this.progressPercent = document.getElementById('progressPercent');
        this.progressTitle = document.getElementById('progressTitle');
        this.progressMessage = document.getElementById('progressMessage');
    }

    show(title = 'Procesando tu solicitud...', message = 'Esto tomará solo unos segundos') {
        this.progressTitle.textContent = title;
        this.progressMessage.textContent = message;
        this.setProgress(0);
        this.modal.show();
        this.simulateProgress();
    }

    hide() {
        this.modal.hide();
    }

    setProgress(percent) {
        this.progressBar.style.width = `${percent}%`;
        this.progressBar.setAttribute('aria-valuenow', percent);
        this.progressPercent.textContent = `${Math.round(percent)}%`;
    }

    simulateProgress() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 90) {
                progress = 90;
                clearInterval(interval);
            }
            this.setProgress(progress);
        }, 300);

        // Guardar intervalo para poder completarlo después
        this.progressInterval = interval;
    }

    complete() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
        this.setProgress(100);
        setTimeout(() => {
            this.hide();
            // Asegurar que el backdrop se elimine completamente
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => backdrop.remove());
        }, 500);
    }
}

// ==========================================
// 3. MODALS DE ÉXITO Y ERROR
// ==========================================

class NotificationModal {
    constructor() {
        this.createModals();
    }

    createModals() {
        // Modal de éxito
        const successHTML = `
            <div class="modal fade" id="successModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-body text-center py-5">
                            <div class="mb-4">
                                <div class="success-checkmark" style="width: 80px; height: 80px; margin: 0 auto;">
                                    <div class="check-icon" style="font-size: 4rem; color: #28a745;">
                                        ✓
                                    </div>
                                </div>
                            </div>
                            <h3 class="mb-3">¡Solicitud Enviada!</h3>
                            <p class="text-muted mb-4" id="successMessage">
                                Te enviaremos el análisis normativo de tu lote a tu email en las próximas 24 horas.
                            </p>
                            <div class="alert alert-info mb-3">
                                <strong>📧 Revisá tu bandeja de entrada</strong><br>
                                <small>Si no lo ves, chequeá spam/correo no deseado</small>
                            </div>
                            <div class="alert alert-success">
                                <small><strong>✅ Esta ventana se cerrará automáticamente en 3 segundos...</strong></small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Modal de error
        const errorHTML = `
            <div class="modal fade" id="errorModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-body text-center py-5">
                            <div class="mb-4">
                                <div class="error-icon" style="font-size: 4rem; color: #dc3545;">
                                    ✕
                                </div>
                            </div>
                            <h3 class="mb-3">Algo salió mal</h3>
                            <p class="text-muted mb-4" id="errorMessage">
                                Hubo un problema al enviar tu solicitud. Por favor intentá nuevamente.
                            </p>
                            <div class="alert alert-warning">
                                <strong>💬 ¿Necesitás ayuda?</strong><br>
                                <small>Contactanos por WhatsApp y te ayudamos inmediatamente</small>
                            </div>
                            <div class="d-grid gap-2">
                                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
                                <a href="https://wa.me/5493854123456" class="btn btn-success" target="_blank">
                                    📱 Contactar por WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insertar modals
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = successHTML + errorHTML;

        // Agregar cada modal al body (no el div temporal)
        while (tempDiv.firstChild) {
            document.body.appendChild(tempDiv.firstChild);
        }

        this.successModal = new bootstrap.Modal(document.getElementById('successModal'));
        this.errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
    }

    showSuccess(message = null) {
        if (message) {
            document.getElementById('successMessage').textContent = message;
        }
        this.successModal.show();

        // Auto-redirect: Redirigir al home en 3 segundos automáticamente
        setTimeout(() => {
            console.log('✅ Redirigiendo al home en 3 segundos...');
            this.successModal.hide();

            // Limpiar backdrops y estilos de modal
            setTimeout(() => {
                const backdrops = document.querySelectorAll('.modal-backdrop');
                backdrops.forEach(backdrop => backdrop.remove());
                document.body.classList.remove('modal-open');
                document.body.style.removeProperty('padding-right');
                document.body.style.removeProperty('overflow');

                // Redirigir al home
                window.location.href = 'index.html';
            }, 300);
        }, 3000);
    }

    showError(message = null) {
        if (message) {
            document.getElementById('errorMessage').textContent = message;
        }
        this.errorModal.show();
    }
}

// ==========================================
// 4. INICIALIZACIÓN Y EXPORTACIÓN
// ==========================================

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFormEnhancements);
} else {
    initFormEnhancements();
}

function initFormEnhancements() {
    // Crear instancias
    window.formValidator = new FormValidator('analisis-form');
    window.progressBar = new ProgressBar();
    window.notificationModal = new NotificationModal();

    console.log('✅ Form enhancements initialized');
    console.log('✅ formValidator:', window.formValidator);
    console.log('✅ progressBar:', window.progressBar);
    console.log('✅ notificationModal:', window.notificationModal);
}
