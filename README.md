# sweetwater
Project for playing with leaflet, require, js-xlsx, etc.

The code is orginazied as much as possible into Use Cases.
Some features you may find in this project are:
* Showing an application with a geographical (leaflet) base map and a control box in <code>app/uc_showmap</code>
* Own defined projection for EPSG:3006 (SWEREF99) in <code>app/basemaps</code>
* Downloadning excel file using js-xlsx in <code>app/uc_saveexcelfile</code>
* Importing av file using js-xlsx and customize file upload button in <code>app/uc_importexcelfile</code>
* Searching and finding a lat:lon using geonames in <code>app/uc_searchbyname</code>
* Selecting different base map layer in <code>app/uc_selectbasemap</code>
* Showing a position pop-up on map with a drop-down feature in <code>app/uc_selectpositiononmap</code>
