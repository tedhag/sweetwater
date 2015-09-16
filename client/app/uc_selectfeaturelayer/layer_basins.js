define([
  'leaflet',
  'shp'
], function (L, shp) {
  /*
  Using 
  https://github.com/mapbox/geojson-vt
  */
  var loaddata = function(data) {
    for(var i in data.features) {
        var geom = data.features[i].geometry;
        data.features[i].properties.geom = geom;
    }

    this.tileIndex = geojsonvt(data, this.tileOptions);
    this._loaded = true;
    var _self = this;
    this.redraw();
    var event = new CustomEvent("canvasDataLoaded", {
      detail: {
        message: 'Basins loaded'
      },
      bubbles: true,
      cancelable: true
    });
    window.dispatchEvent(event);        
  };
  
  /* load shap file using shp */
  var loadshapefile = function(url){
    console.log("Shapefile loading...");
    shp(url).then(function(geojson){
      console.log("Shapefile loaded, processing data...");
      self.loadData(geojson);
    });
  };
  
  var create = function(file){
    var layer = L.tileLayer.canvas();
    loadshapefile(file,layer);
    
    return layer;
  }
    
  return {
    create: create
  };
});