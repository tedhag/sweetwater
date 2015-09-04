define([
  'leaflet',
  'esri'
], function (L) {
    
    var create = function(){
    var layer = L.esri.basemapLayer('NationalGeographic');
  
      return layer;
    }
    
    return {
      create: create
    };
  
});