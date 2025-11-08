// ============================================================================
// PREPARAR CONTEXTO PARA CÓRDOBA - VERSIÓN 3.0 (ACTUALIZADO 2024)
// ============================================================================
// Archivo: CODIGO_PREPARAR_CONTEXTO_CORDOBA_V3.js
// Uso: Copiar y pegar en el nodo "Preparar Contexto Córdoba" en n8n
// Basado en digesto_cordoba_v3_2024.js con Ord. 13.460/2024
// ============================================================================

console.log('✅ USANDO DIGESTO CÓRDOBA V3 - ACTUALIZADO 2024');
console.log('📍 Ordenanza 13.460/2024 incluida');

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

const idecorResponse = $('Consultar IDECOR WFS').first().json;

let barrioCatastral = 'No disponible';
let superficieCatastral = 'No disponible';
let padronCatastral = 'No disponible';
let nomenclatura_catastral = 'No disponible';
let idecorEncontrado = false;

console.log('🔍 Respuesta IDECOR completa:', JSON.stringify(idecorResponse, null, 2));

if (idecorResponse.features && idecorResponse.features.length > 0) {
  const feature = idecorResponse.features[0];
  const props = feature.properties;

  console.log('📋 Properties disponibles en IDECOR:', Object.keys(props));

  nomenclatura_catastral = props.Nomenclatura || props.nomenclatura || props.NOMENCLATURA ||
                          props.nomenclatura_catastral || props.NOMENCLAT || 'No disponible';

  superficieCatastral = props.Superficie_Tierra_Urbana || props.superficie || props.SUPERFICIE ||
                       props.sup_terreno || props.sup_hectareas || 'No disponible';

  padronCatastral = props.Nro_Cuenta || props.nro_cuenta || props.NRO_CUENTA ||
                   props.padron || props.cuenta || 'No disponible';

  barrioCatastral = props.Barrio || props.barrio || props.BARRIO ||
                   props.nombre_barrio || props.NOMBRE_BARRIO || 'No disponible';

  idecorEncontrado = true;

  console.log('✅ Datos IDECOR procesados:', {
    nomenclatura: nomenclatura_catastral,
    superficie: superficieCatastral,
    padron: padronCatastral,
    barrio: barrioCatastral
  });
} else {
  console.warn('⚠️ No se encontraron parcelas en IDECOR para las coordenadas especificadas');
  console.log('📍 Coordenadas consultadas:', { lat, lon });
}

// ============================================================================
// 4. DIGESTO CÓRDOBA V3 (ACTUALIZADO 2024)
// ============================================================================

