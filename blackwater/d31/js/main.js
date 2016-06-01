require.config({
  paths: {
    'jquery': "lib/jquery-2.2.4.min",
    'bootstrap': "lib/bootstrap.min",  
    'd3': '//d3js.org/d3.v3.min'
  },
  shim: {
    'bootstrap': {deps: ['jquery'], exports:"$"}
  }
});

require(['diagram'
], function (Diagram) {
   
  Diagram.init();
    
});