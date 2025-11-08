// ============================================================================
// DIGESTO NORMATIVO CÓRDOBA - VERSIÓN 3.0 (ACTUALIZADO 2024)
// ============================================================================
// Basado en Ord. 8256/86 y modificatorias hasta Ord. 13.460/2024
// Comparado y alineado con estructura de Santiago del Estero
// Última actualización: 25 de junio de 2024
// ============================================================================

const digesto_normativa_cordoba_v3 = {
  "digesto_cordoba_v3": {
    "metadata": {
      "version": "3.0",
      "fecha_creacion": "2024-11",
      "ultima_actualizacion": "2024-06-25",
      "fuentes": [
        "Ord. 8256/1986 (Base)",
        "Ord. 12483/2015",
        "Ord. 12596/2015", 
        "Decreto 4689/2016",
        "Ord. 13460/2024 (Última modificación)"
      ],
      "decreto_promulgacion": "Decreto N° 327/2024",
      "uso": "analisis_automatizado_lotes_cordoba"
    },

    // ============================================================================
    // NUEVOS CONCEPTOS 2024 (Ord. 13.460)
    // ============================================================================
    "conceptos_actualizados_2024": {
      "alto_impacto_urbanistico": {
        "definicion": "Grandes actuaciones urbanísticas que transforman la estructura urbana",
        "caracteristicas": [
          "Alteración en la movilidad urbana",
          "Requerimientos de infraestructuras no previstas",
          "Modificación del entorno inmediato (alturas, ocupación superior)",
          "Introducción de usos no existentes",
          "Alteración del soporte físico natural"
        ],
        "evaluacion": "Criterio técnico de la Autoridad de Aplicación"
      },

      "arbolado_nativo": {
        "definicion": "Provisión de especies vegetales nativas",
        "autoridad": "Dirección de Impacto Ambiental y Cambio Climático",
        "obligatorio": true
      },

      "cobertura_vegetal": {
        "definicion": "Porcentaje del suelo libre y permeable con cobertura vegetal de arbolado nativo",
        "aplicacion": "Espacios libres de impermeabilización"
      },

      "frente_urbano_ambiental_rio_suquia": {
        "definicion": "Franja urbano ambiental conformada por márgenes del Río Suquía",
        "marco_legal": "Ley Provincial N° 10355",
        "referencia": "Art. 240 y 1970 del Código Civil y Comercial",
        "caracter": "Interés público y protección ambiental"
      },

      "vinculacion_funcional": {
        "definicion": "Proyectos con continuidad física y/o de usos",
        "incluye": [
          "Circulaciones compartidas",
          "Ingresos continuos o subyacentes",
          "Tratamiento que identifique conjunto"
        ]
      }
    },

    // ============================================================================
    // INSTRUCCIONES CRÍTICAS (Comparadas con SDE)
    // ============================================================================
    "INSTRUCCIONES_CRITICAS": {
      "1": "Verificar si está en corredor o área especial PRIMERO",
      "2": "Los corredores PREVALECEN sobre zonificación general",
      "3": "Aplicar nuevas restricciones ambientales 2024",
      "4": "En Río Suquía aplicar Frente Urbano Ambiental",
      "5": "Alto impacto urbanístico requiere evaluación especial",
      "6": "Construcciones en subsuelo: máx 60% con 40% permeable"
    },

    // ============================================================================
    // MAPEO DE CALLES PRINCIPALES (Similar a SDE)
    // ============================================================================
    "mapeo_calles_principales": {
      "Avenida_Colon": {
        "zona_aplicable": "C1",
        "ancho": 30,
        "tipo": "avenida_principal",
        "altura_maxima": 27.0,
        "fos": 0.80,
        "fot": 3.0,
        "perfil": "Especial C1"
      },
      
      "Boulevard_Castro_Barros": {
        "zona_aplicable": "C1",
        "ancho": 30,
        "tipo": "boulevard",
        "altura_maxima": 27.0,
        "fos": 0.80,
        "fot": 3.0
      },

      "Avenida_Velez_Sarsfield": {
        "zona_aplicable": "C1",
        "ancho": 30,
        "tipo": "avenida_principal",
        "altura_maxima": 27.0,
        "fos": 0.80,
        "fot": 3.0
      },

      "General_Paz": {
        "zona_aplicable": "C2",
        "ancho": 20,
        "tipo": "avenida_secundaria",
        "altura_maxima": 18.0,
        "fos": 0.80,
        "fot": 2.5
      },

      "Avenida_Pueyrredon": {
        "zona_aplicable": "C1",
        "ancho": 25,
        "tipo": "avenida_principal",
        "altura_maxima": 27.0,
        "fos": 0.80,
        "fot": 3.0
      },

      "Duarte_Quiros": {
        "zona_aplicable": "I",
        "ancho": 20,
        "tipo": "avenida_secundaria",
        "altura_maxima": 13.5,
        "fos": 0.70,
        "fot": 2.0
      },

      "Ejercito_Argentino": {
        "zona_aplicable": "I",
        "ancho": 20,
        "tipo": "avenida_secundaria",
        "extension": 150,
        "nota": "Zona I se extiende 150m desde LM"
      },

      "Avenida_Circunvalacion": {
        "zona_aplicable": "Variable",
        "ancho": 40,
        "tipo": "circunvalacion",
        "nota": "APU en varios tramos"
      },

      "Recta_Martinolli": {
        "zona_aplicable": "F5",
        "tipo": "avenida_principal",
        "permite_equipamiento": true,
        "nota": "Permite equipamientos > 1000m²"
      },

      "Pedro_Simon_Laplace": {
        "zona_aplicable": "F5",
        "tipo": "avenida_secundaria",
        "permite_equipamiento": true,
        "tramo": "Entre Roberto Boyle y Recta Martinolli"
      },

      "Carlos_Federico_Gauss": {
        "zona_aplicable": "F5",
        "tipo": "avenida_secundaria",
        "permite_equipamiento": true,
        "tramo": "Entre Roberto Boyle y Recta Martinolli"
      }
    },

    // ============================================================================
    // ZONAS PRINCIPALES (Actualizado 2024)
    // ============================================================================
    "zonas_principales": {
      "ZONA_A": {
        "nombre": "Área Central",
        "caracter": "Máxima densificación poblacional",
        "fos": 0.80,
        "fot": 4.0,
        "altura_maxima": 45.0,
        "altura_minima": 10.5,
        "perfil": "Varios según ubicación",
        "retiros": {
          "frente": "Sobre LM o retiro optativo",
          "fondo": 3.0,
          "laterales": "No obligatorio"
        }
      },

      "ZONA_B": {
        "nombre": "Área Intermedia",
        "caracter": "Renovación con densificación relativa",
        "fos": 0.80,
        "fot": 3.5,
        "altura_maxima": 36.0,
        "perfil": "XXI/XXII",
        "retiros": {
          "frente": "Sobre LM o retiro optativo",
          "fondo": 3.0,
          "laterales": "No obligatorio"
        }
      },

      "ZONA_C1": {
        "nombre": "Corredor Lineal Principal",
        "caracter": "Renovación con densificación poblacional",
        "fos": 0.80,
        "fot": 3.0,
        "altura_maxima": 27.0,
        "perfil": "Específico C1",
        "retiros": {
          "frente": "Sobre LM obligatorio",
          "fondo": 3.0,
          "laterales": "No obligatorio"
        }
      },

      "ZONA_C2": {
        "nombre": "Corredor Lineal Secundario",
        "caracter": "Renovación con densificación media",
        "fos": 0.80,
        "fot": 2.5,
        "altura_maxima": 18.0,
        "perfil": "Específico C2",
        "retiros": {
          "frente": "Sobre LM obligatorio",
          "fondo": 3.0,
          "laterales": "No obligatorio"
        }
      },

      "ZONA_C3": {
        "nombre": "Corredor Barrial",
        "caracter": "Consolidación residencial-comercial",
        "fos": 0.75,
        "fot": 2.0,
        "altura_maxima": 15.0,
        "retiros": {
          "frente": "Sobre LM o retiro optativo",
          "fondo": 3.0,
          "laterales": "No obligatorio"
        }
      },

      "ZONA_C5": {
        "nombre": "Corredor Especial Río Suquía",
        "caracter": "Corredor de preservación ambiental",
        "fos": 0.60,
        "fot": 1.5,
        "altura_maxima": 12.0,
        "retiros": {
          "frente": "Según sector",
          "rio": 15.0,
          "laterales": "Variable"
        },
        "restricciones": "Protección ambiental ribereña"
      },

      "ZONA_D": {
        "nombre": "Residencial Densidad Media-Alta",
        "caracter": "Renovación con densificación relativa",
        "fos": 0.70,
        "fot": 2.5,
        "altura_maxima": 15.0,
        "altura_fachada": 12.0,
        "perfil": "XXIII",
        "retiros": {
          "frente": "Optativo",
          "fondo": 3.0,
          "laterales": "No obligatorio"
        },
        "escalonamiento": {
          "retiro_a_12m": 3.0,
          "altura_final": 15.0
        }
      },

      "ZONA_E": {
        "nombre": "Residencial Densidad Media",
        "caracter": "Renovación con densificación relativa",
        "fos": 0.70,
        "fot": 2.0,
        "altura_maxima": 12.0,
        "altura_fachada": 8.0,
        "perfil": "XXIV",
        "retiros": {
          "frente": "Optativo",
          "fondo": 3.0,
          "laterales": "No obligatorio"
        },
        "escalonamiento": {
          "retiro_a_8m": 12.0,
          "altura_final": 12.0
        },
        "unidades_max": "1 cada 100 m² (sin cloacas)"
      },

      // ZONA F MODIFICADA 2024
      "ZONA_F": {
        "nombre": "Residencial con Preservación Ambiental",
        "caracter": "Consolidación residencial con características ambientales a preservar",
        "actualizado": "2024",
        "fos": 0.35,
        "fot": 1.0,
        "altura_maxima": 10.5,
        "perfil": "Básico",
        "retiros": {
          "frente": 6.0,
          "fondo": 6.0,
          "laterales": {
            "frente_18m": "1 lateral 3m",
            "frente_22m": "todos 3m"
          }
        },
        "unidades_max": "1 cada 250 m²",
        "especial_2024": {
          "frente_rio_suquia": true,
          "preservacion_ambiental": true,
          "vegetacion_nativa": "obligatoria"
        }
      },

      // ZONA F5 CON RESTRICCIONES 2024
      "ZONA_F5": {
        "nombre": "Residencial Baja Densidad con Restricciones",
        "actualizado": "2024",
        "fos": 0.35,
        "fot": 1.0,
        "altura_maxima": 10.5,
        "equipamientos_permitidos": {
          "superficie_max": 1000,
          "vias_permitidas": [
            "Av. Recta Martinolli",
            "Av. Pedro Simón Laplace (tramo específico)",
            "Av. Carlos Federico Gauss (tramo específico)"
          ]
        }
      },

      "ZONA_G1": {
        "nombre": "Residencial Periférica",
        "caracter": "Extensión urbana baja densidad",
        "fos": 0.60,
        "fot": 1.2,
        "altura_maxima": 10.5,
        "retiros": {
          "frente": 3.0,
          "fondo": 3.0,
          "laterales": "Según ancho de parcela"
        }
      },

      "ZONA_H1": {
        "nombre": "Mixta Residencial-Productiva",
        "caracter": "Residencial con actividades productivas compatibles",
        "fos": 0.60,
        "fot": 1.0,
        "altura_maxima": 10.5,
        "retiros": {
          "frente": 6.0,
          "fondo": 6.0,
          "laterales": "Según uso"
        }
      },

      "ZONA_I": {
        "nombre": "Industrial Mixta",
        "caracter": "Actividades industriales con restricciones medias",
        "fos": 0.70,
        "fot": 2.0,
        "altura_maxima": 13.5,
        "retiros": {
          "frente": "Según Art. 9",
          "fondo": 3.0,
          "laterales": "Según actividad"
        }
      },

      // ZONAS J1 y J2 CON RESTRICCIONES 2024
      "ZONA_J1": {
        "nombre": "Urbanización Parque 1",
        "actualizado": "2024",
        "ordenanza_base": "6646/67",
        "altura_maxima": 12.0,
        "equipamientos_2024": {
          "max_1000m2": "Solo en vías con Patrón Id",
          "restriccion": "Según Ord. 8133"
        }
      },

      "ZONA_J2": {
        "nombre": "Urbanización Parque 2",
        "actualizado": "2024",
        "ordenanza_base": "6646/67",
        "altura_maxima": 12.0,
        "equipamientos_2024": {
          "max_1000m2": "Solo en vías con Patrón Id",
          "restriccion": "Según Ord. 8133"
        }
      },

      "ZONA_K": {
        "nombre": "Industrial Periférica",
        "caracter": "Actividades industriales con molestias importantes",
        "fos": 0.60,
        "fot": 1.0,
        "altura_maxima": 10.5,
        "retiros": {
          "frente": "Según Art. 9",
          "fondo": "Según actividad",
          "laterales": "Según actividad"
        }
      },

      "ZONA_L": {
        "nombre": "Industrial Exclusiva",
        "caracter": "Actividades industriales importantes y usos rurales",
        "fos": {
          "frente_menor_25m": 0.80,
          "frente_mayor_25m": 0.60
        },
        "fot": 1.5,
        "altura_maxima": "Sin límite",
        "retiros": {
          "frente": 10.0,
          "fondo": 10.0,
          "laterales": {
            "frente_menor_25m": "No obligatorio",
            "frente_25_60m": "1 lateral",
            "frente_mayor_60m": "Todos los laterales"
          }
        }
      },

      "ZONA_U": {
        "nombre": "Zona de Renovación con Densificación",
        "caracter": "Renovación con densificación poblacional relativa",
        "fos": 0.70,
        "fot": null,
        "altura_maxima": 10.5,
        "perfil": "XVIII",
        "condiciones": {
          "puede_llegar_a_12m": "Si FOS máx 60%"
        },
        "retiros": {
          "frente": "Sobre LM obligatorio",
          "fondo": 3.0,
          "laterales": "No obligatorio"
        }
      },

      "ZONA_W": {
        "nombre": "Zona de Renovación con Densificación",
        "caracter": "Vivienda individual y colectiva con servicios",
        "fos": 0.70,
        "fot": null,
        "altura_maxima": 10.0,
        "perfil": "XXV",
        "retiros": {
          "frente": "Sobre LM",
          "fondo": 3.0,
          "laterales": "No obligatorio"
        },
        "restricciones": "Máximas restricciones industriales"
      }
    },

    // ============================================================================
    // ÁREAS ESPECIALES
    // ============================================================================
    "areas_especiales": {
      "APH1": {
        "nombre": "Área de Protección del Patrimonio Histórico 1",
        "descripcion": "Regeneración urbana con preservación histórica",
        "fos": 0.80,
        "fot": null,
        "altura_maxima": 12.0,
        "altura_fachada": 8.0,
        "perfil": "XXVIII",
        "retiros": {
          "frente": "Sobre LM obligatorio",
          "fondo": 3.0,
          "laterales": "No obligatorio"
        },
        "restricciones": "Máxima restricción industrial",
        "CEPT": "Permite transferir edificabilidad"
      },

      "APH2": {
        "nombre": "Área de Protección del Patrimonio Histórico 2",
        "descripcion": "Preservación estricta del patrimonio",
        "fos": 0.80,
        "fot": null,
        "altura_maxima": 5.5,
        "perfil": "XXIX",
        "retiros": {
          "frente": "Sobre LM obligatorio",
          "fondo": "No aplica",
          "laterales": "No obligatorio"
        }
      },

      "APU": {
        "nombre": "Áreas de Promoción Urbana",
        "descripcion": "Áreas receptoras de CEPT y desarrollo especial",
        "nota": "Requiere estudio particularizado",
        "cantidad_2024": 24,
        "ejemplos": [
          "APU Av. Circunvalación Arco Noroeste",
          "APU Ferrocarril Belgrano – Av. Cardeñosa",
          "APU Ronda Urbana Norte – Predio C.N.E.A",
          "APU Río Suquía: Borde San Vicente",
          "APU Río Suquía: Villa Paez – Villa Cabrera",
          "APU Circunvalación Oeste: Av. Cárcamo"
        ]
      },

      "FRENTE_URBANO_AMBIENTAL": {
        "nombre": "Frente Urbano Ambiental Río Suquía",
        "descripcion": "Nueva figura 2024",
        "caracter": "Interés público y protección ambiental",
        "aplicacion": "Márgenes del río y parcelas frentistas",
        "normativa": "Ley Provincial N° 10355",
        "restricciones": [
          "Protección ambiental obligatoria",
          "Uso óptimo de recursos naturales",
          "Vegetación nativa prioritaria"
        ]
      }
    },

    // ============================================================================
    // CONSTRUCCIONES EN SUBSUELO (ACTUALIZADO 2024)
    // ============================================================================
    "construcciones_subsuelo_2024": {
      "descripcion": "Modificado por Ord. 13460/2024",
      "reglas": {
        "desarrollo_maximo": "60% de la superficie de parcela",
        "coincidencia_FOS": "Debe coincidir con FOS de Planta Baja",
        "superficie_libre": "40% mínimo",
        "impermeabilizacion": "40% debe ser libre de impermeabilización",
        "tratamiento": {
          "tipo": "Paisajístico",
          "elementos": [
            "Parquización",
            "Suelo natural",
            "Vegetación"
          ]
        }
      },
      "aplicacion": "Todas las zonas salvo restricción específica"
    },

    // ============================================================================
    // VEGETACIÓN Y ARBOLADO (ACTUALIZADO 2024)
    // ============================================================================
    "vegetacion_urbana_2024": {
      "arbolado_nativo": {
        "obligatorio": true,
        "autoridad": "Dirección de Impacto Ambiental y Cambio Climático",
        "especies": "Nativas según especificaciones oficiales"
      },
      
      "cobertura_vegetal": {
        "definicion": "Porcentaje con cobertura de arbolado nativo",
        "aplicacion": "Suelo libre y permeable"
      },

      "espacios_verdes": {
        "cesion_obligatoria": "10% superficie en loteos > 5000m²",
        "equipamiento_comunitario": "5% adicional",
        "referencia": "Art. 67° Ord. 8060"
      },

      "arbolado_veredas": {
        "frecuencia": "1 árbol cada 8-10 metros",
        "especies_recomendadas": [
          "Jacarandá",
          "Tipa",
          "Lapacho rosado",
          "Crespón",
          "Liquidambar"
        ],
        "especies_prohibidas": [
          "Eucaliptus en veredas",
          "Álamo",
          "Sauce fuera de riberas"
        ],
        "cazuela_minima": "0.80 x 0.80 metros",
        "distancia_esquina": "Mínimo 5 metros"
      }
    },

    // ============================================================================
    // PLANES DE VIVIENDA (ACTUALIZADO 2024)
    // ============================================================================
    "planes_vivienda_2024": {
      "menos_10_unidades": {
        "aprobacion": "Dirección de Obras Privadas",
        "requisitos": "Cumplir normativa de zona"
      },

      "mas_10_unidades": {
        "aprobacion": "Dirección de Planeamiento Urbano",
        "requisitos": [
          "Factibilidad de localización",
          "Estudio de densidades",
          "Infraestructura completa",
          "Espacios verdes según escala"
        ],
        "estacionamiento": {
          "minimo": "1 cochera por unidad",
          "cortesia": "10% adicional",
          "ubicacion": "Fuera del retiro de frente"
        },
        "vias_circulacion": {
          "ancho_minimo": 6.0,
          "restriccion": "No en retiros de edificación"
        }
      },

      "parcelas_grandes": {
        "mas_30000m2": "Rige normativa de urbanizaciones/loteos",
        "mas_200m_lado": "Puede exigirse apertura de calle",
        "continuidad_vial": "Obligatoria según sector"
      },

      "vinculacion_funcional": {
        "definicion": "Proyectos contiguos con continuidad",
        "aplican": "Todas las condiciones del conjunto"
      },

      "planes_colectivos": {
        "requisito_2024": "Factibilidad red cloacal o tratamiento autorizado",
        "obligatorio": true
      }
    },

    // ============================================================================
    // FACTOR DE IMPERMEABILIZACIÓN (FIS)
    // ============================================================================
    "factor_impermeabilizacion": {
      "FIS": {
        "descripcion": "Coeficiente de impermeabilización admisible",
        "formula": "(superficie_impermeabilizada / superficie_total) * 100",
        "limites_por_zona": {
          "zonas_alta_densidad": 0.90,
          "zonas_media_densidad": 0.70,
          "zonas_baja_densidad": 0.50,
          "zonas_parque": 0.35,
          "zonas_rio_suquia": 0.40
        },
        "nota": "Incluye cubiertas y solados impermeables",
        "subsuelo_2024": "Máximo 60% con 40% permeable obligatorio"
      }
    },

    // ============================================================================
    // CERTIFICADO EDIFICABILIDAD (CEPT)
    // ============================================================================
    "certificado_edificabilidad": {
      "CEPT": {
        "nombre_completo": "Certificado de Edificabilidad Potencial Transferible",
        "descripcion": "Permite transferir capacidad edificable entre parcelas",
        "aplicacion": {
          "zonas_emisoras": ["APH1", "APH2", "Catalogados"],
          "zonas_receptoras": ["APU", "Zonas con convenio"],
          "vigencia": "12 meses desde emisión",
          "extension": "12 meses adicionales con tramitación"
        },
        "procedimiento": [
          "Solicitud en Dirección de Planeamiento",
          "Acreditación de dominio",
          "Estudio de capacidad transferible", 
          "Emisión del certificado",
          "Inscripción registral"
        ]
      }
    },

    // ============================================================================
    // REGLAS ESPECIALES
    // ============================================================================
    "reglas_especiales": {
      "esquinas": {
        "descripcion": "En esquinas, altura mayor puede extenderse",
        "extension_maxima": 20.0,
        "altura_minima": 2.7,
        "aplicacion": "Ambos frentes"
      },

      "alto_impacto": {
        "requiere": "Evaluación especial de Autoridad",
        "considera": [
          "Transformación estructura urbana",
          "Alteración movilidad",
          "Cambio de usos",
          "Impacto ambiental"
        ]
      },

      "patrimonio": {
        "catalogados": "Requiere visación previa",
        "colindantes": "Condiciones particulares",
        "autoridad": "Dirección de Planeamiento Urbano"
      },

      "centro_manzana": {
        "descripcion": "Espacio protegido por líneas de frente interno",
        "aplicacion": "Zonas con regulación específica"
      },

      "patios": {
        "primera_categoria": {
          "locales_principales": true,
          "superficie_min": 10.0,
          "lado_min": 3.0,
          "formula_altura": "h/4 (min 3m)"
        },
        "segunda_categoria": {
          "locales_servicio": true,
          "superficie_min": 6.0,
          "lado_min": 2.0,
          "formula_altura": "h/5 (min 2m)"
        }
      },

      "voladizos_balcones": {
        "altura_minima": 2.7,
        "saliente_maxima": {
          "formula": "ancho_calle / 10",
          "maximo": 1.5,
          "minimo": 0.8
        },
        "restricciones": "No en APH con protección directa"
      }
    },

    // ============================================================================
    // COMPARACIÓN CON SANTIAGO DEL ESTERO
    // ============================================================================
    "comparacion_SDE": {
      "similitudes": {
        "estructura": "Ambos usan sistema de zonas y perfiles",
        "FOS_FOT": "Indicadores similares",
        "areas_especiales": "Protección patrimonial",
        "calles_principales": "Normativa específica por corredor"
      },
      
      "diferencias_cordoba": {
        "complejidad": "20+ zonas vs 10 en SDE",
        "actualizacion": "2024 vs 2013",
        "ambiental": "Mayor énfasis en sostenibilidad",
        "subsuelo": "Regulación específica 60/40",
        "CEPT": "Sistema de transferencia edificabilidad",
        "alto_impacto": "Evaluación de grandes proyectos"
      },

      "ventajas_cordoba": {
        "1": "Normativa ambiental más completa",
        "2": "Regulación de subsuelos actualizada",
        "3": "Sistema CEPT para desarrollo urbano",
        "4": "24 APU para promoción urbana",
        "5": "Frente Urbano Ambiental Río"
      }
    },

    // ============================================================================
    // DISPOSICIONES TRANSITORIAS 2024
    // ============================================================================
    "disposiciones_transitorias_2024": {
      "factibilidades": {
        "vigencia": "90 días desde Ord. 13460/2024",
        "vencimiento": "Caducidad automática",
        "requisito": "Obtener Permiso Edificación"
      },
      
      "resoluciones_ratificadas": [
        "224/2023",
        "266/2023", 
        "274/2023",
        "001/1/2023"
      ],

      "entrada_vigencia": "25 de junio de 2024"
    },

    // ============================================================================
    // ALGORITMO DE ANÁLISIS (Mejorado para 2024)
    // ============================================================================
    "algoritmo_analisis": {
      "paso_1": "Verificar si es Alto Impacto Urbanístico",
      "paso_2": "Identificar si está en corredor o área especial",
      "paso_3": "Si está en Río Suquía, aplicar Frente Urbano Ambiental",
      "paso_4": "Identificar zona general si no es corredor",
      "paso_5": "Aplicar perfil correspondiente",
      "paso_6": "Calcular FOS, FOT, FIS",
      "paso_7": "Aplicar restricciones de subsuelo (60/40)",
      "paso_8": "Determinar vegetación nativa obligatoria",
      "paso_9": "Verificar patrimonio si corresponde",
      "paso_10": "Aplicar reglas de esquina si aplica"
    },

    // ============================================================================
    // DATOS PARA PROMPT N8N
    // ============================================================================
    "configuracion_n8n": {
      "version_digesto": "3.0",
      "ultima_actualizacion": "2024-06-25",
      "ciudad": "Córdoba",
      "provincia": "Córdoba",
      "pais": "Argentina",
      "normativa_base": "Ord. 8256/86",
      "ultima_modificacion": "Ord. 13460/2024",
      "autoridad_aplicacion": "Dirección de Planeamiento Urbano",
      "organismo_ambiental": "Dirección de Impacto Ambiental y Cambio Climático"
    }
  }
};

