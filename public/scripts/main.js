

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
        weight: 2.5,
        opacity: 1,
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
        fillOpacity: 0.5
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
}


function mouseclick(e) {
    var layer = e.target;
    var name = layer.feature.properties.name;
    var paragraph = summary(name);
    var display = layer.feature.properties.display;
    layer.bindPopup('<div class="popup">' + '<h1>'+display+'</h1>'+ '<p1>' + paragraph + '</p1>' + '<img src="/test.png" alt="Graph about watersheds" class="graph">'+'</img>'+ '</div>',  {maxHeight: 500});
}


function summary(name){
    return name === "Pueblo" ?'The Pueblo San Diego watershed lies within the San Diego Bay WMA and is the smallest of the three San Diego Bay WMA watersheds, covering just over 36,000 acres. It is comprised of three hydrologic areas: Point Loma, San Diego Mesa, and National City . Major water bodies include Chollas Creek, Paleta Creek, and San Diego Bay.' :
           name === "Tijuana" ? 'The Tijuana River Watershed covers 1,750 square miles – three-fourths lies in Mexico and includes the cities of Tijuana and Tecate. We can all do our part to protect our watershed by not allowing harmful pollutants like motor oil, fertilizer, and plastic trash to enter storm drains and flow into the estuary and then the sea.':
           name === "Otay" ? 'The Otay watershed comprises approximately 98,500 acres. It consists of three hydrologic areas: Coronado, Otay, and Dulzura. Major water bodies include the Upper and Lower Otay Reservoirs, Otay River, and San Diego Bay . Nearly 70 percent of the watershed is unincorporated with the remaining portions divided between the Port of San Diego, Chula Vista, Coronado, Imperial Beach, National City, and San Diego.':
           name === "SweetWater" ?'The Sweetwater watershed is the largest of the three watersheds that border San Diego Bay, encompassing over 148,000 acres. The watershed includes three hydrologic areas: Lower Sweetwater, Middle Sweetwater, and Upper Sweetwater . Major water bodies within the Sweetwater watershed include the Sweetwater River , Sweetwater Reservoir, Loveland Reservoir, and San Diego Bay .' :
           name === "LosPenasquitos" ? 'The Los Peñasquitos Watershed Management Area (WMA) encompasses a land area of 94 square miles, making it the second smallest WMA in San Diego County. It lies in the central portion of San Diego County and neighbors the San Dieguito River Watershed to the north and the Mission Bay/La Jolla and San Diego River WMAs to the south.':
           name === "SanDiego" ?'The San Diego River Watershed encompasses a land area of 434 square miles, making it the second largest watershed management area (WMA) located in San Diego County. It lies in the central portion of the County and neighbors Los Penasquitos and San Dieguito River Watersheds to the north and San Diego Bay WMA to the south.' :
           name === "SanDieguito" ? 'The San Dieguito River Watershed Management Area (WMA) is a drainage area that encompasses approximately 345 square miles, including portions of the Cities of Del Mar, Escondido, Poway, San Diego, and Solana Beach, and unincorporated areas of San Diego County. ':
           name === "Carlsbad" ? 'The Carlsbad Watershed Management Area (WMA) is comprised of six (6) distinct hydrologic areas covering a land area of 211 square miles. The WMA extends from the headwaters above Lake Wohlford in the east to the Pacific Ocean in the west, and borders San Luis Rey and San Dieguito Watersheds to the north and south, respectively.':
           'error';
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: mouseclick
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



