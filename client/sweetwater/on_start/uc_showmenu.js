define([
  'on_start/cssutil',
  'mustache',
  'text!on_start/showmenu_template.html',
], function (CssUtil,
             Mustache,
             ShowMenuTemplate) {
  
  var toggle = function() {
      console.log('toggle');
      var ele = document.getElementById('menu-items');

      if(ele.style.display == "block") {
        ele.style.display = "none";
      }
      else {
        ele.style.display = "block";
      }
	};
  
  var init = function (element){
    /* Load menu css */
    //CssUtil.load('sweetwater/on_start/showmenu.css');
    
    var template = Mustache.render(ShowMenuTemplate);
    $(element).append(template);
    
    /*Prepare more label for action */
    $("#menu-header").on('click', function(e){
        console.log("click");
        toggle();
    });
    
  }
  
  return {
    init: init
  };
  
});