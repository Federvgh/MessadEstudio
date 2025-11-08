# 🔧 PASOS MANUALES EN N8N - WORKAROUND IDECOR

**Fecha:** 2025-11-08
**Estado:** IDECOR WFS temporalmente deshabilitado (layer no accesible)
**Workflow:** https://federvgh.app.n8n.cloud/workflow/EG5DPQd3LeHy7yv0

---

## ⚠️ SITUACIÓN ACTUAL

El nodo "Consultar IDECOR WFS" falla con error:
```
Feature type idecor:parcelas unknown
```

**Solución temporal:** Deshabilitar IDECOR y usar placeholder vacío hasta investigar acceso correcto a la API.

---

## ✅ PASOS A SEGUIR EN N8N

### PASO 1: Deshabilitar nodo "Consultar IDECOR WFS"

1. Click derecho en el nodo "Consultar IDECOR WFS"
2. Seleccionar **"Disable"**
3. El nodo debe aparecer en gris/deshabilitado

---

### PASO 2: Actualizar "Formatear Coordenadas Georef"

**Ubicación:** Nodo CODE después de "Geo Coding Córdoba (Georef)"

**Acción:** Agregar campo `idecor_response` vacío al objeto de retorno

**Código completo:**
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
    localidad: direccion.localidad ? direccion.localidad.nombre : 'No disponible',
    // 👇 NUEVO: Datos IDECOR vacíos (temporal)
    idecor_response: {
      features: []
    }
  }
}];
```

**⚠️ IMPORTANTE:** Copiar y pegar TODO el código, reemplazando el contenido actual del nodo.

---

### PASO 3: Actualizar "Preparar Contexto Córdoba"

**Ubicación:** Nodo CODE al final de la rama Córdoba (antes de conectar a "Message a model")

**Acción:** Copiar código actualizado de `CODIGO_PREPARAR_CONTEXTO_CORDOBA.js`

**Instrucciones:**
1. Abrir archivo: `/Users/feder/VScode/MessadEstudio/CODIGO_PREPARAR_CONTEXTO_CORDOBA.js`
2. Copiar TODO el contenido (líneas 1-429)
3. En n8n, abrir nodo "Preparar Contexto Córdoba"
4. Seleccionar todo el código existente (Cmd+A)
5. Pegar el nuevo código (Cmd+V)
6. Click en "Save" o "Execute Node"

**Cambio clave (línea 59):**
```javascript
// ✅ NUEVO (lee desde georefData)
const idecorResponse = georefData.idecor_response || { features: [] };

// ❌ ANTERIOR (leía desde nodo IDECOR deshabilitado)
// const idecorResponse = items[0].json;
```

---

## 🧪 TESTING

Después de completar los 3 pasos, testear con caso Córdoba:

**Datos de prueba:**
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
- ✅ Rama Córdoba se ejecuta (Output 1 del Switch)
- ✅ API Georef devuelve coordenadas
- ✅ IDECOR deshabilitado (sin error)
- ✅ Preparar Contexto Córdoba lee `idecor_response` vacío
- ✅ Claude genera análisis con advertencia de datos catastrales "No disponible"
- ✅ Email se envía correctamente

**Verificar en logs:**
```
⚠️ USANDO CONTEXTO CÓRDOBA PLACEHOLDER
📍 Integrar digesto completo después de completar digesto_cordoba_v1.json
⚠️ No se encontraron datos catastrales en IDECOR (servicio temporalmente deshabilitado)
```

---

## 📊 ESTADO DEL FLUJO CÓRDOBA

**Con workaround activo:**

```
Webhook → Switch
  └─ [1] Córdoba → Geo Coding Córdoba (Georef) ✅
                     ↓
                   Formatear Coordenadas Georef ✅
                   (agrega idecor_response vacío)
                     ↓
                   [Consultar IDECOR WFS] ⚠️ DESHABILITADO
                     ↓
                   Preparar Contexto Córdoba ✅
                   (lee idecor_response desde georefData)
                     ↓
                   Message a model (Claude) ✅
                     ↓
                   Email al Arquitecto ✅
