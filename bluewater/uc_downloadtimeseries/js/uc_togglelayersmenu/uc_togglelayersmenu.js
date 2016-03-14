define([
  'jquery',
  'leaflet',
  'mustache',
  'text!uc_togglelayersmenu/layersmenu_template.html',
  'uc_togglebasinlayer/uc_togglebasinlayer'
], function ($, L, Mustache, LayersMenuTemplate, UC_ToggleBasinLayer) {

  var LayerBox = L.Control.extend({
    options: {
        position: 'topright'
    },

    onAdd: function (map) {
      // create the control container with a particular class name
      var container = L.DomUtil.create('div', 'layer-container');
      // Prevent further event propagation, ie. no click events behind the control-box
      L.DomEvent.disableClickPropagation(container);
      
      var control_box = Mustache.render(LayersMenuTemplate);
      container.innerHTML = control_box;
      
      return container;
    }
  });
  
  var init = function(map, basinlayer){
    map.addControl( new LayerBox() );
    
    UC_ToggleBasinLayer.init(".layer-content", map, basinlayer);
    
    $(".show-layers").on('click', function(){
      console.log("show layers");
      $(".layer-unfold").css({visibility: "visible",
                              opacity: 1,
                              width: "7em"});
      $(".layer-header").css({backgroundColor: "rgba(175, 150, 50, 0.7)"});
      
    });
    
    $("#hide-layers").on('click', function(){
      console.log("hide layers");
      $(".layer-unfold").css({visibility: "hidden",
                              opacity: 0,
                              width: "0em"});
      $(".layer-header").css({backgroundColor: "rgba(0, 0, 0, 0)"});
    });
  };
  
  return {
    init: init
  };
});