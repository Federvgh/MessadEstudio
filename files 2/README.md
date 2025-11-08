# 📚 DIGESTOS NORMATIVOS URBANOS - ARGENTINA
## Sistema Integrado Santiago del Estero + Córdoba (2024)

---

## 📁 ARCHIVOS GENERADOS

### 1. **digesto_cordoba_v3_2024.js** ✅
- **Versión:** 3.0
- **Actualización:** Junio 2024 (Ord. 13460/2024)
- **Contenido:** Digesto completo de Córdoba con todas las modificaciones 2024
- **Características nuevas:**
  - Alto Impacto Urbanístico
  - Factor de Impermeabilización (FIS)
  - Construcciones en subsuelo 60/40
  - Frente Urbano Ambiental Río Suquía
  - Vegetación nativa obligatoria

### 2. **sistema_integrado_sde_cordoba_n8n.js** 🔧
- **Función:** Código listo para n8n que maneja ambas ciudades
- **Incluye:** 
  - Digestos de ambas ciudades
  - Funciones de análisis automatizado
  - Generador de prompts para Claude
  - Manejo de errores

### 3. **comparacion_sde_cordoba_2024.md** 📊
- **Contenido:** Comparación detallada entre ambas normativas
- **Incluye:** Tablas comparativas, ventajas, diferencias

---

## 🚀 CÓMO USAR EN N8N

### Paso 1: Configurar Webhook
```javascript
// Webhook esperado con estos campos:
{
  "ciudad": "Córdoba", // o "Santiago del Estero"
  "direccion": "Av. Colón 350",
  "frente": 10.5,
  "profundidad": 30,
  "lat": -31.4201,
  "lon": -64.1888,
  "tipo_proyecto": "vivienda",
  "plantas": 3
}
```

### Paso 2: Agregar Nodo de Código
1. Crear un nodo **Code** en n8n
2. Copiar el contenido de `sistema_integrado_sde_cordoba_n8n.js`
3. Conectar al webhook

### Paso 3: Conectar con Claude
1. Agregar nodo **Anthropic Claude**
2. Usar el campo `prompt_claude` del resultado
3. Claude generará el informe técnico completo

---

## ✨ CARACTERÍSTICAS DESTACADAS 2024

### 🏙️ **CÓRDOBA - NOVEDADES 2024**
- ✅ **Alto Impacto Urbanístico**: Evaluación especial para grandes proyectos
- ✅ **FIS (Factor Impermeabilización)**: Control ambiental del suelo
- ✅ **Subsuelo 60/40**: Máx. 60% construcción, mín. 40% permeable
- ✅ **Frente Urbano Ambiental**: Protección del Río Suquía
- ✅ **Vegetación Nativa**: Obligatoria con autoridad específica
- ✅ **24 APU**: Áreas de Promoción Urbana activas
- ✅ **CEPT**: Sistema de transferencia de edificabilidad

### 🏛️ **SANTIAGO DEL ESTERO - VIGENTE**
- ✅ Mapeo detallado calle por calle
- ✅ FOS uniforme 85% en área central
- ✅ Sistema de perfiles por corredor
- ✅ Áreas Especiales (AE1-AE5)
- ✅ Simplicidad normativa

---

## 📊 COMPARACIÓN RÁPIDA

| **Aspecto** | **SDE** | **Córdoba 2024** |
|------------|---------|------------------|
| **Última actualización** | 2013 | 2024 ✅ |
| **Complejidad** | Media | Alta |
| **Enfoque ambiental** | Básico | Avanzado ✅ |
| **Herramientas gestión** | Limitadas | CEPT, APU ✅ |
| **FOS centro** | 85% uniforme | 80% variable |
| **Control subsuelo** | No | Sí (60/40) ✅ |

---

## ⚙️ FUNCIONES PRINCIPALES DEL SISTEMA

### `analizarLoteUrbano(parametros)`
Función principal que:
1. Detecta la ciudad automáticamente
2. Aplica el digesto correspondiente
3. Calcula todos los indicadores
4. Genera restricciones aplicables
5. Retorna análisis completo

### `generarPromptClaude(parametros, analisis)`
Genera prompt optimizado para Claude con:
- Datos del lote
- Análisis realizado
- Formato para informe técnico

### Cálculos automáticos:
- ✅ FOS, FOT, FIS
- ✅ Superficie máxima edificable
- ✅ Retiros obligatorios
- ✅ Patios reglamentarios
- ✅ Restricciones especiales 2024
- ✅ Evaluación alto impacto
- ✅ Vegetación obligatoria

---

## 🔄 ACTUALIZACIÓN Y MANTENIMIENTO

### Córdoba
- **Verificar mensualmente** boletines municipales
- Última actualización: **25 junio 2024**
- Próxima revisión sugerida: **Enero 2025**

### Santiago del Estero
- **Verificar anualmente** ordenanzas nuevas
- Última actualización: **2013**
- **⚠️ Requiere actualización urgente**

---

## 📝 NOTAS IMPORTANTES

1. **Validación Legal**: Siempre verificar con las direcciones de planeamiento municipales
2. **Interpretación**: Requiere criterio técnico profesional
3. **Actualizaciones**: Córdoba puede tener cambios post-junio 2024
4. **GIS**: Para producción, integrar con servicios GIS para determinación automática de zonas

---

## 🆘 SOPORTE Y MEJORAS

### Mejoras sugeridas:
- [ ] Integración con GIS municipal
- [ ] Actualización automática de ordenanzas
- [ ] Generación de planos esquemáticos
- [ ] Cálculo automático de tasas municipales
- [ ] Integración con CAD/BIM

### Próximas actualizaciones planificadas:
- Santiago del Estero: Buscar ordenanzas 2014-2024
- Córdoba: Monitorear cambios post-junio 2024
- Agregar más ciudades argentinas

---

## 📜 LICENCIA Y USO

Este sistema es para uso profesional en análisis urbanístico.
Requiere validación municipal para uso oficial.
Los cálculos son orientativos y no reemplazan el criterio profesional.

---

**Versión:** 1.0.0
**Fecha:** Noviembre 2024
**Autor:** Sistema de Análisis Urbano Automatizado

---

*Para consultas técnicas o reportar errores, mantener registro en el sistema n8n*