define([
  'jquery',
  'mustache',
  'text!uc_saveexcelfile/savebutton_template.html',
], function ($, Mustache, SaveButtonTemplate) {
  /* At the moment of writing this code I was not able to get the import of js-xlsx libs
     working properly with Require.js, so the needed js-xlxs libs are imported in the index.html.
     This will be solved later.
  */
  
  
  /* Prepare some test data. The Sheet data must be of the the following format:
  ws = { 'A1' :  (cell in sheet)      
            { t: 'n',       (value type; n=number, b=boole, s=string)
              v: '1',       (the actual value, date values are since epoch)
              z: '<format>' (any value format, ie for date you may set 'yyyyMMdd')
            }
        }
  */
  function preparedata(){
    var ws = {};
    ws['A1'] = {t:'n', 
              v:'1'};
    
    ws['!ref'] = 'A1:D4'; //Needed
    return ws;
  }
  
  /* Class for holding Excel Workbook data */
  function Workbook() {
	if(!(this instanceof Workbook)) return new Workbook();
	this.SheetNames = [];
	this.Sheets = {};
  }
  
  /* Converting chars to hex for Blob.js*/
  function toHexArray(s) {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i=0; i!=s.length; ++i) 
        view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    }

  /* Where it all happens */ 
  var execute = function(){
    console.log("execute");
    var wb = new Workbook();
    var ws = preparedata();
    var sheet_name = "SheetJS";
    wb.SheetNames.push(sheet_name);
    wb.Sheets[sheet_name] = ws;
    var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:false, type: 'binary'});
    
    saveAs(new Blob([toHexArray(wbout)],{type:"application/octet-stream"}), "sample_file.xlsx")
  }
  
  /* Init Use Case */
  var init = function (element){
    
    /* Add save button to leaflet pop-up */
    var template = Mustache.render(SaveButtonTemplate);
    $(element).append(template);
    
    /* Add listner to save button */
    $("#save-excel-button").on('click', function(){
      execute();
    });
  }
  
  return {
      init: init
    };
  
});