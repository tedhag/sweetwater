define([
  'jquery',
  'mustache',
  'text!uc_saveasexcel/saveasexcel_template.html'
], function ($, Mustache, SaveAsExcelTemplate) {
	
	
  
    /* Init Use Case */
    var init = function (data){
      var url = '/balthype/data/timeseries/excel/basin/'+data.id;
      var template = Mustache.render(SaveAsExcelTemplate, 
                                     {subid: '#'+data.id,
                                      url: url});
      $(".save-dialog").html(template);
      
      
    	
    };
  
    return {
      init: init
    };
  
});