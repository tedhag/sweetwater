define([
  'jquery',
  'leaflet',
  'cssutil',
  'mustache',
  'text!uc_showmap/map_template.html',
  'uc_showmap/map_vattenweb',
  'uc_showmap/map_openstreet',
  'text!uc_showmap/popup_template.html',
  'uc_saveexcelfile/uc_saveexcelfile'
], function ($, L, cssutil, Mustache, MapTemplate, Vattenweb, Openstreet, PopupTemplate, UC_SaveExcelFile) {
  
  var init = function (element){
    /* Load leaflet css */
    cssutil.load('http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css');
    
    /*Load template for holding the map */
    var map_template = Mustache.render(MapTemplate);
    $(element).html(map_template);
    
    /* Create the map layer */
    var map = Vattenweb.create();
    //var map = Openstreet.create();
    
    var startPos = new L.LatLng(61.93971314997426, 16.54225424576134); //Almost center Sweden.
    map.setView(startPos, 3);
    
    /* Add a pop-up */
    var popup = L.popup();
    function onMapClick(e) {
      
      /*Load template for holding the popup with latlon as data */
      var latlon = e.latlng.toString();
      var popup_template = Mustache.render(PopupTemplate, {latlon});
     
      popup.setLatLng(e.latlng)
           .setContent(popup_template)
           .openOn(map);
     
      /* Load the save-to-excel Use Case after the DOM has been set */
      UC_SaveExcelFile.init('#pop-up');
    }
    
    /* Prepare map for action */
    map.on('click', onMapClick);
    
  }
  
  return {
        init: init
    };
  
});