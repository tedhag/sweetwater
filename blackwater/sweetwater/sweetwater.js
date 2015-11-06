require.config({
  paths: {
    'jquery': 'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min',  
    'leaflet': 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.5/leaflet',
    'proj4leaflet': 'lib/proj4leaflet',
    'proj4': 'lib/proj4',
    'esri': 'http://cdn.jsdelivr.net/leaflet.esri/1.0.0/esri-leaflet',
    'mustache': 'https://cdnjs.cloudflare.com/ajax/libs/mustache.js/0.8.1/mustache.min',
    'text': 'https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min',
  }
});

require([ 
  'on_start/uc_showmap',
  'on_start/uc_showmenu',
], function (uc_showmap,
             uc_showmenu) {
  
  //uc_showmap.init('start-map');
  uc_showmenu.init('#menu');
  
});