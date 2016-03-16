define([
], function () {

  var dayserie = [];
  var monthserie = [];
  var yearserie = [];
  
  var parse = function(data_serie){
    
    data_serie = $.trim(data_serie);
    /* get all rows */
    var rows = data_serie.split("\n");

    
    var year_curr = 1961;
    var yearsum_isalv = 0;
    var yearsum_moran = 0;
    var yeardays = 0;
    
    var month_curr = "01";
    var monthsum_isalv = 0;
    var monthsum_moran = 0;
    var monthdays = 0;
    
    for (var i in rows){
      if (/^\d{4}/.test(rows[i])){
        dayvalues = rows[i].split("\t");
        
        var date = dayvalues[0];
        var day_isalv = parseInt(dayvalues[1]);
        var day_moran = parseInt(dayvalues[2]);
        
        dayserie[date] = {};
        dayserie[date].isalv = day_isalv;
        dayserie[date].moran = day_moran;
        
        var year = parseInt(date.substr(0,4));
        var month = date.substr(5,2);
        
        /* collect month values *********** */
        if (month != month_curr){
          var year_month = year_curr+"-"+month_curr;
          monthserie[year_month] = {};
          monthserie[year_month].isalv = monthsum_isalv/monthdays; 
          monthserie[year_month].moran = monthsum_moran/monthdays;
          
          monthdays = 0;
          monthsum_moran = 0;
          monthsum_isalv=0;
          month_curr = month;
        }
        
        monthsum_isalv += day_isalv;
        monthsum_moran += day_moran;
        monthdays++;
        
        /* collect yearly values ********** */
        if(year > year_curr) {
          yearserie[year_curr] = {};
          yearserie[year_curr].isalv = yearsum_isalv/yeardays; 
          yearserie[year_curr].moran = yearsum_moran/yeardays;
          
          yeardays = 0;
          yearsum_moran = 0;
          yearsum_isalv=0;
          year_curr = year;
        }

        yearsum_isalv += day_isalv;
        yearsum_moran += day_moran;
        yeardays++;
        
        /* ...and adding the last values ** */
        if(date==="2014-12-31"){
          yearserie[year_curr] = {};
          yearserie[year_curr].isalv = yearsum_isalv/yeardays; 
          yearserie[year_curr].moran = yearsum_moran/yeardays;
          
          var year_month = year_curr+"-"+month_curr;
          monthserie[year_month] = {};
          monthserie[year_month].isalv = monthsum_isalv/monthdays; 
          monthserie[year_month].moran = monthsum_moran/monthdays;
        }
      }
    }
  }
  
  var years = function(){
    return yearserie;
  };
  
  var months = function(){
    return monthserie;
  };
  
  var days = function(){
    return dayserie;
  };
  
  return{
    parse: parse,
    years: years,
    months : months,
    days: days
  }
  
});