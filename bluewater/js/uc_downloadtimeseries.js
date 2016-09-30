define([
  'leaflet',
  'lmv/proj_epsg3006',
  'lmv/layer_lmvtopographic'
], function (L, EPSG3006, LayerLMVTopographic) {
  
  /* Init Use Case */
  var init = function () {
    
    var epsg3006 = EPSG3006.create();
    //var layer = LayerLMVTopographic.create();
    
    var wms = L.tileLayer.wms("http://maps.sgu.se/lmv/topowebb/v1", {
      version: '1.1.1',
      layers: 'topowebbkartan_nedtonad',
      format: 'image/png',
      crs : epsg3006
    });
    
    var map = L.map('map',
      { layers : [ wms ],
		//crs : epsg3006,
        minZoom : 2,
        maxZoom : 8,
        attributionControl: false,
        zoomControl: false,
        continuousWorld : false});
    
    
    var startPos = new L.LatLng(62.7, 16.5); //Almost center Sweden.
    map.setView(startPos, 5);
    
    map.addLayer(wms);
    
        
  };
  
  return {
      init: init
  };
  
});