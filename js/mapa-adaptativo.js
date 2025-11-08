// ============================================================================
// MAPA ADAPTATIVO - Messad Estudio
// Sistema de visualización adaptativo según ciudad:
// - Santiago del Estero: NIVEL 2 (rectángulo orientado a la calle)
// - Córdoba Capital: NIVEL 3 (polígono catastral real de IDECOR)
// ============================================================================

// ============================================================================
// CONFIGURACIÓN POR CIUDAD
// ============================================================================

const CIUDAD_CONFIG = {
    santiago: {
        nombre: 'Santiago del Estero',
        nombreCompleto: 'Santiago del Estero, Santiago del Estero, Argentina',
        nivel: 2, // Rectángulo orientado a la calle
        geocodingAPI: 'georef',
        catastroAPI: 'https://geoserver.msebas.gob.ar/geoserver/wms',
        centro: { lat: -27.7833, lng: -64.2667 },
        zoom: 15,
        colorPrimario: '#fc5404', // Naranja
        colorSecundario: '#e04d03'
    },
    cordoba: {
        nombre: 'Córdoba Capital',
        nombreCompleto: 'Córdoba, Córdoba, Argentina',
        nivel: 3, // Polígono catastral real
        geocodingAPI: 'georef',
        catastroWMS: 'https://gn-idecor.mapascordoba.gob.ar/geoserver/wms',
        catastroWFS: 'https://gn-idecor.mapascordoba.gob.ar/geoserver/wfs',
        centro: { lat: -31.4201, lng: -64.1888 },
        zoom: 15,
        colorPrimario: '#28a745', // Verde (indica dato oficial)
        colorSecundario: '#218838'
    }
};

// ============================================================================
// ESTADO GLOBAL
// ============================================================================

let map = null;
let marker = null;
let polygon = null;
let currentCiudad = null;
let currentCoords = null;
let googleMapsReady = false;

// ============================================================================
// CALLBACK DE GOOGLE MAPS (llamada cuando la API termina de cargar)
// ============================================================================

window.initGoogleMaps = function() {
    console.log('✅ Google Maps API cargada exitosamente');
    googleMapsReady = true;
};

// ============================================================================
// INICIALIZACIÓN
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🗺️ Mapa adaptativo: Inicializando...');

    // Listener: Cambio de ciudad
    const ciudadSelect = document.getElementById('ciudad');
    if (ciudadSelect) {
        ciudadSelect.addEventListener('change', onCiudadChange);
    }

    // Listener: Input de dirección (con debounce)
    const direccionInput = document.getElementById('direccion');
    if (direccionInput) {
        let geocodingTimeout = null;
        direccionInput.addEventListener('input', function(e) {
            const direccion = e.target.value.trim();

            // Validar mínimo 5 caracteres y ciudad seleccionada
            if (direccion.length < 5 || !currentCiudad) return;

            // Debounce: esperar 1 segundo después de dejar de escribir
            clearTimeout(geocodingTimeout);
            geocodingTimeout = setTimeout(() => {
                geocodificarYActualizarMapa(direccion);
            }, 1000);
        });
    }

    // Listener: Cambios en dimensiones del lote
    const frenteInput = document.getElementById('frente');
    const profundidadInput = document.getElementById('profundidad');

    if (frenteInput && profundidadInput) {
        const redrawHandler = () => {
            if (currentCoords && currentCiudad) {
                redibujarPoligono();
            }
        };

        frenteInput.addEventListener('input', redrawHandler);
        profundidadInput.addEventListener('input', redrawHandler);
    }

    console.log('✅ Mapa adaptativo: Listeners configurados');
});

// ============================================================================
// EVENTO: CAMBIO DE CIUDAD
// ============================================================================

