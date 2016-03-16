define([
  'jquery',
  'mustache',
  'text!uc_saveasexcel/saveasexcel_template.html',
  'uc_saveasexcel/excelsheet',
  'uc_saveasexcel/timeserie'
], function ($, Mustache, SaveAsExcelTemplate, ExcelSheet, Timeserie) {
  
    /* Where it all happens */ 
	var execute = function(data, data_serie){
      
      Timeserie.parse(data_serie);
      
      ExcelSheet.create(data, Timeserie );
		
	};
  
    /* Init Use Case */
    var init = function (data){
      
      var template = Mustache.render(SaveAsExcelTemplate, {subid: '#'+data.id});
      $(".save-dialog").html(template);
      
      $(".save-as-excel").on('click', function(e){
        console.log(data.id);
        //var url = '/download/subid?subid='+data.id;
        var url = 'test/1.txt'
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function(){
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
              var data_serie = xmlhttp.responseText;
              execute(data, data_serie);
            }
        }
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
      })
    	
    };
  
    return {
      init: init
    };
  
});