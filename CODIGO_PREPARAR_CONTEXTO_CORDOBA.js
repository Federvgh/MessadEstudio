// ============================================================================
// PREPARAR CONTEXTO PARA CÓRDOBA - VERSION PLACEHOLDER
// ============================================================================
// Archivo: CODIGO_PREPARAR_CONTEXTO_CORDOBA.js
// Uso: Copiar y pegar en el nodo "Preparar Contexto Córdoba" en n8n
// ============================================================================
// TODO: Integrar digesto_cordoba_v1.json cuando esté completo
// Por ahora usa estructura similar a Santiago pero con datos de IDECOR
// ============================================================================

console.log('⚠️ USANDO CONTEXTO CÓRDOBA PLACEHOLDER');
console.log('📍 Integrar digesto completo después de completar digesto_cordoba_v1.json');

const items = $input.all();

// ============================================================================
// 1. OBTENER DATOS DEL WEBHOOK
// ============================================================================

const webhookData = $('Webhook Trigger').first().json.body;

const direccion = webhookData.direccion || '';
const frente = webhookData.frente || 0;
const profundidad = webhookData.profundidad || 0;
const superficie = webhookData.superficie || (frente * profundidad);
const email_cliente = webhookData.email_cliente || '';
const nombre = webhookData.nombre || 'Cliente';
const whatsapp = webhookData.whatsapp || '';

console.log('📍 Dirección del webhook:', direccion);

// Validación básica
if (!direccion || direccion.length < 5) {
  throw new Error(`Dirección inválida: "${direccion}". Debe tener al menos 5 caracteres.`);
}

// ============================================================================
// 2. OBTENER COORDENADAS DE GEOREF
// ============================================================================

const georefData = $('Formatear Coordenadas Georef').first().json;
const lat = georefData.lat;
const lon = georefData.lon;
const direccion_normalizada = georefData.direccion_normalizada || direccion;
const provincia = georefData.provincia || 'Córdoba';
const departamento = georefData.departamento || 'Capital';
const localidad = georefData.localidad || 'Córdoba';

console.log('🌍 Coordenadas Georef:', { lat, lon });
console.log('📍 Dirección normalizada:', direccion_normalizada);

// ============================================================================
// 3. PROCESAR DATOS DE IDECOR (Catastro Oficial Córdoba)
// ============================================================================
// NOTA: Temporalmente deshabilitado - API IDECOR requiere investigación
// Los datos vienen vacíos desde "Formatear Coordenadas Georef"
// ============================================================================

const idecorResponse = georefData.idecor_response || { features: [] };

let barrioCatastral = 'No disponible';
let superficieCatastral = 'No disponible';
let padronCatastral = 'No disponible';
let nomenclatura_catastral = 'No disponible';
let idecorEncontrado = false;

if (idecorResponse.features && idecorResponse.features.length > 0) {
  const feature = idecorResponse.features[0];
  const props = feature.properties;

  // Campos típicos de IDECOR (ajustar según respuesta real)
  barrioCatastral = props.barrio || props.nombre_barrio || props.BARRIO || 'No disponible';
  superficieCatastral = props.superficie || props.sup_hectareas || props.SUPERFICIE || 'No disponible';
  padronCatastral = props.nomenclatura || props.padron || props.NOMENCLATURA || 'No disponible';
  nomenclatura_catastral = props.nomenclatura_catastral || props.NOMENCLAT || props.nomenclatura || 'No disponible';
  idecorEncontrado = true;

  console.log('🏛️ Datos IDECOR encontrados:', {
    barrio: barrioCatastral,
    superficie: superficieCatastral,
    padron: padronCatastral,
    nomenclatura: nomenclatura_catastral
  });
} else {
  console.warn('⚠️ No se encontraron datos catastrales en IDECOR (servicio temporalmente deshabilitado)');
}

// ============================================================================
// 4. DIGESTO CÓRDOBA PLACEHOLDER (JSON)
// ============================================================================

const digesto_cordoba_placeholder = {
  "digesto_cordoba_placeholder_v1": {
    "metadata": {
      "version": "placeholder_1.0",
      "fecha": "2025-01-07",
      "fuentes": ["Ordenanza 8256/2000"],
      "uso": "analisis_automatizado_placeholder",
      "advertencia": "VALORES APROXIMADOS - Validar con municipalidad"
    },

    "ADVERTENCIA_CRITICA": "Este es un PLACEHOLDER. Los valores son APROXIMADOS y deben ser VALIDADOS con la Dirección de Planeamiento Urbano de Córdoba.",

    "zonas_aproximadas": {
      "A": {
        "nombre": "Zona Residencial Especial",
        "fos": 0.60,
        "fot": 1.20,
        "altura_maxima": 9.0
      },
      "B": {
        "nombre": "Zona Residencial Media",
        "fos": 0.70,
        "fot": 2.10,
        "altura_maxima": 12.0
      },
      "C1": {
        "nombre": "Zona Central 1",
        "fos": 1.0,
        "fot": 4.0,
        "altura_maxima": null,
        "nota": "Sin límite de altura en área central"
      },
      "C2": {
        "nombre": "Zona Central 2",
        "fos": 0.85,
        "fot": 3.0,
        "altura_maxima": 18.0
      }
    },

    "calles_principales_aproximadas": {
      "Av. Colón": "C1",
      "Av. Vélez Sarsfield": "C1",
      "Av. General Paz": "C2",
      "Av. Hipólito Yrigoyen": "C2"
    },

    "zona_por_defecto": {
      "codigo": "B",
      "fos": 0.70,
      "fot": 2.10,
      "altura_maxima": 12.0,
      "nota": "Valores genéricos cuando no se puede determinar zona específica"
    }
  }
};

