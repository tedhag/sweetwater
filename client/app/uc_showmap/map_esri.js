define([
  'leaflet',
  'uc_showmap/layers/layer_esri'
], function (L, EsriLayer) {

  var create = function(){
    var map = L.map('map');
    var layer = EsriLayer.create();
    layer.addTo(map);
    
    return map;
  };
  
  return {
    create: create
  };
  
});