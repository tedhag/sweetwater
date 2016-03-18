define([
  'leaflet',
  'layer_basins',
  'esri'
], function (L, BasinsLayer) {
  
  /* Init Use Case */
  var init = function () {
    
    var map = L.map('map',{
      zoomControl: false,  
      minZoom: 3,
      maxZoom: 16 
    });
    
    //L.esri.basemapLayer('Gray', {detectRetina: true }).addTo(map);
    //L.esri.basemapLayer('GrayLabels').addTo(map);
    
    var startPos = new L.LatLng(63.0, 19.0);
	map.setView(startPos, 5);
  
    BasinsLayer.create();
    
    map.on('click', function(e){
      
      console.log("click on map");
      
      
    });
    
    var basinDfd = $.Deferred();
    $(window).on("basinsloaded", function(e) {
       basinDfd.resolve();
    });
    $.when(basinDfd)
    .done(function(){ 
      BasinsLayer.get().addTo(map);
      setTimeout(function(){
          
      }, 500);
    });
    
  };
  
  return {
      init: init
  };
  
});