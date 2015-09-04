define([
  'leaflet',
  'uc_showmap/layers/layer_openstreet'
], function (L, OpenStreetLayer) {

  var create = function(){
    var map = L.map('map');
    var layer = OpenStreetLayer.create();
    /*
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    */
    
    layer.addTo(map);
    
    return map;
  };
  
  return {
    create: create
  };
  
});