define([
  'jquery',
  'mustache',
  'leaflet',
  'text!uc_showmap/control_box_template.html',
  'uc_importexcelfile/uc_importexcelfile',
  'uc_searchbyname/uc_searchbyname',
  'uc_selectbasemap/uc_selectbasemap',
  'uc_selectfeaturelayer/uc_selectfeaturelayer'
], function ( $,
              Mustache,
              L,
              ControlBoxTemplate,
              UC_ImportExcelFile,
              UC_SearchByName,
              UC_SelectBasemap,
              UC_SelectFeatureLayer) {
  
  var ControlBox = L.Control.extend({
    options: {
        position: 'topright'
    },

    onAdd: function (map) {
      // create the control container with a particular class name
      var container = L.DomUtil.create('div', 'my-control');
      // Prevent further event propagation, ie. no click events behind the control-box
      L.DomEvent.disableClickPropagation(container);
      
      var control_box = Mustache.render(ControlBoxTemplate);
      container.innerHTML = control_box;
      
      return container;
    }
  });
  
  var init = function (map){
    map.addControl( new ControlBox() );
    
    /* Load the import-excel Use Case */
    UC_ImportExcelFile.init('#control-box', map);
    
    /* Load the search by name Use Case */
    UC_SearchByName.init('#control-box', map);
    
    /* Load the change base map Use Case */
    UC_SelectBasemap.init('#control-box', map);
    
    /* Load the view feature layer Use Case */
    UC_SelectFeatureLayer.init('#control-box', map);
  };
  
  return {
        init: init
    };
  
});