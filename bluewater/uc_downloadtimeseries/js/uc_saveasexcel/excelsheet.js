define([
], function () {

  var moran_text = "Morän grundvattnets fyllnadsgrad %";
  var isalv_text = "Isälvsmatrial grundvattnets fyllnadsgrad %";
  var wscols = [{wch:15},{wch:25},{wch:25},{wch:10}]; 
  
  /* Class for holding Excel Workbook data */
  function Workbook() {
    if(!(this instanceof Workbook)){ 
        return new Workbook();
    }
    this.SheetNames = [];
    this.Sheets = {};
  }
  
  var create_areainfo = function(feature){
    var subbasinarea =  new Number(feature.tags.Shape_Area / 1E6).toLocaleString();
    
    var ws = {};
    ws['A1'] = {t:'s', v:'Modellinformation'};	
    ws['A3'] = {t:'s', v:'HYPE Modelsetup version:'};	ws['B3'] = {t:'s', v:'s-hype2012_version_3_0_0'};
    ws['A4'] = {t:'s', v:'HYPE version:'};				ws['B4'] = {t:'s', v:'HYPE_version_4_10_6'};
    ws['A5'] = {t:'s', v:'Simulation start time:'};		ws['B5'] = {t:'s', v:'1956-01-01'};
    ws['A6'] = {t:'s', v:'SVAR version:'};				ws['B6'] = {t:'s', v:'SVAR_2012_2'};
    
    ws['A9'] = {t:'s', v:'Delavrinningsområdet'};			
    ws['A12'] = {t:'s', v:'Delavrinningsområdets SUBID:'};	ws['B12'] = {t:'s', v:''+feature.tags.SUBIDnew};
    ws['A13'] = {t:'s', v:'Delavrinningsområdets AROID:'};	ws['B13'] = {t:'s', v:feature.tags.AROIDnew};
    ws['A14'] = {t:'s', v:'Delavrinningsområdets namn:'};	ws['B14'] = {t:'s', v:'Modellinformation'};
    ws['A17'] = {t:'s', v:'Area [km2]:'};	ws['B17'] = {t:'s', v:''+subbasinarea};
    
    ws['!ref'] = 'A1:B18'; //Needed for specifying print "area"
    ws['!cols'] = [{wch:30},{wch:30}];
    
    return ws;
  };
  
  var create_reference = function(){
    var ws = {};
    ws['A1'] = {t:'s', v:'Referenser'};
    ws['A3'] = {t:'s', v:'Alla referenser finns samlade i referensguiden:'};
    ws['A4'] = {t:'s', v:'http://www.smhi.se/Professionella-tjanster/Professionella-tjanster/Miljo-och-klimat/Vattenmiljo/referensguide-till-smhi-vattenwebb-1.22742'};
    
    ws['!ref'] = 'A1:A5'; //Needed for specifying print "area"
    ws['!cols'] = [{wch:116}];
    return ws;
  };
  
  var create_datasheet = function(timeserie){
    var ws = {};
    ws['B1'] = {t:'s', v:moran_text};
    ws['C1'] = {t:'s', v:isalv_text};
    var row = 2;
    for (var key in timeserie){
      ws['A'+row] = {t:'s', v:key};
      ws['B'+row] = {t:'s', v:timeserie[key].moran.toFixed(1)};
      ws['C'+row] = {t:'s', v:timeserie[key].isalv.toFixed(1)};
      row++;
    }
    
    ws['!ref'] = 'A1:C'+row; //Needed for specifying print "area"
    ws['!cols'] = wscols;
    
    return ws;
  };
  
  /* Converting chars to hex for Blob.js*/
  function toHexArray(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i=0; i!=s.length; ++i){ 
      view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
  }
  
  var create = function(data, timeserie ){
    console.log("execute");
    
    var wb = new Workbook();
    
    var sheet_1 = "Områdesinformation";
    wb.SheetNames.push(sheet_1);
    wb.Sheets[sheet_1] = create_areainfo(data.basin);
    
    var sheet_2 = "Referenser";
    wb.SheetNames.push(sheet_2);
    wb.Sheets[sheet_2] = create_reference();
    
    var sheet_3 = "Årsvärden";
    wb.SheetNames.push(sheet_3);
    wb.Sheets[sheet_3] = create_datasheet(timeserie.years());
    
    var sheet_4 = "Månadsvärden";
    wb.SheetNames.push(sheet_4);
    wb.Sheets[sheet_4] = create_datasheet(timeserie.months());
    
    var sheet_5 = "Dygnsvärden";
    wb.SheetNames.push(sheet_5);
    wb.Sheets[sheet_5] = create_datasheet(timeserie.days());
    

    var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:false, type: 'binary'});

    var filename = data.id+".xlsx";
    saveAs(new Blob([toHexArray(wbout)],{type:"application/octet-stream"}), filename);
    
  }
  
  return{
    create: create,
  }
  
});