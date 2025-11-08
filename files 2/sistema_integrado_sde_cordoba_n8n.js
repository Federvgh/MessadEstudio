// ============================================================================
// SISTEMA INTEGRADO DE ANÁLISIS NORMATIVO URBANO
// Santiago del Estero + Córdoba (Actualizado 2024)
// Para implementación en n8n
// ============================================================================

// ============================================================================
// CONFIGURACIÓN INICIAL
// ============================================================================

const CIUDADES_DISPONIBLES = {
  SANTIAGO_DEL_ESTERO: 'sde',
  CORDOBA: 'cba'
};

// ============================================================================
// DIGESTO SANTIAGO DEL ESTERO (2013)
// ============================================================================

const digesto_SDE = {
  "version": "1.0",
  "ultima_actualizacion": "2013",
  "area_central_delimitacion": {
    "limites": {
      "norte": "3 de Febrero",
      "sur": "Chaco",
      "este": "Olaechea",
      "oeste": "Bolivia"
    }
  },
  "zonas": {
    "AE4": {
      "nombre": "Área Especial 4 - Institucional",
      "perfil": "XVI",
      "altura_maxima": 22.0,
      "fos": 0.85,
      "fot": null
    },
    "AG-C1": {
      "nombre": "Área General - Comercial 1",
      "perfil": "IV o V",
      "altura_maxima": 27.0,
      "fos": 0.85,
      "fot": null
    }
  },
  "mapeo_calles": {
    "Absalón Rojas": {
      "zona": "AE4",
      "perfil": "XVI",
      "altura_maxima": 22.0,
      "fos": 0.85
    },
    "Urquiza": {
      "zona": "AG-C1",
      "perfil": "IV",
      "altura_maxima": 27.0,
      "fos": 0.85
    },
    "Libertad": {
      "zona": "AG-C1", 
      "perfil": "IV",
      "altura_maxima": 27.0,
      "fos": 0.85
    }
  }
};

// ============================================================================
// DIGESTO CÓRDOBA (2024)
// ============================================================================

const digesto_CORDOBA = {
  "version": "3.0",
  "ultima_actualizacion": "2024-06-25",
  "ultima_ordenanza": "13460/2024",
  
  "conceptos_2024": {
    "alto_impacto_urbanistico": true,
    "frente_urbano_ambiental": true,
    "arbolado_nativo_obligatorio": true,
    "subsuelo_60_40": true
  },

  "zonas": {
    "A": {
      "nombre": "Área Central",
      "fos": 0.80,
      "fot": 4.0,
      "altura_maxima": 45.0
    },
    "B": {
      "nombre": "Área Intermedia",
      "fos": 0.80,
      "fot": 3.5,
      "altura_maxima": 36.0
    },
    "C1": {
      "nombre": "Corredor Principal",
      "fos": 0.80,
      "fot": 3.0,
      "altura_maxima": 27.0
    },
    "D": {
      "nombre": "Residencial Media-Alta",
      "fos": 0.70,
      "fot": 2.5,
      "altura_maxima": 15.0
    },
    "F": {
      "nombre": "Residencial con Preservación Ambiental",
      "fos": 0.35,
      "fot": 1.0,
      "altura_maxima": 10.5,
      "frente_rio_suquia": true
    }
  },

  "construcciones_subsuelo": {
    "ocupacion_maxima": 0.60,
    "superficie_permeable_minima": 0.40,
    "tratamiento": "paisajistico"
  },

  "factor_impermeabilizacion": {
    "alta_densidad": 0.90,
    "media_densidad": 0.70,
    "baja_densidad": 0.50,
    "zonas_rio": 0.40
  }
};

// ============================================================================
// FUNCIÓN PRINCIPAL PARA N8N
// ============================================================================

function analizarLoteUrbano(parametros) {
  const {
    ciudad,
    direccion,
    frente,
    profundidad,
    lat,
    lon,
    tipo_proyecto = 'vivienda',
    plantas_proyectadas = 1
  } = parametros;

  // Calcular superficie
  const superficie = frente * profundidad;

  // Determinar ciudad y seleccionar digesto
  const ciudadNormalizada = normalizarCiudad(ciudad);
  let analisis = {};

  switch(ciudadNormalizada) {
    case CIUDADES_DISPONIBLES.SANTIAGO_DEL_ESTERO:
      analisis = analizarSDE(direccion, frente, profundidad, superficie, lat, lon);
      break;
    
    case CIUDADES_DISPONIBLES.CORDOBA:
      analisis = analizarCordoba(direccion, frente, profundidad, superficie, lat, lon);
      break;
    
    default:
      throw new Error(`Ciudad no soportada: ${ciudad}`);
  }

  // Agregar cálculos comunes
  analisis.calculos_adicionales = calcularParametrosComunes(
    analisis,
    superficie,
    plantas_proyectadas
  );

  return analisis;
}

// ============================================================================
// ANÁLISIS SANTIAGO DEL ESTERO
// ============================================================================