function onCiudadChange(e) {
    currentCiudad = e.target.value;

    if (!currentCiudad) {
        // Ocultar mapa si no hay ciudad
        document.getElementById('mapa-container').style.display = 'none';
        return;
    }

    console.log(`🏙️ Ciudad seleccionada: ${CIUDAD_CONFIG[currentCiudad].nombre}`);

    // Inicializar mapa
    inicializarMapa(currentCiudad);

    // Mostrar contenedor del mapa y ocultar placeholder
    document.getElementById('mapa-container').style.display = 'block';
    const placeholder = document.getElementById('mapa-placeholder');
    if (placeholder) {
        placeholder.style.display = 'none';
    }

    // Actualizar hint de dirección
    const config = CIUDAD_CONFIG[currentCiudad];
    const direccionHint = document.querySelector('#direccion').nextElementSibling;
    if (direccionHint) {
        direccionHint.textContent = `Solo calle y número (agregaremos ${config.nombre} automáticamente)`;
    }

    // Si ya había una dirección, re-geocodificar
    const direccion = document.getElementById('direccion').value.trim();
    if (direccion.length >= 5) {
        geocodificarYActualizarMapa(direccion);
    }
}

// ============================================================================
// INICIALIZAR GOOGLE MAPS
// ============================================================================

function inicializarMapa(ciudad) {
    const config = CIUDAD_CONFIG[ciudad];

    // Verificar que Google Maps esté cargado
    if (typeof google === 'undefined' || !google.maps) {
        console.warn('⏳ Google Maps aún no está cargado, esperando...');

        // Reintentar en 500ms
        setTimeout(() => {
            inicializarMapa(ciudad);
        }, 500);
        return;
    }

    if (!map) {
        // Crear mapa por primera vez
        map = new google.maps.Map(document.getElementById('mapa-preview'), {
            center: config.centro,
            zoom: config.zoom,
            mapTypeId: 'satellite', // Vista satelital
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: google.maps.ControlPosition.TOP_RIGHT
            },
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true,
            styles: [] // Puedes agregar estilos custom aquí
        });

        // Crear marker draggable
        marker = new google.maps.Marker({
            map: map,
            draggable: true,
            visible: false,
            animation: google.maps.Animation.DROP,
            title: 'Arrastrá para ajustar ubicación exacta',
            icon: {
                url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            }
        });

        // Listener: cuando arrastran el marker
        marker.addListener('dragend', function() {
            const newPos = marker.getPosition();
            currentCoords = { lat: newPos.lat(), lng: newPos.lng() };
            console.log('📍 Marker arrastrado a:', currentCoords);

            // Redibujar polígono en nueva ubicación
            redibujarPoligono();
        });

        console.log('✅ Google Maps inicializado');

    } else {
        // Solo re-centrar si ya existe
        map.setCenter(config.centro);
        map.setZoom(config.zoom);
    }
}

// ============================================================================
// GEOCODIFICAR Y ACTUALIZAR MAPA
// ============================================================================

async function geocodificarYActualizarMapa(direccion) {
    try {
        console.log(`🔍 Geocodificando: ${direccion}`);

        const config = CIUDAD_CONFIG[currentCiudad];

        // 1. Geocodificar con API Georef
        const direccionCompleta = `${direccion}, ${config.nombreCompleto}`;
        const coords = await geocodificarGeoref(direccionCompleta);

        if (!coords) {
            console.warn('⚠️ No se pudo geocodificar la dirección');
            mostrarError('No encontramos esa dirección. Verificá que esté bien escrita.');
            return;
        }

        currentCoords = coords;
        console.log('✅ Geocodificado:', coords);

        // 2. Centrar mapa y mostrar marker
        map.setCenter(coords);
        map.setZoom(17); // Zoom más cercano cuando encuentra ubicación
        marker.setPosition(coords);
        marker.setVisible(true);

        // 3. Obtener y dibujar el lote según el nivel
        await dibujarLoteSegunNivel();

        // 4. Mostrar info
        mostrarInfoParcela(coords);

    } catch (error) {
        console.error('❌ Error al actualizar mapa:', error);
        mostrarError('Error al buscar la ubicación. Por favor intentá nuevamente.');
    }
}

// ============================================================================
// DIBUJAR LOTE SEGÚN NIVEL (2 o 3)
// ============================================================================