const digesto_cordoba_v3 = {
  "metadata": {
    "version": "3.0",
    "fecha_creacion": "2024-11",
    "ultima_actualizacion": "2024-06-25",
    "fuentes": [
      "Ord. 8256/1986 (Base)",
      "Ord. 12483/2015",
      "Ord. 12596/2015",
      "Decreto 4689/2016",
      "Ord. 13460/2024 (Última modificación)"
    ],
    "decreto_promulgacion": "Decreto N° 327/2024",
    "uso": "analisis_automatizado_lotes_cordoba"
  },

  "conceptos_actualizados_2024": {
    "alto_impacto_urbanistico": {
      "definicion": "Grandes actuaciones urbanísticas que transforman la estructura urbana",
      "caracteristicas": [
        "Alteración en la movilidad urbana",
        "Requerimientos de infraestructuras no previstas",
        "Modificación del entorno inmediato (alturas, ocupación superior)",
        "Introducción de usos no existentes",
        "Alteración del soporte físico natural"
      ],
      "evaluacion": "Criterio técnico de la Autoridad de Aplicación"
    },

    "arbolado_nativo": {
      "definicion": "Provisión de especies vegetales nativas",
      "autoridad": "Dirección de Impacto Ambiental y Cambio Climático",
      "obligatorio": true
    },

    "frente_urbano_ambiental_rio_suquia": {
      "definicion": "Franja urbano ambiental conformada por márgenes del Río Suquía",
      "marco_legal": "Ley Provincial N° 10355",
      "caracter": "Interés público y protección ambiental"
    }
  },

  "INSTRUCCIONES_CRITICAS": {
    "1": "Verificar si está en corredor o área especial PRIMERO",
    "2": "Los corredores PREVALECEN sobre zonificación general",
    "3": "Aplicar nuevas restricciones ambientales 2024",
    "4": "En Río Suquía aplicar Frente Urbano Ambiental",
    "5": "Alto impacto urbanístico requiere evaluación especial",
    "6": "Construcciones en subsuelo: máx 60% con 40% permeable"
  },

  "zonas_principales": {
    "ZONA_A": {
      "nombre": "Área Central",
      "caracter": "Máxima densificación poblacional",
      "fos": 0.80,
      "fot": 4.0,
      "altura_maxima": 45.0,
      "altura_minima": 10.5,
      "perfil": "Varios según ubicación",
      "retiros": {
        "frente": "Sobre LM o retiro optativo",
        "fondo": 3.0,
        "laterales": "No obligatorio"
      }
    },

    "ZONA_B": {
      "nombre": "Área Intermedia",
      "caracter": "Renovación con densificación relativa",
      "fos": 0.80,
      "fot": 3.5,
      "altura_maxima": 36.0,
      "perfil": "XXI/XXII",
      "retiros": {
        "frente": "Sobre LM o retiro optativo",
        "fondo": 3.0,
        "laterales": "No obligatorio"
      }
    },

    "ZONA_C1": {
      "nombre": "Corredor Lineal Principal",
      "caracter": "Renovación con densificación poblacional",
      "fos": 0.80,
      "fot": 3.0,
      "altura_maxima": 27.0,
      "perfil": "Específico C1",
      "retiros": {
        "frente": "Sobre LM obligatorio",
        "fondo": 3.0,
        "laterales": "No obligatorio"
      }
    },

    "ZONA_C2": {
      "nombre": "Corredor Lineal Secundario",
      "caracter": "Renovación con densificación media",
      "fos": 0.80,
      "fot": 2.5,
      "altura_maxima": 18.0,
      "perfil": "Específico C2",
      "retiros": {
        "frente": "Sobre LM obligatorio",
        "fondo": 3.0,
        "laterales": "No obligatorio"
      }
    },

    "ZONA_D": {
      "nombre": "Residencial Densidad Media-Alta",
      "caracter": "Renovación con densificación relativa",
      "fos": 0.70,
      "fot": 2.5,
      "altura_maxima": 15.0,
      "altura_fachada": 12.0,
      "perfil": "XXIII"
    },

    "ZONA_E": {
      "nombre": "Residencial Densidad Media",
      "caracter": "Renovación con densificación relativa",
      "fos": 0.70,
      "fot": 2.0,
      "altura_maxima": 12.0,
      "altura_fachada": 8.0,
      "perfil": "XXIV"
    },

    "ZONA_F": {
      "nombre": "Residencial con Preservación Ambiental",
      "caracter": "Consolidación residencial con características ambientales a preservar",
      "actualizado": "2024",
      "fos": 0.35,
      "fot": 1.0,
      "altura_maxima": 10.5,
      "perfil": "Básico",
      "retiros": {
        "frente": 6.0,
        "fondo": 6.0
      },
      "especial_2024": {
        "frente_rio_suquia": true,
        "preservacion_ambiental": true,
        "vegetacion_nativa": "obligatoria"
      }
    }
  },

  "construcciones_subsuelo_2024": {
    "descripcion": "Modificado por Ord. 13460/2024",
    "desarrollo_maximo": "60% de la superficie de parcela",
    "superficie_libre": "40% mínimo",
    "impermeabilizacion": "40% debe ser libre de impermeabilización",
    "tratamiento": "Paisajístico con vegetación nativa"
  },

  "factor_impermeabilizacion": {
    "descripcion": "Coeficiente de impermeabilización admisible (FIS)",
    "limites_por_zona": {
      "zonas_alta_densidad": 0.90,
      "zonas_media_densidad": 0.70,
      "zonas_baja_densidad": 0.50,
      "zonas_parque": 0.35,
      "zonas_rio_suquia": 0.40
    },
    "subsuelo_2024": "Máximo 60% con 40% permeable obligatorio"
  },

  "areas_especiales": {
    "APH1": {
      "nombre": "Área de Protección del Patrimonio Histórico 1",
      "fos": 0.80,
      "altura_maxima": 12.0,
      "CEPT": "Permite transferir edificabilidad"
    },

    "APH2": {
      "nombre": "Área de Protección del Patrimonio Histórico 2",
      "fos": 0.80,
      "altura_maxima": 5.5
    },

    "APU": {
      "nombre": "Áreas de Promoción Urbana",
      "cantidad_2024": 24,
      "descripcion": "Áreas receptoras de CEPT y desarrollo especial"
    },

    "FRENTE_URBANO_AMBIENTAL": {
      "nombre": "Frente Urbano Ambiental Río Suquía",
      "descripcion": "Nueva figura 2024",
      "normativa": "Ley Provincial N° 10355"
    }
  },

  "planes_vivienda_2024": {
    "menos_10_unidades": {
      "aprobacion": "Dirección de Obras Privadas",
      "requisitos": "Cumplir normativa de zona"
    },
    "mas_10_unidades": {
      "aprobacion": "Dirección de Planeamiento Urbano",
      "requisito_2024": "Factibilidad red cloacal o tratamiento autorizado"
    }
  },

  "algoritmo_analisis": {
    "paso_1": "Verificar si es Alto Impacto Urbanístico",
    "paso_2": "Identificar si está en corredor o área especial",
    "paso_3": "Si está en Río Suquía, aplicar Frente Urbano Ambiental",
    "paso_4": "Identificar zona general si no es corredor",
    "paso_5": "Aplicar perfil correspondiente",
    "paso_6": "Calcular FOS, FOT, FIS",
    "paso_7": "Aplicar restricciones de subsuelo (60/40)",
    "paso_8": "Determinar vegetación nativa obligatoria",
    "paso_9": "Verificar patrimonio si corresponde",
    "paso_10": "Aplicar reglas de esquina si aplica"
  }
};

