define([
  'leaflet',
  'shp',
  'geojsonvt',
  'canvas_tilelayer'
], function (L, ShapeFile, GeoJsonVT, CanvasTilelayer) {
  
  var fillcolor = 'rgba(0,0,0,0)';
  var linecolor = 'rgba(78, 114, 59, 0.7)';
  var highlightcolor = 'rgba(200, 200, 200, 0.5)';
  var layer = null;
  /* 
  load shap file using shp from: 
    https://github.com/calvinmetcalf/shapefile-js/blob/master/dist/shp.js 
  and converitng to GeoJSON geojson-vt from:
    https://github.com/mapbox/geojson-vt
  */
  var loadshapefile = function(tileoptions, fn){
    console.log("Shapefile loading...");
    /* Using javascript promises (then) */
    ShapeFile('shape/SHYPE2012_version_1_2_0_polygons.zip').then(function(data){
      console.log("Shapefile loaded, processing data...");
      console.log("Prepare GeoJSON...");
      for(var i in data.features) {
          var geom = data.features[i].geometry;
          data.features[i].properties.geom = geom;
      }

      var tileindex = GeoJsonVT(data, tileoptions);
      
      fn(tileindex);
    });
  };
  
  var create = function(){
    var tileoptions = {
      maxZoom: 20,  // max zoom to preserve detail on
      tolerance: 5, // simplification tolerance (higher means simpler)
      extent: 4096, // tile extent (both width and height)
      buffer: 64,   // tile buffer on each side
      debug: 0, // logging level (0 to disable, 1 or 2)
      indexMaxZoom: 0, // max zoom in the initial tile index
      indexMaxPoints: 100000, // max number of points per tile in the index
    };
    
    loadshapefile(tileoptions, function(tileindex){
      layer = CanvasTilelayer.create(tileindex, 
                                     tileoptions, 
                                     { tileSize:256, padding: 5},
                                     linecolor, 
                                     fillcolor);
      console.log('basin layer created');
      $(window).trigger('basinsloaded');
      
      /*window.dispatchEvent(
        new CustomEvent("basinsloaded", { detail: { msg: 'basins loaded' }, cancelable: true })); */ 
      
    });
  }
  
  var toggle = function(map, checked){
    if (layer != null){
      console.log('checkbox basins is marked '+checked);
      if (checked){
        map.addLayer(layer);
      }
      else{
        map.removeLayer(layer);
      }
    }
  };
  
  var get = function(){
    return layer;
  };
    
  return {
    create: create,
    toggle: toggle,
    get: get
  };
});