// ============================================================================
// 5. PROMPT PLACEHOLDER PARA CLAUDE
// ============================================================================

const claude_prompt = `# ANÁLISIS NORMATIVO URBANÍSTICO - CÓRDOBA CAPITAL

## ⚠️ ADVERTENCIA IMPORTANTE

Este análisis utiliza un **DIGESTO PLACEHOLDER** para Córdoba Capital.

**Limitaciones actuales:**
- Los valores normativos son **APROXIMADOS**
- Las zonas son **ESTIMADAS** basadas en patrones urbanos generales
- Los datos catastrales son **OFICIALES** (IDECOR) pero los valores normativos NO

**¿Qué datos SÍ son confiables?**
✅ Coordenadas geográficas (API Georef - oficial)
✅ Datos catastrales: barrio, padrón, nomenclatura (IDECOR - oficial)
✅ Superficie catastral oficial

**¿Qué datos son aproximados?**
⚠️ FOS, FOT, alturas máximas
⚠️ Zonificación específica
⚠️ Perfiles de edificación

**Próximos pasos:**
El sistema está pendiente de integración del digesto completo de Córdoba (Ordenanza 8256/2000 y modificatorias).

---

## INSTRUCCIONES PARA EL ANÁLISIS

Genera un análisis normativo profesional PERO incluye advertencias claras sobre las limitaciones.

Estructura requerida:

1. **Advertencia visible al inicio** sobre naturaleza preliminar
2. **Datos oficiales destacados** (IDECOR, Georef)
3. **Valores normativos aproximados** con nota de validación requerida
4. **Recomendación explícita** de validar con Dirección de Planeamiento Urbano

---

## 📍 DATOS DEL LOTE

**Dirección Ingresada:** ${direccion}
**Dirección Normalizada (Georef):** ${direccion_normalizada}
**Coordenadas:** Lat: ${lat}, Long: ${lon}
**Provincia:** ${provincia}
**Departamento:** ${departamento}
**Localidad:** ${localidad}

**Dimensiones:**
- Frente: ${frente} m
- Profundidad: ${profundidad} m
- Superficie: ${superficie} m²

---

## 🏛️ DATOS CATASTRALES OFICIALES (IDECOR)

**Fuente:** Sistema de Información Territorial de Córdoba (IDECOR)
**Confiabilidad:** ✅ DATOS OFICIALES

${idecorEncontrado ? `
**Barrio Catastral:** ${barrioCatastral}
**Padrón/Nomenclatura:** ${padronCatastral}
**Nomenclatura Catastral:** ${nomenclatura_catastral}
**Superficie Catastral:** ${superficieCatastral}

✅ Se encontraron datos catastrales oficiales para este lote.
` : `
⚠️ No se encontraron datos catastrales en IDECOR para estas coordenadas.

Posibles causas:
- Lote fuera del área catastrada
- Coordenadas imprecisas
- Zona rural o en proceso de urbanización

Se recomienda verificar la dirección y consultar con la municipalidad.
`}

---

## 📊 DIGESTO NORMATIVO PLACEHOLDER

${JSON.stringify(digesto_cordoba_placeholder, null, 2)}

---

## 🎯 ANÁLISIS REQUERIDO

Genera el análisis siguiendo esta estructura exacta:

\`\`\`markdown
# ANÁLISIS NORMATIVO PRELIMINAR - CÓRDOBA CAPITAL

## ⚠️ ADVERTENCIA IMPORTANTE

Este es un **ANÁLISIS PRELIMINAR** que utiliza:
- ✅ Datos catastrales OFICIALES de IDECOR (confiables)
- ⚠️ Valores normativos APROXIMADOS (requieren validación)

**VALIDACIÓN OBLIGATORIA** con la Dirección de Planeamiento Urbano de la Municipalidad de Córdoba.

---

## 📍 IDENTIFICACIÓN DEL LOTE

**Dirección:** ${direccion}
**Dirección Normalizada:** ${direccion_normalizada}
**Coordenadas:** Lat: ${lat}, Long: ${lon}
**Provincia:** ${provincia}
**Departamento:** ${departamento}

**Dimensiones:**
- Frente: ${frente} m
- Profundidad: ${profundidad} m
- Superficie: ${superficie} m²

---

## 🏛️ DATOS CATASTRALES OFICIALES (IDECOR)

✅ **Fuente Confiable:** Sistema de Información Territorial de Córdoba

${idecorEncontrado ? `
**Barrio Catastral:** ${barrioCatastral}
**Padrón:** ${padronCatastral}
**Nomenclatura Catastral:** ${nomenclatura_catastral}
**Superficie Catastral:** ${superficieCatastral} m²

