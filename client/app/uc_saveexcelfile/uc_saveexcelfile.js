define([
  'jquery'
], function ($) {
  
  var init = function (element){
    
    console.log("init on element "+element);
    
    $("#downloadButton").on('click', function(){
      console.log("clickeity click");
    });
    
    console.log("init end ");
  }
  
  var 
  
  return {
      init: init
    };
  
});