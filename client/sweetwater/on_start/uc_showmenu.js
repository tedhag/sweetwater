define([
  'on_start/cssutil',
  'mustache',
  'text!on_start/showmenu_template.html',
], function (CssUtil,
             Mustache,
             ShowMenuTemplate) {
  
  var init = function (element){
    /* Load menu css */
    CssUtil.load('sweetwater/on_start/showmenu.css');
    
    var template = Mustache.render(ShowMenuTemplate);
    $(element).append(template);
  }
  
  return {
    init: init
  };
  
});