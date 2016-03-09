define([
  'leaflet',
  'proj_epsg3006',
  'layer_lmvtopographic',
  'esri'
], function (L, 
             EPSG3006, 
             LayerLMVTopographic
             ) {
  
  /* Init Use Case */
  var init = function () {
    
    var epsg3006 = EPSG3006.create();
    var layer = LayerLMVTopographic.create();

    /* Init the map */
    var map = L.map('map',
      { layers : [layer],
		crs : epsg3006,
        continuousWorld : false,
        closePopupOnClick: false,
        minZoom : 1,
        maxZoom : 7,
        attributionControl: false,
        zoomControl: false });
    
    layer.addTo(map);
    
    var startPos = [60.0, 20.0];
    map.setView(startPos, 5);
    //map.addControl(new L.control.zoom({ position: 'bottomleft'}));
    //map.addControl(new L.control.scale({ imperial: false, position: 'bottomright'}));

    
    map.on('click', function(e){
      console.log("click on map");
    });

    
  };
  
  return {
      init: init
  };
  
});