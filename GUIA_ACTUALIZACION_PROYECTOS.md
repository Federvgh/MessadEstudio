# 📘 Guía de Actualización de Proyectos - Messad Estudio

**Versión:** 1.0
**Fecha:** Noviembre 2025
**Para:** Arquitectos sin conocimientos técnicos de programación

---

## 🎯 Objetivo

Esta guía te permite agregar nuevos proyectos al sitio web de manera simple y rápida, sin necesidad de saber programación.

---

## 📋 Resumen Rápido

Para agregar un proyecto nuevo necesitás:

1. ✅ Fotos del proyecto (mínimo 4, formato WebP)
2. ✅ Información del proyecto (nombre, ubicación, año, superficie)
3. ✅ 15 minutos de tiempo
4. ✅ Editor de texto (VSCode recomendado, o Notepad++)
5. ✅ Navegador web para probar

---

## 🚀 Proceso Completo: Agregar un Proyecto Nuevo

### PASO 1: Preparar las Fotos (5 minutos)

#### 1.1 Seleccionar las mejores fotos

Elegir:
- 1 foto principal (la mejor vista del proyecto)
- 3-8 fotos para la galería (diferentes ángulos, interiores, detalles)

#### 1.2 Optimizar las fotos

**Opción A: Usar Squoosh (Online, Gratis, Fácil)**

1. Ir a https://squoosh.app/
2. Arrastrar cada foto
3. En el panel derecho seleccionar:
   - Formato: **WebP**
   - Calidad: **80**
4. Descargar cada foto optimizada

**Opción B: Usar Photoshop**

1. Abrir la foto
2. Archivo → Exportar → Exportar Como
3. Formato: **WebP**
4. Calidad: **80**
5. Guardar

#### 1.3 Renombrar las fotos

Usar nombres descriptivos:
- `principal.webp` (obligatorio - la foto de portada)
- `fachada-principal.webp`
- `interior-living.webp`
- `exterior-noche.webp`
- etc.

**✅ Buenos nombres:**
- `principal.webp`
- `fachada-norte.webp`
- `render-exterior.webp`

**❌ Malos nombres:**
- `IMG_1234.jpg`
- `foto nueva.jpg` (tiene espacios)
- `PROYECTO.JPG` (mayúsculas)

---

### PASO 2: Organizar en Carpetas (2 minutos)

#### 2.1 Crear carpeta del proyecto

Ir a la carpeta correcta según el tipo:

- **Comercial:** `images/projects/comercial/`
- **Edificios:** `images/projects/edificios/`
- **Institucional:** `images/projects/institucional/`
- **Vivienda:** `images/projects/vivienda/`

Crear una nueva carpeta con nombre descriptivo:

**✅ Ejemplos correctos:**
```
edificio-san-martin-350
casa-barrio-los-pinos
local-comercial-centro
escuela-tecnica-belgrano
```

**❌ Ejemplos incorrectos:**
```
Proyecto Nuevo          (tiene espacios y mayúsculas)
proyecto 1              (tiene espacios)
IMG_2024                (no descriptivo)
```

#### 2.2 Copiar las fotos

Copiar todas las fotos optimizadas dentro de la carpeta del proyecto.

**Ejemplo final:**
```
images/projects/edificios/edificio-san-martin-350/
├── principal.webp
├── fachada-principal.webp
├── interior-lobby.webp
├── interior-departamento.webp
├── exterior-noche.webp
└── plano-tipo.webp
```

---

### PASO 3: Agregar el Proyecto al Sitio (8 minutos)

#### 3.1 Abrir el archivo HTML de la categoría

Según el tipo de proyecto, abrir:

- Comercial → `comercial.html`
- Edificios → `edificios.html`
- Institucional → `institucional.html`
- Vivienda → `vivienda.html`

**Cómo abrir:**
1. Click derecho en el archivo
2. "Abrir con" → VSCode (o Notepad++)

#### 3.2 Copiar el template

