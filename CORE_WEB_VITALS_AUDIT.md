# Core Web Vitals Audit - Messad Estudio

**Fecha del Audit**: 5 de Noviembre, 2025
**Herramientas**: PageSpeed Insights, Lighthouse (Chrome DevTools)

## Core Web Vitals 2025 - Métricas

### Umbrales de Referencia
- **LCP (Largest Contentful Paint)**: < 2.5 segundos ✅
- **CLS (Cumulative Layout Shift)**: < 0.1 ✅
- **INP (Interaction to Next Paint)**: < 200ms ✅ (Reemplazó a FID en 2024)

---

## Páginas Principales

### 1. index.html (Home)
**Estado**: ⏳ Pendiente de medición

**Desktop**:
- LCP: - segundos
- CLS: -
- INP: - ms
- Performance Score: -

**Mobile**:
- LCP: - segundos
- CLS: -
- INP: - ms
- Performance Score: -

**Problemas Identificados**:
- [ ] Pendiente de análisis

**Oportunidades de Mejora**:
- [ ] Pendiente de análisis

---

### 2. about.html
**Estado**: ⏳ Pendiente de medición

**Desktop**:
- LCP: - segundos
- CLS: -
- INP: - ms
- Performance Score: -

**Mobile**:
- LCP: - segundos
- CLS: -
- INP: - ms
- Performance Score: -

**Problemas Identificados**:
- [ ] Pendiente de análisis

**Oportunidades de Mejora**:
- [ ] Pendiente de análisis

---

### 3. services.html
**Estado**: ⏳ Pendiente de medición

**Desktop**:
- LCP: - segundos
- CLS: -
- INP: - ms
- Performance Score: -

**Mobile**:
- LCP: - segundos
- CLS: -
- INP: - ms
- Performance Score: -

**Problemas Identificados**:
- [ ] Pendiente de análisis

**Oportunidades de Mejora**:
- [ ] Pendiente de análisis

---

### 4. projects.html
**Estado**: ⏳ Pendiente de medición

**Desktop**:
- LCP: - segundos
- CLS: -
- INP: - ms
- Performance Score: -

**Mobile**:
- LCP: - segundos
- CLS: -
- INP: - ms
- Performance Score: -

**Problemas Identificados**:
- [ ] Pendiente de análisis

**Oportunidades de Mejora**:
- [ ] Pendiente de análisis

---

### 5. contact.html
**Estado**: ⏳ Pendiente de medición

**Desktop**:
- LCP: - segundos
- CLS: -
- INP: - ms
- Performance Score: -

**Mobile**:
- LCP: - segundos
- CLS: -
- INP: - ms
- Performance Score: -

**Problemas Identificados**:
- [ ] Pendiente de análisis

**Oportunidades de Mejora**:
- [ ] Pendiente de análisis

---

### 6. faq.html
**Estado**: ⏳ Pendiente de medición

**Desktop**:
- LCP: - segundos
- CLS: -
- INP: - ms
- Performance Score: -

**Mobile**:
- LCP: - segundos
- CLS: -
- INP: - ms
- Performance Score: -

**Problemas Identificados**:
- [ ] Pendiente de análisis

**Oportunidades de Mejora**:
- [ ] Pendiente de análisis

---

### 7. solicitar-analisis.html (Calculadora)
**Estado**: ⏳ Pendiente de medición

**Desktop**:
- LCP: - segundos
- CLS: -
- INP: - ms
- Performance Score: -

**Mobile**:
- LCP: - segundos
- CLS: -
- INP: - ms
- Performance Score: -

**Problemas Identificados**:
- [ ] Pendiente de análisis

**Oportunidades de Mejora**:
- [ ] Pendiente de análisis

---

## Páginas de Categorías

### 8. comercial.html
**Estado**: ⏳ Pendiente de medición

**Desktop**:
- LCP: - segundos
- CLS: -
- INP: - ms
- Performance Score: -

**Mobile**:
- LCP: - segundos
- CLS: -
- INP: - ms
- Performance Score: -

---

### 9. edificios.html
**Estado**: ⏳ Pendiente de medición

**Desktop**:
- LCP: - segundos
- CLS: -
- INP: - ms
- Performance Score: -

**Mobile**:
- LCP: - segundos
- CLS: -
- INP: - ms
- Performance Score: -

---

### 10. institucional.html
**Estado**: ⏳ Pendiente de medición

**Desktop**:
- LCP: - segundos
- CLS: -
- INP: - ms
- Performance Score: -

