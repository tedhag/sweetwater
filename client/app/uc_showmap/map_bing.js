define([
  'leaflet',
  'uc_showmap/layers/layer_bing'
], function (L, BingLayer) {

  var create = function(){
    var map = L.map('map');
    var layer = BingLayer.create();
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