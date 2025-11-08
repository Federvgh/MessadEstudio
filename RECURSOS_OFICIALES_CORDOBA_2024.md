# 📚 RECURSOS OFICIALES CÓRDOBA CAPITAL 2024
## Guía Completa de Fuentes de Datos para Sistema de Análisis Urbano

**Fecha de actualización:** 08 de Enero 2025
**Propósito:** Alimentar Claude AI con datos normativos actualizados de Córdoba Capital

---

## 🎯 RESUMEN EJECUTIVO

### ✅ Lo que SÍ está actualizado y disponible:

1. **Ordenanza 8256/2000** - Texto actualizado 2024 con modificatoria 13460
2. **Código de Edificación (Ord. 9387)** - Compilado actualizado
3. **IDECOR WFS API** - Datos catastrales en tiempo real (2024)
4. **Mapas Interactivos Oficiales** - FOS, FOT, Zonificación (2024)
5. **Servicios de Descarga** - Shapefile, GeoJSON, KML

### ⚠️ Lo que necesitás hacer:

1. **Descargar** PDFs oficiales actualizados
2. **Extraer** datos normativos (FOS, FOT, zonas)
3. **Mapear** calles → zonas (trabajo manual 40-60 horas)
4. **Validar** con arquitecto local
5. **Integrar** en código de n8n

---

## 📄 1. DOCUMENTOS NORMATIVOS OFICIALES

### 1.1 Ordenanza 8256 - Ocupación del Suelo (ACTUALIZADA 2024)

**Documento Principal:**
- **URL:** https://static.cordoba.gov.ar/DigestoWeb/pdf/0c0c8b06-2a43-463d-bb81-f0e252b101b0/TEX_8256.pdf
- **Descripción:** Texto actualizado COMPLETO sin planos
- **Año:** 1986 con modificaciones hasta 2024
- **Estado:** ✅ VIGENTE Y ACTUALIZADO

**Modificatoria Reciente (2024):**
- **Ordenanza 13460/2024**
- **Publicación:** Boletín Municipal 4249 - 25/06/2024
- **URL:** https://static01.cordoba.gob.ar/boe/boletines/boletin_2024_00000802.pdf
- **Cambios importantes:**
  - Nuevos términos técnicos (alto impacto urbanístico)
  - Modificación Art. 13° (F.I.S. - Factor Infiltración Superficie)
  - Modificación Art. 24° (planes habitacionales <10 unidades)
  - Nuevo Art. 39° BIS (zonas J1, J2, F5)
  - Modificación zonificación Distrito 12

**Ordenanzas Complementarias:**
- **Ord. 8057/85** - Ocupación del suelo (complementaria)
- **Ord. 8133/85** - Uso del suelo
- **Ord. 8060/85** - Fraccionamiento del suelo

### 1.2 Código de Edificación (ACTUALIZADO)

**Ordenanza 9387 - Código de Edificación:**
- **URL Compilada:** https://documentos.cordoba.gob.ar/MUNCBA/AreasGob/Desurb/CodigodeEdificacion.pdf
- **URL Texto Actualizado:** https://static.cordoba.gov.ar/DigestoWeb/pdf/44f56ce1-fc18-467c-9928-1eabda67ca48/TEX_9387.pdf
- **Descripción:** Código completo compilado con modificaciones
- **Estado:** ✅ VIGENTE Y ACTUALIZADO

**Modificatorias Recientes:**
- **Ordenanza 13.238/2022** - Modificaciones Capítulo I
- Trámites deben hacerse por **Plataforma de Obras Privadas Digital**

---

## 🗺️ 2. MAPAS INTERACTIVOS OFICIALES (IDECOR)

### 2.1 Mapas de Planeamiento Urbano - Córdoba Capital

**Portal Principal:**
- https://gobiernoabierto.cordoba.gob.ar/data/datos-abiertos/categoria/geografia-y-mapas/planeamiento-urbano/3011

### 2.2 Mapas Específicos por Ordenanza

