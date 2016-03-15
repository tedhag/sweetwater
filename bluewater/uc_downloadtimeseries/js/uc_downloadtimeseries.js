define([
  'leaflet',
  //'proj_epsg3006',
  //'layer_lmvtopographic',
  //'layer_lmvtopogray',
  'uc_togglelayersmenu/uc_togglelayersmenu',
  'uc_togglesavemenu/uc_togglesavemenu',
  'layer_basins',
  'uc_saveasexcel/uc_saveasexcel',
  'esri'
], function (L, 
             //EPSG3006, 
             //LayerLMVTopographic,
             //LayerLMVTopogray,
             UC_ToggleLayersMenu,
             UC_ToggleSaveMenu,  
             BasinsLayer,
             UC_SaveAsExcel
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
                UC_SaveAsExcel.init(data);
              });
              
            });
            
            
          }
          
        });
        
      }
      
    });
    
    UC_ToggleLayersMenu.init(map, BasinsLayer);
    UC_ToggleSaveMenu.init(map);
    
    var basinDfd = $.Deferred();
    $(window).on("basinsloaded", function(e) {
       basinDfd.resolve();
    });
    $.when(basinDfd)
    .done(function(){ 
       setTimeout(function(){
          $(".layer-unfold").css({visibility: "hidden", opacity: 0 });
          $(".layer-content").css({visibility: "hidden", opacity: 0 });
          $(".layer-container").css({backgroundColor: "rgba(0, 0, 0, 0)", width: "3em"});
         
          $(".save-unfold").css({visibility: "hidden", opacity: 0 });
          $(".save-content").css({visibility: "hidden", opacity: 0 });
          $(".save-container").css({backgroundColor: "rgba(0, 0, 0, 0)", width: "3em"});
        }, 500);
    });
    
  };
  
  return {
      init: init
  };
  
});