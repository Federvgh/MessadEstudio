# 🔧 INSTRUCCIONES: Configurar Routing Multi-Ciudad en n8n

## Estado Actual

El workflow tiene un nodo Switch creado pero no está conectado correctamente. Necesitamos:
1. Conectar el Switch después del Webhook
2. Crear rama para Córdoba con API Georef y IDECOR
3. Ambas ramas convergen en "Formatear Resultados"

---

## PASO 1: Conectar el Nodo Switch

### 1.1 Abrir el Workflow
- Ir a: https://federvgh.app.n8n.cloud/workflow/EG5DPQd3LeHy7yv0
- El workflow debe estar en modo EDICIÓN (no activo mientras modificas)

### 1.2 Desconectar "Webhook Trigger" → "Geo Coding"
1. Click en la conexión entre "Webhook Trigger" y "Geo Coding"
2. Presionar `Delete` o `Backspace`

### 1.3 Conectar "Webhook Trigger" → "Switch"
1. Arrastrar desde el punto de salida de "Webhook Trigger"
2. Conectar a "🏙️ Switch - Routing por Ciudad"

### 1.4 Conectar "Switch" → "Geo Coding" (Output 0)
1. Arrastrar desde el OUTPUT 0 del Switch (primer círculo de salida)
2. Conectar a "Geo Coding" (el nodo existente)
3. Esta es la RAMA SANTIAGO

---

## PASO 2: Crear Rama para Córdoba (Output 1 del Switch)

### 2.1 Crear Nodo "Geo Coding Córdoba (Georef)"

**Ubicación:** A la derecha del Switch, debajo de "Geo Coding"

**Tipo de nodo:** HTTP Request

**Configuración:**
```
Method: GET
URL: https://apis.datos.gob.ar/georef/api/direcciones

Query Parameters:
- direccion: {{ $json.body.direccion }}
- provincia: Córdoba
- max: 1
```

**Conexión:**
- INPUT: Switch (Output 1 - segundo círculo de salida)
- OUTPUT: (siguiente nodo)

---

### 2.2 Crear Nodo "Formatear Coordenadas Georef"

**Ubicación:** Después de "Geo Coding Córdoba"

**Tipo de nodo:** Code

**Código:**
```javascript
const items = $input.all();
const response = items[0].json;

if (!response.direcciones || response.direcciones.length === 0) {
  throw new Error('Dirección no encontrada en API Georef');
}

const direccion = response.direcciones[0];
const location = direccion.ubicacion;

return [{
  json: {
    lat: location.lat,
    lon: location.lon,
    direccion_normalizada: direccion.nomenclatura,
    provincia: direccion.provincia.nombre,
    departamento: direccion.departamento.nombre,
    localidad: direccion.localidad ? direccion.localidad.nombre : 'No disponible'
  }
}];
```

**Conexión:**
- INPUT: Geo Coding Córdoba (Georef)
- OUTPUT: (siguiente nodo)

---

### 2.3 Crear Nodo "Consultar IDECOR WFS"

**Ubicación:** Después de "Formatear Coordenadas Georef"

**Tipo de nodo:** HTTP Request

**Configuración:**
```
Method: GET
URL: {{ construcción dinámica - ver abajo }}
```

**URL dinámica (en Expression mode):**
```javascript
`https://gn-idecor.mapascordoba.gob.ar/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=idecor:parcelas&outputFormat=application/json&CQL_FILTER=INTERSECTS(geom,POINT(${$json.lon} ${$json.lat}))`
```

**Opciones avanzadas:**
- Response Format: JSON
- Timeout: 15000 ms

**Conexión:**
- INPUT: Formatear Coordenadas Georef
- OUTPUT: Preparar Contexto Córdoba (próximo paso)

---

## PASO 3: Crear "Preparar Contexto Córdoba"

### 3.1 Duplicar el nodo "Preparar Contexto"

**Forma rápida:**
1. Click derecho en "Preparar Contexto"
2. "Duplicate"
3. Renombrar a: "Preparar Contexto Córdoba"
4. Mover debajo de "Consultar IDECOR WFS"

### 3.2 Modificar el código (PLACEHOLDER por ahora)

En el nuevo nodo "Preparar Contexto Córdoba", agregar al inicio del código:

```javascript
// ============================================================================
// PREPARAR CONTEXTO PARA CÓRDOBA - VERSION PLACEHOLDER
// ============================================================================
// TODO: Integrar digesto_cordoba_v1.json cuando esté completo
// Por ahora usa estructura similar a Santiago pero con datos de IDECOR
// ============================================================================

console.log('⚠️ USANDO CONTEXTO CÓRDOBA PLACEHOLDER');
console.log('📍 Integrar digesto completo después de completar digesto_cordoba_v1.json');

const items = $input.all();
const webhookData = $('Webhook Trigger').first().json.body;
const georefData = $('Formatear Coordenadas Georef').first().json;
const idecorResponse = items[0].json;