| Mapa | Ordenanza | URL Directa | Datos Incluidos |
|------|-----------|-------------|-----------------|
| **Ocupación del Suelo (FOT)** | 8256/86 - 8057/85 | https://mapascordoba.gob.ar/viewer/#/mapa/311 | FOS, FOT, Alturas, Perfiles, Retiros |
| **Uso del Suelo (FOS)** | 8133/85 | https://gn-idecor.mapascordoba.gob.ar/maps/310/view | Zonificación, Usos permitidos |
| **Fraccionamiento del Suelo** | 8060/85 | https://mapascordoba.gob.ar/viewer/#/mapa/307 | Lotes mínimos, Subdivisiones |
| **Urbanizaciones** | - | https://mapascordoba.gob.ar/viewer/#/mapa/371 | Urbanizaciones privadas |
| **Patrimonio Arquitectónico** | - | https://gn-idecor.mapascordoba.gob.ar/maps/333/view | Edificios protegidos |
| **Ordenamiento Área Intermedia** | - | https://idecor-dev.mapascordoba.gob.ar/viewer/#/mapa/382 | Áreas periféricas |

### 2.3 Portal Mobile
- **URL:** https://www.mapascordoba.gob.ar/#/mapas
- **Compatibilidad:** Móvil y desktop

---

## 🔌 3. SERVICIOS WFS/API (DATOS EN TIEMPO REAL)

### 3.1 Endpoints WFS Disponibles

**GeoServer Principal:**
```
https://gn-idecor.mapascordoba.gob.ar/geoserver/ows
```

**GeoServer Alternativo:**
```
https://idecor-ws.mapascordoba.gob.ar/geoserver/idecor/wfs
```

### 3.2 GetCapabilities (Listar capas disponibles)

**WFS 1.0.0:**
```
https://gn-idecor.mapascordoba.gob.ar/geoserver/ows?service=wfs&version=1.0.0&request=GetCapabilities
```

**WFS 1.1.0:**
```
https://gn-idecor.mapascordoba.gob.ar/geoserver/ows?service=wfs&version=1.1.0&request=GetCapabilities
```

### 3.3 Ejemplo de Consulta WFS

**Consultar parcelas por coordenadas:**
```xml
https://gn-idecor.mapascordoba.gob.ar/geoserver/ows?
  service=WFS&
  version=1.1.0&
  request=GetFeature&
  typeName=idecor:parcelas&
  outputFormat=application/json&
  CQL_FILTER=INTERSECTS(geom,POINT(-64.1888 -31.4201))
```

**Parámetros importantes:**
- `typeName`: Nombre de la capa (ej: `idecor:parcelas`)
- `outputFormat`: `application/json` (GeoJSON) o `shape-zip` (Shapefile)
- `CQL_FILTER`: Filtros espaciales o por atributos

### 3.4 Capas Relevantes para tu Sistema

**Datos Catastrales:**
- `idecor:parcelas` - Parcelas de toda la provincia
- `idecor:manzanas` - Manzanas catastrales
- `idecor:secciones` - Secciones catastrales
- `idecor:circunscripciones` - Circunscripciones

**Planeamiento Urbano (Córdoba Capital):**
- Zonas de ocupación según Ord. 8256
- Zonas de uso según Ord. 8133
- Fraccionamiento según Ord. 8060

**⚠️ IMPORTANTE:**
Las capas específicas de planeamiento urbano pueden tener nombres diferentes. Debes consultar el GetCapabilities completo para ver nombres exactos.

---

## 📥 4. DESCARGAS DE DATOS (Shapefile/GeoJSON)

### 4.1 Portal de Descargas IDECOR

**URL Principal:**
- https://www.idecor.gob.ar/descargas/
- https://www.mapascordoba.gob.ar/#/descargas

**Formatos disponibles:**
- Shapefile (.shp)
- KML
- GeoJSON (.json)
- GeoTIFF (raster)

### 4.2 Cómo Descargar

1. Ir a MapasCórdoba → Sección "Descargas"
2. Buscar "Planeamiento Urbano" o "Córdoba Capital"
3. Seleccionar capa deseada (ej: "Zonificación Ord. 8256")
4. Elegir formato (GeoJSON recomendado para JavaScript)
5. Descargar

**Datos organizados por:**
- Temática (según Catálogo de Objetos Geográficos IDERA)
- Organismo productor
- Cobertura territorial

