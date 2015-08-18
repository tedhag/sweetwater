define([
  'jquery',
  'jquery-ui',
  'leaflet',
  'mustache',
  'cssutil',
  'text!uc_searchbyname/searchbyname_template.html',
  'text!uc_searchbyname/popup_template.html',
  'uc_saveexcelfile/uc_saveexcelfile'
], function ($, UI , L, Mustache, CssUtil, SearchByNameTemplate, PopupTemplate, UC_SaveExcelFile ) {
    
    /* Puts the position on the map*/
    var execute = function (ui, map) {
      
      var popup = L.popup();
      var latlon = {name: ui.item.value , lat: ui.item.position.lat, lon: ui.item.position.lng };
      var popup_template = Mustache.render(PopupTemplate, latlon);

      popup.setLatLng(ui.item.position)
           .setContent(popup_template)
           .openOn(map);

      UC_SaveExcelFile.init('#search-name-pop-up-buttons', latlon);
    };
  
    /* Init Use Case */
    var init = function (element, map) {
      /* Load CSS for this UC */
      CssUtil.load('app/uc_searchbyname/uc_searchbyname.css');

      /* Add search field to leaflet control */
      var template = Mustache.render(SearchByNameTemplate);
      $(element).append(template);

      /* Search name from geonames */
      $("#search-name-input").autocomplete({
        delay: 500,
		minLength: 3,
        source: function (request, response){
          var data = $.ajax({
            url: 'http://api.geonames.org/searchJSON?username=tedhag',
            dataType: 'jsonp',
            // GeoNames expects "traditional" param serializing
            traditional: true,
            data: {
              featureClass: 'P', //Populated places
              maxRows: 10,
              country: 'SE',
              name_startsWith: request.term
            }
          })
          
          //Using the built-in deferred function in $.ajax()
          data.done(function (data){
            console.log(data);
            response($.map( data.geonames, function( item ) {
              return {
                //Label is used for the display name
                label: item.name + (item.adminName1 ? ", " + item.adminName1 : "") + ", " + item.countryName,
                //value is just used for the position on map
                value: item.name,
                position: {lat: item.lat, lng: item.lng } 
              }
            }));
          }); 
        },
        focus: function(event, ui) {
          // prevent autocomplete from updating the textbox
          event.preventDefault();
        },
        select: function(event, ui) {
          // Selected element in text field comes in the ui argument
          execute(ui, map);
        },
        close: function(event, ui) {
          //Reset the search field after select
          this.value = "";
        }
      });

    };
  
    return {
        init: init
    };
  
});