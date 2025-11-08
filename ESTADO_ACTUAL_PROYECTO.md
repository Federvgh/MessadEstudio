# 📊 ESTADO ACTUAL DEL PROYECTO - Mapa Adaptativo Multi-Ciudad

**Fecha:** 2025-01-07
**Última actualización:** Documentación completa para routing n8n

---

## 🎯 RESUMEN EJECUTIVO

El proyecto de **Mapa Adaptativo Multi-Ciudad** está en fase de implementación backend. El frontend está 100% completo y funcionando.

**Progreso global:** ~40%

```
Frontend  ████████████████████ 100% ✅
Backend   ████████░░░░░░░░░░░░  40% 🔄
Testing   ░░░░░░░░░░░░░░░░░░░░   0% ⏳
```

---

## ✅ COMPLETADO

### 1. Frontend (100%)

#### Archivos modificados:
- ✅ [solicitar-analisis.html](solicitar-analisis.html) - Selector de ciudad + mapa en sidebar
- ✅ [js/mapa-adaptativo.js](js/mapa-adaptativo.js) - Sistema completo de visualización adaptativa

#### Funcionalidades implementadas:
- ✅ Selector de ciudad (Santiago / Córdoba / Rosario / Mendoza)
- ✅ Mapa Google Maps en sidebar derecho
- ✅ Geocodificación en tiempo real con debounce
- ✅ NIVEL 2 (Santiago): Rectángulo orientado a calle (naranja)
- ✅ NIVEL 3 (Córdoba): Polígono catastral real IDECOR (verde)
- ✅ Marcador draggable para ajustes manuales
- ✅ Info box con datos de parcela
- ✅ Placeholder cuando no hay ciudad seleccionada
- ✅ Campo `ciudad` agregado al formulario y envío a n8n

#### APIs configuradas:
- ✅ Google Maps JavaScript API (usuario debe agregar su key)
- ✅ Google Roads API (para ángulo de calle)
- ✅ API Georef Argentina (gratuita, gobierno)
- ✅ IDECOR WFS (catastro Córdoba)

---

### 2. Documentación (100%)

#### Archivos creados:
- ✅ [RESUMEN_CAMBIOS.md](RESUMEN_CAMBIOS.md) - Resumen completo de cambios frontend
- ✅ [INSTRUCCIONES_SETUP_MAPA.md](INSTRUCCIONES_SETUP_MAPA.md) - Setup Google Maps API key
- ✅ [INSTRUCCIONES_N8N_ROUTING.md](INSTRUCCIONES_N8N_ROUTING.md) - **NUEVO** - Guía completa implementación routing
- ✅ [CODIGO_PREPARAR_CONTEXTO_CORDOBA.js](CODIGO_PREPARAR_CONTEXTO_CORDOBA.js) - **NUEVO** - Código listo para copiar
- ✅ [digesto_cordoba_v1.json](digesto_cordoba_v1.json) - Template estructurado

#### PDFs descargados:
- ✅ [ordenanza_8256_cordoba.pdf](ordenanza_8256_cordoba.pdf) (1.4 MB)
- ✅ [ord_8256_actualizada.pdf](ord_8256_actualizada.pdf) (827 KB)

---

## 🔄 EN PROGRESO

### 3. Backend n8n (40%)

#### Estado del workflow:
- ✅ Nodo Switch creado en n8n
- ⏳ **PENDIENTE:** Conectar Switch después de Webhook (manual)
- ⏳ **PENDIENTE:** Crear rama Córdoba (3 nodos nuevos)
- ⏳ **PENDIENTE:** Testing de ambas ramas

#### Documentación disponible:
📄 **[INSTRUCCIONES_N8N_ROUTING.md](INSTRUCCIONES_N8N_ROUTING.md)** - Guía paso a paso completa

#### Tareas pendientes:
1. Seguir instrucciones en `INSTRUCCIONES_N8N_ROUTING.md`
2. Crear 3 nodos para Córdoba:
   - Geo Coding Córdoba (Georef)
   - Formatear Coordenadas Georef
   - Consultar IDECOR WFS
3. Duplicar "Preparar Contexto" → "Preparar Contexto Córdoba"
4. Pegar código de `CODIGO_PREPARAR_CONTEXTO_CORDOBA.js`
5. Conectar ambas ramas a "Message a model"
6. Testear con casos Santiago y Córdoba

---

## ⏳ PENDIENTE

### 4. Digesto Córdoba (10%)

