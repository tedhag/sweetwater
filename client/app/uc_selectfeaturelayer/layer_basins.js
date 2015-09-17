define([
  'leaflet',
  'shp'
], function (L, shp) {
  /*
  Using geojson-vt from
  https://github.com/mapbox/geojson-vt
  */
  var loaddata = function(data) {
    console.log("Prepare GeoJSON");
    for(var i in data.features) {
        var geom = data.features[i].geometry;
        data.features[i].properties.geom = geom;
    }

    /*
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
    */
  };
  
  /* 
  load shap file using shp from 
  https://github.com/calvinmetcalf/shapefile-js/blob/master/dist/shp.js 
  */
  var loadshapefile = function(url){
    console.log("Shapefile loading...");
    /* Using javascript promises (then) */
    shp(url).then(function(geojson){
      console.log("Shapefile loaded, processing data...");
      loadData(geojson);
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