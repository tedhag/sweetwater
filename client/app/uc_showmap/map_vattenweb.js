define([
  'leaflet',
  'proj4leaflet',
  'proj4'
], function (L) {

  L.TileLayer.WMTS = L.TileLayer.extend({
    wmtsOptions: {
        'SERVICE': 'WMTS',
        'VERSION': '1.0.0',
        'REQUEST': 'GetTile',
        'FORMAT': 'image/png',
        'LAYER': undefined,
        'TILEMATRIXSET': undefined,
        'TILEMATRIX': undefined,
        'TILECOL': '{x}',
        'TILEROW': '{y}'
    },
    initialize: function (url, wmtsOptions, options) {
        var self = this;
        var bar = Object.keys(L.extend(this.wmtsOptions, wmtsOptions)).reduce(function (a, b) {
            var foo = self.wmtsOptions[b] ? b + '=' + self.wmtsOptions[b] : b + '={' + b + '}';
            a.push(foo);
            return a;
        }, []);
        L.TileLayer.prototype.initialize(url + '?' + bar.join('&'), options);
    },
  });
  
  var create = function(){
    var waterwebmapUrl = 'http://vattenwebb-tst.smhi.se/tiles/vw';
    var wmsLayer = new L.TileLayer.WMTS(waterwebmapUrl + '/wmts', {
      LAYER: 'vw',
      FORMAT: 'image/png',
      TILEMATRIXSET: 'vattenwebb-grid',
      TILEMATRIX: '{z}',
      }, { noWrap: true, tileSize: 512 });

    var projection = 
        L.CRS.proj4js('EPSG:3006', 
                      '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs', 
                      new L.Transformation(1, 1412599.1392429359, -1, 8010405.502378));
    
    projection.scale = function (zoom) {
      return 1 / ((2159355.8713766325 - (-1412599.1392429359)) / (512 * Math.pow(2, zoom)));
    };
  
    projection.getSize = function (zoom) {
      var s = Math.pow(2, zoom) * 512;
      return new L.Point(s, s);
    };
    
    var map = L.map('map',{
      layers: [wmsLayer],
      crs: projection,
      continuousWorld: false,
      minZoom: 1,
      maxZoom: 10,
      tileSize: 512
	});
    
    return map;
  };
  
  return {
    create: create
  };
  
});