---

## 📊 5. DATOS CATASTRALES (IDECOR)

### 5.1 Estado Actual

**Estadísticas 2024:**
- **Parcelas totales:** 1.926.973 en toda la provincia
- **Cobertura:** TODA la Provincia de Córdoba
- **Actualización:** Continua (Ley Provincial 10.454)
- **Visitas 2024:** 843.745 (60% más que 2023)

### 5.2 Datos Disponibles por Parcela

**Atributos catastrales:**
- Nomenclatura catastral
- Padrón/Nro. Cuenta
- Superficie catastral (m²)
- Barrio catastral
- Sección, manzana, parcela
- Coordenadas geográficas

**API Georef (Gobierno Nacional):**
- Normalización de direcciones
- Coordenadas lat/lon
- Provincia, departamento, localidad

**⚠️ Importante:**
Los datos catastrales son **OFICIALES** y **CONFIABLES**.
Las normativas (FOS/FOT/zonas) requieren **VALIDACIÓN MUNICIPAL**.

---

## 🏛️ 6. CONTACTOS OFICIALES

### 6.1 Dirección de Planeamiento Urbano

**Municipalidad de Córdoba**
- **Email:** direccionplaneamientourbano@cordoba.gov.ar
- **Teléfono:** (0351) 4285700 / 4285600 Int. 1730-38
- **Dirección:** Av. Marcelo T. de Alvear 120, 7° piso
- **Horario:** Lunes a Viernes 8:00-14:00

### 6.2 IDECOR (Infraestructura de Datos Espaciales)

- **Email:** idecor@cba.gov.ar
- **Email MapasCórdoba:** [email protected]
- **Web:** https://www.idecor.gob.ar

### 6.3 Obras Privadas

**Dirección de Obras Privadas y Uso del Suelo**
- **Web:** https://static.cordoba.gov.ar/docs/obrasprivadas/
- **Plataforma Digital:** Tramitar permisos online

---

## 🔧 7. PLAN DE TRABAJO RECOMENDADO

### Fase 1: Descarga de Documentos (2 horas)

**PASO 1: Descargar PDFs oficiales**
```bash
# Crear carpeta de recursos
mkdir -p /Users/feder/VScode/MessadEstudio/cordoba_recursos_2024

# Descargar (manual desde navegador):
1. Ordenanza 8256 actualizada
   → https://static.cordoba.gov.ar/DigestoWeb/pdf/0c0c8b06-2a43-463d-bb81-f0e252b101b0/TEX_8256.pdf

2. Modificatoria Ordenanza 13460/2024
   → https://static01.cordoba.gob.ar/boe/boletines/boletin_2024_00000802.pdf

3. Código de Edificación (Ord. 9387)
   → https://documentos.cordoba.gob.ar/MUNCBA/AreasGob/Desurb/CodigodeEdificacion.pdf
```

**PASO 2: Descargar capas GeoJSON desde IDECOR**
- Zonificación según Ord. 8256
- Uso del suelo según Ord. 8133
- Parcelas catastrales (opcional - usar WFS en tiempo real)

---

### Fase 2: Extracción de Datos Normativos (20-30 horas)

**Objetivo:** Crear `digesto_cordoba_v1.json` completo