**Mobile**:
- LCP: - segundos
- CLS: -
- INP: - ms
- Performance Score: -

---

### 11. vivienda.html
**Estado**: ⏳ Pendiente de medición

**Desktop**:
- LCP: - segundos
- CLS: -
- INP: - ms
- Performance Score: -

**Mobile**:
- LCP: - segundos
- CLS: -
- INP: - ms
- Performance Score: -

---

## Páginas de Proyecto Individual

### 12. project-single.html
**Estado**: ⏳ Pendiente de medición

**Desktop**:
- LCP: - segundos
- CLS: -
- INP: - ms
- Performance Score: -

**Mobile**:
- LCP: - segundos
- CLS: -
- INP: - ms
- Performance Score: -

---

### 13. single.html
**Estado**: ⏳ Pendiente de medición

**Desktop**:
- LCP: - segundos
- CLS: -
- INP: - ms
- Performance Score: -

**Mobile**:
- LCP: - segundos
- CLS: -
- INP: - ms
- Performance Score: -

---

## Análisis Técnico Preliminar

### Archivos CSS
```
css/style.css
css/calculadora.css
css/mobile-menu.css
css/micro-interactions.css
css/aos.css
css/glightbox.min.css
css/loading-states.css
css/whatsapp-widget.css
css/project-filters.css
```

### Archivos JavaScript
```
js/bootstrap.bundle.min.js
js/aos.min.js
js/glightbox.min.js
js/custom.min.js
js/simple-lead-capture.min.js
js/form-enhancements.js
js/whatsapp-widget.min.js
js/config.min.js
js/simple-auth.min.js
js/project-filters.js
```

### Fonts
```
Google Fonts: Playfair Display, Roboto, Montserrat
icomoon custom font icons
```

---

## Problemas Comunes a Investigar

### 1. Render-Blocking Resources
- [ ] CSS cargado en `<head>` sin optimización
- [ ] JavaScript bloqueante
- [ ] Google Fonts sin optimización

### 2. Imágenes
- [ ] Formato de imágenes (¿WebP?)
- [ ] Lazy loading implementado
- [ ] Dimensiones explícitas (width/height)
- [ ] Compresión de imágenes

### 3. JavaScript
- [ ] Tamaño total de JS
- [ ] Scripts defer/async
- [ ] Code splitting
- [ ] Eliminación de código no usado

### 4. CSS
- [ ] CSS crítico inline
- [ ] CSS no usado
- [ ] Minificación

### 5. Fuentes
- [ ] Font display swap
- [ ] Preconnect a Google Fonts
- [ ] Subset de fuentes

### 6. Caché y Compresión
- [ ] Headers de caché
- [ ] Gzip/Brotli compression
- [ ] Service Worker

---

## Instrucciones para Medición Manual

### Usando PageSpeed Insights
1. Ir a https://pagespeed.web.dev/
2. Ingresar URL de la página a testear
3. Analizar resultados de Mobile y Desktop
4. Documentar las métricas en este archivo
5. Anotar "Opportunities" y "Diagnostics"

### Usando Lighthouse (Chrome DevTools)
1. Abrir Chrome DevTools (F12)
2. Ir a la pestaña "Lighthouse"
3. Seleccionar categorías: Performance, Accessibility, Best Practices, SEO
4. Elegir device: Mobile o Desktop
5. Click en "Analyze page load"
6. Documentar resultados

---

## Plan de Optimización

### Alta Prioridad
- [ ] Optimizar imágenes (formato WebP, compresión)
- [ ] Implementar lazy loading de imágenes
- [ ] Optimizar fuentes (preconnect, font-display)
- [ ] Minificar y optimizar CSS crítico

### Media Prioridad
- [ ] Implementar defer/async en scripts
- [ ] Eliminar CSS/JS no usado
- [ ] Optimizar orden de carga de recursos
- [ ] Implementar cache headers

### Baja Prioridad
- [ ] Implementar Service Worker
- [ ] Code splitting de JavaScript
- [ ] CDN para assets estáticos

---

## Historial de Mejoras

### [Fecha] - Descripción de cambios
- Cambio 1
- Cambio 2
- Impacto en métricas

---

## Recursos y Referencias

- [Core Web Vitals 2025 Guide](https://skymooninfotech.com/blogs/core-web-vitals/)
- [Optimizing Web Vitals using Lighthouse](https://web.dev/articles/optimize-vitals-lighthouse)
- [Core Web Vitals workflows with Google tools](https://web.dev/articles/vitals-tools)
- [PageSpeed Insights](https://pagespeed.web.dev/)
