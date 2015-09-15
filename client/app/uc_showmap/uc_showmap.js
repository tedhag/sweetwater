define([
  'leaflet',
  'cssutil',
  'mustache',
  'text!basemaps/map_template.html',
  'basemaps/layer_esri',
  'uc_showmap/control_box',
  'uc_selectpositiononmap/uc_selectpositiononmap'
], function ( L, 
              CssUtil,
              Mustache, 
              MapTemplate, 
              Esri,
              ControlBox,
              UC_SelectPosition ) {
  
  var init = function (element){
    /* Load leaflet css */
    CssUtil.load('https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.5/leaflet.css');
    
    /*Load template for holding the map */
    var map_template = Mustache.render(MapTemplate);
    $(element).html(map_template);
    
    /* Init with default map */
    var layer = Esri.create();
    var map = L.map('map');
    layer.addTo(map);
    var startPos = new L.LatLng(61.93971314997426, 16.54225424576134); //Almost center Sweden.
    map.setView(startPos, 4);
    
    /* Init pop-up when click a position on map */
    UC_SelectPosition.init(map);
      
    /* Add a control box to map */
    ControlBox.init(map);
  }
  
  return {
    init: init
  };
  
});