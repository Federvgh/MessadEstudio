# 📁 Estructura de Carpetas de Proyectos

Esta carpeta contiene todas las imágenes de proyectos organizadas por categoría.

## 📂 Organización

```
images/projects/
├── comercial/
│   ├── proyecto-1/
│   ├── proyecto-2/
│   └── ...
├── edificios/
│   ├── proyecto-1/
│   ├── proyecto-2/
│   └── ...
├── institucional/
│   ├── proyecto-1/
│   └── ...
└── vivienda/
    ├── proyecto-1/
    └── ...
```

## ✅ Cómo Agregar un Nuevo Proyecto

### Paso 1: Crear carpeta del proyecto

Crear una carpeta dentro de la categoría correspondiente con un nombre descriptivo:

**✅ Nombres correctos:**
- `edificio-san-martin-350`
- `casa-barrio-norte`
- `local-comercial-centro`
- `escuela-tecnica-belgrano`

**❌ Nombres incorrectos:**
- `Proyecto nuevo` (con espacios y mayúsculas)
- `IMG_1234` (no descriptivo)
- `edificio 1` (con espacios)

### Paso 2: Organizar las fotos

Dentro de cada carpeta de proyecto, organizar las imágenes con nombres claros:

**Imágenes obligatorias:**
- `principal.webp` o `principal.jpg` - Foto principal para la tarjeta del proyecto
- `fachada.webp` - Vista de la fachada (si aplica)
- `interior-01.webp`, `interior-02.webp`, etc. - Vistas interiores
- `render-01.webp`, `render-02.webp`, etc. - Renders 3D

**Ejemplo de estructura:**
```
edificios/edificio-san-martin-350/
├── principal.webp          ← Imagen de portada
├── fachada-frontal.webp
├── fachada-lateral.webp
├── interior-lobby.webp
├── interior-departamento.webp
├── render-exterior.webp
├── plano-planta-baja.webp
└── plano-tipo.webp
```

### Paso 3: Optimizar imágenes

**Antes de subir las fotos:**

1. **Formato recomendado:** WebP (menor peso, mejor calidad)
2. **Tamaño recomendado:**
   - Imagen principal: 1200x800px
   - Imágenes de galería: 1600x1200px máximo
   - Miniaturas: 600x400px
3. **Peso máximo:** 500KB por imagen (idealmente 200-300KB)

**Herramientas para optimizar:**
- Online: https://squoosh.app/
- Photoshop: Exportar como WebP, calidad 80%
- GIMP: Exportar como WebP

### Paso 4: Actualizar el HTML

Una vez que las fotos están en su carpeta, actualizar:

1. La página de categoría (comercial.html, edificios.html, etc.)
2. Opcionalmente crear una página individual del proyecto

Ver `templates/` para ejemplos de código HTML.

## 🔄 Convenciones de Nombres

### Para carpetas de proyectos:
- Todo en minúsculas
- Sin espacios (usar guiones `-`)
- Descriptivo y corto
- Sin tildes ni caracteres especiales

### Para archivos de imágenes:
- Formato: `[tipo]-[descripcion].webp`
- Ejemplos:
  - `principal.webp`
  - `fachada-norte.webp`
  - `interior-cocina.webp`
  - `render-noche.webp`
  - `plano-planta-baja.webp`

## 📋 Checklist por Proyecto

- [ ] Carpeta creada con nombre correcto
- [ ] Imagen `principal.webp` agregada (obligatoria)
- [ ] Mínimo 4-6 imágenes del proyecto
- [ ] Todas las imágenes optimizadas (<500KB)
- [ ] Formato WebP utilizado
- [ ] Nombres de archivo descriptivos
- [ ] HTML actualizado en la página de categoría

## ❓ Preguntas Frecuentes

**¿Puedo usar JPG en lugar de WebP?**
Sí, pero WebP es preferible por menor peso y mejor calidad.

**¿Cuántas fotos mínimo debo subir por proyecto?**
Mínimo 4: una principal y 3 para galería.

**¿Qué hago si no tengo foto principal?**
Usar el mejor render o la vista más representativa del proyecto.

**¿Puedo tener subcarpetas dentro del proyecto?**
No recomendado. Mantener todas las imágenes en el primer nivel de la carpeta del proyecto.
