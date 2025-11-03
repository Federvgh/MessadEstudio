// Simple Lead Capture para Messad Estudio
// Envía directamente a n8n (que guarda en Google Sheets)

/**
 * Enviar datos al webhook de n8n
 * @param {Object} leadData - Datos del formulario
 * @returns {Promise<Object>} - Resultado del envío
 */
async function enviarLead(leadData) {
    try {
        // URL del webhook de n8n
        const N8N_WEBHOOK_URL = 'https://federvgh.app.n8n.cloud/webhook/messad-lead-capture';

        console.log('📤 Enviando lead a n8n...', leadData);

        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(leadData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('✅ Lead enviado exitosamente:', result);
        return { success: true, data: result };

    } catch (error) {
        console.error('❌ Error al enviar lead:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Función principal para enviar el formulario
 * @param {Object} leadData - Datos del formulario
 */
async function submitLead(leadData) {
    try {
        // Mostrar loading
        showLoading(true);

        // Validar que tenga los campos requeridos
        if (!leadData.direccion || leadData.direccion.length < 5) {
            throw new Error('Dirección inválida');
        }

        const email = leadData.email_cliente || leadData.email;
        if (!email || !email.includes('@')) {
            throw new Error('Email inválido');
        }

        // Si se ingresaron dimensiones, validar
        if (leadData.frente || leadData.profundidad) {
            if (!leadData.frente || !leadData.profundidad) {
                throw new Error('Debes ingresar tanto el frente como la profundidad');
            }
            if (leadData.frente < 5 || leadData.frente > 100) {
                throw new Error('El frente debe estar entre 5 y 100 metros');
            }
            if (leadData.profundidad < 10 || leadData.profundidad > 200) {
                throw new Error('La profundidad debe estar entre 10 y 200 metros');
            }
        }

        // Enviar a n8n (que lo guarda en Google Sheets y genera análisis)
        const result = await enviarLead(leadData);

        if (result.success) {
            console.log('✅ Lead procesado correctamente');

            // Guardar en localStorage como backup
            guardarEnLocalStorage(leadData);

            // Mostrar mensaje de éxito
            mostrarExito();

            // Track en Google Analytics (si está configurado)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'lead_submitted', {
                    'event_category': 'engagement',
                    'event_label': leadData.direccion,
                    'value': leadData.superficie || 0
                });
            }

            return { success: true };

        } else {
            throw new Error(result.error || 'Error al procesar el formulario');
        }

    } catch (error) {
        console.error('❌ Error en submitLead:', error);
        mostrarError(error.message);
        return { success: false, error: error.message };

    } finally {
        showLoading(false);
    }
}

// Helpers UI
function showLoading(show) {
    const btn = document.getElementById('submit-btn');
    if (btn) {
        if (show) {
            btn.disabled = true;
            btn.innerHTML = '⏳ Enviando...';
        } else {
            btn.disabled = false;
            btn.innerHTML = '📨 Solicitar Análisis Gratis';
        }
    }
}

function mostrarExito() {
    // Ocultar formulario
    const form = document.getElementById('lead-form');
    if (form) {
        form.style.display = 'none';
    }

    // Mostrar mensaje de éxito
    const successMsg = document.getElementById('success-message');
    if (successMsg) {
        successMsg.style.display = 'block';

        // Scroll al mensaje
        successMsg.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}

function mostrarError(mensaje) {
    alert(`❌ ${mensaje || 'Hubo un error al enviar tu solicitud'}. Por favor intentá nuevamente o contactanos por WhatsApp.`);
}

// Guardar también en localStorage como backup
function guardarEnLocalStorage(leadData) {
    try {
        let leads = JSON.parse(localStorage.getItem('messad_leads') || '[]');
        leads.push({
            ...leadData,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('messad_leads', JSON.stringify(leads));
        console.log('💾 Guardado en localStorage como backup');
    } catch (error) {
        console.error('Error guardando en localStorage:', error);
    }
}

// Exportar funciones
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        enviarLead,
        submitLead
    };
}
