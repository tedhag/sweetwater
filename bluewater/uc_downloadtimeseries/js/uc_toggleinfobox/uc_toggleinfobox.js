define([
  'jquery',
  'leaflet',
  'mustache',
  'text!uc_toggleinfobox/infobox_template.html',
  'text!uc_toggleinfobox/infocontent_template.html'
], function ($, L, Mustache, InfoBoxTemplate, InfoContentTemplate) {

  var InfoBox = L.Control.extend({
    options: {
        position: 'topleft'
    },

    onAdd: function (map) {
      // create the control container with a particular class name
      var container = L.DomUtil.create('div', 'info-container');
      // Prevent further event propagation, ie. no click events behind the control-box
      L.DomEvent.disableClickPropagation(container);
      
      var control_box = Mustache.render(InfoBoxTemplate);
      container.innerHTML = control_box;
      
      return container;
    }
  });
  
  var init = function(map, basinlayer){
    map.addControl( new InfoBox() );
    
    var infocontent = Mustache.render(InfoContentTemplate);
    $(".container").append(infocontent);
    
    $(".info-img").on('click', function(e){
      $("#map").css({height: "0%"});
      $(".info-content").css({height: "100%", visibility: "visible"});
    });
    
    $("#info-close").on('click', function(e){
      $("#map").css({height: "100%"});
      $(".info-content").css({height: "0%", visibility: "hidden"});
    });
  };
  
  return {
    init: init
  };
});