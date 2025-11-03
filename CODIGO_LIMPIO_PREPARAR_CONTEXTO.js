// ============================================================================
// Preparar Contexto para Claude - VERSIÓN 5.0 (Nodo Nativo de Anthropic)
// ============================================================================
// Combina datos del webhook, geocoding y GeoServer
// Usa digesto v5 estructurado para mayor precisión
// Devuelve el prompt listo para el nodo nativo de Anthropic
// ============================================================================

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
// 2. OBTENER COORDENADAS DEL GEOCODING
// ============================================================================

const geoData = $('Formatear Coordenadas Google').first().json;
const lat = geoData.lat;
const lon = geoData.lon;
const direccion_geocodificada = geoData.display_name || direccion;

console.log('🌍 Coordenadas:', { lat, lon });

// ============================================================================
// 3. PROCESAR DATOS DEL GEOSERVER (Catastro Municipal)
// ============================================================================

const geoserverResponse = items[0].json;

let barrioCatastral = 'No disponible';
let superficieCatastral = 'No disponible';
let padronCatastral = 'No disponible';
let geoserverEncontrado = false;

if (geoserverResponse.features && geoserverResponse.features.length > 0) {
  const feature = geoserverResponse.features[0];
  const props = feature.properties;

  barrioCatastral = props.nbarrio || 'No disponible';
  superficieCatastral = props.area ? `${props.area}` : 'No disponible';
  padronCatastral = props.padroni || 'No disponible';
  geoserverEncontrado = true;

  console.log('🏛️ Datos catastrales encontrados:', {
    barrio: barrioCatastral,
    area: superficieCatastral,
    padron: padronCatastral
  });
} else {
  console.warn('⚠️ No se encontraron datos catastrales en GeoServer');
}

// ============================================================================
// 4. DIGESTO NORMATIVO V5 ESTRUCTURADO (JSON)
// ============================================================================

