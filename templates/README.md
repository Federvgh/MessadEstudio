# 📦 Templates - Messad Estudio

Esta carpeta contiene templates HTML listos para usar al agregar nuevos proyectos.

---

## 📄 Archivos Disponibles

### 1. `project-card-template.html`
**Uso:** Agregar un proyecto a las páginas de categoría (comercial.html, edificios.html, etc.)

**Dónde pegar:**
- `comercial.html` - Para proyectos comerciales
- `edificios.html` - Para edificios residenciales
- `institucional.html` - Para proyectos institucionales
- `vivienda.html` - Para viviendas unifamiliares

**Cómo usar:**
1. Abrir este archivo
2. Copiar TODO el contenido
3. Pegar en la página de categoría dentro de `<div class="row">`
4. Reemplazar los valores entre [CORCHETES]
5. Guardar y probar en navegador

**Valores a reemplazar:**
- `[NOMBRE_PROYECTO]`
- `[DESCRIPCION_CORTA]`
- `[UBICACION]`
- `[ANIO]`
- `[SUPERFICIE]`
- `[URL_IMAGEN_PRINCIPAL]`
- `[URL_PAGINA_PROYECTO]`

---

### 2. `project-page-template.html`
**Uso:** Crear una página completa dedicada a un proyecto individual

**Cómo usar:**
1. Abrir este archivo
2. "Guardar como" → `proyecto-[nombre].html` en la raíz del sitio
   - Ejemplo: `proyecto-edificio-san-martin.html`
3. Reemplazar TODOS los valores entre [CORCHETES]
4. Agregar más imágenes copiando bloques de la galería
5. Guardar y probar en navegador

**Valores a reemplazar:**
- `[NOMBRE_PROYECTO]`
- `[DESCRIPCION_CORTA]`
- `[DESCRIPCION_LARGA_PARRAFO_1]`, `[PARRAFO_2]`, `[PARRAFO_3]`
- `[URL_IMAGEN_PRINCIPAL]`
- `[URL_IMAGEN_GALERIA_1]`, `[_2]`, `[_3]`, etc.
- `[UBICACION_COMPLETA]`
- `[ANIO]`
- `[SUPERFICIE]`
- `[ESTADO]` (Proyecto, En Construcción, Finalizado)
- `[CLIENTE_O_PRIVADO]`
- `[CATEGORIA]` (Comercial, Edificios, Institucional, Vivienda)

**Luego de crear la página:**
Actualizar el link en la tarjeta del proyecto:
```html
<!-- Antes -->
<a href="#">Ver Proyecto →</a>

<!-- Después -->
<a href="proyecto-edificio-san-martin.html">Ver Proyecto →</a>
```

---

## 🎯 Flujo de Trabajo Recomendado

### Para agregar UN proyecto sin página individual:

1. Preparar fotos → Carpeta en `images/projects/[categoria]/[nombre-proyecto]/`
2. Usar `project-card-template.html`
3. Pegar en página de categoría
4. Reemplazar valores
5. Probar

**Tiempo estimado:** 10 minutos

---

### Para agregar UN proyecto CON página individual:

1. Preparar fotos → Carpeta en `images/projects/[categoria]/[nombre-proyecto]/`
2. Usar `project-page-template.html` → Crear `proyecto-[nombre].html`
3. Reemplazar valores en la página individual
4. Usar `project-card-template.html`
5. Pegar en página de categoría
6. Actualizar link para que apunte a la página individual
7. Probar ambas páginas

**Tiempo estimado:** 20 minutos

---

## 📚 Documentación Relacionada

- **Guía completa:** `GUIA_ACTUALIZACION_PROYECTOS.md` (en la raíz)
- **Organización de fotos:** `images/projects/README.md`

---

## 💡 Tips

### Nombres de archivos
- Usar minúsculas
- Sin espacios (usar guiones `-`)
- Descriptivos y cortos
- Ejemplo: `proyecto-edificio-centro.html`

### Imágenes
- Siempre tener `principal.webp` en la carpeta del proyecto
- Formato WebP preferido (menor peso)
- Tamaño recomendado: 1200x800px para principales
- Peso máximo: 500KB

### Testing
- Probar SIEMPRE en el navegador antes de publicar
- Verificar que las imágenes se vean
- Verificar que los links funcionen
- Probar en móvil (F12 en Chrome → modo responsive)

---

## ❓ ¿Necesitás ayuda?

1. Lee `GUIA_ACTUALIZACION_PROYECTOS.md` - Guía paso a paso completa
2. Revisá los ejemplos en estos templates
3. Consultá con el equipo técnico mostrando el error específico

---

¡Listo para agregar proyectos! 🚀
