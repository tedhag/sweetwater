define([
  'leaflet',
  //'proj_epsg3006',
  //'layer_lmvtopographic',
  //'layer_lmvtopogray',
  'uc_togglelayersmenu/uc_togglelayersmenu',
  'layer_basins',
  'esri'
], function (L, 
             //EPSG3006, 
             //LayerLMVTopographic,
             //LayerLMVTopogray,
             UC_ToggleLayersMenu,  
             BasinsLayer
             ) {
  
  /* Init Use Case */
  var init = function () {
    
    /*
    var epsg3006 = EPSG3006.create();
    //var layer = LayerLMVTopographic.create();
    var layer = LayerLMVTopogray.create();

    var map = L.map('map',
      { layers : [ layer ],
		crs : epsg3006,
        minZoom : 1,
        maxZoom : 8,
        attributionControl: false,
        zoomControl: false,
        continuousWorld : true});
    
    layer.addTo(map);
    */
    var map = L.map('map',{
      zoomControl: false,  
      minZoom: 3,
      maxZoom: 16 
    });
    
    L.esri.basemapLayer('Gray', {detectRetina: true }).addTo(map);
    L.esri.basemapLayer('GrayLabels').addTo(map);
    
    var startPos = new L.LatLng(61.93971314997426, 16.54225424576134);
	map.setView(startPos, 4);
    map.addControl(new L.control.zoom({ position: 'bottomleft'}));
  
    BasinsLayer.create();
    
    map.on('click', function(e){
      console.log("click on map");
    });
    
    UC_ToggleLayersMenu.init(map, BasinsLayer);
    
    /*
    $(window).on("basinsloaded", function(e){
      console.log("basinsloaded");
      
      var layer = BasinsLayer.get();
      layer.addTo(map);
    });
    */
  };
  
  return {
      init: init
  };
  
});