✅ Datos catastrales oficiales encontrados.
` : `
⚠️ No se encontraron datos catastrales para estas coordenadas.
Se recomienda verificar la dirección con la municipalidad.
`}

---

## 🏗️ ZONIFICACIÓN (APROXIMADA)

⚠️ **Advertencia:** Zona ESTIMADA basada en ubicación general.

**Zona Aproximada:** [Determinar basándose en dirección y calles principales]
**Ordenanza Aplicable:** Ordenanza 8256/2000 y modificatorias

**Descripción:** [Descripción general de la zona]

---

## 📊 INDICADORES URBANÍSTICOS (APROXIMADOS)

⚠️ **Advertencia:** Valores ESTIMADOS - VALIDAR con municipalidad

**F.O.S. (Factor de Ocupación del Suelo):** [valor] ([cálculo] m² construibles en PB)
**F.O.T. (Factor de Ocupación Total):** [valor o "No aplica"]
**Altura Máxima:** [valor] metros
**Perfil de Edificación:** [valor aproximado]

---

## 📏 RETIROS OBLIGATORIOS (APROXIMADOS)

⚠️ **Advertencia:** Retiros ESTIMADOS según zona aproximada

**Línea Municipal:**
- [Especificar según zona]

**Retiro de Fondo:**
- [Valor aproximado]

**Retiro Lateral:**
- [Valor aproximado]

---

## 🏛️ PATIOS REGLAMENTARIOS (APROXIMADOS)

**Patios 1ª Categoría:**
- Lado mínimo: [valor] m
- Superficie mínima: [valor] m²

**Patios 2ª Categoría:**
- Lado/diámetro mínimo: [valor] m

---

## 💡 OBSERVACIONES IMPORTANTES

1. ✅ **Datos Catastrales:** Información oficial de IDECOR (confiable)
2. ⚠️ **Valores Normativos:** Aproximados según zona estimada (requieren validación)
3. 📋 **Digesto Completo:** En proceso de integración
4. 🏛️ **Validación Requerida:** Dirección de Planeamiento Urbano de Córdoba
5. 📞 **Contacto Municipalidad:** 0351-4285200 (Mesa de Entrada)

---

## ⚖️ NOTA LEGAL

Este análisis se basa en:
- ✅ Datos catastrales oficiales de IDECOR
- ✅ API Georef (Gobierno de Argentina)
- ⚠️ Digesto normativo PLACEHOLDER (en desarrollo)

**VALIDACIÓN OBLIGATORIA** con la Dirección de Planeamiento Urbano de la Municipalidad de Córdoba antes de cualquier trámite o decisión de proyecto.

**Ordenanza de referencia:** Ordenanza 8256/2000 y modificatorias
**Sistema catastral:** IDECOR (Infraestructura de Datos Espaciales de la Provincia de Córdoba)

---

**Análisis generado:** ${new Date().toLocaleString('es-AR')}
**Sistema:** Messad Estudio - Análisis Urbano Automatizado
**Versión Digesto:** Placeholder v1.0 (pendiente integración completa)
\`\`\`

---

## ✅ CHECKLIST DE VALIDACIÓN

Antes de entregar el análisis, verificar:

- ✅ Advertencia visible sobre naturaleza preliminar
- ✅ Distinción clara entre datos oficiales y aproximados
- ✅ Recomendación explícita de validación municipal
- ✅ Inclusión de datos IDECOR si existen
- ✅ Explicación de limitaciones actuales
- ✅ Nota legal completa

---

**PROCEDER CON EL ANÁLISIS SEGÚN LAS INSTRUCCIONES.**
`;

// ============================================================================
// 6. RETORNAR CONTEXTO COMPLETO
// ============================================================================

console.log('✅ Contexto Córdoba (placeholder) preparado correctamente');
console.log('📊 Tamaño del prompt:', claude_prompt.length, 'caracteres');

return [{
  json: {
    // Prompt para Claude
    claude_prompt: claude_prompt,

    // Datos del lote
    direccion,
    direccion_normalizada,
    frente,
    profundidad,
    superficie,

    // Datos del cliente
    email_cliente,
    nombre_cliente: nombre,
    whatsapp_cliente: whatsapp,

    // Datos geográficos (Georef)
    lat,
    lon,
    provincia,
    departamento,
    localidad,

    // Datos catastrales (IDECOR)
    barrio_catastral: barrioCatastral,
    superficie_catastral: superficieCatastral,
    padron_catastral: padronCatastral,
    nomenclatura_catastral: nomenclatura_catastral,
    idecor_encontrado: idecorEncontrado,

    // Metadata
    ciudad: 'Córdoba Capital',
    timestamp: new Date().toISOString(),
    digesto_version: 'placeholder_v1.0',
    advertencia: 'Análisis con digesto placeholder - Validar con municipalidad'
  }
}];
