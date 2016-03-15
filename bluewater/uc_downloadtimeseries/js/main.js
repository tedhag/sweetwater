require.config({
  paths: {
    'header': '../../page_header/page_header',
    'jquery': 'lib/jquery-2.2.0.min',
    'leaflet': 'lib/leaflet-0.7.7/leaflet',
    'esri': 'lib/esri-leaflet',
    'mustache': 'lib/mustache.min',
    'text': 'lib/text',
    'esri': 'lib/esri-leaflet',
    'proj4': 'lib/proj4js/proj4-compressed',
    'proj4leaflet': 'lib/proj4js/proj4leaflet',
    'shp': 'lib/shp.min',
    'geojsonvt': 'lib/geojson-vt-dev'
  }
});

require(['header', 'uc_downloadtimeseries'
], function (Header, UC_DownloadTimeseries) {
   
    Header.init( function(){
      console.log("init page");
      UC_DownloadTimeseries.init();
    });
  
});