function analizarSDE(direccion, frente, profundidad, superficie, lat, lon) {
  // Extraer nombre de calle principal
  const callePrincipal = extraerCallePrincipal(direccion);
  
  // Buscar en mapeo de calles
  const datosZona = digesto_SDE.mapeo_calles[callePrincipal] || {
    zona: "AG-C1",
    perfil: "IV",
    altura_maxima: 27.0,
    fos: 0.85,
    fot: null
  };

  // Calcular superficies
  const superficieMaximaPB = superficie * datosZona.fos;
  const superficieTotalEdificable = datosZona.fot ? 
    superficie * datosZona.fot : 
    superficieMaximaPB * Math.floor(datosZona.altura_maxima / 3);

  // Calcular retiros
  const retiros = {
    frente: datosZona.zona.includes("AE") ? 3.0 : 0,
    fondo: Math.max(datosZona.altura_maxima * 0.25, 6.0),
    lateral: datosZona.altura_maxima * 0.15
  };

  // Calcular patios
  const patios = calcularPatios(datosZona.altura_maxima);

  return {
    ciudad: "Santiago del Estero",
    normativa: "Ord. 796/1982 y 4860/2013",
    zona: datosZona.zona,
    perfil: datosZona.perfil,
    indicadores: {
      fos: datosZona.fos,
      fot: datosZona.fot,
      altura_maxima: datosZona.altura_maxima,
      superficie_maxima_pb: superficieMaximaPB,
      superficie_total_edificable: superficieTotalEdificable
    },
    retiros,
    patios,
    restricciones: [
      "Arbolado: 1 cada 5 metros",
      "Balcones: después de 6m altura",
      datosZona.zona === "AE4" ? "No guardacoches en ciertos tramos" : null
    ].filter(Boolean)
  };
}

// ============================================================================
// ANÁLISIS CÓRDOBA  
// ============================================================================

function analizarCordoba(direccion, frente, profundidad, superficie, lat, lon) {
  // Determinar zona (simplificado - en producción usar GIS)
  const zona = determinarZonaCordoba(direccion, lat, lon);
  const datosZona = digesto_CORDOBA.zonas[zona];

  if (!datosZona) {
    throw new Error(`Zona no encontrada: ${zona}`);
  }

  // Calcular superficies básicas
  const superficieMaximaPB = superficie * datosZona.fos;
  const superficieTotalEdificable = datosZona.fot ? 
    superficie * datosZona.fot : 
    superficieMaximaPB;

  // NUEVO 2024: Calcular subsuelo
  const subsuelo = {
    superficie_maxima: superficie * digesto_CORDOBA.construcciones_subsuelo.ocupacion_maxima,
    superficie_permeable: superficie * digesto_CORDOBA.construcciones_subsuelo.superficie_permeable_minima,
    tratamiento: digesto_CORDOBA.construcciones_subsuelo.tratamiento
  };

  // NUEVO 2024: Factor de impermeabilización
  const fis = determinarFIS(zona, digesto_CORDOBA);

  // Calcular retiros
  const retiros = calcularRetirosCordoba(zona, datosZona.altura_maxima);

  // Calcular patios
  const patios = calcularPatios(datosZona.altura_maxima);

  // NUEVO 2024: Verificar alto impacto
  const altoImpacto = superficie > 5000 || datosZona.altura_maxima > 30;

  return {
    ciudad: "Córdoba",
    normativa: "Ord. 8256/86 - Actualizada Ord. 13460/2024",
    zona: zona,
    nombre_zona: datosZona.nombre,
    indicadores: {
      fos: datosZona.fos,
      fot: datosZona.fot,
      fis: fis,
      altura_maxima: datosZona.altura_maxima,
      superficie_maxima_pb: superficieMaximaPB,
      superficie_total_edificable: superficieTotalEdificable
    },
    subsuelo_2024: subsuelo,
    retiros,
    patios,
    restricciones_2024: {
      alto_impacto: altoImpacto,
      vegetacion_nativa: datosZona.frente_rio_suquia || zona === 'F',
      frente_urbano_ambiental: datosZona.frente_rio_suquia || false,
      arbolado_nativo: true
    },
    observaciones: [
      altoImpacto ? "⚠️ Requiere evaluación de Alto Impacto Urbanístico" : null,
      datosZona.frente_rio_suquia ? "🌊 Aplica Frente Urbano Ambiental Río Suquía" : null,
      "✅ Normativa actualizada 2024"
    ].filter(Boolean)
  };
}

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

function normalizarCiudad(ciudad) {
  const ciudadLower = ciudad.toLowerCase();
  if (ciudadLower.includes('santiago') || ciudadLower.includes('sde')) {
    return CIUDADES_DISPONIBLES.SANTIAGO_DEL_ESTERO;
  }
  if (ciudadLower.includes('córdoba') || ciudadLower.includes('cordoba') || ciudadLower.includes('cba')) {
    return CIUDADES_DISPONIBLES.CORDOBA;
  }
  return null;
}

function extraerCallePrincipal(direccion) {
  // Extraer nombre de calle (simplificado)
  const partes = direccion.split(/\d+/)[0].trim();
  return partes.split(' ').slice(0, -1).join(' ') || partes;
}