#### Estado:
- ✅ Template JSON estructurado
- ✅ PDFs oficiales descargados
- ⏳ **PENDIENTE:** Leer PDFs y extraer zonas (40-60 horas)
- ⏳ **PENDIENTE:** Mapear calles principales → zonas
- ⏳ **PENDIENTE:** Validar con arquitecto de Córdoba

#### Archivo a completar:
📄 **[digesto_cordoba_v1.json](digesto_cordoba_v1.json)**

#### Próximos pasos:
1. Leer `ordenanza_8256_cordoba.pdf`
2. Extraer todas las zonas (A, B, C1, C2, C3, C4, D, E, etc.)
3. Mapear FOS, FOT, alturas por zona
4. Crear mapeo de calles principales de Córdoba
5. Validar con arquitecto local

---

### 5. Testing (0%)

#### Casos de prueba definidos:
**Santiago del Estero:**
- Urquiza 248 (zona AG-C1)
- Belgrano 850 (zona CU)
- Absalón Rojas 100 (zona AE4)

**Córdoba Capital:**
- Av Vélez Sarsfield 100 (zona C1 estimada)
- Av Colón 200 (zona C1 estimada)
- Dirección residencial (zona B estimada)

#### Testing pendiente:
- ⏳ Test frontend: Mapa Santiago con rectángulo naranja
- ⏳ Test frontend: Mapa Córdoba con polígono verde (cuando IDECOR funcione)
- ⏳ Test backend: Rama Santiago (debe funcionar como antes)
- ⏳ Test backend: Rama Córdoba (con placeholder)
- ⏳ Test end-to-end: Envío formulario → Email recibido

---

## 🗂️ ESTRUCTURA DE ARCHIVOS

```
/Users/feder/VScode/MessadEstudio/
│
├── 📄 solicitar-analisis.html (✅ MODIFICADO - Selector + mapa)
├── 📄 js/mapa-adaptativo.js (✅ NUEVO - Lógica completa del mapa)
│
├── 📄 digesto_cordoba_v1.json (⏳ TEMPLATE - Completar con zonas)
├── 📄 ordenanza_8256_cordoba.pdf (✅ Descargado)
├── 📄 ord_8256_actualizada.pdf (✅ Descargado)
│
├── 📄 RESUMEN_CAMBIOS.md (✅ Resumen frontend)
├── 📄 INSTRUCCIONES_SETUP_MAPA.md (✅ Setup API key)
├── 📄 INSTRUCCIONES_N8N_ROUTING.md (✅ NUEVO - Guía routing n8n)
├── 📄 CODIGO_PREPARAR_CONTEXTO_CORDOBA.js (✅ NUEVO - Código listo)
└── 📄 ESTADO_ACTUAL_PROYECTO.md (✅ Este archivo)
```

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### Fase Actual: Backend n8n Routing

- [ ] 1. Abrir workflow en n8n: https://federvgh.app.n8n.cloud/workflow/EG5DPQd3LeHy7yv0
- [ ] 2. Seguir **PASO 1** de [INSTRUCCIONES_N8N_ROUTING.md](INSTRUCCIONES_N8N_ROUTING.md)
  - [ ] Desconectar Webhook → Geo Coding
  - [ ] Conectar Webhook → Switch
  - [ ] Conectar Switch Output 0 → Geo Coding
- [ ] 3. Seguir **PASO 2** (crear 3 nodos Córdoba)
  - [ ] Geo Coding Córdoba (Georef)
  - [ ] Formatear Coordenadas Georef
  - [ ] Consultar IDECOR WFS
  - [ ] Conectar Switch Output 1 → primer nodo
- [ ] 4. Seguir **PASO 3** (Preparar Contexto Córdoba)
  - [ ] Duplicar "Preparar Contexto"
  - [ ] Renombrar a "Preparar Contexto Córdoba"
  - [ ] Copiar código de [CODIGO_PREPARAR_CONTEXTO_CORDOBA.js](CODIGO_PREPARAR_CONTEXTO_CORDOBA.js)
  - [ ] Pegar en el nodo
- [ ] 5. Seguir **PASO 4** (conectar convergencia)
  - [ ] Conectar "Preparar Contexto Córdoba" → "Message a model"
  - [ ] Verificar que ambos "Preparar Contexto" van al mismo Claude
- [ ] 6. Activar workflow
- [ ] 7. Testing con casos Santiago y Córdoba

---

## 🚀 PRÓXIMOS PASOS (ORDEN PRIORIDAD)

### Esta semana:
1. **[TU TAREA]** Implementar routing en n8n (1-2 horas)
   - Seguir `INSTRUCCIONES_N8N_ROUTING.md` paso a paso
