# 🗺️ INSTRUCCIONES: Setup del Mapa Adaptativo

## ✅ Lo que ya está listo

1. ✅ **Frontend modificado**: `solicitar-analisis.html` ahora tiene:
   - Selector de ciudad (Santiago del Estero / Córdoba Capital)
   - Contenedor del mapa (se muestra cuando seleccionan ciudad)
   - Info box para mostrar datos de la parcela

2. ✅ **JavaScript creado**: `js/mapa-adaptativo.js` con toda la lógica:
   - NIVEL 2 (Santiago): Rectángulo orientado a la calle
   - NIVEL 3 (Córdoba): Polígono catastral real de IDECOR
   - Geocodificación con API Georef (gratuita)
   - Marker draggable para ajuste manual

3. ✅ **PDFs descargados**:
   - `ordenanza_8256_cordoba.pdf` - Ordenanza 8256 original
   - `ord_8256_actualizada.pdf` - Versión actualizada

4. ✅ **Template JSON**: `digesto_cordoba_v1.json` listo para completar

---

## ⚠️ LO QUE FALTA HACER (CRÍTICO)

### 1. 🔑 Obtener Google Maps API Key (30 minutos)

**Pasos:**

1. Ir a: https://console.cloud.google.com/
2. Crear un proyecto nuevo: "Messad Estudio - Mapa"
3. Ir a **"APIs & Services"** > **"Library"**
4. Buscar y **HABILITAR** estas 3 APIs:
   - ✅ **Maps JavaScript API** (para mostrar el mapa)
   - ✅ **Roads API** (para detectar ángulo de la calle)
   - ✅ **Geocoding API** (backup opcional)

5. Ir a **"Credentials"** > **"Create Credentials"** > **"API Key"**
6. **COPIAR LA KEY** que te da (algo como: `AIzaSyD...`)

7. **IMPORTANTE: Configurar restricciones** (seguridad):
   - Click en la key que creaste
   - **Application restrictions:**
     - Seleccionar "HTTP referrers (web sites)"
     - Agregar: `federvgh.github.io/*`
     - Agregar: `messadestudio.com/*` (si tenés dominio)
     - Agregar: `localhost:*` (para testing local)

   - **API restrictions:**
     - Seleccionar "Restrict key"
     - Elegir solo las 3 APIs que habilitaste arriba

   - Click "Save"

8. **Copiar la API Key** y guardarla en un lugar seguro

---

### 2. ✏️ Reemplazar la API Key en el código

**Archivo:** `solicitar-analisis.html`

**Buscar la línea 698:**
```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places" defer></script>
```

**Reemplazar `YOUR_API_KEY` por tu key real:**
```html
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD...TU_KEY_REAL...&libraries=places" defer></script>
```

**TAMBIÉN en:** `js/mapa-adaptativo.js` (línea 220)
```javascript
// Buscar:
key: 'YOUR_GOOGLE_API_KEY' // TODO: Reemplazar con la key real

// Reemplazar por:
key: 'AIzaSyD...TU_KEY_REAL...'
```

---

### 3. 🧪 Testear que funciona

**Opción A: Con Live Server (VS Code)**
1. Click derecho en `solicitar-analisis.html`
2. "Open with Live Server"
3. La página se abre en el browser

**Opción B: Con Python**
```bash
cd /Users/feder/VScode/MessadEstudio
python3 -m http.server 8000
```
Luego abrir: http://localhost:8000/solicitar-analisis.html

**Flujo de prueba:**
1. Seleccionar "Santiago del Estero"
2. Escribir "Belgrano 850"
3. **DEBERÍA aparecer el mapa** con un marcador rojo
4. **DEBERÍA dibujarse un rectángulo naranja** (orientado a la calle)
5. Si funciona, probá con "Córdoba Capital" y "Av Vélez Sarsfield 100"

---

### 4. 🐛 Solución de problemas

#### **Error: "Google is not defined"**
- Esperá 5-10 segundos después de cargar la página
- Refrescá la página (F5)
- Verificá que pusiste bien la API key

#### **Error: "This API project is not authorized"**
- Verificá las restricciones del API key
- Asegurate de habilitar las 3 APIs en Google Console
- Puede tardar 5 minutos en activarse

#### **El mapa no aparece**
- Abrí la consola del browser (F12)
- Fijate si hay errores en rojo
- Verificá que el selector de ciudad tenga valor

#### **No se dibuja el polígono**
- Es normal si la dirección no existe
- Probá con direcciones reales:
  - Santiago: "Belgrano 850", "Urquiza 248", "Av Belgrano 871"
  - Córdoba: "Av Colón 100", "Av Vélez Sarsfield 200"

---

## 📊 Costo Estimado

| Servicio | Uso gratuito | Costo después |
|----------|--------------|---------------|
| Google Maps JavaScript API | Primeras 28,000 cargas/mes | $7 por 1000 cargas |
| Roads API | Primeras 28,000 requests/mes | $10 por 1000 requests |
| Geocoding API | Primeras 40,000 requests/mes | $5 por 1000 requests |
| **TOTAL con 100 análisis/mes** | **$0 (dentro del free tier)** | N/A |

**Nota:** Google te da $200 de crédito mensual gratis, así que con 100-200 análisis/mes no vas a pagar nada.

---

## 🔄 Próximos pasos (después de que funcione el mapa)

1. ✅ Frontend funcionando con mapa
2. ⏳ Completar `digesto_cordoba_v1.json` con todas las zonas
3. ⏳ Configurar n8n workflow con Switch para routing
4. ⏳ Integrar IDECOR WMS en n8n para Córdoba
5. ⏳ Testing end-to-end

---

## 📞 Si te trabás

**Problemas comunes y soluciones:**

1. **"No veo el selector de ciudad"**
   - Refrescá el cache del browser (Ctrl+Shift+R)
   - Verificá que subiste los cambios a GitHub

2. **"El mapa se ve pero sin estilo"**
   - La API key está mal o tiene restricciones incorrectas
   - Verificá en Google Console > Credentials

3. **"El polígono no se dibuja"**
   - Normal si es la primera vez, aún falta configurar backend
   - Por ahora solo importa que veas el mapa

---

## 🎯 Estado actual

✅ **Completado:**
- Frontend HTML modificado
- JavaScript mapa-adaptativo.js creado
- PDFs de Córdoba descargados
- Template JSON estructurado

⏳ **Pendiente:**
- [ ] Obtener Google Maps API Key (TU tarea)
- [ ] Reemplazar key en el código (TU tarea)
- [ ] Testear que funciona (TU tarea)
- [ ] Completar digesto_cordoba_v1.json (60 horas de trabajo)
- [ ] Configurar backend n8n

---

**Última actualización:** 2025-01-07
**Autor:** Claude Code + Federico
**Versión:** 1.0
