define([
  'jquery', 
  'mustache', 
  'text!uc_togglebasinlayer/togglebasinlayer_template.html'
], function ($, Mustache, BasinToggleTemplate) {
    
    /* Init Use Case */
    var init = function (element, map, BasinsLayer) {
      
      var template = Mustache.render(BasinToggleTemplate);
      $(element).append(template);

      $(window).on("basinsloaded", function(e){
        console.log("basins loaded");
        
        BasinsLayer.get().addTo(map);
        
        $(".basins-spinner").css("display", "none");
        $(".toggle-basins").css("display", "block");

        var basins = document.getElementById('basins');
        basins.disabled=false;
        basins.addEventListener('change', function(){
          BasinsLayer.toggle(map, basins.checked);
        });
      });

    }
        
    return {
        init: init
    };
  
});