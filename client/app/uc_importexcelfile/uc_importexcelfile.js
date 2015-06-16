define([
  'jquery',
  'mustache',
  'text!uc_importexcelfile/importbutton_template.html',
], function ($, Mustache, ImportButtonTemplate) {
  
  /* Where it all happens */ 
  var execute = function(){
    console.log("execute import");
  }
  
  /* Init Use Case */
  var init = function (element){
    
    /* Add save button to leaflet pop-up */
    var template = Mustache.render(ImportButtonTemplate);
    $(element).append(template);
    
    /* Add listner to save button */
    $("#import-excel-button").on('click', function(){
      execute();
    });
  }
  
  return {
      init: init
    };
  
});