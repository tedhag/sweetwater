define([
  'leaflet',
  //'proj_epsg3006',
  //'layer_lmvtopographic',
  //'layer_lmvtopogray',
  'uc_togglelayersmenu/uc_togglelayersmenu',
  'uc_togglesavemenu/uc_togglesavemenu',
  'layer_basins',
  'esri'
], function (L, 
             //EPSG3006, 
             //LayerLMVTopographic,
             //LayerLMVTopogray,
             UC_ToggleLayersMenu,
             UC_ToggleSaveMenu,  
             BasinsLayer
             ) {
  
  var update_save = function(data, fn){
    
    fn(data);
    
    
  }
  
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
    
    var startPos = new L.LatLng(63.0, 19.0);
	map.setView(startPos, 4);
    map.addControl(new L.control.zoom({ position: 'bottomleft'}));
  
    BasinsLayer.create();
    
    map.on('click', function(e){
      
      console.log("click on map");
      
      if (BasinsLayer.ready()){
        BasinsLayer.match(e, function(data){
          
          if (data.basin != null){
            console.log("subid "+data.id);
            update_save(data, function(data){
              
              BasinsLayer.clear(function(){
                BasinsLayer.highlight_basin(data.basin);
                //UC save as excel
              });
              
            });
            
            
          }
          
        });
        
      }
      
    });
    
    UC_ToggleLayersMenu.init(map, BasinsLayer);
    UC_ToggleSaveMenu.init(map);
    
  };
  
  return {
      init: init
  };
  
});