function determinarZonaCordoba(direccion, lat, lon) {
  // Simplificado - en producción usar servicio GIS
  if (direccion.toLowerCase().includes('colón') || direccion.toLowerCase().includes('centro')) {
    return 'A';
  }
  if (direccion.toLowerCase().includes('río') || direccion.toLowerCase().includes('suquía')) {
    return 'F';
  }
  // Default
  return 'D';
}

function calcularPatios(altura) {
  const patios = {
    primera_categoria: {},
    segunda_categoria: {}
  };

  if (altura <= 13) {
    patios.primera_categoria = {
      superficie_minima: 9.0,
      lado_minimo: 3.0
    };
    patios.segunda_categoria = {
      superficie_minima: 6.0,
      lado_minimo: 2.0
    };
  } else {
    patios.primera_categoria = {
      lado_minimo: Math.max(altura * 0.25, 5.0),
      superficie_minima: Math.pow(Math.max(altura * 0.25, 5.0), 2)
    };
    patios.segunda_categoria = {
      diametro_minimo: 3.0,
      superficie_minima: Math.PI * 1.5 * 1.5
    };
  }

  return patios;
}

function calcularRetirosCordoba(zona, altura) {
  // Simplificado según zona
  const retirosBase = {
    'A': { frente: 0, fondo: 3, lateral: 0 },
    'B': { frente: 0, fondo: 3, lateral: 0 },
    'C1': { frente: 0, fondo: 3, lateral: 0 },
    'D': { frente: 0, fondo: 3, lateral: 0 },
    'F': { frente: 6, fondo: 6, lateral: 3 }
  };

  return retirosBase[zona] || { frente: 3, fondo: 3, lateral: 0 };
}

function determinarFIS(zona, digesto) {
  const zonaDensidad = {
    'A': 'alta_densidad',
    'B': 'alta_densidad',
    'C1': 'alta_densidad',
    'D': 'media_densidad',
    'E': 'media_densidad',
    'F': 'zonas_rio',
    'G': 'baja_densidad'
  };

  const tipoDensidad = zonaDensidad[zona] || 'media_densidad';
  return digesto.factor_impermeabilizacion[tipoDensidad];
}

function calcularParametrosComunes(analisis, superficie, plantas) {
  const superficiePorPlanta = analisis.indicadores.superficie_maxima_pb;
  const superficieTotalProyecto = superficiePorPlanta * plantas;
  
  return {
    superficie_por_planta: superficiePorPlanta,
    superficie_total_proyecto: superficieTotalProyecto,
    plantas_maximas: Math.floor(analisis.indicadores.altura_maxima / 3),
    viabilidad: superficieTotalProyecto <= analisis.indicadores.superficie_total_edificable,
    porcentaje_uso: (superficieTotalProyecto / analisis.indicadores.superficie_total_edificable * 100).toFixed(2)
  };
}

// ============================================================================
// PROMPT GENERATOR PARA CLAUDE
// ============================================================================

function generarPromptClaude(parametros, analisis) {
  return `
# ANÁLISIS NORMATIVO URBANÍSTICO

## DATOS DEL LOTE
- Ciudad: ${parametros.ciudad}
- Dirección: ${parametros.direccion}
- Dimensiones: ${parametros.frente}m x ${parametros.profundidad}m
- Superficie: ${parametros.frente * parametros.profundidad} m²
- Coordenadas: ${parametros.lat}, ${parametros.lon}

## ANÁLISIS REALIZADO
${JSON.stringify(analisis, null, 2)}

Por favor, genera un informe técnico profesional con:
1. Resumen ejecutivo
2. Análisis detallado de indicadores
3. Restricciones aplicables
4. Recomendaciones de diseño
5. Observaciones sobre normativa 2024 (si aplica)
`;
}

// ============================================================================
// EXPORTACIÓN PARA N8N
// ============================================================================

// Para usar en n8n, simplemente llama a esta función con los datos del webhook
const procesarAnalisisUrbano = (webhookData) => {
  try {
    // Extraer datos del webhook
    const parametros = {
      ciudad: webhookData.ciudad || 'Córdoba',
      direccion: webhookData.direccion,
      frente: parseFloat(webhookData.frente),
      profundidad: parseFloat(webhookData.profundidad),
      lat: parseFloat(webhookData.lat),
      lon: parseFloat(webhookData.lon),
      tipo_proyecto: webhookData.tipo_proyecto || 'vivienda',
      plantas_proyectadas: parseInt(webhookData.plantas) || 1
    };

    // Realizar análisis
    const analisis = analizarLoteUrbano(parametros);

    // Generar prompt para Claude
    const promptClaude = generarPromptClaude(parametros, analisis);

    // Retornar resultado para siguiente nodo
    return [{
      json: {
        success: true,
        parametros,
        analisis,
        prompt_claude: promptClaude,
        timestamp: new Date().toISOString()
      }
    }];

  } catch (error) {
    return [{
      json: {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }
    }];
  }
};

// Ejecutar con los datos del nodo anterior en n8n
return procesarAnalisisUrbano($json);