const digesto_normativa_v5 = {
  "digesto_sde_v5": {
    "metadata": {
      "version": "5.0",
      "fecha": "2024-11",
      "fuentes": ["Ord. 796/1982", "Ord. 4860/2013"],
      "uso": "analisis_automatizado_lotes"
    },

    "INSTRUCCIONES_CRITICAS": {
      "1": "SIEMPRE buscar primero si la calle está en 'mapeo_calles_zonas'",
      "2": "Si la calle está en área_central_delimitacion, aplicar normas Ord. 4860/2013",
      "3": "NUNCA inventar valores - usar solo los especificados aquí",
      "4": "Si no encuentras la zona específica, usar 'zona_por_defecto' CON ADVERTENCIA",
      "5": "Los valores de AP/AE prevalecen sobre AG, y AG sobre zonas 1-6"
    },

    "area_central_delimitacion": {
      "descripcion": "Si el lote está dentro de estos límites, aplica Ord. 4860/2013",
      "limites": {
        "norte": "3 de Febrero",
        "sur": "Chaco",
        "este": "Olaechea",
        "oeste": "Bolivia"
      },
      "calles_incluidas": [
        "3 de Febrero", "Independencia", "Pueyrredón", "Sor Mercedes Guerra",
        "Av. Moreno", "Presb. Gorriti", "Av. Belgrano", "Bolivia", "Perú", "Chaco",
        "Av. Núñez del Prado", "Pozo de Vargas", "Olaechea", "Roca", "Alsina",
        "Rivadavia", "Urquiza", "Libertad", "24 de Septiembre", "25 de Mayo",
        "9 de Julio", "Buenos Aires", "Avellaneda", "Absalón Rojas", "Tucumán",
        "Pedro León Gallo", "Sáenz Peña", "Irigoyen", "Jujuy", "Santa Cruz"
      ]
    },

    "mapeo_calles_zonas": {
      "Absalón Rojas": {
        "zona_primaria": "AE4",
        "perfil": "XVI",
        "altura_maxima": 22.0,
        "fos": 0.85,
        "fot": null,
        "ancho_calle": 15,
        "tipo_via": "principal",
        "restricciones_especiales": ["No guardacoches entre Jujuy y Urquiza"]
      },
      "Urquiza": {
        "zona_primaria": "AG-C1",
        "perfil": "IV",
        "altura_maxima": 27.0,
        "fos": 0.85,
        "fot": null,
        "ancho_calle": 12,
        "tipo_via": "principal"
      },
      "Libertad": {
        "zona_primaria": "AG-C1",
        "perfil": "IV",
        "altura_maxima": 27.0,
        "fos": 0.85,
        "fot": null,
        "ancho_calle": 15,
        "tipo_via": "principal"
      },
      "Av. Belgrano": {
        "zona_primaria": "CU",
        "perfil": "IX",
        "altura_maxima": 36.0,
        "fos": 0.85,
        "fot": null,
        "ancho_calle": 20,
        "tipo_via": "avenida",
        "nota": "Entre Urquiza-P.L.Gallo: Perfil X con basamento"
      },
      "Av. Roca": {
        "zona_primaria": "CU",
        "perfil": "IX",
        "altura_maxima": 36.0,
        "fos": 0.85,
        "fot": null,
        "ancho_calle": 20,
        "tipo_via": "avenida"
      },
      "Av. Alsina": {
        "zona_primaria": "CU",
        "perfil": "IX",
        "altura_maxima": 36.0,
        "fos": 0.85,
        "fot": null,
        "ancho_calle": 20,
        "tipo_via": "avenida"
      },
      "24 de Septiembre": {
        "zona_primaria": "AG-C1",
        "perfil": "IV",
        "altura_maxima": 27.0,
        "fos": 0.85,
        "fot": null,
        "ancho_calle": 12,
        "tipo_via": "secundaria"
      },
      "25 de Mayo": {
        "zona_primaria": "AG-C1",
        "perfil": "IV",
        "altura_maxima": 27.0,
        "fos": 0.85,
        "fot": null,
        "ancho_calle": 12,
        "tipo_via": "secundaria"
      },
      "9 de Julio": {
        "zona_primaria": "AG-C1",
        "perfil": "IV",
        "altura_maxima": 27.0,
        "fos": 0.85,
        "fot": null,
        "ancho_calle": 15,
        "tipo_via": "principal"
      },
      "Buenos Aires": {
        "zona_primaria": "AG-C1",
        "perfil": "IV",
        "altura_maxima": 27.0,
        "fos": 0.85,
        "fot": null,
        "ancho_calle": 12,
        "tipo_via": "secundaria"
      },
      "Avellaneda": {
        "zona_primaria": "AG-C1",
        "perfil": "IV",
        "altura_maxima": 27.0,
        "fos": 0.85,
        "fot": null,
        "ancho_calle": 12,
        "tipo_via": "secundaria"
      }
    },

    "zonas_detalle": {
      "AE4": {
        "nombre": "Área Especial 4 - Institucional y Paseo Alvear",
        "perfil": "XVI",
        "altura_maxima": 22.0,
        "fos": 0.85,
        "fot": null,
        "retiros": {
          "linea_municipal": {
            "con_basamento": 0,
            "sin_basamento": 3.0
          },
          "fondo_locales_1ra": "25% de H, mínimo 6.0m",
          "fondo_locales_2da": "3.0m",
          "lateral": "15% de H (edificios perímetro libre)"
        }
      },
      "AG-C1": {
        "nombre": "Área General - Distrito Comercial 1",
        "perfil": "IV o V",
        "altura_maxima": 27.0,
        "altura_minima": 6.0,
        "fos": 0.85,
        "fot": null,
        "condiciones": {
          "calles_12m_o_mas": {
            "perfil": "IV",
            "altura": 27.0,
            "basamento": "no requiere"
          },
          "calles_menos_12m": {
            "perfil": "V",
            "altura": 27.0,
            "basamento": 13.0,
            "retiro_sobre_basamento": 6.0
          }
        }
      },
      "AG-C2": {
        "nombre": "Área General - Distrito Comercial 2",
        "perfil": "IV, V o VI",
        "altura_maxima": 27.0,
        "fos": 0.85,
        "fot": null
      },
      "AG-R": {
        "nombre": "Área General - Residencial",
        "perfil": "VII o VIII",
        "altura_maxima": 22.0,
        "fos": 0.85,
        "fot": null
      },
      "CU": {
        "nombre": "Corredor Urbano",
        "perfil": "IX o X",
        "altura_maxima": 36.0,
        "fos": 0.85,
        "fot": null
      }
    },

    "formulas_calculo": {
      "retiro_fondo_1ra_clase": {
        "formula": "MAX(H * 0.25, 6.0)",
        "descripcion": "25% de altura o 6m, el mayor"
      },
      "retiro_fondo_2da_clase": {
        "valor": 3.0,
        "descripcion": "Fijo 3 metros"
      },
      "retiro_lateral": {
        "formula": "H * 0.15",
        "descripcion": "15% de altura (solo perímetro libre)"
      },
      "patio_1ra_categoria": {
        "hasta_13m": {
          "superficie_min": 9.0,
          "lado_min": 3.0
        },
        "mas_13m": {
          "formula": "H * 0.25",
          "minimo": 5.0
        }
      },
      "patio_2da_categoria": {
        "hasta_13m": {
          "superficie_min": 6.0,
          "lado_min": 2.0
        },
        "mas_13m": {
          "diametro_min": 3.0
        }
      },
      "voladizo_balcon": {
        "altura_min": 6.0,
        "saliente_maxima": "MIN(ancho_calle / 12, limite)",
        "limites": {
          "calle_mas_15m": 1.50,
          "calle_12_15m": 1.20,
          "calle_menos_12m": 0.80
        }
      }
    },

    "zona_por_defecto": {
      "descripcion": "⚠️ USAR SOLO SI NO SE ENCUENTRA ZONA ESPECÍFICA",
      "fos": 0.60,
      "fot": 2.0,
      "altura_maxima": 13.0,
      "retiro_frente": 3.0,
      "retiro_fondo": 3.0,
      "retiro_lateral": 3.0,
      "nota": "ADVERTENCIA: Valores genéricos - DEBE verificar con municipalidad"
    }
  }
};

