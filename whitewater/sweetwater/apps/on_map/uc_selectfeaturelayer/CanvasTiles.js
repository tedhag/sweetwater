L.CanvasTiles =  L.TileLayer.Canvas.extend({
        
    tileOptions : {
      maxZoom: 20,  // max zoom to preserve detail on
      tolerance: 5, // simplification tolerance (higher means simpler)
      extent: 4096, // tile extent (both width and height)
      buffer: 64,   // tile buffer on each side
      debug: 0,      // logging level (0 to disable, 1 or 2)

      indexMaxZoom: 0,        // max zoom in the initial tile index
      indexMaxPoints: 100000, // max number of points per tile in the index
    },
    
    tileIndex: null, _loaded : false,
    
    initialize: function (options,callContext) {
        this._callContext = callContext;
        L.setOptions(this, options);

        var self = this;
        this.drawTile = function (tileCanvas, tilePoint, zoom) {
           
            this._draw(tileCanvas, tilePoint, zoom);
            if (self.options.debug) {
                self._drawDebugInfo(tileCanvas, tilePoint, zoom);
            }

        };
        return this;
    },

    params: function (options) {
        L.setOptions(this, options);
        return this;
    },

    addTo: function (map) {
        map.addLayer(this);
        return this;
    },
    
   getTileIndex : function() {
        return this.tileIndex;
   },
    
  isLoaded : function() {
    return this._loaded;
  },
    
  callbackWhenLoaded(callback) {
     window.addEventListener("canvasDataLoaded", function(e) { 
         if (typeof callback === "function") {
            callback(e);
         }     
     });

  },
    
    
   loadGeoJson : function (url){
       var self = this;
       if(typeof url === 'string' || url instanceof String) {
          var req = new XMLHttpRequest();           

          req.onreadystatechange = function() {
            if (this.readyState == 4 ) {
               if(this.status == 200){
                   var geojson = JSON.parse(this.responseText);
                        self.loadData(geojson);                

               }
            }
          }

          req.open("GET", url, true);
          req.send();       
       
       } else {
            self.loadData(url);
       }

    }, 
    
    /**
     * uploads and unzip a shapefile
     * @param {string} url
     * @return {void}
     * @private
     */    
    loadShapeFile : function(url) {     
        var self = this;

        shp(url).then(function(geojson){
            console.log("Shapefile loaded, processing data");
            self.loadData(geojson);
            
        });
    },   
    
    loadData : function(data) {
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
            layer: _self
          }
        });
        window.dispatchEvent(event);        
    },    

    _drawDebugInfo: function (tileCanvas, tilePoint, zoom) {

        var max = this.options.tileSize;
        var g = tileCanvas.getContext('2d');
        g.globalCompositeOperation = 'destination-over';
        g.strokeStyle = '#FFFFFF';
        g.fillStyle = '#FFFFFF';
        g.strokeRect(0, 0, max, max);
        g.font = "12px Arial";
        g.fillRect(0, 0, 5, 5);
        g.fillRect(0, max - 5, 5, 5);
        g.fillRect(max - 5, 0, 5, 5);
        g.fillRect(max - 5, max - 5, 5, 5);
        g.fillRect(max / 2 - 5, max / 2 - 5, 10, 10);
        g.strokeText(tilePoint.x + ' ' + tilePoint.y + ' ' + zoom, max / 2 - 30, max / 2 - 10);

    },

    /**
     * Transforms coordinates to tile space
     */
    tilePoint: function (map, coords,tilePoint, tileSize) {
        // start coords to tile 'space'
        var s = tilePoint.multiplyBy(tileSize);

        // actual coords to tile 'space'
        var p = map.project(new L.LatLng(coords[0], coords[1]));

        // point to draw
        var x = Math.round(p.x - s.x);
        var y = Math.round(p.y - s.y);
        return {x: x,
            y: y};
    },
    /**
     * Creates a query for the quadtree from bounds
     */
    _boundsToQuery: function (bounds) {
        if (bounds.getSouthWest() == undefined) { return { x: 0, y: 0, width: 0.1, height: 0.1 }; }  // for empty data sets
        return {
            x: bounds.getSouthWest().lng,
            y: bounds.getSouthWest().lat,
            width: bounds.getNorthEast().lng - bounds.getSouthWest().lng,
            height: bounds.getNorthEast().lat - bounds.getSouthWest().lat
        };
    },
    
    _draw: function (tileCanvas, tilePoint, zoom) {

        var tileSize = this.options.tileSize;

        var nwPoint = tilePoint.multiplyBy(tileSize);
        var sePoint = nwPoint.add(new L.Point(tileSize, tileSize));

        
        // padding to draw points that overlap with this tile but their center is in other tile
        var pad = new L.Point(this.options.padding, this.options.padding);

        nwPoint = nwPoint.subtract(pad);
        sePoint = sePoint.add(pad);

        var bounds = new L.LatLngBounds(this._map.unproject(sePoint), this._map.unproject(nwPoint));
        var zoomScale  = 1 / ((40075016.68 / tileSize) / Math.pow(2, zoom));


        this.drawingOnCanvas( this._callContext,
            {
                canvas: tileCanvas,
                tilePoint: tilePoint,
                bounds: bounds,
                size: tileSize,
                zoomScale: zoomScale,
                zoom: zoom,
                options: this.options
            }
         );

      
    },
        
    colorizeFeatures: function(data) {
        var counter = 0;
        for (var i = 0; i < data.features.length; i++) {
            data.features[i].properties.color = 'hsl(' + 360 * Math.random() + ', 50%, 50%)';
            counter += data.features[i].geometry.coordinates[0].length;
        }
        return counter;
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
        var tile = this.tileIndex.getTile(params.tilePoint.z, params.tilePoint.x, params.tilePoint.y);
        if (!tile) {
            return;
        }

        ctx.clearRect(0, 0, params.canvas.width, params.canvas.height);

        var features = tile.features;

        ctx.strokeStyle = 'grey';


        for (var i = 0; i < features.length; i++) {
            var feature = features[i],
                type = feature.type;

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
    
    searchFeature : function(attrName, value) {
        for(var i in this.tileIndex.tiles) {
            
            var tile = this.tileIndex.tiles[i];
            
            for(var index in tile.features) {
                var feature = tile.features[index];
                
                if(feature.tags[attrName] == value) {
                    return feature;
                }
            }
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
                
                if(this.pointInPolygon(point,feature.tags.geom)) {

                    return feature;
                }            
            }
        
        }
 
    },
    
    /**
        Return true/false if point is in polygon.
    **/
    pointInPolygon : function (point, polygon) {
      var points = polygon.coordinates[0];
      var i, j, nvert = points.length;
      var c = false;

      for(var i = 0, j = nvert - 1; i < nvert; j = i++) {
        if( ( (points[i][1] >= point.y ) != (points[j][1] >= point.y) ) &&
            (point.x <= (points[j][0] - points[i][0]) * (point.y - points[i][1]) / (points[j][1] - points[i][1]) + points[i][0])
          )
          c = !c;
      }

      return c;
    },
    
    intersectsValues : function(bbox, latlng) { 
        var x = latlng.lng;
        var y = latlng.lat;
        return !(x > bbox[2] || x < bbox[0] || y > bbox[3] || y < bbox[1]);    
    }, 
    
    mergePolygons : function(feature1,feature2) {
        var p1 = this.createPolygon(feature1.tags.geom.coordinates);
        var p2 = this.createPolygon(feature1.tags.geom.coordinates);
        return p1.merge(p2);
    },
    
    createPolygon(coords) {
        var arr = new Array();
         for(var i in coords) {
            var coord = coords[i];
            arr.push(new Point(coord[0],coord[1]));
        } 
        return new Polygon(arr);
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
    
    
});

