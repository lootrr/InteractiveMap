

var mapboxAccessToken = 'pk.eyJ1IjoiaGFycmlzb25raW0wMSIsImEiOiJja2x4YzNoeHEycjMxMnVsd2oxbXp6cmpwIn0.ircUJsgLMkN1uYqzfFGxgA';

// events

var beach1= L.marker([32.979960, -117.272243]).bindPopup('Beach Cleanup 1');
var beach2 = L.marker([32.848810, -117.276530]).bindPopup('Beach Cleanup 2');
var beach3 = L.marker([32.588463, -117.105293]).bindPopup('Beach Cleanup 3');
var beach4 = L.marker([32.725751, -117.257370]).bindPopup('Beach Cleanup 4');


var events = L.layerGroup([beach1,beach2,beach3,beach4]);
// set up topographic/regular layers
var grayscale = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1});
var streets   = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {id: 'mapbox/outdoors-v11', tileSize: 512, zoomOffset: -1});

var map = L.map('map', {
    center: [32.757, -117.1611],
    zoom: 11,
    layers: [grayscale, events]
});

var baseMaps = {
    "Grayscale": grayscale,
    "Streets": streets
};

var overlayMaps = {
    "Events": events
};

L.control.layers(baseMaps,overlayMaps).addTo(map);


// configure watersheds
var geojson;

function setColorName(name){
    return name === "Pueblo" ?'#8be9fd' :
           name === "Tijuana" ? '#ff79c6':
           name === "Otay" ? '#bd93f9':
           name === "SweetWater" ?'#50fa7b' :
           name === "LosPenasquitos" ? '#f1fa8c':
           name === "SanDiego" ?'#ffb86c' :
           name === "SanDieguito" ? '#ff5555':
           name === "Carlsbad" ? '#44475a':
           '#f8f8f2';
}

function style() {
    return {
        weight: 3,
        opacity: .9,
        color: 'black',
        fillOpacity: 0
    };
}
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: setColorName(layer.feature.properties.name),
        dashArray: '',
        fillOpacity: 0.6
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
}


function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

geojson = L.geoJson(sd, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

// Geocoding search results
var searchControl = L.esri.Geocoding.geosearch().addTo(map);

var results = L.layerGroup().addTo(map);

searchControl.on('results', function (data) {
  results.clearLayers();
  for (var i = data.results.length - 1; i >= 0; i--) {
    results.addLayer(L.marker(data.results[i].latlng));
  }
});



