define([
  'leaflet',
  'mustache',
  'cssutil',
  'text!uc_changebasemap/changebasemap_template.html',
  'basemaps/layer_esri',
  'basemaps/layer_openstreet',
  'basemaps/layer_bing',
  'basemaps/layer_vattenweb'
], function (L, 
             Mustache, 
             CssUtil,
             ChangeBasemapTemplate, 
             Esri, 
             OpenStreet,
             Bing,
             Vattenweb) {
    
    /* Change the base map*/
    var execute = function (map, mapname) {
      console.log(mapname);
      
      var latlon = map.getCenter();
      var zoom = map.getZoom();
      
      map.eachLayer(function (layer) {
        map.removeLayer(layer);
        console.log("remove: "+layer._url);
      });
      
      L.setOptions(map, {crs: L.CRS.EPSG3857 });  
      
      var layer = undefined;
      switch (mapname) {
      case 'nationalgeographic':
        layer = Esri.create();
        break;
      case 'openstreet':
        layer = OpenStreet.create();
        break;
      case 'bing':
        layer = Bing.create('AerialWithLabels');
        break;
      case 'roads':
        layer = Bing.create('Road');
        break;
      /*
      Not used for the moment. Problems with projection when selecting other maps
      after vw has been selected
      case 'vw':
        layer = Vattenweb.create();
        //Almost center Sweden.
        latlon = new L.LatLng(61.93971314997426, 16.54225424576134); 
        zoom = 3;  
        L.setOptions(map, {crs: Vattenweb.projection() });
        break;
        */
      default:
        layer = Esri.create();
        break;
      }
      
      map.addLayer(layer);
      map.setView(latlon, zoom);
      
    };
  
    /* Init Use Case */
    var init = function (element, map) {
      /* Load CSS for this UC */
      CssUtil.load('app/uc_changebasemap/changebasemap.css');

      /* Add select field to leaflet control */
      var template = Mustache.render(ChangeBasemapTemplate);
      $(element).append(template);
      
      var basemaps = document.getElementById('basemaps');
      basemaps.addEventListener('change', function(){
        execute(map, basemaps.value);
      });

    };
  
    return {
        init: init
    };
  
});