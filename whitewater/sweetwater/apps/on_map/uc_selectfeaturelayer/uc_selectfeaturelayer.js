define([
  'leaflet',
  'cssutil',
  'mustache',
  'text!uc_selectfeaturelayer/selectfeaturelayer_template.html',
  'uc_selectfeaturelayer/layer_basins'
], function (L, CssUtil, Mustache, FeatureLayerTemplate, BasinsLayer) {
    
    /* Init Use Case */
    var init = function (element, map) {
       /* Load CSS for this UC */
      CssUtil.load('uc_selectfeaturelayer/selectfeaturelayer.css');

      /* Add select field to leaflet control */
      var template = Mustache.render(FeatureLayerTemplate);
      $(element).append(template);
      
      BasinsLayer.create(map, function(map, layer){
        window.addEventListener("basinsloaded", function(e){
          var subid = document.getElementById('subid');
          subid.disabled=false;
          subid.addEventListener('change', function(){
            console.log('checkbox basins is marked '+subid.checked);
            if (subid.checked){
              map.addLayer(layer);
            }
            else{
              map.removeLayer(layer);
            }
          });
        });
      });
      
    };
  
    return {
        init: init
    };
  
});