L.canvasTiles = function (options, callContext) {
    return new L.CanvasTiles(options, callContext);
};




/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

// Point object
function Point(a,b) {
    // a=x,b=y
    if (b) {
        this.x=a;
        this.y=b;
        }
    // a=Point or {x:?,y:?}
    else if (a) {
        this.x=a.x;
        this.y=a.y;
        }
    // empty
    else {
        this.x=this.y=0;
        }
    }
Point.prototype.toHashkey = function() {
    return this.x+"_"+this.y;
    };
Point.prototype.clone = function() {
    return new Point(this);
    };
// Segment object
function Segment(a,b) {
    this.ptA = new Point(a);
    this.ptB = new Point(b);
    }
// Contour object
function Contour(a) {
    this.pts = []; // no points
    if (a) {
        if (a instanceof Array) { // assume array of Point objects
            var nPts = a.length;
            for (var iPt=0; iPt<nPts; iPt++) {
                this.pts.push(a[iPt].clone());
                }
            }
        }
    }
Contour.prototype.clone = function() {
    return new Contour(this);
    };
Contour.prototype.addPoint = function(p) {
    this.pts.push(p);
    };
// Polygon object
function Polygon(a) {
    this.contours = []; // no contour
    if (a) {
        if (a instanceof Polygon) {
            var contours = a.contours;
            var nContours = contours.length;
            for ( var iContour=0; iContour<nContours; iContour++ ) {
                this.contours.push(new Contour(contours[iContour]));
                }
             }
        else if ( a instanceof Array ) {
            this.contours.push(new Contour(a));
            }
        }
    }
