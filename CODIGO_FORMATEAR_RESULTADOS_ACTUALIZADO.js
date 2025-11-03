// ============================================================================
// Formatear Resultados para Email - ACTUALIZADO PARA NODO ANTHROPIC NATIVO
// ============================================================================
// Recibe la respuesta de Claude y formatea el email final
// ============================================================================

const items = $input.all();

// ============================================================================
// 1. OBTENER RESPUESTA DE CLAUDE (NODO NATIVO)
// ============================================================================

const claudeResponse = items[0].json;

// CAMBIO PRINCIPAL: Con nodo Anthropic nativo y Simplify Output: true
let analisis = '';

if (claudeResponse.response) {
  // ✅ NUEVO: Nodo Anthropic con Simplify Output: true
  analisis = claudeResponse.response;
} else if (claudeResponse.content && Array.isArray(claudeResponse.content)) {
  // Fallback: Si Simplify Output está en false
  analisis = claudeResponse.content
    .filter(block => block.type === 'text')
    .map(block => block.text)
    .join('\n\n');
} else if (typeof claudeResponse.content === 'string') {
  analisis = claudeResponse.content;
} else {
  console.error('❌ Formato de respuesta de Claude no reconocido:', claudeResponse);
  analisis = 'Error: No se pudo obtener el análisis de Claude';
}

console.log('📄 Análisis de Claude obtenido:', analisis.substring(0, 200) + '...');

// ============================================================================
// 2. OBTENER DATOS DEL WEBHOOK
// ============================================================================

const webhookData = $('Webhook Trigger').first().json.body;

const direccion = webhookData.direccion;
const frente = webhookData.frente || 'No especificado';
const profundidad = webhookData.profundidad || 'No especificado';
const superficie = webhookData.superficie || 'No especificada';
const email_cliente = webhookData.email_cliente;
const nombre = webhookData.nombre || 'Cliente';
const whatsapp = webhookData.whatsapp || 'No proporcionado';

// ============================================================================
// 3. OBTENER DATOS DEL CONTEXTO
// ============================================================================

const contextoData = $('Preparar Contexto').first().json;

const zona = contextoData.zona || 'No determinada';
const barrio_catastral = contextoData.barrio_catastral || 'No disponible';
const superficie_catastral = contextoData.superficie_catastral || 'No disponible';
const padron_catastral = contextoData.padron_catastral || 'No disponible';
const lat = contextoData.lat;
const lon = contextoData.lon;

// ============================================================================
// 4. PREPARAR TIMESTAMP
// ============================================================================

const fecha = new Date().toLocaleDateString('es-AR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
});

const hora = new Date().toLocaleTimeString('es-AR', {
  hour: '2-digit',
  minute: '2-digit'
});

// ============================================================================
// 5. FORMATEAR EMAIL HTML
// ============================================================================

const emailHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Análisis Normativo Urbanístico</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      border-bottom: 3px solid #2c5aa0;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #2c5aa0;
      margin: 0;
      font-size: 28px;
    }
    .header p {
      color: #666;
      margin: 10px 0 0 0;
    }
    .info-section {
      background-color: #f8f9fa;
      border-left: 4px solid #2c5aa0;
      padding: 15px;
      margin: 20px 0;
    }
    .info-section h3 {
      margin-top: 0;
      color: #2c5aa0;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 10px;
    }
    .info-item {
      padding: 8px 0;
    }
    .info-label {
      font-weight: 600;
      color: #555;
    }
    .analysis {
      margin: 30px 0;
      white-space: pre-wrap;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      color: #666;
      font-size: 14px;
      text-align: center;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      margin-left: 10px;
    }
    .badge-success {
      background-color: #d4edda;
      color: #155724;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📋 Análisis Normativo Urbanístico</h1>
      <p>Messad Estudio - Arquitectura y Urbanismo</p>
      <p style="font-size: 14px; color: #999;">Generado: ${fecha} a las ${hora}</p>
    </div>

    <div class="info-section">
      <h3>📍 Información del Lote</h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Dirección:</span><br>
          ${direccion}
        </div>
        <div class="info-item">
          <span class="info-label">Zona:</span><br>
          ${zona}
        </div>
        <div class="info-item">
          <span class="info-label">Frente:</span><br>
          ${frente} m
        </div>
        <div class="info-item">
          <span class="info-label">Profundidad:</span><br>
          ${profundidad} m
        </div>
        <div class="info-item">
          <span class="info-label">Superficie:</span><br>
          ${superficie} m²
        </div>
        <div class="info-item">
          <span class="info-label">Barrio Catastral:</span><br>
          ${barrio_catastral}
        </div>
      </div>
    </div>

    <div class="info-section" style="border-left-color: #28a745;">
      <h3>🏛️ Datos Catastrales Oficiales</h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Padrón:</span><br>
          ${padron_catastral}
        </div>
        <div class="info-item">
          <span class="info-label">Superficie Catastral:</span><br>
          ${superficie_catastral} m²
        </div>
        <div class="info-item">
          <span class="info-label">Coordenadas:</span><br>
          ${lat}, ${lon}
        </div>
      </div>
    </div>

    <div style="margin: 30px 0;">
      <h3 style="color: #2c5aa0;">📊 Análisis Técnico Urbanístico</h3>
      <div class="analysis">${analisis}</div>
    </div>

    <div class="footer">
      <p><strong>Messad Estudio</strong></p>
      <p>Arquitectura y Urbanismo | Santiago del Estero, Argentina</p>
      <p style="font-size: 12px; color: #999;">
        Este análisis es orientativo y se basa en la normativa vigente al momento de su emisión.
        Se recomienda verificar con la autoridad municipal competente.
      </p>
    </div>
  </div>
</body>
</html>
`;

// ============================================================================
// 6. PREPARAR EMAIL TEXTO PLANO (fallback)
// ============================================================================

const emailPlainText = `
ANÁLISIS NORMATIVO URBANÍSTICO
Messad Estudio - Arquitectura y Urbanismo

Generado: ${fecha} a las ${hora}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 INFORMACIÓN DEL LOTE

Dirección: ${direccion}
Zona: ${zona}
Frente: ${frente} m
Profundidad: ${profundidad} m
Superficie: ${superficie} m²
Barrio Catastral: ${barrio_catastral}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏛️ DATOS CATASTRALES OFICIALES

Padrón: ${padron_catastral}
Superficie Catastral: ${superficie_catastral} m²
Coordenadas: ${lat}, ${lon}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 ANÁLISIS TÉCNICO URBANÍSTICO

${analisis}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Messad Estudio
Arquitectura y Urbanismo
Santiago del Estero, Argentina

Este análisis es orientativo y se basa en la normativa vigente al momento
de su emisión. Se recomienda verificar con la autoridad municipal competente.
`;

// ============================================================================
// 7. RETORNAR DATOS FORMATEADOS
// ============================================================================

console.log('✅ Email formateado correctamente');

return [{
  json: {
    // Datos para el email
    email_html: emailHTML,
    email_plain_text: emailPlainText,
    email_subject: `Análisis Normativo - ${direccion}`,
    email_to: email_cliente,

    // Datos del cliente
    nombre_cliente: nombre,
    email_cliente: email_cliente,
    whatsapp_cliente: whatsapp,

    // Datos del lote
    direccion,
    zona,
    frente,
    profundidad,
    superficie,
    barrio_catastral,
    superficie_catastral,
    padron_catastral,

    // Análisis
    analisis_completo: analisis,

    // Metadata
    fecha_analisis: fecha,
    hora_analisis: hora,
    timestamp: new Date().toISOString()
  }
}];