// Extraer datos de IDECOR
let barrioCatastral = 'No disponible';
let superficieCatastral = 'No disponible';
let padronCatastral = 'No disponible';
let nomenclatura_catastral = 'No disponible';

if (idecorResponse.features && idecorResponse.features.length > 0) {
  const feature = idecorResponse.features[0];
  const props = feature.properties;

  // Campos típicos de IDECOR (ajustar según respuesta real)
  barrioCatastral = props.barrio || props.nombre_barrio || 'No disponible';
  superficieCatastral = props.superficie || props.sup_hectareas || 'No disponible';
  padronCatastral = props.nomenclatura || props.padron || 'No disponible';
  nomenclatura_catastral = props.nomenclatura_catastral || 'No disponible';

  console.log('🏛️ Datos IDECOR encontrados:', {
    barrio: barrioCatastral,
    superficie: superficieCatastral,
    padron: padronCatastral
  });
}

// Prompt placeholder para Córdoba
const claude_prompt = `# ANÁLISIS NORMATIVO URBANÍSTICO - CÓRDOBA CAPITAL

## ⚠️ ADVERTENCIA IMPORTANTE
Este análisis utiliza un DIGESTO PLACEHOLDER para Córdoba.
Los valores son APROXIMADOS y deben ser VALIDADOS con la Dirección de Planeamiento Urbano.

## INSTRUCCIONES
Genera un análisis normativo profesional para Córdoba Capital basándote en:
- Ordenanza 8256/2000 y modificatorias
- Datos catastrales oficiales de IDECOR
- Valores normativos generales de Córdoba

## DATOS DEL LOTE

**Dirección:** ${webhookData.direccion || 'No disponible'}
**Coordenadas:** Lat: ${georefData.lat}, Long: ${georefData.lon}
**Dimensiones:** ${webhookData.frente || 0} m x ${webhookData.profundidad || 0} m
**Superficie:** ${webhookData.superficie || 0} m²

## DATOS CATASTRALES OFICIALES (IDECOR)

**Barrio Catastral:** ${barrioCatastral}
**Padrón/Nomenclatura:** ${padronCatastral}
**Superficie Catastral:** ${superficieCatastral}
**Nomenclatura Catastral:** ${nomenclatura_catastral}

## DIGESTO CÓRDOBA (PLACEHOLDER)

**Zonas principales:**
- **Zona A**: FOS 0.60, FOT 1.20, Altura máx 9m
- **Zona B**: FOS 0.70, FOT 2.10, Altura máx 12m
- **Zona C1**: FOS 1.0, FOT 4.0, Sin límite altura (área central)
- **Zona C2**: FOS 0.85, FOT 3.0, Altura máx 18m

**IMPORTANTE:** Estos valores son APROXIMADOS. El sistema está pendiente de integración del digesto completo de Córdoba.

---

GENERAR ANÁLISIS con la siguiente estructura:

\`\`\`markdown
# ANÁLISIS NORMATIVO DEL LOTE - CÓRDOBA CAPITAL

## ⚠️ NOTA IMPORTANTE
Este análisis utiliza datos catastrales oficiales de IDECOR, pero los valores normativos son APROXIMADOS.
Se recomienda VALIDAR con la Dirección de Planeamiento Urbano de la Municipalidad de Córdoba.

## 📍 IDENTIFICACIÓN
[Datos del lote...]

## 🏛️ DATOS CATASTRALES OFICIALES (IDECOR)
[Datos de IDECOR...]

## 🏗️ ZONIFICACIÓN (PLACEHOLDER)
**Advertencia:** Zona aproximada - VALIDAR con municipalidad

## 📊 INDICADORES URBANÍSTICOS
[Valores aproximados según zona estimada]

## 📏 RETIROS OBLIGATORIOS
[Según normativa general Córdoba]

## 💡 OBSERVACIONES IMPORTANTES
1. Este análisis usa datos catastrales OFICIALES de IDECOR
2. Los valores normativos son APROXIMADOS
3. El sistema está pendiente de integración del digesto completo
4. **VALIDAR todo con Dirección de Planeamiento Urbano**

## ⚖️ NOTA LEGAL
Análisis preliminar basado en Ordenanza 8256/2000.
**VALIDACIÓN OBLIGATORIA** con autoridades municipales.
\`\`\`
`;

