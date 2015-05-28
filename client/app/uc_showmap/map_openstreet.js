define([
  'leaflet'
], function (L) {

  var create = function(){
    var map = L.map('map');
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    return map;
  };
  
  return {
    create: create
  };
  
});