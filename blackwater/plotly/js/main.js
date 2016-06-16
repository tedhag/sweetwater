require.config({
  paths: {
    'd3': 'lib/d3.min',
    'plotly': 'lib/plotly-latest.min',
    'jquery': 'lib/jquery-2.2.4.min',
    'moment': 'lib/moment'
  },

  shim: {
    plotly: {
      deps: ['d3', 'jquery'],
      exports: 'plotly'
    }
  }
  
});

require(['diagram'
], function (Diagram) {
   
  Diagram.init();
    
});