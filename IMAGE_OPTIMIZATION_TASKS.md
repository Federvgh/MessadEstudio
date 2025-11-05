# Tareas de Optimización de Imágenes - Messad Estudio

**Fecha**: 5 de Noviembre, 2025
**Objetivo**: Mejorar CLS (Cumulative Layout Shift) y LCP (Largest Contentful Paint)

---

## 🔴 Alta Prioridad - Agregar Dimensiones (Fix CLS)

### index.html

#### Imágenes Sin Width/Height
```html
<!-- LÍNEA 512 -->
❌ <picture><source srcset="images/Enscape_2.webp" type="image/webp"><img loading="lazy" src="images/Enscape_2.png" alt="Image" class="img-fluid"></picture>

✅ <picture><source srcset="images/Enscape_2.webp" type="image/webp"><img loading="lazy" src="images/Enscape_2.png" alt="Image" class="img-fluid" width="XXX" height="YYY"></picture>
```

```html
<!-- LÍNEA 559 -->
❌ <picture><source srcset="images/01_Photo - 7_Photo - 4.webp" type="image/webp"><img loading="lazy" src="images/01_Photo - 7_Photo - 4.jpg" alt="Image" class="img-fluid"></picture>

✅ <picture><source srcset="images/01_Photo - 7_Photo - 4.webp" type="image/webp"><img loading="lazy" src="images/01_Photo - 7_Photo - 4.jpg" alt="Image" class="img-fluid" width="XXX" height="YYY"></picture>
```

```html
<!-- LÍNEA 643 -->
❌ <img loading="lazy" src="images/img_3.jpg" alt="Image" class="img-fluid author-image mb-3">

✅ <img loading="lazy" src="images/img_3.jpg" alt="Image" class="img-fluid author-image mb-3" width="XXX" height="YYY">
```

```html
<!-- LÍNEA 658 -->
❌ <img loading="lazy" src="images/img_4.jpg" alt="Image" class="img-fluid author-image mb-3">

✅ <img loading="lazy" src="images/img_4.jpg" alt="Image" class="img-fluid author-image mb-3" width="XXX" height="YYY">
```

```html
<!-- LÍNEA 674 -->
❌ <img loading="lazy" src="images/img_5.jpg" alt="Image" class="img-fluid author-image mb-3">

✅ <img loading="lazy" src="images/img_5.jpg" alt="Image" class="img-fluid author-image mb-3" width="XXX" height="YYY">
```

**Acción Requerida**:
1. Abrir cada imagen en editor
2. Obtener dimensiones reales (ancho x alto en píxeles)
3. Agregar attributes `width` y `height` al tag `<img>`

**Comandos para obtener dimensiones**:
```bash
# macOS
sips -g pixelWidth -g pixelHeight images/Enscape_2.png

# Linux
identify -format "%wx%h" images/Enscape_2.png

# Node.js
node -e "const sizeOf = require('image-size'); console.log(sizeOf('images/Enscape_2.png'));"
```

---

## 🟡 Media Prioridad - Agregar WebP (Reducir Tamaño)

### index.html

#### Imágenes Sin Picture Tag
```html
<!-- LÍNEA 547 -->
❌ <img loading="lazy" src="images/0213.jpg" alt="Image" class="img-fluid" width="1000" height="562">

✅ <picture>
    <source srcset="images/0213.webp" type="image/webp">
    <img loading="lazy" src="images/0213.jpg" alt="Image" class="img-fluid" width="1000" height="562">
</picture>
```

```html
<!-- LÍNEA 643 - TAMBIÉN NECESITA DIMENSIONES -->
❌ <img loading="lazy" src="images/img_3.jpg" alt="Image" class="img-fluid author-image mb-3">

✅ <picture>
    <source srcset="images/img_3.webp" type="image/webp">
    <img loading="lazy" src="images/img_3.jpg" alt="Image" class="img-fluid author-image mb-3" width="XXX" height="YYY">
</picture>
```

```html
<!-- LÍNEA 658 - TAMBIÉN NECESITA DIMENSIONES -->
❌ <img loading="lazy" src="images/img_4.jpg" alt="Image" class="img-fluid author-image mb-3">

✅ <picture>
    <source srcset="images/img_4.webp" type="image/webp">
    <img loading="lazy" src="images/img_4.jpg" alt="Image" class="img-fluid author-image mb-3" width="XXX" height="YYY">
</picture>
```

```html
<!-- LÍNEA 674 - TAMBIÉN NECESITA DIMENSIONES -->
❌ <img loading="lazy" src="images/img_5.jpg" alt="Image" class="img-fluid author-image mb-3">

✅ <picture>
    <source srcset="images/img_5.webp" type="image/webp">
    <img loading="lazy" src="images/img_5.jpg" alt="Image" class="img-fluid author-image mb-3" width="XXX" height="YYY">
</picture>
```

**Acción Requerida**:
1. Convertir imágenes a formato WebP
2. Actualizar HTML para usar `<picture>` tag
3. Mantener JPG como fallback

