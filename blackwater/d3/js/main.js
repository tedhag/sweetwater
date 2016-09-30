require.config({
  paths: {
    'd3': '//d3js.org/d3.v4.min'
  }
});

require(['diagram'
], function (Diagram) {
   
  Diagram.init();
    
});