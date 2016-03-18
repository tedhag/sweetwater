define([
  'jquery',
  'mustache',
  'leaflet',
  'text!on_start/control_box_template.html'
], function ( $,
              Mustache,
              L,
              ControlBoxTemplate) {
  
  var ControlBox = L.Control.extend({
    options: {
        position: 'topright'
    },

    onAdd: function (map) {
      // create the control container with a particular class name
      var container = L.DomUtil.create('div', 'my-control');
      // Prevent further event propagation, ie. no click events behind the control-box
      L.DomEvent.disableClickPropagation(container);
      
      var control_box = Mustache.render(ControlBoxTemplate);
      container.innerHTML = control_box;
      
      return container;
    }
  });
  
  var init = function (map){
    map.addControl( new ControlBox() );
  };
  
  return {
        init: init
    };
  
});