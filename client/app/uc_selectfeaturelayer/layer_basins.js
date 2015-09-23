define([
  'leaflet',
  'shp',
  'geojsonvt'
], function (L, ShapeFile, GeoJsonVT) {
  
  L.CanvasTiles =  L.TileLayer.Canvas.extend({
    
    tileIndex: null,
    
    initialize: function (tileindex, options, callContext) {
      this.tileIndex = tileindex;
      this._callContext = callContext;
      L.setOptions(this, options);

      var self = this;
      /* function that needs to be overriden when
      extending L.TileLayer.Canvas */
      this.drawTile = function (tileCanvas, tilePoint, zoom) {
          this.draw(tileCanvas, tilePoint, zoom);
      };
      return this;
    },
    
    addTo: function (map) {
      map.addLayer(this);
      return this;
    },
    
    draw: function (tileCanvas, tilePoint, zoom) {
      var tileSize = this.options.tileSize;
      var nwPoint = tilePoint.multiplyBy(tileSize);
      var sePoint = nwPoint.add(new L.Point(tileSize, tileSize));

      /*padding to draw points that overlap with this tile, 
      but their center is in other tile */
      var pad = new L.Point(this.options.padding, this.options.padding);
      nwPoint = nwPoint.subtract(pad);
      sePoint = sePoint.add(pad);

      var bounds = new L.LatLngBounds(this._map.unproject(sePoint),
                                      this._map.unproject(nwPoint));
      var zoomScale  = 1 / ((40075016.68 / tileSize) / Math.pow(2, zoom));
      this.drawingOnCanvas( this._callContext,
        { canvas: tileCanvas,
          tilePoint: tilePoint,
          bounds: bounds,
          size: tileSize,
          zoomScale: zoomScale,
          zoom: zoom,
          options: this.options });
    },
    
    drawingOnCanvas : function(canvasOverlay, params) {
      var pad = 0, ratio = 1;
      var bounds = params.bounds;
      params.tilePoint.z = params.zoom;

      var ctx = params.canvas.getContext('2d');
      ctx.globalCompositeOperation = 'source-over';

      if(this.tileIndex ==  null){
        return;
      }
      var tile = this.tileIndex.getTile(params.tilePoint.z, 
                                        params.tilePoint.x, 
                                        params.tilePoint.y);
      if (!tile) {
        return;
      }

      ctx.clearRect(0, 0, params.canvas.width, params.canvas.height);
      var features = tile.features;
      ctx.strokeStyle = 'grey';
      for (var i = 0; i < features.length; i++) {
          var feature = features[i];
          var type = feature.type;

          ctx.fillStyle = feature.tags.color ? feature.tags.color : 'rgba(255,0,0,0.05)';
          ctx.beginPath();
          for (var j = 0; j < feature.geometry.length; j++) {
            var geom = feature.geometry[j];
            if (type === 1) {
                ctx.arc(geom[0] * ratio + pad, geom[1] * ratio + pad, 2, 0, 2 * Math.PI, false);
                continue;
            }

            for (var k = 0; k < geom.length; k++) {
                var p = geom[k];
                var x = p[0] / this.tileOptions.extent * this.options.tileSize;
                var y = p[1] / this.tileOptions.extent * this.options.tileSize;
                if (k) ctx.lineTo(x  + pad, y   + pad);
                else ctx.moveTo(x  + pad, y  + pad);
            }
          }

          if (type === 3 || type === 1) ctx.fill('evenodd');
          ctx.stroke();
      }
    },
    
    
  });
  
  
  /* 
  load shap file using shp from: 
    https://github.com/calvinmetcalf/shapefile-js/blob/master/dist/shp.js 
  and converitng to GeoJSON geojson-vt from:
    https://github.com/mapbox/geojson-vt
  */
  var loadshapefile = function(url){
    console.log("Shapefile loading...");
    /* Using javascript promises (then) */
    ShapeFile(url).then(function(data){
      console.log("Shapefile loaded, processing data...");
      console.log("Prepare GeoJSON...");
      for(var i in data.features) {
          var geom = data.features[i].geometry;
          data.features[i].properties.geom = geom;
      }
      console.log(data.features[0]);

      var tileoptions = {
          maxZoom: 20,  // max zoom to preserve detail on
          tolerance: 5, // simplification tolerance (higher means simpler)
          extent: 4096, // tile extent (both width and height)
          buffer: 64,   // tile buffer on each side
          debug: 0,      // logging level (0 to disable, 1 or 2)
          indexMaxZoom: 0,        // max zoom in the initial tile index
          indexMaxPoints: 100000, // max number of points per tile in the index
      };

      var tileindex = GeoJsonVT(data, tileoptions);
      console.log(tileindex);
      //var event = new CustomEvent("basinsloaded", { detail: { msg: 'data loaded' }, cancelable: true });
      window.dispatchEvent(new CustomEvent("basinsloaded", 
                                           { detail: { msg: 'data loaded' }, cancelable: true }));   
        
      return tileindex;
    });
  };
  
  
  var create = function(file){
    var tileindex = loadshapefile(file);
    
    window.addEventListener("basinsloaded", function(e) { 
      e.stopPropagation();
      var layer = new L.CanvasTiles(tileindex, {tileSize:256});
      console.log('a layer');
      
      return layer;
     });
  }
    
  return {
    create: create
  };
});