async function dibujarLoteSegunNivel() {
    const config = CIUDAD_CONFIG[currentCiudad];

    if (config.nivel === 2) {
        // NIVEL 2: Rectángulo orientado a la calle (Santiago)
        await dibujarRectanguloOrientado();
    } else if (config.nivel === 3) {
        // NIVEL 3: Polígono catastral real (Córdoba)
        await obtenerPoligonoReal();
    }
}

// Wrapper para redibujar (cuando cambian dimensiones o arrastran marker)
async function redibujarPoligono() {
    if (!currentCoords || !currentCiudad) return;
    await dibujarLoteSegunNivel();
    mostrarInfoParcela(currentCoords);
}

// ============================================================================
// NIVEL 2: RECTÁNGULO ORIENTADO A LA CALLE (Santiago)
// ============================================================================

async function dibujarRectanguloOrientado() {
    try {
        console.log('📐 Dibujando rectángulo orientado (NIVEL 2)...');

        // Limpiar polígono anterior
        if (polygon) {
            polygon.setMap(null);
            polygon = null;
        }

        // Obtener dimensiones del formulario
        const frente = parseFloat(document.getElementById('frente').value) || 10;
        const profundidad = parseFloat(document.getElementById('profundidad').value) || 40;

        // 1. Obtener bearing (ángulo) de la calle
        const streetBearing = await obtenerAnguloCalleGoogle(currentCoords);
        console.log(`📐 Ángulo de la calle: ${streetBearing}°`);

        // 2. Calcular vértices del rectángulo perpendicular a la calle
        const vertices = calcularRectangulo(currentCoords, frente, profundidad, streetBearing + 90);

        // 3. Dibujar polígono
        const config = CIUDAD_CONFIG[currentCiudad];
        polygon = new google.maps.Polygon({
            paths: vertices,
            strokeColor: config.colorPrimario,
            strokeOpacity: 0.9,
            strokeWeight: 3,
            fillColor: config.colorPrimario,
            fillOpacity: 0.25,
            editable: false,
            draggable: false,
            map: map
        });

        // Ajustar bounds del mapa para mostrar todo el polígono
        const bounds = new google.maps.LatLngBounds();
        vertices.forEach(v => bounds.extend(v));
        map.fitBounds(bounds);

        console.log('✅ Rectángulo orientado dibujado');

    } catch (error) {
        console.error('❌ Error dibujando rectángulo:', error);
    }
}

// ============================================================================
// NIVEL 3: POLÍGONO CATASTRAL REAL (Córdoba)
// ============================================================================

async function obtenerPoligonoReal() {
    try {
        console.log('🗺️ Obteniendo polígono catastral real (NIVEL 3)...');

        // Limpiar polígono anterior
        if (polygon) {
            polygon.setMap(null);
            polygon = null;
        }

        const config = CIUDAD_CONFIG[currentCiudad];

        // 1. Consultar WFS de IDECOR para obtener geometría de la parcela
        const wfsUrl = `${config.catastroWFS}?` + new URLSearchParams({
            service: 'WFS',
            version: '2.0.0',
            request: 'GetFeature',
            typeName: 'idecor:parcelas', // Capa de parcelas
            outputFormat: 'application/json',
            srsName: 'EPSG:4326',
            // Buscar parcela que contiene este punto
            CQL_FILTER: `CONTAINS(geom, POINT(${currentCoords.lng} ${currentCoords.lat}))`,
            maxFeatures: 1
        }).toString();

        console.log('🔗 Consultando IDECOR WFS:', wfsUrl);

        const response = await fetch(wfsUrl);
        const geojson = await response.json();

        if (geojson.features && geojson.features.length > 0) {
            const parcela = geojson.features[0];
            console.log('✅ Parcela encontrada:', parcela.properties);

            // 2. Convertir GeoJSON a formato Google Maps
            const coordinates = parcela.geometry.coordinates[0];
            const vertices = coordinates.map(coord => ({
                lat: coord[1],
                lng: coord[0]
            }));

            // 3. Dibujar polígono REAL
            polygon = new google.maps.Polygon({
                paths: vertices,
                strokeColor: config.colorPrimario, // Verde
                strokeOpacity: 0.9,
                strokeWeight: 3,
                fillColor: config.colorPrimario,
                fillOpacity: 0.25,
                editable: false,
                draggable: false,
                map: map
            });

            // Ajustar bounds
            const bounds = new google.maps.LatLngBounds();
            vertices.forEach(v => bounds.extend(v));
            map.fitBounds(bounds);

            // 4. Mostrar info catastral oficial
            mostrarInfoCatastral(parcela.properties);

            console.log('✅ Polígono catastral real dibujado');

        } else {
            console.warn('⚠️ No se encontró parcela catastral en IDECOR');
            // Fallback: dibujar rectángulo orientado
            console.log('↩️ Fallback a rectángulo orientado');
            await dibujarRectanguloOrientado();
            mostrarInfoParcela(currentCoords, 'No se encontró parcela catastral. Mostrando estimación.');
        }

    } catch (error) {
        console.error('❌ Error obteniendo polígono real:', error);
        // Fallback: dibujar rectángulo orientado
        console.log('↩️ Fallback a rectángulo orientado por error');
        await dibujarRectanguloOrientado();
    }
}