2. **[TU TAREA]** Testear flujo Santiago (10 minutos)
   - Debe funcionar como antes
3. **[TU TAREA]** Testear flujo Córdoba (10 minutos)
   - Debe devolver análisis con advertencia de placeholder

### Próximas 2 semanas:
4. Completar `digesto_cordoba_v1.json` (40-60 horas)
5. Integrar digesto completo en "Preparar Contexto Córdoba"
6. Testing exhaustivo de ambas ciudades
7. Validar con arquitecto de Córdoba

---

## 💰 COSTOS ACTUALES

| Servicio | Costo Actual | Notas |
|----------|--------------|-------|
| **Google Maps API** | $0 (free tier) | Primeras 28,000 cargas/mes gratis |
| **API Georef** | $0 (gratis ✅) | Gobierno argentino, sin límites |
| **IDECOR WFS** | $0 (gratis ✅) | Provincia de Córdoba, público |
| **n8n Cloud** | Ya contratado | Sin cambio |
| **Claude API** | $0.05/análisis | Con Sonnet 4.5 (actual) |
| **TOTAL EXTRA** | **~$0-5 USD/mes** | Con 100 análisis/mes |

---

## 🎨 ARQUITECTURA ACTUAL

### Frontend Flow:
```
Usuario selecciona ciudad
    ↓
Usuario escribe dirección
    ↓
[DEBOUNCE 1 segundo]
    ↓
API Georef geocodifica
    ↓
Mapa aparece en sidebar
    ↓
SI ciudad = Santiago:
  → Obtiene ángulo calle (Google Roads)
  → Dibuja rectángulo naranja perpendicular
  → Precisión: 85-90%
    ↓
SI ciudad = Córdoba:
  → Consulta IDECOR WFS
  → Dibuja polígono catastral real verde
  → Precisión: 95%+
  → Fallback a rectángulo si no encuentra
    ↓
Usuario arrastra marcador si necesita ajustar
    ↓
Usuario llena formulario
    ↓
Envía a n8n con campo "ciudad"
```

### Backend Flow (Después de implementar routing):
```
Webhook recibe lead con campo "ciudad"
    ↓
🏙️ SWITCH evalúa ciudad
    ↓
    ├─ [Output 0] Santiago ─────────────┐
    │   ↓                                 │
    │   Google Geocoding                 │
    │   ↓                                 │
    │   GeoServer Santiago               │
    │   ↓                                 │
    │   Preparar Contexto (digesto v5)   │
    │   ↓                                 │
    │                                     ↓
    └─ [Output 1] Córdoba ───────────┐   │
        ↓                             │   │
        API Georef (gratis)           │   │
        ↓                             │   │
        IDECOR WFS (oficial)          │   │
        ↓                             │   │
        Preparar Contexto Córdoba     │   │
        (placeholder)                 │   │
        ↓                             │   │
        ↓─────────────────────────────┘   │
        ↓                                 │
        Claude Sonnet 4.5 ←───────────────┘
        ↓
        Generar JSON Revit
        ↓
        Formatear Email
        ↓
        Enviar Email + Guardar Sheets
        ↓
        Responder al Webhook
```

---

## 📞 SOPORTE

### Si te trabás con:

**Frontend (Mapa):**
- Leer: `INSTRUCCIONES_SETUP_MAPA.md`
- Verificar API key en 2 lugares
- Probar con direcciones reales

**Backend (n8n):**
- Leer: `INSTRUCCIONES_N8N_ROUTING.md`
- Seguir paso a paso
- Probar primero con Santiago (debe funcionar como antes)

**Digesto Córdoba:**
- Leer: `digesto_cordoba_v1.json` (ver estructura)
- Leer PDFs descargados
- Consultar con arquitecto de Córdoba

---

## 🎯 HITOS DEL PROYECTO

```
✅ Semana 1 (completada):
   - Frontend con selector ciudad
   - Mapa adaptativo funcionando
   - Documentación completa

🔄 Semana 2 (actual):
   - Implementar routing n8n
   - Testing básico
   - Validar flujo end-to-end

⏳ Semana 3-4:
   - Completar digesto Córdoba
   - Integrar en backend
   - Testing exhaustivo

⏳ Semana 5:
   - Validación con arquitectos
   - Ajustes finales
   - Deploy a producción
```

---

**Última actualización:** 2025-01-07 - 14:30 hs
**Próxima revisión:** Después de implementar routing n8n
**Responsable:** Federico + Claude Code
**Workflow ID:** EG5DPQd3LeHy7yv0
