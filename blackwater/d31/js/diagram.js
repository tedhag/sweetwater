define([
  'd3'
], function(d3){
  
  
  var init = function (){
    console.log("d31");
    
    var width = 960;
    var height = 500;
    
    //Define chart area
    var svg = d3.select(".diagram")
    .append("svg")
    .attr("width", "40em")
    .attr("height", "40em")
    .append("g")
    .attr("transform", "translate(20,20)");

    
    var parseDate = d3.time.format("%m-%d").parse,
        formatPercent = d3.format(".0%");

    var x = d3.time.scale()
      .range([0, width]);

    var y = d3.scale.linear()
      .range([height, 0]);

    var color = d3.scale.category20();

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");
    
    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(formatPercent);

    var area = d3.svg.area()
      .x(function(d) { return x(d.date); })
      .y0(function(d) { return y(d.y0); })
      .y1(function(d) { return y(d.y0 + d.y); });

    var stack = d3.layout.stack()
      .values(function(d) { return d.values; });

    
    d3.tsv("data.tsv", function(error, data) {
      if (error) throw error;

      color.domain(d3.keys(data[0]).filter(function(key) { return key !== "DATE"; }));

      data.forEach(function(d) {
        d.date = parseDate(d.DATE);
      });

      var browsers = stack(color.domain().map(function(name) {
        return {
            name: name,
            values: data.map(function(d) {
            return {date: d.date, y: d[name] / 100};
          })
        };
      }));

      x.domain(d3.extent(data, function(d) { return d.date; }));

      var browser = svg.selectAll(".browser")
        .data(browsers)
        .enter().append("g")
        .attr("class", "browser");

      browser.append("path")
        .attr("class", "area")
        .attr("d", function(d) { return area(d.values); })
        .style("fill", function(d) { return color(d.name); });

      browser.append("text")
        .datum(function(d) { 
          return {name: d.name, value: d.values[d.values.length - 1]}; 
        })
        .attr("transform", function(d) { 
          return "translate(" + x(d.value.date) + "," + y(d.value.y0 + d.value.y / 2) + ")"; 
        })
        .attr("x", -6)
        .attr("dy", ".35em")
        .text(function(d) { 
          return d.name; 
        });

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);
    });
    
  };
  
  return{
    init:init
  }
});