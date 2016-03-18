define([
  'leaflet',
  'on_start/cssutil',
  'on_start/layer_vattenweb',
  'on_start/control_box',
  'esri'
], function ( L, 
              CssUtil,
              Vattenweb,
              ControlBox) {
  
  var init = function (element){
    /* Load leaflet css */
    CssUtil.load('https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.5/leaflet.css');
    
    /* Init with default map 
    var map = L.map(element, {
      crs: Vattenweb.projection(),
      minZoom:1 } );
    var layer = Vattenweb.create();
    */
    
    var map = L.map(element);
    var layer = L.esri.basemapLayer('NationalGeographic');
    layer.addTo(map);
    var startPos = new L.LatLng(62.7, 16.5); //Almost center Sweden.
    map.setView(startPos, 5);
    map.addControl(new L.control.scale({ imperial: false, position: 'bottomleft'}));
   
    /* Add a control box to map */
    ControlBox.init(map);
    
  }
  
  return {
    init: init
  };
  
});