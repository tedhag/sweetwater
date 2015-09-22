# sweetwater
Project for playing with leaflet, require, js-xlsx, etc.

The code is orginazied as much as possible into Use Cases.
Some features you may find in this project are:
* Showing an application with a geographical (leaflet) base map and a control box in app/uc_showmap
* Own defined projection for EPSG:3006 (SWEREF99) in directory app/basemaps.
* Downloadning excel file using js-xlsx in app/uc_saveexcelfile.
* Importing av file using js-xlsx and customize file upload button in app/uc_importexcelfile
* Searching and finding a lat:lon using geonames in app/uc_searchbyname
* Selecting different base map layer in app/uc_selectbasemap
* Showing a position pop-up on map with a drop-down feature in app/uc_selectpositiononmap
