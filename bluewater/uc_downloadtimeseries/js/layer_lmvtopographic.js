define([
  'leaflet'
], function (L) {
  
  /* extend leaflet tilelayer for own config */
  L.TileLayer.WMTS = L.TileLayer.extend({
    wmtsOptions : {
      'SERVICE' : 'WMTS',
      'VERSION' : '1.0.0',
      'REQUEST' : 'GetTile',
      'FORMAT' : 'image/png',
      'LAYER' : undefined,
      'TILEMATRIXSET' : undefined,
      'TILEMATRIX' : undefined,
      'TILECOL' : '{x}',
      'TILEROW' : '{y}'
    },

    initialize : function(url, wmtsOptions, options) {
      var self = this;

      var bar = Object.keys(L.extend(this.wmtsOptions, wmtsOptions)).reduce(function(a, b) {
        var foo = self.wmtsOptions[b] ? b + '=' + self.wmtsOptions[b] : b + '={' + b + '}';
        a.push(foo);
        return a;
      }, []);

      L.TileLayer.prototype.initialize(url + '?' + bar.join('&'), options);
    },
  });
  
  
  var create = function(){
     /* create base map layer*/
    var layer = new L.TileLayer.WMTS('http://maps-open.lantmateriet.se/open/topowebb-ccby/v1/wmts', 
      {LAYER : 'topowebb',
       FORMAT : 'image/png',
       TILEMATRIXSET : '3006',
       TILEMATRIX : '{z}'}, 
      {tileSize : 256,
       noWrap : true });
    
    return layer;
    
  };
  
  return {
    create: create
  };
  
});