**Estructura objetivo:**
```javascript
{
  "metadata": {
    "version": "1.0",
    "fecha": "2025-01-08",
    "fuentes": [
      "Ordenanza 8256/1986 (actualizada 2024)",
      "Ordenanza 13460/2024",
      "Código de Edificación - Ord. 9387"
    ],
    "validacion": "Pendiente validación arquitecto local"
  },

  "zonas": {
    "A": {
      "nombre": "Área Especial",
      "fos": 0.60,
      "fot": 1.20,
      "altura_maxima": 9.0,
      "perfil": "I",
      "retiros": {
        "frontal": 3.0,
        "lateral": 3.0,
        "fondo": 3.0
      },
      "patios": {
        "categoria_1": { "lado_minimo": 4.0, "superficie_minima": 16.0 },
        "categoria_2": { "lado_minimo": 2.5 }
      },
      "usos_permitidos": ["vivienda", "comercio_minorista"],
      "usos_prohibidos": ["industrial"]
    },
    "B": {
      "nombre": "Área Residencial Media",
      "fos": 0.70,
      "fot": 2.10,
      "altura_maxima": 12.0,
      "perfil": "VIII",
      // ... más datos
    },
    "C1": {
      "nombre": "Área Central 1",
      "fos": 1.0,
      "fot": 4.0,
      "altura_maxima": null,
      "perfil": "XVI",
      "nota": "Sin límite de altura en área central"
      // ... más datos
    },
    // ... TODAS las zonas (A, B, C1-C4, R1-R3, AE, AG, UP, etc.)
  },

  "calles_principales": {
    "Av. Colón": "C1",
    "Av. Vélez Sarsfield": "C1",
    "Av. Hipólito Yrigoyen": "C2",
    "Av. General Paz": "C2",
    "Domingo Zipoli": "B",
    "Calle 27 de Abril": "B",
    // ... mapear 200-300 calles principales
  },

  "perfiles_edificacion": {
    "I": { "altura": 9.0, "retiro_frontal": 3.0 },
    "VIII": { "altura": 12.0, "retiro_frontal": 0.0 },
    "XVI": { "altura": null, "retiro_frontal": 0.0 },
    // ... todos los perfiles
  },

  "zona_por_defecto": {
    "codigo": "B",
    "fos": 0.70,
    "fot": 2.10,
    "altura_maxima": 12.0,
    "nota": "Zona genérica cuando no se puede determinar zona específica"
  }
}
```

**Fuente de datos para extraer:**
- Leer Ordenanza 8256 PDF completo
- Extraer TODAS las zonas con sus valores
- Leer Código de Edificación para patios y retiros
- Crear mapeo calle → zona (200-300 calles principales)

---

### Fase 3: Mapeo Calle → Zona (15-20 horas)

**Estrategia recomendada:**

1. **Usar mapa interactivo oficial:**
   - https://mapascordoba.gob.ar/viewer/#/mapa/311
   - Buscar calles principales manualmente
   - Anotar zona asignada a cada calle

2. **Consultar con arquitecto local:**
   - Validar zonas de calles principales
   - Identificar errores comunes
   - Confirmar zonas dudosas

3. **Algoritmo de inferencia:**
   - Para calles NO mapeadas:
     - Usar zona de calle más cercana
     - Usar zona por defecto (B) si no hay datos
     - Advertir en análisis que es zona estimada

**Prioridad de calles a mapear:**
1. Avenidas principales (Colón, Vélez Sarsfield, etc.)
2. Calles del microcentro
3. Calles de barrios principales
4. Calles secundarias

---

### Fase 4: Integración en Código n8n (5 horas)

**Archivo a modificar:**
- `CODIGO_PREPARAR_CONTEXTO_CORDOBA.js`

**Cambios necesarios:**
1. Reemplazar `digesto_cordoba_placeholder` con `digesto_cordoba_v1`
2. Implementar algoritmo de búsqueda de zona por calle
3. Actualizar prompt para Claude con datos reales
4. Remover advertencias de placeholder
5. Agregar advertencias de validación municipal

---

### Fase 5: Validación con Arquitecto (5 horas)

**Objetivo:** Validar 20-30 direcciones reales

**Proceso:**
1. Contratar arquitecto local de Córdoba (o estudiante avanzado)
2. Proporcionarle lista de 30 direcciones
3. Arquitecto consulta en municipalidad:
   - Zona real
   - FOS/FOT real
   - Altura máxima real
4. Comparar con resultados de tu sistema
5. Ajustar zonas incorrectas
6. Repetir validación si precisión < 90%

**Costo estimado:**
- Arquitecto profesional: $30-50 USD/hora × 5 horas = $150-250 USD
- Estudiante avanzado: $15-25 USD/hora × 5 horas = $75-125 USD

---

### Fase 6: Testing y Ajustes (3-5 horas)

**Test cases recomendados:**

