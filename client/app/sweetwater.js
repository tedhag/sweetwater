require.config({
  paths: {
    'jquery': 'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min',  
    'jquery-ui': 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min',
    'leaflet': 'http://cdn.leafletjs.com/leaflet-0.7/leaflet',
    'text': 'https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min',
    'mustache': 'https://cdnjs.cloudflare.com/ajax/libs/mustache.js/0.8.1/mustache.min',
    'proj4leaflet': 'lib/proj4leaflet',
    'proj4': 'lib/proj4'
  },
  shim: {
    'jquery-ui': {
      export:'$',
      deps: ['jquery']
    }
  }
});

require([ 
  'uc_showmap/uc_showmap'   
], function (uc_showmap) {
  
  uc_showmap.init('#sweetwater');  
  
});