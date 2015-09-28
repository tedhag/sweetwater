define(['jquery',
        'mustache',
], function ($, Mustache) {
  
    var load = function (url) {
      
      /* Add css-link to head-element */
      var template = 
          Mustache.render('<link type="text/css" rel="stylesheet" href="{{url}}">', {url: url});
      $('head').append(template);
      
    };

    return {
        load: load
    };
});