define(['jquery',
        'mustache',
        'text!../../page_header/page_header_template.html'
], function ($ , Mustache, PageHeaderTemplate) {
  
    /*Inject the menu header */
    var init = function (fn) {
      var template = Mustache.render(PageHeaderTemplate);
      $('header').append(template);
      
      $(".menu").on('click', function(e){
        $(".dropdown-menu").css({ visibility: "visible", opacity: 1});
      });
      
      $(".close-menu").on('click', function(e){
        var styles = {
          visibility: "hidden",
          opacity: 0
        }
        $(".dropdown-menu").css(styles);
      });
      
      fn();
    };
  
    return {
        init: init
    };
  
});