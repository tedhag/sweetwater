require.config({
  paths: {
    'd3': 'lib/d3/d3.min'
  }
});

require(['diagram'
], function (Diagram) {
  Diagram.init();
});