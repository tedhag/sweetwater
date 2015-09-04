define([
'leaflet'
], function (L) {
    
    var create = function(){
      var openstreet = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }); 
  
      return openstreet;
    }
    
    return {
      create: create
    };
  
});

