define([
  'jquery',
  'jquery-ui',
  'leaflet',
  'mustache',
  'cssutil',
  'text!uc_searchbyname/searchbyname_template.html'
], function ($, UI , L, Mustache, CssUtil, SearchByNameTemplate ) {

    /* Where it all happens */
    var execute = function (e, map) {
        console.log("execute");
    };
  
    /* Init Use Case */
    var init = function (element, map) {
      /* Load CSS for this UC */
      CssUtil.load('app/uc_searchbyname/uc_searchbyname.css');

      /* Add import button to leaflet control */
      var template = Mustache.render(SearchByNameTemplate);
      $(element).append(template);

      $("#search-name-input").autocomplete({
        delay: 500,
		minLength: 2,
        source: ["Norrby", "Norrköping", "Karlstad", "Bråviken"],
        focus: function(event, ui) {
          // prevent autocomplete from updating the textbox
          event.preventDefault();
        },
        select: function(event, ui) {
          // prevent autocomplete from updating the textbox
          //event.preventDefault();
          execute(event, map);
        }
      });

      /* Add listner to import button */
      /*
      $("#search-name-field").on('change', function (e) {
          execute(e, map);
      });*/
    };
  
    return {
        init: init
    };
  
});