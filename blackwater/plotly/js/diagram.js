define(['moment', 'jquery', 'plotly'], 
function(moment, $, Plotly){
      
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
    var trace1 = {
      x: ['2016-01-01', '2016-01-02', '2016-01-03', '2016-01-04'],
      y: [0, 2, 3, 5],
      fill: 'tozeroy',
      type: 'scatter'
    };

    var trace2 = {
      x: ['2016-01-02', '2016-01-03', '2016-01-04', '2016-01-05'],
      y: [3, 5, 6, 3],
      fill: 'tozeroy',
      type: 'scatter'
    };

    var layout = {
      title: 'Simple line chart',
      xaxis: {
        tickformat: '%m-%d'
      }
    };
    
    var data = [trace2, trace1];

    Plotly.newPlot('diagram', data, layout);
    
  };
  
  return {
    init: init
  }
});