// ============================================================================
// PROMPT PARA CLAUDE - ANÁLISIS DE LOTES EN CÓRDOBA (ACTUALIZADO 2024)
// ============================================================================

const claude_prompt_cordoba_2024 = `# ANÁLISIS NORMATIVO URBANÍSTICO - CÓRDOBA (ACTUALIZADO 2024)

## INSTRUCCIONES CRÍTICAS - VERSIÓN 3.0

Eres un experto en normativa urbana de Córdoba actualizado con la Ordenanza 13.460/2024.
DEBES seguir estos pasos EXACTAMENTE:

### PASO 1: EVALUACIÓN DE ALTO IMPACTO
Determinar si el proyecto constituye "Alto Impacto Urbanístico" según:
- Alteración de movilidad urbana
- Infraestructuras no previstas
- Modificación significativa del entorno
- Introducción de usos no existentes
- Alteración del soporte físico natural

### PASO 2: IDENTIFICACIÓN DE ZONA
1. Analizar dirección: "${direccion}"
2. Verificar si está en Frente Urbano Ambiental Río Suquía
3. Comprobar si está en corredor principal
4. Verificar área especial (APH, APU)
5. Si es esquina, marcar para reglas especiales
6. Identificar zona general

### PASO 3: EXTRACCIÓN DE PARÁMETROS
De la zona identificada, extraer:
- Carácter urbanístico
- FOS, FOT y FIS (nuevo 2024)
- Altura máxima y mínima
- Perfil de edificación
- Retiros obligatorios
- Restricciones especiales 2024

### PASO 4: CÁLCULOS ESPECÍFICOS

**Superficie Edificable:**
- Planta Baja = superficie_parcela × FOS
- Total = superficie_parcela × FOT
- Subsuelo = máximo 60% parcela (40% permeable obligatorio)

**Factor Impermeabilización (FIS):**
- Calcular según zona
- Considerar 40% mínimo permeable en subsuelos

**Vegetación Nativa:**
- Obligatoria en zonas F y frente al río
- Según Dirección de Impacto Ambiental

**Retiros:**
- Aplicar valores específicos de zona
- En perímetro libre: d = h/3 (mínimo 4m)

**Patios reglamentarios:**
- 1ª categoría: h/4 (mín 3m lado, 10m² superficie)
- 2ª categoría: h/5 (mín 2m lado, 6m² superficie)

### PASO 5: FORMATO DE RESPUESTA

# ANÁLISIS NORMATIVO DEL LOTE - CÓRDOBA 2024

## 📍 IDENTIFICACIÓN
**Dirección:** ${direccion}
**Coordenadas:** Lat: ${lat}, Long: ${lon}
**Dimensiones:** ${frente} m × ${profundidad} m
**Superficie:** ${superficie} m²

## 🏗️ ZONIFICACIÓN
**Zona:** [Código] - [Nombre]
**Ordenanza Base:** Ord. 8256/86
**Última Modificación:** Ord. 13.460/2024
**Perfil:** [Perfil aplicable]
**Carácter:** [Descripción]

## 📊 INDICADORES URBANÍSTICOS
**F.O.S.:** [valor]% = [cálculo] m²
**F.O.T.:** [valor] = [cálculo] m² totales
**F.I.S.:** [valor]% (Factor Impermeabilización)
**Altura Máxima:** [valor] m
**Altura Mínima:** [valor] m (si aplica)

## 🏗️ CONSTRUCCIONES EN SUBSUELO (2024)
**Ocupación Máxima:** 60% = [cálculo] m²
**Superficie Permeable Obligatoria:** 40% = [cálculo] m²
**Tratamiento:** Paisajístico con vegetación nativa

## 📏 RETIROS OBLIGATORIOS
**Línea Municipal/Edificación:** [valor]
**Retiro Fondo:** [valor] m
**Retiros Laterales:** [especificar]

## 🌳 VEGETACIÓN Y AMBIENTE (2024)
**Arbolado Nativo:** [Obligatorio/Opcional]
**Cobertura Vegetal:** [porcentaje]%
**Especies:** [Según Dirección Impacto Ambiental]

## 🏛️ PATIOS REGLAMENTARIOS
[Cálculos según altura]

## ⚠️ RESTRICCIONES ESPECIALES 2024
[Listar todas las aplicables]

## 🔍 EVALUACIÓN ALTO IMPACTO
[Si aplica, indicar requisitos especiales]

## ⚖️ NOTA LEGAL
Análisis basado en Ord. 8256/86 y modificatorias hasta Ord. 13.460/2024.
Validar con Dirección de Planeamiento Urbano de Córdoba.

---

## DIGESTO CÓRDOBA 2024:
${JSON.stringify(digesto_normativa_cordoba_v3, null, 2)}

PROCEDER CON EL ANÁLISIS.`;

// ============================================================================
// EXPORTACIÓN Y USO EN N8N
// ============================================================================

module.exports = {
  digesto: digesto_normativa_cordoba_v3,
  prompt: claude_prompt_cordoba_2024,
  
  // Función helper para n8n
  generarAnalisis: function(datosLote) {
    return {
      prompt: claude_prompt_cordoba_2024,
      datos_lote: datosLote,
      version: "3.0",
      fecha: new Date().toISOString(),
      normativa: "Ord. 13.460/2024"
    };
  }
};

// Ejemplo de uso:
/* 
const analisis = generarAnalisis({
  direccion: "Av. Colón 350",
  frente: 10,
  profundidad: 30,
  superficie: 300,
  lat: -31.4201,
  lon: -64.1888
});
*/