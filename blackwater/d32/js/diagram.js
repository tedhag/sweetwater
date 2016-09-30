define([
  'd3'
], function(d3){
  
  var init = function (){
    
    //var data = [4, 8, 25, 16, 23, 42];
    
    var data = d3.range(1,51);
    
    var x = d3.scaleLinear().domain([0, d3.max(data)]).range([0, 80]);
    var y = d3.scaleLinear().domain([0, d3.max(data)]).range([20,70]);
    
    function update(indata){
      
      var bar = d3.select(".diagram").selectAll("div").data(indata)
        .style("width", function(d) { return x(d) + "%"; })
        .style("height", function(d) { return y(d) + "px"; })
        .style("font-size", function(d) { return y(d)-5 + "px"; })
        .style("background-color",function(d) {
          var red = (d*5);
          var green = (d*5);
          var blue = (d*2);
          return "rgb(" +red+","+green+","+blue+")"; 
        })
        .text(function(d) { return d; });
      
      bar.enter().append("div");
      
      bar.exit().remove();
      
    }
    
    update(d3.shuffle(data).slice(0, 8).sort());
    
    d3.interval(function(){
      update(d3.shuffle(data).slice(0, 8).sort())
    }, 1000);
   
  };
  
  return{
    init:init
  };
});