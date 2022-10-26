const map = L.map('map', {
    maxBounds: L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180)),
    maxBoundsViscosity: 1.0,
    zoomControl: false,
    attributionControl: false
}).setView([51.505, -0.09], 2);

var time_p = document.getElementById("time"); 
time_p.innerHTML = new Date();

var distance = document.getElementById("distance-travelled");

var path_icon = L.divIcon({
    html: `<?xml version="1.0" encoding="UTF-8"?>
    <svg class="icon icon-tabler icon-tabler-x" width="12" height="12" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0h24v24H0z" fill="none" stroke="none"/>
    <line x1="18" x2="6" y1="6" y2="18"/>
    <line x1="6" x2="18" y1="6" y2="18"/>
    </svg>
    `,
    className: '',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
});

var countries = await fetch("https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson")
countries = await countries.json()

var countriyLayer = L.geoJSON(countries, { 
    style: function(feature) {
        return {color: "green"};
    }
}).addTo(map);

var iss = await fetch("https://api.wheretheiss.at/v1/satellites/25544")
iss = await iss.json()
L.marker([iss.latitude, iss.longitude], {icon: path_icon}).addTo(map);

var starter_lat = iss.latitude
var starter_lon = iss.longitude

var marker = L.marker()
//refresh every 5 seconds
setInterval(async function() {
    var prev_lat = iss.latitude
    var prev_lon = iss.longitude
    
    iss = await fetch("https://api.wheretheiss.at/v1/satellites/25544")
    iss = await iss.json()

    map.removeLayer(marker)
    
    marker = L.marker([iss.latitude, iss.longitude], {icon: path_icon}).addTo(map);
    
    distance.innerHTML = Math.floor(calcCrow(starter_lat, starter_lon, iss.latitude, iss.longitude)) + " km (calcolo in linea d'aria della distanza percorsa da quando è partita la webapp)" ;

    L.polyline([[iss.latitude, iss.longitude], [prev_lat, prev_lon]], {color: 'black'}).addTo(map);

    
}, 5000);



//calcolate the distance between two coordinates

function toRad(Value) 
    {
        return Value * Math.PI / 180;
    }

function calcCrow(lat1, lon1, lat2, lon2) 
    {
      var R = 6371; // km
      var dLat = toRad(lat2-lat1);
      var dLon = toRad(lon2-lon1);
      var lat1 = toRad(lat1);
      var lat2 = toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      return d;
    }