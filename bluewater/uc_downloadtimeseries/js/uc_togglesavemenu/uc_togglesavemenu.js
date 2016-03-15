define([
  'jquery',
  'leaflet',
  'mustache',
  'text!uc_togglesavemenu/savemenu_template.html'
], function ($, L, Mustache, SaveMenuTemplate) {

  var SaveBox = L.Control.extend({
    options: {
        position: 'topright'
    },

    onAdd: function (map) {
      // create the control container with a particular class name
      var container = L.DomUtil.create('div', 'save-container');
      // Prevent further event propagation, ie. no click events behind the control-box
      L.DomEvent.disableClickPropagation(container);
      
      var control_box = Mustache.render(SaveMenuTemplate);
      container.innerHTML = control_box;
      
      return container;
    }
    
  });
  
  var init = function(map){
    map.addControl( new SaveBox() );
    
    $(".show-save").on('click', function(){
      console.log("show save menu");
      $(".save-unfold").css({visibility: "visible", opacity: 1 });
      //$(".save-content").css({visibility: "visible",opacity: 1 });
      $(".save-content").css({display: "flex" });
      $(".save-container").css({backgroundColor: "rgba(175, 150, 50, 0.7)", width: "14em"});
      
    });
    
    $("#hide-save").on('click', function(){
      console.log("hide save menu");
      $(".save-unfold").css({visibility: "hidden", opacity: 0 });
      //$(".save-content").css({visibility: "hidden", opacity: 0 });
      $(".save-content").css({display: "none" });
      $(".save-container").css({backgroundColor: "rgba(0, 0, 0, 0)", width: "3em"});
    });
    
  };
  
  return {
    init: init
  };
});