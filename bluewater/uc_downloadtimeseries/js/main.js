require.config({
  paths: {
    'header': '../../page_header/page_header',
    'jquery': 'lib/jquery-2.2.0.min',
    'leaflet': 'lib/leaflet-0.7.7/leaflet',
    'esri': 'lib/esri-leaflet',
    'mustache': 'lib/mustache.min',
    'text': 'lib/text',
    'shp': 'lib/shp.min',
    'geojsonvt': 'lib/geojson-vt-dev'
  }
});

require(['header',
], function (Header) {
   
    Header.init( function(){
      console.log("init page");
    });
  
});