define([
  'leaflet',
  'cssutil',
  'mustache',
  'text!uc_selectfeaturelayer/selectfeaturelayer_template.html',
  'uc_selectfeaturelayer/layer_basins'
], function (L, CssUtil, Mustache, FeatureLayerTemplate, BasinsLayer) {
    
    
    var toggle_basins = function (map, checked) {
      console.log('checkbox basins is marked '+checked);
      var layer = BasinsLayer.create('data/shape/subid.zip');
    };
  
    /* Init Use Case */
    var init = function (element, map) {
       /* Load CSS for this UC */
      CssUtil.load('app/uc_selectfeaturelayer/selectfeaturelayer.css');

      /* Add select field to leaflet control */
      var template = Mustache.render(FeatureLayerTemplate);
      $(element).append(template);
      
      var subid = document.getElementById('subid');
      subid.addEventListener('change', function(){
        toggle_basins(map, subid.checked);
      });

    };
  
    return {
        init: init
    };
  
});