define(['moment', 'jquery', 'jquery.flot', 'jquery.flot.fillbetween', 'jquery.flot.time', 'jquery.flot.navigate'], 
function(moment, $){
  
  var start_date = null;
  
  var get_today = function(){
    var now = moment();
    var day = now.date();
    var month = now.month();
    var year = now.year();
    
    var today = moment({ year:year, month:month, day:day });
    
    return today;
  }
  
  var draw = function(filldegree){
    
    var dataset = [
      { data: filldegree["forecast"], lines: { show: true }, color: "rgb(0, 0, 0)" },
      { data: filldegree["hindcast"], lines: { show: true }, color: "rgb(0, 0, 0)" },
      { id: "f15%", data: filldegree["p15"], lines: { show: true, lineWidth: 0, fill: 0.6 }, color: "rgb(255,50,50)" },
      { id: "f40%", data: filldegree["p40"], lines: { show: true, lineWidth: 0, fill: 0.6 }, color: "rgb(255, 239, 50)", fillBetween: "f15%" },
      { id: "f60%", data: filldegree["p60"], lines: { show: true, lineWidth: 0, fill: 0.6 }, color: "rgb(50, 255, 66)", fillBetween: "f40%" },
      { id: "f85%", data: filldegree["p85"], lines: { show: true, lineWidth: 0, fill: 0.6 }, color: "rgb(50, 239, 255)", fillBetween: "f60%" },
      { id: "f100%", data: filldegree["p100"], lines: { show: true, lineWidth: 0, fill: 0.6 }, color: "rgb(0, 126, 219)", fillBetween: "f85%" }
    ];
    
    var today = get_today().unix()*1000;
    var diagram = $.plot($(".diagram"), dataset, {
      xaxis: {
        mode: "time",
        timeformat: "%m-%d",
        ticks: 12,
        panRange: [filldegree.p15[0][0], filldegree.p15[filldegree.p15.length-1][0]]
      },
      yaxis: {
        max: 100,
        tickFormatter: function (v) {
            return v + " %";
        },
        panRange: [0, 100]
      },
      grid: {
        //hoverable: true,
        markings: [{ xaxis: { from: today, to: today }, color: 'rgb(255, 0, 0)' }]
      },
      zoom: {
        interactive: true
      },
      pan: {
        interactive: true
      }
      /*legend: {
        position: "se"
      }*/
    });
    
    $(window).on('resize', function(e){
      diagram.resize();
      diagram.setupGrid();
      diagram.draw();
    });
  };
  
  var set_startdate = function(date){
    var now = moment();
    var month = now.month()+1;//moment counts from 0-11
    var year = now.year();
    
    var start = date.split("-");
    var start_month = parseInt(start[0]);
    
    if (start_month>month){
      start_date = moment(year-1+"-"+date);
    }
    else{
      start_date = moment(year+"-"+date);
    }
  };
  
  
  var percentiledata = function(dfd){
    var url = "js/data.tsv";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
        var percentile = xmlhttp.responseText;
        var rows = percentile.split('\n');
        
        var data = { series: {"p15": [],
                              "p40": [],
                              "p60": [],
                              "p85": [],
                              "p100": []}};
        
        rows.forEach(function(row){
          
          if (/^MIN/.test(row)){
            var rowdata = row.split('\t');
            data.min = rowdata[0].split(':')[1];
            data.max = rowdata[1].split(':')[1];
          }
          
          if (/^\d{2}-\d{2}/.test(row)){
            var rowdata = row.split('\t');
            
            data.date = rowdata[0];
            if (start_date==null){
              set_startdate(data.date);
            }
            else{
              start_date.add(1, 'days');
            }
            console.log(start_date.format());
            
            var epoch = start_date.unix()*1000;
            data.series.p15.push([epoch, parseFloat(rowdata[1])]);
            data.series.p40.push([epoch, parseFloat(rowdata[2])]);
            data.series.p60.push([epoch, parseFloat(rowdata[3])]);
            data.series.p85.push([epoch, parseFloat(rowdata[4])]);
            data.series.p100.push([epoch, 100]);
          }
          
        });
        
        dfd.resolve(data);
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }
  
  var forecastdata = function(dfd){
    var url = "js/forecast.tsv";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
        var forecast = xmlhttp.responseText;
        var rows = forecast.split('\n');
        
        var data = [];
        rows.forEach(function(row){
          
          var rowdata = row.split('\t');
          var date = moment(rowdata[0]);
          var value = rowdata[1];
          data.push([date.unix()*1000, parseFloat(value)]);
        });
        
        dfd.resolve(data);
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }
  
  var hindcastdata = function(dfd){
    var url = "js/hindcast.tsv";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
        var hindcast = xmlhttp.responseText;
        var rows = hindcast.split('\n');
        
        var data = [];
        rows.forEach(function(row){
          
          var rowdata = row.split('\t');
          var date = moment(rowdata[0]);
          var value = rowdata[1];
          data.push([date.unix()*1000, parseFloat(value)]);
        });
        
        dfd.resolve(data);
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }
  
  var filldegree = function(value, min, max){
	  var filldegree = null;
	  
    if (min===max && value!==min){
      filldegree = ((value-min)/min)*-100;
    }
    else if (min===max && value===min){
			filldegree=100.0;
    }
    else{
        filldegree = (1-(max-value)/(max-min))*100;
    }
    
    return Math.round(filldegree*10)/10;
    
  }
  
  var init = function(){
    console.log($.plot);
    
    var percentileDfd = $.Deferred();
    var forecastDfd = $.Deferred();
    var hindcastDfd = $.Deferred();
      
    percentiledata(percentileDfd);
    forecastdata(forecastDfd);
    hindcastdata(hindcastDfd);
    
    $.when(percentileDfd, forecastDfd, hindcastDfd)
    .done(function(data, forecast, hindcast){
      data.series.forecast = forecast;
      data.series.hindcast = hindcast;
      
      $.each(data.series, function(key, serie){
        serie.forEach(function(d){
          d[1] = filldegree(d[1], data.min, data.max);
        });
      })
      
      draw(data.series);  
    });
    
  };
  
  return {
    init: init
  }
});