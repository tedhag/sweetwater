define([
  'leaflet', 
], function (L) {

  L.CanvasTiles =  L.TileLayer.Canvas.extend({

    tileOptions: null,
    tileIndex: null,
    linecolor: null,
    fillcolor: null,

    getTileIndex : function() {
      return this.tileIndex;
    },

    initialize: function (tileIndex, tileoptions, options, linecolor, fillcolor) {
      this.tileIndex = tileIndex;
      this.tileOptions = tileoptions;
      this.linecolor = linecolor;
      this.fillcolor = fillcolor;
      //this._callContext = callContext;
      L.setOptions(this, options);

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
      ctx.strokeStyle = this.linecolor;
      for (var i = 0; i < features.length; i++) {
        var feature = features[i];
        var type = feature.type;

        ctx.fillStyle = feature.tags.color ? feature.tags.color : this.fillcolor;
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

    /**
        return feature from click in map
    **/
    getFeature : function (latlng) {   
      var tile = this.getTileFromLatLng(latlng);

      if(tile) {
        var features = tile.features;
        for(var i in features) {
          var feature = features[i];                
          var point = {x:latlng.lng,y:latlng.lat};
          var polygon_points = null;
          if(feature.tags.geom.type === 'MultiPolygon') {
            var polygons = feature.tags.geom.coordinates;
            for (var i in polygons){
              var polygon = polygons[i];
              var polygon_points = polygon[0];
              if(this.pointInPolygon(point,polygon_points)) {
                return feature;
              }    
            }
          } else {
            var polygon_points = feature.tags.geom.coordinates[0];
            if(this.pointInPolygon(point,polygon_points)) {
              return feature;
            }
          }
        }

      }
    },

    getTileFromLatLng : function(latlng) {
      var point = this.getTilePoint(latlng.lat,latlng.lng,this._map.getZoom());        
      return this.tileIndex.getTile(point.z,point.x,point.y);
    },

    getTilePoint : function(lat, lon, zoom) {
      var tilePoint = {};
      tilePoint.x = parseInt(Math.floor( (lon + 180) / 360 * (1<<zoom) ));
      tilePoint.y = parseInt(Math.floor( (1 - Math.log(Math.tan(lat.toRad()) + 1 / Math.cos(lat.toRad())) / Math.PI) / 2 * (1<<zoom) ));
      tilePoint.z = zoom;
      return tilePoint;
    }, 

    /**
        Return true/false if point is in polygon.
    **/
    pointInPolygon : function (point, points) {
      var i, j, nvert = points.length;
      var c = false;

      for(var i = 0, j = nvert - 1; i < nvert; j = i++) {
        if( ( (points[i][1] >= point.y ) != (points[j][1] >= point.y) ) &&
            (point.x <= (points[j][0] - points[i][0]) * (point.y - points[i][1]) / (points[j][1] - points[i][1]) + points[i][0])
          )
          c = !c;
      }

      return c;
    }

  });

  /** Converts numeric degrees to radians */
  if (typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
      return this * Math.PI / 180;
    }
  }
  
  var create = function(tileindex, tileoptions, options, linecolor, fillcolor){
    var layer = new L.CanvasTiles(tileindex, tileoptions, options, linecolor, fillcolor);
    return layer;
  };

  return {
    create: create
  };
  
});