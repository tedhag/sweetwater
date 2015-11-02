define([
  'leaflet',
  'mustache',
  'text!uc_selectpositiononmap/popup_template.html',
  'uc_saveexcelfile/uc_saveexcelfile'
], function (L, Mustache, PopupTemplate, UC_SaveExcelFile) {
    
    var toggle = function() {
      console.log('toggle');
      var ele = document.getElementById('more-actions');
      var text = document.getElementById('more-label');
      if(ele.style.display == "block") {
        ele.style.display = "none";
        text.innerHTML = "more";
      }
      else {
        ele.style.display = "block";
        text.innerHTML = "hide";
      }
	};
  
    /* Puts the position on the map*/
    var execute = function (map, mapname) {
      /* Add a pop-up */
      var popup = L.popup();
      function onMapClick(e) {

        /*Load template for holding the popup with latlon as data */
        var latlon = {lat: e.latlng.lat, lon: e.latlng.lng };
        var popup_template = Mustache.render(PopupTemplate, latlon);

        popup.setLatLng(e.latlng)
             .setContent(popup_template)
             .openOn(map);
        
        /*Prepare more label for action */
        $("#more-label").on('click', function(e){
			console.log("click");
		    toggle();
        });
        
        /* Load the save-to-excel Use Case after the template has been set */
        UC_SaveExcelFile.init('#more-actions', latlon);
      }

      /* Prepare map for action */
      map.on('click', onMapClick);
    };
  
    /* Init Use Case */
    var init = function (map) {
      execute(map);
    };
  
    return {
        init: init
    };
  
});