// ============================================================================
// HELPERS: API GEOREF
// ============================================================================

async function geocodificarGeoref(direccion) {
    try {
        const url = `https://apis.datos.gob.ar/georef/api/direcciones?direccion=${encodeURIComponent(direccion)}&max=1`;
        console.log('🔗 Georef API:', url);

        const response = await fetch(url);
        const data = await response.json();

        if (data.direcciones && data.direcciones.length > 0) {
            const ubicacion = data.direcciones[0].ubicacion;
            return { lat: ubicacion.lat, lng: ubicacion.lon };
        }

        return null;
    } catch (error) {
        console.error('❌ Error geocodificando con Georef:', error);
        return null;
    }
}

// ============================================================================
// HELPERS: GOOGLE ROADS API (para obtener ángulo de calle)
// ============================================================================

async function obtenerAnguloCalleGoogle(coords) {
    try {
        // Snap to Roads API de Google
        // Nota: Necesita API key con Roads API habilitada
        const url = `https://roads.googleapis.com/v1/nearestRoads?` + new URLSearchParams({
            points: `${coords.lat},${coords.lng}`,
            key: 'AIzaSyDNxmV9m0cein7H4pOj6Kakboj5c30v-ho' // TODO: Reemplazar con la key real
        }).toString();

        const response = await fetch(url);
        const data = await response.json();

        if (data.snappedPoints && data.snappedPoints.length > 0) {
            // Calcular bearing entre el punto original y el punto "snapped"
            const snapped = data.snappedPoints[0].location;
            return calcularBearing(coords, { lat: snapped.latitude, lng: snapped.longitude });
        }

        // Default: asumir calle horizontal (0°)
        console.warn('⚠️ No se pudo obtener ángulo de calle, usando 0°');
        return 0;

    } catch (error) {
        console.error('❌ Error obteniendo ángulo de calle:', error);
        return 0; // Default
    }
}

// ============================================================================
// HELPERS: GEOMETRÍA
// ============================================================================

// Calcular vértices del rectángulo con rotación
function calcularRectangulo(centro, ancho, largo, rotacion) {
    // Convertir a radianes
    const rad = rotacion * Math.PI / 180;

    // Calcular offset en grados (aproximación)
    // 1° de latitud ≈ 111.32 km
    // 1° de longitud varía con latitud: 111.32 * cos(lat) km
    const latOffset = (ancho / 2) / 111320; // metros a grados
    const lngOffset = (largo / 2) / (111320 * Math.cos(centro.lat * Math.PI / 180));

    // Vértices sin rotar (rectángulo alineado N-S-E-W)
    const vertices = [
        { lat: centro.lat + latOffset, lng: centro.lng - lngOffset }, // NW
        { lat: centro.lat + latOffset, lng: centro.lng + lngOffset }, // NE
        { lat: centro.lat - latOffset, lng: centro.lng + lngOffset }, // SE
        { lat: centro.lat - latOffset, lng: centro.lng - lngOffset }  // SW
    ];

    // Aplicar rotación alrededor del centro
    return vertices.map(v => rotarPunto(v, centro, rad));
}

