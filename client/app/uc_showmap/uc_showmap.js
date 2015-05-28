define([
  'jquery',
  'leaflet',
  'cssutil',
  'mustache',
  'text!uc_showmap/maptemplate.html',
  'uc_showmap/map_vattenweb',
  'uc_showmap/map_openstreet'
], function ($, L, cssutil, Mustache, template, Vattenweb, Openstreet) {
  
  var init = function (element){
    /* Load leaflet css */
    cssutil.load('http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css');
    
    /*Load template for holding the map */
    var rendered_template = Mustache.render(template);
    $(element).html(rendered_template);
    
    /* Create the map layer */
    var map = Vattenweb.create();
    //var map = Openstreet.create();
    
    var startPos = new L.LatLng(61.93971314997426, 16.54225424576134); //Almost center Sweden.
    map.setView(startPos, 3);
    
    var popup = L.popup();
    function onMapClick(e) {
      popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
    }
    
    map.on('click', onMapClick);
    
  }
  
  return {
        init: init
    };
  
});