1. Abrir el archivo `templates/project-card-template.html`
2. Seleccionar TODO el contenido (Ctrl+A)
3. Copiar (Ctrl+C)

#### 3.3 Pegar en la página

1. En el archivo de categoría (ej: `edificios.html`), buscar la línea:
   ```html
   <div class="container">
       <!-- Aquí puedes agregar el contenido específico de Edificios -->
   </div>
   ```

2. Reemplazar el comentario con:
   ```html
   <div class="container">
       <div class="row">
           <!-- PEGAR AQUÍ EL TEMPLATE COPIADO -->
       </div>
   </div>
   ```

#### 3.4 Reemplazar la información

Buscar y reemplazar los valores entre [CORCHETES]:

**Valores a reemplazar:**

| Placeholder | Ejemplo |
|------------|---------|
| `[NOMBRE_PROYECTO]` | Edificio San Martín 350 |
| `[DESCRIPCION_CORTA]` | Edificio residencial de 8 pisos con amenities completos |
| `[UBICACION]` | Centro, Santiago del Estero |
| `[ANIO]` | 2024 |
| `[SUPERFICIE]` | 1,200 m² |
| `[URL_IMAGEN_PRINCIPAL]` | images/projects/edificios/edificio-san-martin-350/principal.webp |
| `[URL_PAGINA_PROYECTO]` | # (por ahora, luego se puede crear página completa) |

**Ejemplo completo reemplazado:**

```html
<div class="col-md-6 col-lg-4 mb-5" data-aos="fade-up" data-aos-delay="0">
	<div class="project-item h-100">
		<a href="#" class="project-link">
			<img
				loading="lazy"
				src="images/projects/edificios/edificio-san-martin-350/principal.webp"
				alt="Edificio San Martín 350 - Messad Estudio"
				class="img-fluid project-image"
				width="800"
				height="600"
			>
		</a>

		<div class="project-info p-4">
			<h3 class="project-title">
				<a href="#">Edificio San Martín 350</a>
			</h3>
			<p class="project-description text-muted mb-3">
				Edificio residencial de 8 pisos con amenities completos
			</p>

			<ul class="project-details list-unstyled small text-muted">
				<li><strong>Ubicación:</strong> Centro, Santiago del Estero</li>
				<li><strong>Año:</strong> 2024</li>
				<li><strong>Superficie:</strong> 1,200 m²</li>
			</ul>

			<a href="#" class="btn btn-sm btn-outline-primary mt-2">
				Ver Proyecto →
			</a>
		</div>
	</div>
</div>
```

#### 3.5 Guardar el archivo

1. Guardar (Ctrl+S)
2. ¡Listo! Ya agregaste el proyecto.

---

### PASO 4: Probar el Resultado (2 minutos)

1. Abrir el archivo HTML en el navegador:
   - Click derecho en el archivo → "Abrir con" → Chrome/Firefox

2. Verificar que:
   - ✅ La imagen principal se ve correctamente
   - ✅ El nombre del proyecto es correcto
   - ✅ La descripción es clara
   - ✅ Los datos técnicos son correctos

3. Si algo no se ve bien, volver al archivo HTML y corregir.

---

## 🎨 Agregar Más Proyectos

Para agregar más proyectos a la misma categoría:

1. Repetir PASO 1 y PASO 2 (preparar fotos y carpetas)
2. En el archivo HTML, **copiar y pegar** el bloque del proyecto anterior
3. Reemplazar los valores con la nueva información
4. Guardar y probar

**Ejemplo:** Si ya tenés 1 proyecto en edificios.html, el código queda:

```html
<div class="container">
    <div class="row">

        <!-- PROYECTO 1: Edificio San Martín -->
        <div class="col-md-6 col-lg-4 mb-5">
            ...
        </div>

        <!-- PROYECTO 2: Edificio Belgrano -->
        <div class="col-md-6 col-lg-4 mb-5">
            ...
        </div>

        <!-- PROYECTO 3: Edificio Centro -->
        <div class="col-md-6 col-lg-4 mb-5">
            ...
        </div>

    </div>
</div>
```

