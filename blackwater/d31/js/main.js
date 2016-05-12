require.config({
  paths: {
    'd3': '//d3js.org/d3.v3.min'
  }
});

require(['diagram'
], function (Diagram) {
   
  Diagram.init();
    
});