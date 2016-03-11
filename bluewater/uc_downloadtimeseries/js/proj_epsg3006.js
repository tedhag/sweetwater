define([
  'leaflet',
  'proj4leaflet',
  'proj4'
], function (L) {

  var create = function(){
    
    function rescalc(res, n) {
		if(n === 0)
			return [ res ];
		else
			return  [ res ].concat(rescalc(res / 2, n - 1));
	}
	
	var resolutions = rescalc(4096, 7);
    var epsg3006 = new L.Proj.CRS('EPSG:3006', '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs', {
    	resolutions: resolutions,
    	origin: [-1200000.000000, 8500000.000000]
    });
    
    
	return epsg3006;
  };
  
  return{
    create: create
  };
  
});