// ============================================================================
// 5. PROMPT PARA CLAUDE (ACTUALIZADO 2024)
// ============================================================================

const claude_prompt = `# ANÁLISIS NORMATIVO URBANÍSTICO - CÓRDOBA CAPITAL (ACTUALIZADO 2024)

## ⚠️ INSTRUCCIONES CRÍTICAS - VERSIÓN 3.0

Eres un experto en normativa urbana de Córdoba actualizado con la **Ordenanza 13.460/2024**.
DEBES seguir estos pasos EXACTAMENTE:

### PASO 1: EVALUACIÓN DE ALTO IMPACTO
Determinar si el proyecto constituye "Alto Impacto Urbanístico" según:
- Alteración de movilidad urbana
- Infraestructuras no previstas
- Modificación significativa del entorno (alturas, ocupación)
- Introducción de usos no existentes
- Alteración del soporte físico natural

### PASO 2: IDENTIFICACIÓN DE ZONA
1. Analizar dirección: "${direccion_normalizada}"
2. Verificar si está en Frente Urbano Ambiental Río Suquía
3. Comprobar si está en corredor principal (C1, C2)
4. Verificar área especial (APH, APU)
5. Si es esquina, marcar para reglas especiales
6. Identificar zona general (A, B, D, E, F, etc.)

### PASO 3: EXTRACCIÓN DE PARÁMETROS
De la zona identificada, extraer:
- Carácter urbanístico
- FOS (Factor Ocupación Suelo)
- FOT (Factor Ocupación Total)
- FIS (Factor Impermeabilización - NUEVO 2024)
- Altura máxima y mínima
- Perfil de edificación
- Retiros obligatorios
- Restricciones especiales 2024

### PASO 4: CÁLCULOS ESPECÍFICOS

**Superficie Edificable:**
- Planta Baja = ${superficie} m² × FOS
- Total edificable = ${superficie} m² × FOT
- Subsuelo máximo = ${superficie} m² × 0.60 (40% permeable obligatorio)

**Factor Impermeabilización (FIS - NUEVO 2024):**
- Calcular según zona
- Considerar 40% mínimo permeable en subsuelos

**Vegetación Nativa (NUEVO 2024):**
- Obligatoria en zonas F y frente al río
- Según Dirección de Impacto Ambiental y Cambio Climático

**Retiros:**
- Aplicar valores específicos de zona
- En perímetro libre: d = h/3 (mínimo 4m)

**Patios reglamentarios:**
- 1ª categoría: h/4 (mín 3m lado, 10m² superficie)
- 2ª categoría: h/5 (mín 2m lado, 6m² superficie)

### PASO 5: FORMATO DE RESPUESTA

Genera el análisis siguiendo esta estructura EXACTA:

---

# ANÁLISIS NORMATIVO DEL LOTE - CÓRDOBA 2024

## 📍 IDENTIFICACIÓN DEL LOTE

**Dirección:** ${direccion}
**Dirección Normalizada:** ${direccion_normalizada}
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

## 🏗️ ZONIFICACIÓN

**Zona:** [Código según análisis] - [Nombre completo]
**Ordenanza Base:** Ord. 8256/86
**Última Modificación:** **Ord. 13.460/2024** (25 de junio de 2024)
**Perfil de Edificación:** [Perfil aplicable]
**Carácter Urbanístico:** [Descripción del carácter de la zona]

---

## 📊 INDICADORES URBANÍSTICOS

**F.O.S. (Factor de Ocupación del Suelo):** [valor]% = [cálculo] m² construibles en PB
**F.O.T. (Factor de Ocupación Total):** [valor] = [cálculo] m² totales edificables
**F.I.S. (Factor de Impermeabilización - NUEVO 2024):** [valor]%
**Altura Máxima:** [valor] m
**Altura Mínima:** [valor] m (si aplica)
**Perfil:** [Perfil específico]

---

## 🏗️ CONSTRUCCIONES EN SUBSUELO (NUEVO 2024)

⚠️ **Modificado por Ord. 13.460/2024**

**Ocupación Máxima Subsuelo:** 60% = [cálculo] m²
**Superficie Permeable Obligatoria:** 40% = [cálculo] m²
**Tratamiento Obligatorio:** Paisajístico con vegetación nativa
**Elementos requeridos:** Parquización, suelo natural, vegetación

---

## 📏 RETIROS OBLIGATORIOS

**Línea Municipal/Edificación:** [especificar según zona]
**Retiro de Fondo:** [valor] m
**Retiros Laterales:** [especificar según ancho de parcela]

---

## 🌳 VEGETACIÓN Y AMBIENTE (NUEVO 2024)

**Arbolado Nativo:** [Obligatorio/Opcional según zona]
**Autoridad:** Dirección de Impacto Ambiental y Cambio Climático
**Cobertura Vegetal:** [porcentaje según zona]%
**Especies:** Según especificaciones oficiales de vegetación nativa

**Arbolado en Veredas:**
- Frecuencia: 1 árbol cada 8-10 metros
- Especies recomendadas: Jacarandá, Tipa, Lapacho rosado, Crespón
- Especies prohibidas: Eucaliptus en veredas, Álamo, Sauce fuera de riberas

---

## 🏛️ PATIOS REGLAMENTARIOS

**Patios 1ª Categoría (Locales principales):**
- Lado mínimo: [cálculo h/4, mín 3m]
- Superficie mínima: [mín 10m²]

**Patios 2ª Categoría (Locales de servicio):**
- Lado/diámetro mínimo: [cálculo h/5, mín 2m]
- Superficie mínima: [mín 6m²]

---

## ⚠️ RESTRICCIONES ESPECIALES 2024

[Listar TODAS las aplicables según el lote:]

1. **Alto Impacto Urbanístico:** [Si/No - justificar]
2. **Frente Urbano Ambiental Río Suquía:** [Si/No]
3. **Vegetación Nativa Obligatoria:** [Si/No]
4. **Subsuelo 60/40:** Sí (aplicable a todas las zonas)
5. **CEPT (Transferencia edificabilidad):** [Si/No según zona]
6. **Planes de Vivienda:** [< 10 unidades / ≥ 10 unidades]

---

## 🔍 EVALUACIÓN DE ALTO IMPACTO

[Si aplica, detallar:]
- Requiere evaluación especial de Autoridad de Aplicación
- Criterios a considerar: movilidad, infraestructura, entorno, usos, ambiente

---

## 📋 PLANES DE VIVIENDA (ACTUALIZADO 2024)

${superficie > 1000 ? `
**Proyectos < 10 unidades:**
- Aprobación: Dirección de Obras Privadas
- Requisitos: Cumplir normativa de zona