```

**Datos disponibles:**
- ✅ Coordenadas (Georef - oficial)
- ✅ Dirección normalizada (Georef - oficial)
- ✅ Provincia/Departamento/Localidad (Georef - oficial)
- ⚠️ Barrio catastral: "No disponible"
- ⚠️ Superficie catastral: "No disponible"
- ⚠️ Padrón/Nomenclatura: "No disponible"

**Digesto:**
- ⚠️ Valores FOS/FOT/alturas: Placeholder aproximados
- ⚠️ Zonificación: Estimada
- ⚠️ **Advertencia en análisis:** Usuario debe validar con municipalidad

---

## 🔍 INVESTIGACIÓN COMPLETADA - IDECOR

### ✅ Layer Encontrado

**Layer correcto:** `idecor:parcelas_cba`
**Servidor correcto:** `https://idecor-ws.mapascordoba.gob.ar` (NO `gn-idecor`)
**Endpoint WFS:** `/geoserver/idecor/wfs` o `/geoserver/ows`

**Documentación oficial:** https://www.mapascordoba.gob.ar/#/geoservicios

### ⚠️ Problema: Requiere Autenticación

**Todas las consultas devuelven Error 400**, incluso sin filtros:
```
https://idecor-ws.mapascordoba.gob.ar/geoserver/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=idecor:parcelas_cba&outputFormat=application/json&count=1
```

**Posibles causas:**
1. El servicio WFS requiere autenticación (API key o usuario/contraseña)
2. El servicio está restringido a IPs específicas
3. Hay parámetros obligatorios que faltan

### 📞 Próximos Pasos Recomendados

**1. Contactar IDECOR:**
- **Web:** https://www.idecor.gob.ar/
- **Email:** Buscar contacto en la página oficial
- **Consulta:** Solicitar acceso a WFS para `idecor:parcelas_cba` o documentación de autenticación

**2. Verificar Catastro en Línea:**
- **Web:** https://www.catastrocordoba.gob.ar/ca/idecor/
- Puede tener información sobre acceso a APIs

**3. API Alternativa:**
- Investigar si la Municipalidad de Córdoba tiene API REST de catastro propia
- Similar al GeoServer de Santiago del Estero

### 🔄 URL Correcta (cuando se obtenga acceso):

```
https://idecor-ws.mapascordoba.gob.ar/geoserver/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=idecor:parcelas_cba&outputFormat=application/json&CQL_FILTER=INTERSECTS(geom,POINT(lon lat))
```

**Nota sobre coordenadas:**
- IDECOR usa EPSG:22174 (Gauss-Krüger Córdoba)
- API Georef devuelve EPSG:4326 (WGS84)
- Verificar si el WFS hace transformación automática o hay que convertir antes

---

## 🎯 PRÓXIMOS PASOS

### Corto plazo (esta semana):
1. ✅ Completar PASOS 1-3 de este documento
2. ✅ Testear flujo Córdoba con placeholder
3. ⏳ Verificar que email se envía correctamente
4. ⏳ Validar que análisis incluye advertencias apropiadas

### Mediano plazo (próximas 2 semanas):
1. ⏳ Investigar acceso correcto a IDECOR (GetCapabilities)
2. ⏳ Si IDECOR es accesible: reactivar nodo y ajustar layer name
3. ⏳ Si IDECOR no es accesible: buscar fuente alternativa o mantener placeholder

### Largo plazo:
1. ⏳ Completar digesto_cordoba_v1.json (40-60 horas)
2. ⏳ Integrar digesto completo en "Preparar Contexto Córdoba"
3. ⏳ Validar con arquitecto de Córdoba

---

## ✅ CHECKLIST

Antes de considerar el workaround completo, verificar:

- [ ] Nodo "Consultar IDECOR WFS" está deshabilitado (gris)
- [ ] Nodo "Formatear Coordenadas Georef" incluye `idecor_response: { features: [] }`
- [ ] Nodo "Preparar Contexto Córdoba" tiene código actualizado de archivo .js
- [ ] Test con dirección Córdoba ejecuta sin errores
- [ ] Email recibido con análisis y advertencias apropiadas
- [ ] Logs muestran "⚠️ No se encontraron datos catastrales en IDECOR"

---

**Última actualización:** 2025-11-08
**Commit:** 3d5a8e5
**Workflow:** EG5DPQd3LeHy7yv0
**Responsable:** Federico + Claude Code