Polygon.prototype.merge = function(other) {
    // A Javascript object can be used as an associative array, but
    // they are not real associative array, as there is no way
    // to query the number of entries in the object. For this
    // reason, we maintain an element counter ourself.
    var segments={};
    var contours=this.contours;
    var nContours=contours.length;
    var pts, nPts;
    var iPtA, iPtB;
    var idA, idB;
    for (var iContour=0; iContour<nContours; iContour++) {
        pts = contours[iContour].pts;
        nPts = pts.length;
        iPtA = nPts-1;
        for ( iPtB=0; iPtB<nPts; iPtA=iPtB++ ) {
            idA = pts[iPtA].toHashkey();
            idB = pts[iPtB].toHashkey();
            if (!segments[idA]) {
                segments[idA]={n:0,pts:{}};
                }
            segments[idA].pts[idB] = new Segment(pts[iPtA],pts[iPtB]);
            segments[idA].n++;
            }
        }
    // enumerate segments in other's contours, eliminate duplicate
    contours = other.contours;
    nContours = contours.length;
    for ( iContour=0; iContour<nContours; iContour++ ) {
        pts = contours[iContour].pts;
        nPts = pts.length;
        iPtA=nPts-1;
        for (iPtB=0; iPtB<nPts; iPtA=iPtB++) {
            idA = pts[iPtA].toHashkey();
            idB = pts[iPtB].toHashkey();
            // duplicate (we eliminate same segment in reverse direction)
            if (segments[idB] && segments[idB].pts[idA]) {
                delete segments[idB].pts[idA];
                if (!--segments[idB].n) {
                    delete segments[idB];
                    }
                }
            // not a duplicate
            else {
                if (!segments[idA]) {
                    segments[idA]={n:0,pts:{}};
                    }
                segments[idA].pts[idB] = new Segment(pts[iPtA],pts[iPtB]);
                segments[idA].n++;
                }
            }
        }
    // recreate and store new contours by jumping from one point to the next,
    // using the second point of the segment as hash key for next segment
    this.contours=[]; // regenerate new contours
    var contour;
    for (idA in segments) { // we need this to get a starting point for a new contour
        contour = new Contour();
        this.contours.push(contour);
        for (idB in segments[idA].pts) {break;}
        var segment = segments[idA].pts[idB];
        while (segment) {
            contour.addPoint(new Point(segment.ptA));
            // remove from collection since it has now been used
            delete segments[idA].pts[idB];
            if (!--segments[idA].n) {
                delete segments[idA];
                }
            idA = segment.ptB.toHashkey();
            if (segments[idA]) {
                for (idB in segments[idA].pts) {break;} // any end point will do
                segment = segments[idA].pts[idB];
                }
            else {
                segment = null;
                }
            }
        }
    };