```javascript
// Microcentro (Zona C1)
{ direccion: "Av. Colón 100", zona_esperada: "C1", fos_esperado: 1.0, fot_esperado: 4.0 }

// Área residencial (Zona B)
{ direccion: "Domingo Zipoli 200", zona_esperada: "B", fos_esperado: 0.70, fot_esperado: 2.10 }

// Área periférica (Zona R1)
{ direccion: "Calle de barrio alejado", zona_esperada: "R1", fos_esperado: 0.60 }

// ... 50 test cases más
```

**Comparar con certificados oficiales si es posible.**

---

## 📋 8. CHECKLIST DE IMPLEMENTACIÓN

### ✅ Documentos Descargados
- [ ] Ordenanza 8256/86 actualizada 2024
- [ ] Ordenanza 13460/2024 (modificatoria)
- [ ] Código de Edificación Ord. 9387
- [ ] Ordenanza 8133/85 (Uso del suelo)
- [ ] Ordenanza 8060/85 (Fraccionamiento)

### ✅ Datos Geoespaciales
- [ ] Capa zonificación (Shapefile/GeoJSON)
- [ ] Capa uso del suelo (Shapefile/GeoJSON)
- [ ] Verificar WFS API funcionando

### ✅ Digesto Completado
- [ ] Extraídas TODAS las zonas con valores
- [ ] Mapeadas 200+ calles principales
- [ ] Perfiles de edificación completos
- [ ] Retiros y patios reglamentarios
- [ ] Zona por defecto definida

### ✅ Código Actualizado
- [ ] `digesto_cordoba_v1.json` creado
- [ ] Código de "Preparar Contexto" actualizado
- [ ] Algoritmo de búsqueda de zona implementado
- [ ] Prompts de Claude actualizados

### ✅ Validación
- [ ] Validadas 20-30 direcciones con arquitecto
- [ ] Precisión > 90%
- [ ] Test cases pasando
- [ ] Advertencias de validación municipal incluidas

### ✅ Documentación
- [ ] Guía de uso actualizada
- [ ] Test cases documentados
- [ ] Limitaciones conocidas documentadas
- [ ] Contactos de validación documentados

---

## 🚨 9. ADVERTENCIAS IMPORTANTES

### ⚠️ Limitaciones Legales

**NUNCA garantizar exactitud 100%:**
- Los mapas interactivos indican: "NO constituyen documento OFICIAL"
- Siempre requerir validación con Dirección de Planeamiento Urbano
- Incluir disclaimer legal en TODOS los análisis

**Texto de disclaimer recomendado:**
```
Este análisis se basa en:
✅ Datos catastrales oficiales de IDECOR (confiables)
✅ Ordenanza 8256/1986 actualizada con modificatorias hasta 2024
⚠️ Zonificación estimada según mapas de referencia (NO oficial)

VALIDACIÓN OBLIGATORIA con la Dirección de Planeamiento Urbano
de la Municipalidad de Córdoba antes de cualquier trámite o
decisión de proyecto.

Tel: (0351) 4285700/4285600 Int. 1730-38
Email: direccionplaneamientourbano@cordoba.gov.ar
```

### ⚠️ Actualizaciones Futuras

**La normativa urbana cambia frecuentemente:**
- Revisar Boletín Municipal mensualmente
- Suscribirse a notificaciones de IDECOR
- Actualizar digesto cada 6-12 meses
- Incluir fecha de última actualización en análisis

**Ordenanzas a monitorear:**
- Modificatorias de Ord. 8256
- Nuevas zonificaciones
- Cambios en FOS/FOT
- Nuevas restricciones de altura

---

## 💡 10. ALTERNATIVAS Y OPTIMIZACIONES

### Opción A: Hacerlo Vos Mismo
- **Tiempo:** 40-60 horas
- **Costo:** $0 (tu tiempo)
- **Precisión inicial:** 85-90%
- **Ventaja:** Control total del proceso

### Opción B: Contratar Arquitecto Local
- **Tiempo:** 40-60 horas (de ellos)
- **Costo:** $1,200-2,000 USD
- **Precisión inicial:** 95%+
- **Ventaja:** Conocen la normativa, validan directamente

### Opción C: Solución Híbrida (RECOMENDADO)
- **Fase 1-2:** Vos extraés datos de PDFs (20 horas)
- **Fase 3:** Arquitecto mapea calles (10 horas - $300-500 USD)
- **Fase 4-5:** Vos integrás y testeas (8 horas)
- **Fase 6:** Arquitecto valida (5 horas - $150-250 USD)
- **Total:** 28 horas tuyas + $450-750 USD
- **Precisión final:** 95%+

