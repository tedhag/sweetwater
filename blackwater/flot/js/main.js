require.config({
  paths: {
    'jquery': "lib/jquery-2.2.4.min",
    'jquery.flot': 'lib/flot-0.8.3/jquery.flot',
    'jquery.flot.fillbetween': 'lib/flot-0.8.3/jquery.flot.fillbetween',
    'jquery.flot.time': 'lib/flot-0.8.3/jquery.flot.time',
    'jquery.flot.navigate': 'lib/flot-0.8.3/jquery.flot.navigate',
    'moment': 'lib/moment'
  },
   shim: {
    'jquery': {
      exports: '$'
    },
    'jquery.flot': {
      deps: ['jquery'],
      exports: '$.plot'
    },
    'jquery.flot.fillbetween': {
      deps: ['jquery.flot']
    },
    'jquery.flot.time': {
      deps: ['jquery.flot']
    },
    'jquery.flot.navigate': {
      deps: ['jquery.flot']
    }
  }
});

require(['diagram'
], function (Diagram) {
   
  Diagram.init();
    
});