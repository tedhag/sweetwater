define([
  'leaflet',
  'shp',
  //'geojsonvt',
  //'canvas_tilelayer'
], function (L, ShapeFile 
             //GeoJsonVT, 
             //CanvasTilelayer
             ) {
  
  var fillcolor = 'rgba(0,0,0,0)';
  var linecolor = 'rgba(131, 131, 131, 0.29)';
  var highlightcolor = 'rgba(200, 200, 200, 0.5)';
  var layer = null;
  /* 
  load shap file using shp from: 
    https://github.com/calvinmetcalf/shapefile-js/blob/master/dist/shp.js 
  and converitng to GeoJSON geojson-vt from:
    https://github.com/mapbox/geojson-vt
  */
  var loadshapefile = function(fn){
    console.log("Shapefile loading...");
    /* Using javascript promises (then) */
    ShapeFile('shape/sgu_aro')
    .then(function(data){
      console.log("Shapefile loaded, generate layer...");
      fn(data);
    });
  };
  
  var create = function(){
    
    loadshapefile(function(data){
      
      //var style = ;
      
      layer = L.geoJson(data,{
        'style': {
          "color": "#6b791c",
          "weight": 2,
          "opacity": 0.3,
          "fillOpacity": 0
        },
        'onEachFeature': function(feature, layer){
          layer.on({
				click: function(e){
                  var feature = e.target.feature;
                  console.log(feature.properties.SUBIDnew);
                  layer.setStyle({"fillOpacity": 0.7});
                }
			});
        }});
      
      console.log('basin layer created');
      $(window).trigger('basinsloaded');
      
    });
  }
  
  var get = function(){
    return layer;
  };
    
  return {
    create: create,
    get: get
  };
});