---

## 📄 Crear Página Individual de Proyecto (OPCIONAL)

Si querés una página completa dedicada a un proyecto:

### PASO 1: Copiar el template

1. Abrir `templates/project-page-template.html`
2. "Guardar como" → `proyecto-[nombre-del-proyecto].html` en la raíz
   - Ejemplo: `proyecto-edificio-san-martin.html`

### PASO 2: Reemplazar información

Buscar todos los [CORCHETES] y reemplazar con:

- Información del proyecto
- Rutas de imágenes
- Descripción detallada

### PASO 3: Agregar más fotos a la galería

En la sección de galería, copiar y pegar este bloque por cada foto:

```html
<div class="col-md-6">
	<a href="images/projects/edificios/mi-proyecto/foto-5.webp" class="glightbox">
		<img src="images/projects/edificios/mi-proyecto/foto-5.webp"
		     alt="Mi Proyecto - Vista 5"
		     class="img-fluid rounded">
	</a>
</div>
```

### PASO 4: Actualizar el link en la tarjeta

En la página de categoría, cambiar:

```html
<a href="#">Ver Proyecto →</a>
```

Por:

```html
<a href="proyecto-edificio-san-martin.html">Ver Proyecto →</a>
```

---

## 🔧 Herramientas Recomendadas

### Editor de Código
- **VSCode** (Recomendado): https://code.visualstudio.com/
  - Gratis, fácil de usar, con colores
- **Notepad++**: https://notepad-plus-plus.org/
  - Alternativa más simple

### Optimización de Imágenes
- **Squoosh**: https://squoosh.app/ (online, gratis)
- **TinyPNG**: https://tinypng.com/ (online, gratis)
- **Photoshop**: Exportar como WebP, calidad 80%

### Navegadores para Probar
- Chrome (recomendado)
- Firefox
- Edge

---

## ❓ Preguntas Frecuentes

### ¿Qué hago si rompo algo?

No te preocupes! Podés:
1. Deshacer los cambios (Ctrl+Z en el editor)
2. Cerrar el archivo sin guardar
3. Pedir ayuda mostrando el error específico

### ¿Puedo agregar videos?

Sí, pero por ahora es más complejo. Consultar con el equipo técnico.

### ¿Cuántas fotos puedo agregar?

- **Mínimo:** 4 (1 principal + 3 galería)
- **Recomendado:** 6-10
- **Máximo:** Sin límite técnico, pero mantener entre 10-15 para mejor rendimiento

### ¿Qué pasa si no tengo foto principal?

Usar el mejor render o la vista más representativa como `principal.webp`.

### ¿Puedo editar un proyecto existente?

Sí, simplemente:
1. Abrir el archivo HTML de la categoría
2. Buscar el bloque del proyecto
3. Modificar los valores
4. Guardar

### ¿Necesito saber HTML?

No! Solo seguir esta guía y copiar/pegar los templates.

---

## 📞 Soporte

Si tenés dudas o problemas:

1. Revisar esta guía completa
2. Revisar `images/projects/README.md` para temas de fotos
3. Consultar con el equipo técnico mostrando:
   - El archivo que estás editando
   - El error específico o captura de pantalla

---

## ✅ Checklist Final

Antes de publicar cambios:

- [ ] Fotos optimizadas (formato WebP, <500KB)
- [ ] Carpeta del proyecto creada con nombre correcto
- [ ] Imagen `principal.webp` presente
- [ ] HTML actualizado en la página de categoría
- [ ] Todos los [CORCHETES] reemplazados
- [ ] Probado en el navegador
- [ ] Todo se ve correctamente

---

## 📚 Archivos de Referencia

- `templates/project-card-template.html` - Template de tarjeta
- `templates/project-page-template.html` - Template de página completa
- `images/projects/README.md` - Guía de organización de fotos
- Este archivo - Guía maestra

---

**¡Listo!** Ya estás preparado para agregar proyectos al sitio web de Messad Estudio. 🎉

Si tenés dudas, no dudes en consultar.
