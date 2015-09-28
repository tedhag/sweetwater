define([
'leaflet'
], function (L) {
    
    var create = function(){
      var layer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }); 
  
      return layer;
    }
    
    return {
      create: create
    };
  
});

