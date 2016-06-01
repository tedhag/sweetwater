define([
  'leaflet',
  'lmv/proj_epsg3006',
  'lmv/layer_lmvtopographic'
], function (L, EPSG3006, LayerLMVTopographic) {
  
  /* Init Use Case */
  var init = function () {
    
    var epsg3006 = EPSG3006.create();
    var layer = LayerLMVTopographic.create();
    
    var map = L.map('map',
      { layers : [ layer ],
		crs : epsg3006,
        minZoom : 1,
        maxZoom : 8,
        attributionControl: false,
        zoomControl: false,
        continuousWorld : true});
    
    layer.addTo(map);
    
    
  };
  
  return {
      init: init
  };
  
});