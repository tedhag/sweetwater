
var width = 420,
    barHeight = 20;

var x = d3.scaleLinear()
    .range([0, width]);



//SVG Chart
d3.tsv("js/data.txt",type, function(error, data) {
  x.domain([0, d3.max(data, function(d) { return d.value; })]);

var chart = d3.select(".svgchart")
    .attr("width", width);


var bar = chart.selectAll("g")
    .data(data)
  .enter().append("g")
    .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

bar.append("rect")
    .attr("width", function(d) { return x(d.value); })
    .attr("height", barHeight - 1);

bar.append("text")
    .attr("x", function(d) { return x(d.value) - 3; })
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .text(function(d) { return d.value; });
});

function type(d) {
  d.value = +d.value; // coerce to number
  return d;
}