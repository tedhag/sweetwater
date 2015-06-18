define([
  'jquery',
  'leaflet',
  'mustache',
  'cssutil',
  'text!uc_importexcelfile/importbutton_template.html',
  'text!uc_importexcelfile/popup_template.html'
], function ( $, 
              L, 
              Mustache, 
              CssUtil,
              ImportButtonTemplate,
              PopupTemplate) {
  
  /* Where it all happens */ 
  var execute = function(e, map){
    console.log("execute import");
    console.log(e);
    
    var files = e.target.files;
    var f = files[0];
    console.log(f.name);
    
    var reader = new FileReader();
    reader.onload = function(e) {
      var data = e.target.result;
      var workbook = XLSX.read(data, {type:"binary"});
      
      //First sheet in workbook
      var sheet_name = workbook.SheetNames[0];
      var sheet = workbook.Sheets[sheet_name];
      var latlon = {lat: sheet['B1'].v,
                    lon: sheet['B2'].v };
      
      /* Add a pop-up on the map*/
      var popup_template = Mustache.render(PopupTemplate, latlon);
      var popup = L.popup();
      popup.setLatLng(new L.latLng(latlon.lat, latlon.lon))
           .setContent(popup_template)
           .openOn(map);
    }
    
    reader.readAsBinaryString(f);
  }
  
  /* Init Use Case */
  var init = function (element, map){
    
    CssUtil.load('app/uc_importexcelfile/uc_importexcelfile.css');
    
    /* Add import button to leaflet control */
    var template = Mustache.render(ImportButtonTemplate);
    $(element).append(template);
    
    /* Add listner to import button */
    $("#import-excel-button").on('change', function(e){
      execute(e, map);
    });
    
  }
  
  return {
      init: init
    };
  
});