**Proyectos ≥ 10 unidades:**
- Aprobación: Dirección de Planeamiento Urbano
- **NUEVO 2024:** Factibilidad red cloacal o tratamiento autorizado OBLIGATORIO
- Estacionamiento: 1 cochera/unidad + 10% cortesía
- Vías circulación: ancho mínimo 6m
` : ''}

---

## 💡 OBSERVACIONES IMPORTANTES

1. ✅ **Datos Catastrales:** Información oficial de IDECOR (confiable)
2. ✅ **Normativa Actualizada:** Ord. 13.460/2024 (última modificación 25/06/2024)
3. 📋 **Nuevas Restricciones 2024:** Alto Impacto, FIS, Subsuelo 60/40, Vegetación Nativa
4. 🏛️ **Validación Requerida:** Dirección de Planeamiento Urbano de Córdoba
5. 📞 **Contacto Municipalidad:** (0351) 4285700/4285600 Int. 1730-38

---

## ⚖️ NOTA LEGAL

Este análisis se basa en:
- ✅ Datos catastrales oficiales de IDECOR (Infraestructura de Datos Espaciales de Córdoba)
- ✅ API Georef (Gobierno de Argentina)
- ✅ **Ordenanza 8256/1986 actualizada con Ord. 13.460/2024**
- ✅ Decreto de Promulgación N° 327/2024

**VALIDACIÓN OBLIGATORIA** con la Dirección de Planeamiento Urbano de la Municipalidad de Córdoba antes de cualquier trámite o decisión de proyecto.

**Ordenanzas de referencia:**
- Ordenanza 8256/1986 (Base de ocupación del suelo)
- Ordenanza 12483/2015
- Ordenanza 12596/2015
- Decreto 4689/2016
- **Ordenanza 13460/2024 (Última modificación)**

**Sistema catastral:** IDECOR (Infraestructura de Datos Espaciales de la Provincia de Córdoba)

---

**Análisis generado:** ${new Date().toLocaleString('es-AR')}
**Sistema:** Messad Estudio - Análisis Urbano Automatizado
**Versión Digesto:** 3.0 (Actualizado 2024)
**Última Modificación Normativa:** 25 de junio de 2024

---

## 📚 DIGESTO COMPLETO CÓRDOBA 2024:

${JSON.stringify(digesto_cordoba_v3, null, 2)}

---

**PROCEDER CON EL ANÁLISIS COMPLETO SEGÚN LAS INSTRUCCIONES.**
`;

// ============================================================================
// 6. RETORNAR CONTEXTO COMPLETO
// ============================================================================

console.log('✅ Contexto Córdoba V3 (2024) preparado correctamente');
console.log('📊 Tamaño del prompt:', claude_prompt.length, 'caracteres');
console.log('📋 Versión digesto: 3.0');
console.log('📅 Última actualización normativa: 25/06/2024');

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
    digesto_version: '3.0',
    ultima_actualizacion_normativa: '2024-06-25',
    ordenanza_vigente: 'Ord. 13460/2024',
    advertencia: 'Análisis con digesto actualizado 2024 - Validar con municipalidad'
  }
}];
