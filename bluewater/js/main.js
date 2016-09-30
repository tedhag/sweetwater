require.config({
  paths: {
    'leaflet': 'lib/leaflet-0.7.7/leaflet',
    'proj4': 'lib/proj4js/proj4-compressed',
    'proj4leaflet': 'lib/proj4js/proj4leaflet',
  }
});

require(['uc_downloadtimeseries'
], function (UC_DownloadTimeseries) {
      console.log("init page");
      UC_DownloadTimeseries.init();
  
      
});