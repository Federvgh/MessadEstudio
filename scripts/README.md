# Scripts - Messad Estudio

Este directorio contiene scripts de automatización para optimización del sitio web.

---

## 🖼️ WebP Conversion Scripts

Dos scripts equivalentes para convertir imágenes JPG/PNG a formato WebP optimizado:

### Opción 1: Node.js Script (Recomendado)

**Archivo**: [`convert-to-webp.js`](convert-to-webp.js)

**Ventajas**:
- ✅ Usa `sharp` - librería muy rápida y confiable
- ✅ No requiere instalación de herramientas del sistema
- ✅ Funciona en cualquier OS (Windows, macOS, Linux)

**Requisitos**:
```bash
npm install sharp
```

**Uso**:
```bash
# Convertir TODAS las imágenes sin WebP
node scripts/convert-to-webp.js

# Convertir solo imágenes prioritarias (las más usadas)
node scripts/convert-to-webp.js --priority

# Convertir un archivo específico
node scripts/convert-to-webp.js --file img_5.jpg
```

---

### Opción 2: Bash Script (Alternativa)

**Archivo**: [`convert-to-webp.sh`](convert-to-webp.sh)

**Ventajas**:
- ✅ Usa `cwebp` - herramienta oficial de Google
- ✅ No requiere Node.js
- ✅ Script puro bash

**Requisitos**:
```bash
# macOS (con Homebrew)
brew install webp

# Ubuntu/Debian
sudo apt-get install webp

# CentOS/RHEL
sudo yum install libwebp-tools
```

**Uso**:
```bash
# Convertir TODAS las imágenes sin WebP
./scripts/convert-to-webp.sh

# Convertir solo imágenes prioritarias
./scripts/convert-to-webp.sh --priority

# Convertir un archivo específico
./scripts/convert-to-webp.sh img_5.jpg
```

---

## 📊 Qué Hacen los Scripts

### Funcionalidades

1. **Detección Automática**
   - Buscan archivos `.jpg`, `.jpeg`, `.png` en `/images`
   - Omiten archivos que ya tienen versión `.webp`

2. **Backup Automático**
   - Copian originales a `/images/originals/` antes de convertir
   - Solo si el archivo no existe ya en originals/

3. **Conversión Optimizada**
   - Calidad: 85% (óptima para web)
   - Formato WebP con compresión inteligente
   - Preserva transparencia en PNG

4. **Reportes Detallados**
   - Muestra tamaño original vs WebP
   - Calcula % de ahorro por imagen
   - Resumen total de espacio ahorrado

### Ejemplo de Salida

```
🖼️  WebP Conversion Script

📁 Images directory: ./images
⚙️  Quality: 85

📝 Found 9 images to convert

  🔄 Converting img_5.jpg (158.24 KB)...
    📋 Backed up to originals/
    ✅ Created img_5.webp (47.12 KB)
    💾 Savings: 70.2% (111.12 KB)

  🔄 Converting img_3.jpg (42.56 KB)...
    ✅ Created img_3.webp (14.89 KB)
    💾 Savings: 65.0% (27.67 KB)

============================================================
📊 CONVERSION SUMMARY
============================================================
✅ Converted: 9 images
📦 Original total: 628.70 KB
📦 WebP total: 196.34 KB
💾 Total savings: 432.36 KB (68.8%)

🎉 Conversion complete!
```

---

## 🎯 Imágenes Prioritarias

Los scripts tienen un modo `--priority` que solo convierte las imágenes más importantes:

| Imagen | Tamaño | Usos en HTML | Ahorro Estimado |
|--------|--------|--------------|-----------------|
| `img_5.jpg` | 158 KB | 2x | ~111 KB (70%) |
| `img_4.jpg` | 80 KB | 3x | ~56 KB (70%) |
| `img_7.jpg` | 96 KB | 2x | ~67 KB (70%) |
| `img_3.jpg` | 42 KB | 2x | ~28 KB (67%) |
| `person_1.jpg` | 9.9 KB | 3x | ~6 KB (60%) |
| `person_2.jpg` | 10 KB | 3x | ~6 KB (60%) |
| `person_3.jpg` | 9.8 KB | 1x | ~6 KB (60%) |
| `person_4.jpg` | 17 KB | 2x | ~10 KB (60%) |
| `world-dotted-map.png` | 196 KB | ? | ~136 KB (70%) |

**Total ahorro estimado**: ~426 KB (68%)

---

## 🛠️ Próximos Pasos Después de Convertir

### 1. Actualizar Referencias HTML

Cambiar de:
```html
<img src="images/img_5.jpg" alt="Proyecto" loading="lazy">
```

A:
```html
<picture>
  <source srcset="images/img_5.webp" type="image/webp">
  <img src="images/img_5.jpg" alt="Proyecto" loading="lazy">
</picture>
```

### 2. Verificar Compatibilidad

- Probar en Chrome, Firefox, Safari, Edge
- Verificar en dispositivos móviles (iOS, Android)
- Confirmar que las imágenes cargan correctamente

### 3. Medir Performance

```bash
# Antes de convertir
du -sh images/

# Después de convertir
du -sh images/
```

Usar Google PageSpeed Insights para medir mejora:
- https://pagespeed.web.dev/

---

## 📝 Configuración Avanzada

### Cambiar Calidad de Conversión

**Node.js Script**:
```javascript
// Línea 19 en convert-to-webp.js
quality: 85,  // Cambiar a 80-90
```

**Bash Script**:
```bash
# Línea 16 en convert-to-webp.sh
QUALITY=85  # Cambiar a 80-90
```

### Skip Archivos Existentes

Ambos scripts por defecto omiten archivos que ya tienen versión WebP.

Para forzar re-conversión:
```javascript
// Node.js (línea 20)
skipExisting: false,
```

```bash
# Bash (línea 17)
SKIP_EXISTING=false
```

---

## ⚠️ Precauciones

1. **Backup Automático**: Los scripts crean backups, pero siempre es buena idea tener un backup completo del proyecto

2. **No Modificar Originales**: Los archivos JPG/PNG originales se preservan

3. **Verificar Antes de Deploy**: Probar localmente antes de subir cambios

4. **No Tocar Backend**: Estos scripts NO modifican:
   - `solicitar-analisis.html` (calculadora)
   - Integración con n8n
   - Google Sheets
   - Formularios backend

---

## 🐛 Troubleshooting

### Error: "sharp is not installed"
```bash
npm install sharp
```

### Error: "cwebp not found"
```bash
# macOS
brew install webp

# Ubuntu
sudo apt-get install webp
```

### Error: "Permission denied"
```bash
chmod +x scripts/convert-to-webp.sh
```

### Images no se ven después de conversión
- Verificar que las rutas en HTML son correctas
- Limpiar caché del navegador (Cmd+Shift+R / Ctrl+Shift+R)
- Verificar que los archivos .webp se crearon correctamente

---

## 📚 Recursos

- [WebP Documentation](https://developers.google.com/speed/webp)
- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [Can I Use WebP](https://caniuse.com/webp)
- [Picture Element Guide](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture)

---

**Última actualización**: 2025-11-04
**Fase**: 4 - Performance & Optimization