// ============================================================================
// 5. PROMPT MEJORADO PARA CLAUDE (CON ALGORITMO)
// ============================================================================

const claude_prompt = `# ANÁLISIS NORMATIVO URBANÍSTICO - SANTIAGO DEL ESTERO

## INSTRUCCIONES CRÍTICAS

Eres un experto en normativa urbana de Santiago del Estero. DEBES seguir estos pasos EXACTAMENTE en orden:

### PASO 1: IDENTIFICACIÓN DE ZONA
1. Extraer el nombre de la calle principal de la dirección: "${direccion}"
2. Buscar la calle en \`mapeo_calles_zonas\` del digesto
3. Si no está, verificar si está dentro de \`area_central_delimitacion\`
4. Si está en área central sin mapeo específico, usar zona AG-C1 por defecto
5. Solo usar \`zona_por_defecto\` como ÚLTIMO recurso con ADVERTENCIA VISIBLE

### PASO 2: EXTRACCIÓN DE PARÁMETROS
Una vez identificada la zona, extraer de \`zonas_detalle\`:
- Nombre completo de la zona
- Perfil de edificación
- Altura máxima
- FOS (Factor de Ocupación del Suelo)
- FOT (si es null, indicar "No aplica")
- Condiciones especiales

### PASO 3: CÁLCULOS ESPECÍFICOS
Usando las fórmulas en \`formulas_calculo\`:

**Retiros:**
- Retiro fondo 1ª clase = MAX(altura * 0.25, 6.0)
- Retiro fondo 2ª clase = 3.0 m
- Retiro lateral = altura * 0.15 (solo perímetro libre)

**Patios:**
Si altura ≤ 13m:
  - Patio 1ª: 9m² superficie, 3m lado mínimo
  - Patio 2ª: 6m² superficie, 2m lado mínimo
Si altura > 13m:
  - Patio 1ª: altura * 0.25, mínimo 5m
  - Patio 2ª: círculo 3m diámetro

**Voladizos:**
saliente = MIN(ancho_calle / 12, límite_según_ancho)

### PASO 4: FORMATO DE RESPUESTA

Generar un informe profesional con esta estructura:

\`\`\`markdown
# ANÁLISIS NORMATIVO DEL LOTE

## 📍 IDENTIFICACIÓN
**Dirección:** ${direccion}
**Coordenadas:** Lat: ${lat}, Long: ${lon}
**Dimensiones:** ${frente} m x ${profundidad} m
**Superficie:** ${superficie} m²

## 🏛️ DATOS CATASTRALES OFICIALES
**Barrio Catastral:** ${barrioCatastral}
**Padrón:** ${padronCatastral}
**Superficie Catastral:** ${superficieCatastral} m²

## 🏗️ ZONIFICACIÓN
**Zona Identificada:** [Código] - [Nombre completo]
**Ordenanza Aplicable:** [Ord. 796/1982 o 4860/2013]
**Perfil de Edificación:** [Perfil]

## 📊 INDICADORES URBANÍSTICOS
**F.O.S.:** [valor]% ([cálculo] m² máximo construible en PB)
**F.O.T.:** [valor o "No aplica"]
**Altura Máxima:** [valor] metros
**Altura Mínima:** [valor] metros (si aplica)

## 📏 RETIROS OBLIGATORIOS
**Línea Municipal:**
- [Especificar según perfil]

**Retiro de Fondo:**
- Locales 1ª clase: [valor] m
- Locales 2ª clase: [valor] m

**Retiro Lateral:** [valor o "No requiere"]

## 🏛️ PATIOS REGLAMENTARIOS
**Patios 1ª Categoría:**
- Lado mínimo: [valor] m
- Superficie mínima: [valor] m²

**Patios 2ª Categoría:**
- Lado/diámetro mínimo: [valor] m
- Superficie mínima: [valor] m²

## 🏗️ VOLADIZOS Y BALCONES
**Saliente máxima:** [valor] m
**Altura mínima:** 6.00 m desde vereda

## 🌳 ARBOLADO URBANO
**Obligación:** 1 árbol cada 5 metros

## ⚠️ RESTRICCIONES
[Listar restricciones específicas de la zona]

## 💡 OBSERVACIONES
[Notas importantes del análisis]

## ⚖️ NOTA LEGAL
Este análisis se basa en la normativa vigente (Ord. 796/1982 y 4860/2013).
Se recomienda validar con la Dirección de Planeamiento Urbano.
\`\`\`

### ❌ ERRORES QUE DEBES EVITAR:
1. NUNCA inventar valores no presentes en el digesto
2. NUNCA usar FOS 0.6 o FOT 1.2 si no están en la zona identificada
3. NUNCA asignar altura de 9m como valor genérico
4. NUNCA aplicar retiro genérico de 3m para todo
5. SIEMPRE identificar primero la zona correcta
6. SIEMPRE citar la ordenanza correspondiente

### ✅ VALIDACIÓN FINAL:
Antes de entregar, verificar:
- ¿La zona identificada existe en el digesto?
- ¿Los valores de FOS/FOT coinciden con la zona?
- ¿La altura corresponde al perfil indicado?
- ¿Los cálculos de retiros son correctos?

---

## DIGESTO NORMATIVO ESTRUCTURADO:

${JSON.stringify(digesto_normativa_v5, null, 2)}

---

PROCEDER CON EL ANÁLISIS DEL LOTE SEGÚN LAS INSTRUCCIONES.
`;

// ============================================================================
// 6. RETORNAR CONTEXTO COMPLETO
// ============================================================================

console.log('✅ Contexto preparado correctamente');
console.log('📊 Tamaño del prompt:', claude_prompt.length, 'caracteres');
console.log('📊 Tamaño del digesto v5:', JSON.stringify(digesto_normativa_v5).length, 'caracteres');

return [{
  json: {
    // Prompt para el nodo nativo de Anthropic
    claude_prompt: claude_prompt,

    // Datos del lote
    direccion,
    frente,
    profundidad,
    superficie,

    // Datos del cliente
    email_cliente,
    nombre_cliente: nombre,
    whatsapp_cliente: whatsapp,

    // Datos geográficos
    lat,
    lon,
    direccion_geocodificada,

    // Datos catastrales
    barrio_catastral: barrioCatastral,
    superficie_catastral: superficieCatastral,
    padron_catastral: padronCatastral,
    geoserver_encontrado: geoserverEncontrado,

    // Metadata
    timestamp: new Date().toISOString(),
    digesto_version: "5.0"
  }
}];