**Comandos para conversión**:
```bash
# Usando cwebp (herramienta de Google)
cwebp -q 80 images/0213.jpg -o images/0213.webp
cwebp -q 80 images/img_3.jpg -o images/img_3.webp
cwebp -q 80 images/img_4.jpg -o images/img_4.webp
cwebp -q 80 images/img_5.jpg -o images/img_5.webp

# Batch conversion (todas las jpg)
for file in images/*.jpg; do
    cwebp -q 80 "$file" -o "${file%.jpg}.webp"
done
```

**Herramientas Online**:
- [Squoosh.app](https://squoosh.app/) - UI visual
- [CloudConvert](https://cloudconvert.com/jpg-to-webp)

---

## 📋 Checklist por Página

### index.html
- [x] Análisis completado
- [ ] Obtener dimensiones de imágenes
- [ ] Agregar width/height a 5 imágenes
- [ ] Convertir 4 imágenes a WebP
- [ ] Actualizar HTML con picture tags
- [ ] Verificar en navegador

### solicitar-analisis.html
- [ ] Análisis pendiente
- [ ] Obtener dimensiones de imágenes
- [ ] Agregar width/height
- [ ] Convertir imágenes a WebP
- [ ] Actualizar HTML con picture tags
- [ ] Verificar en navegador

### projects.html
- [ ] Análisis pendiente
- [ ] Obtener dimensiones de imágenes
- [ ] Agregar width/height
- [ ] Convertir imágenes a WebP
- [ ] Actualizar HTML con picture tags
- [ ] Verificar en navegador

### services.html
- [ ] Análisis pendiente
- [ ] Obtener dimensiones de imágenes
- [ ] Agregar width/height
- [ ] Convertir imágenes a WebP
- [ ] Actualizar HTML con picture tags
- [ ] Verificar en navegador

### contact.html
- [ ] Análisis pendiente
- [ ] Obtener dimensiones de imágenes
- [ ] Agregar width/height
- [ ] Convertir imágenes a WebP
- [ ] Actualizar HTML con picture tags
- [ ] Verificar en navegador

### Páginas de Categoría (comercial, edificios, institucional, vivienda)
- [ ] Análisis pendiente
- [ ] Obtener dimensiones de imágenes
- [ ] Agregar width/height
- [ ] Convertir imágenes a WebP
- [ ] Actualizar HTML con picture tags
- [ ] Verificar en navegador

---

## 🎯 Impacto Estimado

### Agregar Dimensiones (width/height)
**Métrica Afectada**: CLS (Cumulative Layout Shift)
**Mejora Estimada**: -50% to -80% en CLS
**Ejemplo**:
- Antes: CLS = 0.15 🔴
- Después: CLS = 0.03-0.07 🟢

### Conversión a WebP
**Métrica Afectada**: LCP (Largest Contentful Paint)
**Mejora Estimada**: -15% to -30% en tiempo de carga de imágenes
**Reducción de Tamaño**: ~30% más liviano que JPEG
**Ejemplo**:
- Antes: imagen de 500KB
- Después: imagen de 350KB WebP + 500KB JPEG fallback

---

## 📊 Tracking de Progreso

### Imágenes Optimizadas: 0 / 9+
- [ ] images/Enscape_2.png
- [ ] images/01_Photo - 7_Photo - 4.jpg
- [ ] images/img_3.jpg
- [ ] images/img_4.jpg
- [ ] images/img_5.jpg
- [ ] images/0213.jpg
- [ ] ... (más por analizar en otras páginas)

### Páginas Completadas: 0 / 13
- [ ] index.html
- [ ] solicitar-analisis.html
- [ ] projects.html
- [ ] services.html
- [ ] contact.html
- [ ] faq.html
- [ ] about.html
- [ ] comercial.html
- [ ] edificios.html
- [ ] institucional.html
- [ ] vivienda.html
- [ ] project-single.html
- [ ] single.html

---

## 🔧 Script de Automatización (Opcional)

### Obtener Dimensiones de Todas las Imágenes
```bash
#!/bin/bash
# get-image-dimensions.sh

echo "Image Dimensions Report"
echo "======================="
echo ""

for img in images/*.{jpg,png,webp} 2>/dev/null; do
    if [ -f "$img" ]; then
        dims=$(sips -g pixelWidth -g pixelHeight "$img" 2>/dev/null | grep -E "pixel(Width|Height)" | awk '{print $2}' | tr '\n' 'x' | sed 's/x$//')
        echo "$(basename "$img"): $dims"
    fi
done
```

**Uso**:
```bash
chmod +x get-image-dimensions.sh
./get-image-dimensions.sh > image-dimensions.txt
```

---

## 📝 Notas

- Todos los cambios deben testearse en navegador antes de commit
- Verificar que el aspect ratio se mantiene correcto
- Asegurar que `class="img-fluid"` sigue funcionando (responsive)
- WebP no soportado en navegadores muy antiguos (< IE11), por eso usar fallback
