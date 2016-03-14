define([
  'leaflet'
], function (L) {
  
  
  var create = function(){
    
    
    /* create base map layer*/
    var layer = L.tileLayer.wms("http://maps.sgu.se/lmv/topowebb/v1", {
      uppercase: true,
      layers: 'topowebbkartan_nedtonad',
      format: 'image/png',
      version: '1.1.1'});
    
    return layer;
    
  };
  
  return {
    create: create
  };
  
});