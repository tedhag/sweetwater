define(['jquery',
        'mustache',
        'text!css_link_template.html',
], function ($, Mustache, LinkTemplate) {
  
    var load = function (url) {
      
      /* Add css-link to head-element */
      var template = Mustache.render(LinkTemplate, {url: url});
      $('head').append(template);
      
      /*
      var link = document.createElement("link");
      link.type = "text/css";
      link.rel = "stylesheet";
      link.href = url;
      document.getElementsByTagName("head")[0].appendChild(link);
      */
    };

    return {
        load: load
    };
});