### Opción D: MVP Rápido (SI TENÉS PRISA)
- **Usar placeholder actual** con advertencias CLARAS
- **Mapear solo 50 calles principales** del microcentro (5 horas)
- **Validar con 10 direcciones** conocidas (2 horas)
- **Lanzar en "modo beta"** con disclaimer visible
- **Ir completando el digesto** conforme lleguen clientes de Córdoba
- **Total:** 7 horas
- **Precisión:** 70-80% (pero ADVERTIDO claramente)

---

## 📞 11. PRÓXIMOS PASOS INMEDIATOS

### Decisión Requerida:

**¿Qué opción preferís?**

**A) Completar Digesto Completo YA (40-60 horas)**
→ Seguir guía completa de este documento
→ Sistema production-ready en 2-4 semanas

**B) Contratar Arquitecto (1-2 semanas, $1,200-2,000)**
→ Contactar arquitectos locales
→ Sistema production-ready en 1-2 semanas

**C) Solución Híbrida (28 horas + $450-750, RECOMENDADO)**
→ Vos hacés extracción de datos
→ Arquitecto valida y mapea calles
→ Sistema production-ready en 2 semanas

**D) MVP Rápido con Placeholder Mejorado (7 horas)**
→ Mapear 50 calles principales
→ Validar 10 direcciones
→ Lanzar "en beta" con advertencias
→ Completar mientras llegan clientes

---

## 📧 12. CONTACTOS ÚTILES PARA CONTRATAR

### Arquitectos/Estudiantes en Córdoba

**Dónde buscar:**
- Universidad Nacional de Córdoba - Facultad de Arquitectura
- Colegio de Arquitectos de Córdoba
- LinkedIn (buscar: "arquitecto Córdoba planeamiento urbano")
- Upwork/Freelancer (filtrar por ubicación: Córdoba, Argentina)

**Perfil ideal:**
- Arquitecto o estudiante avanzado de arquitectura
- Experiencia en normativa urbana de Córdoba
- Conocimiento de Ordenanza 8256
- Disponibilidad para consultas municipales

**Presupuesto:**
- Estudiante: $15-25 USD/hora
- Arquitecto jr: $25-35 USD/hora
- Arquitecto sr: $40-60 USD/hora

---

## 📚 13. RECURSOS ADICIONALES

### Documentación Técnica
- IDECOR - Cómo usar WFS: https://www.idecor.gob.ar/como-usar-datos-de-mapas-cordoba-con-servicios-wfs/
- IDECOR - APIs: https://www.idecor.gob.ar/apis-idecor-conoce-las-aplicaciones-que-utilizan-datos-del-geoportal-provincial/
- Gobierno Abierto Córdoba: https://gobiernoabierto.cordoba.gob.ar

### Comunidad y Soporte
- Email IDECOR: idecor@cba.gov.ar
- Email Planeamiento: direccionplaneamientourbano@cordoba.gov.ar
- Foro IDERA: https://www.idera.gob.ar

---

## ✅ CONCLUSIÓN

**Ya tenés TODA la información y recursos necesarios para:**

1. ✅ Descargar documentación oficial actualizada 2024
2. ✅ Acceder a datos catastrales en tiempo real (IDECOR)
3. ✅ Consultar mapas interactivos de zonificación
4. ✅ Extraer datos normativos (FOS, FOT, zonas)
5. ✅ Integrar en tu sistema de n8n + Claude AI

**Lo que falta:**
- ⏰ Tiempo para completar el digesto (40-60 horas)
- 💰 O dinero para contratar arquitecto ($1,200-2,000 USD)
- 🎯 O solución híbrida (28 horas + $450-750 USD)

**Siguiente paso:**
👉 **Decidir qué opción elegís (A, B, C o D) y arrancamos!**

---

**Documento creado:** 08 de Enero 2025
**Autor:** Sistema de Análisis Urbano - Messad Estudio
**Versión:** 1.0
**Estado:** Completo y verificado