// Rotar un punto alrededor de un centro
function rotarPunto(punto, centro, angulo) {
    const cos = Math.cos(angulo);
    const sin = Math.sin(angulo);

    const dx = punto.lng - centro.lng;
    const dy = punto.lat - centro.lat;

    return {
        lat: centro.lat + (dy * cos - dx * sin),
        lng: centro.lng + (dx * cos + dy * sin)
    };
}

// Calcular bearing (ángulo) entre dos puntos
function calcularBearing(punto1, punto2) {
    const lat1 = punto1.lat * Math.PI / 180;
    const lat2 = punto2.lat * Math.PI / 180;
    const dLng = (punto2.lng - punto1.lng) * Math.PI / 180;

    const y = Math.sin(dLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

    const bearing = Math.atan2(y, x) * 180 / Math.PI;
    return (bearing + 360) % 360; // Normalizar a 0-360°
}

// ============================================================================
// UI: MOSTRAR INFO DE LA PARCELA
// ============================================================================

function mostrarInfoParcela(coords, nota = null) {
    const config = CIUDAD_CONFIG[currentCiudad];
    const infoBox = document.getElementById('info-parcela');
    const infoList = document.getElementById('info-parcela-list');

    // Cambiar color del borde según nivel
    infoBox.style.borderLeftColor = config.colorPrimario;
    infoBox.classList.remove('alert-success', 'alert-info', 'alert-warning');
    infoBox.classList.add(config.nivel === 3 ? 'alert-success' : 'alert-info');

    let html = `
        <li><strong>Ciudad:</strong> ${config.nombre}</li>
        <li><strong>Coordenadas:</strong> ${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}</li>
        <li><strong>Precisión:</strong> ${config.nivel === 3 ? '✅ Polígono oficial del catastro' : '📐 Estimación orientada a la calle'}</li>
    `;

    if (nota) {
        html += `<li style="color: #856404;"><strong>⚠️ ${nota}</strong></li>`;
    }

    infoList.innerHTML = html;
    infoBox.style.display = 'block';
}

function mostrarInfoCatastral(properties) {
    const config = CIUDAD_CONFIG[currentCiudad];
    const infoBox = document.getElementById('info-parcela');
    const infoList = document.getElementById('info-parcela-list');

    infoBox.style.borderLeftColor = config.colorPrimario;
    infoBox.classList.remove('alert-info', 'alert-warning');
    infoBox.classList.add('alert-success');

    const html = `
        <li><strong>Ciudad:</strong> ${config.nombre}</li>
        <li><strong>Padrón:</strong> ${properties.padron || properties.nomencla || 'N/A'}</li>
        <li><strong>Superficie catastral:</strong> ${properties.superficie || properties.sup_m2 || 'N/A'} m²</li>
        <li><strong>Estado:</strong> ${properties.estado || properties.ocupacion || 'N/A'}</li>
        <li style="color: #28a745;"><strong>✅ Polígono oficial de IDECOR - Catastro Provincial</strong></li>
    `;

    infoList.innerHTML = html;
    infoBox.style.display = 'block';
}

// ============================================================================
// UI: MENSAJES DE ERROR
// ============================================================================

function mostrarError(mensaje) {
    const infoBox = document.getElementById('info-parcela');
    const infoList = document.getElementById('info-parcela-list');

    infoBox.style.borderLeftColor = '#dc3545';
    infoBox.classList.remove('alert-info', 'alert-success');
    infoBox.classList.add('alert-warning');

    infoList.innerHTML = `<li style="color: #721c24;"><strong>❌ ${mensaje}</strong></li>`;
    infoBox.style.display = 'block';
}

// ============================================================================
// EXPORTAR FUNCIONES PARA USO EXTERNO
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        geocodificarGeoref,
        calcularRectangulo,
        calcularBearing
    };
}

console.log('✅ mapa-adaptativo.js cargado');