// Retornar contexto
return [{
  json: {
    claude_prompt: claude_prompt,
    direccion: webhookData.direccion,
    frente: webhookData.frente,
    profundidad: webhookData.profundidad,
    superficie: webhookData.superficie,
    email_cliente: webhookData.email_cliente,
    nombre_cliente: webhookData.nombre || 'Cliente',
    whatsapp_cliente: webhookData.whatsapp || '',
    lat: georefData.lat,
    lon: georefData.lon,
    direccion_geocodificada: georefData.direccion_normalizada,
    barrio_catastral: barrioCatastral,
    superficie_catastral: superficieCatastral,
    padron_catastral: padronCatastral,
    nomenclatura_catastral: nomenclatura_catastral,
    ciudad: 'Córdoba Capital',
    provincia: 'Córdoba',
    timestamp: new Date().toISOString(),
    digesto_version: 'placeholder_v1'
  }
}];
```

**Conexión:**
- INPUT: Consultar IDECOR WFS
- OUTPUT: Message a model (el mismo nodo de Claude que ya existe)

---

## PASO 4: Conectar Convergencia de Ramas

### 4.1 Conectar ambos "Preparar Contexto" al mismo "Message a model"

Ahora tienes:
- "Preparar Contexto" (Santiago) → "Message a model"
- "Preparar Contexto Córdoba" → "Message a model" (NUEVA CONEXIÓN)

Ambos nodos deben conectarse al MISMO "Message a model".

### 4.2 Verificar flujo completo

```
Webhook Trigger
    ↓
🏙️ Switch
    ├─ [0] Santiago ─→ Geo Coding (Google)
    │                     ↓
    │                  Formatear Coordenadas Google
    │                     ↓
    │                  Consultar GeoServer WMS
    │                     ↓
    │                  Preparar Contexto
    │                     ↓
    │                     ↓
    │                  Message a model ←───┐
    │                     ↓                 │
    │                                       │
    └─ [1] Córdoba ─→ Geo Coding Córdoba   │
                          ↓                 │
                       Formatear Georef     │
                          ↓                 │
                       Consultar IDECOR     │
                          ↓                 │
                       Preparar Contexto ───┘
                          Córdoba

                    Message a model
                          ↓
                    Generar JSON para Revit
                          ↓
                    Formatear Resultados
                          ↓
                    Email al Arquitecto
                          ↓
                    Webhook Response
                          ↓
                    Respond to Webhook
```

---

## PASO 5: Testing

### 5.1 Test Santiago (rama existente)
```json
{
  "ciudad": "santiago",
  "direccion": "Urquiza 248",
  "frente": 10,
  "profundidad": 40,
  "superficie": 400,
  "email_cliente": "test@example.com",
  "nombre": "Test Santiago",
  "whatsapp": "1234567890"
}
```

**Resultado esperado:**
- Switch envía a Output 0
- Usa Google Geocoding
- Usa GeoServer Santiago
- Análisis con digesto v5 de Santiago

### 5.2 Test Córdoba (rama nueva)
```json
{
  "ciudad": "cordoba",
  "direccion": "Av Vélez Sarsfield 100",
  "frente": 15,
  "profundidad": 30,
  "superficie": 450,
  "email_cliente": "test@example.com",
  "nombre": "Test Córdoba",
  "whatsapp": "1234567890"
}
```

**Resultado esperado:**
- Switch envía a Output 1
- Usa API Georef (gratuita)
- Usa IDECOR WFS (datos oficiales)
- Análisis con PLACEHOLDER de Córdoba (advertencia visible)

---

## PASO 6: Activar Workflow

1. Guardar todos los cambios
2. Click en el toggle "Active" arriba a la derecha
3. Verificar que dice "Active: true"

---

## ⚠️ NOTAS IMPORTANTES

### Digesto Córdoba
El "Preparar Contexto Córdoba" usa un **PLACEHOLDER** porque el digesto completo aún no está terminado.

**Próximos pasos:**
1. Completar `digesto_cordoba_v1.json` con todas las zonas
2. Integrar el JSON completo en "Preparar Contexto Córdoba"
3. Reemplazar el prompt placeholder por el digesto estructurado

### API Georef vs Google
- **Santiago**: Sigue usando Google Geocoding (ya configurado)
- **Córdoba**: Usa API Georef (gratuita, sin límites)
- Migrar Santiago a Georef en el futuro es opcional

### IDECOR WFS
- Devuelve datos catastrales OFICIALES de Córdoba
- Mucho más preciso que estimaciones
- Los campos pueden variar, ajustar según respuesta real

---

## 📞 Troubleshooting

### Error: "Switch no tiene output 1"
- Verificar que el Switch tiene configuradas 2 reglas
- Output 0: ciudad = santiago
- Output 1: ciudad = cordoba

### Error: "IDECOR no devuelve datos"
- Verificar URL del WFS
- Verificar que las coordenadas son correctas
- IDECOR puede tardar 10-15 segundos

### Error: "Georef no encuentra dirección"
- API Georef requiere direcciones más completas
- Ejemplo bueno: "Av Vélez Sarsfield 100, Córdoba"
- Ejemplo malo: "Vélez 100"

---

**Última actualización:** 2025-01-07
**Autor:** Claude Code + Federico
**Workflow ID:** EG5DPQd3LeHy7yv0
