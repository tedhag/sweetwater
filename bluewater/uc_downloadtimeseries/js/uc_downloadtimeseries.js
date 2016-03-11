define([
  'leaflet',
  'proj_epsg3006',
  'layer_lmvtopographic',
  'layer_lmvtopogray',
  'layer_grid_basins',
  'esri'
], function (L, 
             EPSG3006, 
             LayerLMVTopographic,
             LayerLMVTopogray,
             BasinsLayer
             ) {
  
  /* Init Use Case */
  var init = function () {
    
    var epsg3006 = EPSG3006.create();
    //var layer = LayerLMVTopographic.create();
    var layer = LayerLMVTopogray.create();

    /* Init the map */
    var map = L.map('map',
      { layers : [ layer ],
		crs : epsg3006,
        minZoom : 1,
        maxZoom : 8,
        attributionControl: false,
        zoomControl: false,
        continuousWorld : true});
    
    layer.addTo(map);
    
    var startPos = new L.LatLng(61.93971314997426, 16.54225424576134);
	map.setView(startPos, 2);
  
    map.addControl(new L.control.zoom({ position: 'bottomleft'}));
  
    map.on('click', function(e){
      console.log("click on map");
    });
    
    BasinsLayer.create();
    $(window).on("basinsloaded", function(e){
      console.log("basinsloaded");
      
      var layer = BasinsLayer.get();
      layer.addTo(map);
    });
    
    
    
  };
  
  return {
      init: init
  };
  
});