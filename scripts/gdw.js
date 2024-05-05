//define namespace for the application
window.app = {
    // track what tile data is underneath everything apart from layers added through addLayers
    maptiles : [],
    
    // the local data for temperature / salinity / etc
    mapdata : [],
    
    // feature layers on top of everything
    mapoverlay : [],
    
    // array that tracks what is being displayed; osm, temp and/or salinity
    visibleData : []
};
var app = window.app;

//create custom controls for document window
//Animation button and image
app.intervalId = 0;
app.buttonanimation = function(opt_options) {
    var options = opt_options || {};
    var image = document.createElement('span');//create image element
    image.id = 'animation-button';
    image.className = 'glyphicon glyphicon-play';
    var button = document.createElement('button');//create button element 
    button.id = 'button-animation';
    button.title = "Animate Data";
    button.appendChild(image);//append the image to the button
    var element = document.createElement('div');//create div so you can assign a class and css
    element.className = 'gdw-animation ol-unselectable ol-control';
    element.appendChild(button);

    //Animate Data event listener
    var handleclick = function(e) {
        $(this).blur();  //trigger event programmatically (manually)
        var src = $("#animation-img").attr("src");
        var animationAction = 'animate';
    	$(document).off('mousemove', handleMouseMove);// disable mouseover event - reading of pixel data
        if ( image.className == 'glyphicon glyphicon-stop') {//if stop animation
        	image.className = 'glyphicon glyphicon-play';
            window.clearTimeout(app.intervalId);//prevents setTimeout() function from executing
            app.midTreeUpdate = false;// enable the changing of layers now that animation is complete
            fixNodeSelection();
        	$(document).on('mousemove', handleMouseMove);// re-enable mouseover event
        }
        else {//start animation       	
            animationFunction(animationAction);
            image.className = 'glyphicon glyphicon-stop';
        }
        $("#animation-img").attr("src", src);
    };
    button.addEventListener('click', handleclick, false);
    button.addEventListener('touchstart', handleclick, false);
    //openLayers 3 API for Animate Data button
    ol.control.Control.call(this, {
        element: element,
        target: options.target
    });
};//end of button animation function
//assigns custom control to Animate Data button
ol.inherits(app.buttonanimation, ol.control.Control);

//Animate Forward button and image
app.buttonforward = function(opt_options) {
    var options = opt_options || {};
    var image = document.createElement('span');//create image element
    image.id = 'animation-forward-button';
    image.className = 'glyphicon glyphicon-forward';
    var button = document.createElement('button');//create button element 
    button.id = 'button-forward-animation';
    button.title = "Forward One Day";
    button.appendChild(image);//append the image to the button
    var element = document.createElement('div');//create div so you can assign a class and css
    element.className = 'gdw-animation-forward ol-unselectable ol-control';
    element.appendChild(button);

    //Animate Forward Data event listener
    var handleclick = function(e) {
        $(this).blur();  //trigger event programmatically (manually)
        var animationAction = "forward";
        var src = $("#animation-forward-button").attr("src");
    	$(document).off('mousemove', handleMouseMove);// disable mouseover event - reading of pixel data          	
        animationFunction(animationAction);
        $("#animation-forward-button").attr("src", src);
    	$(document).on('mousemove', handleMouseMove);// re-enable mouseover event
    };
    button.addEventListener('click', handleclick, false);
    button.addEventListener('touchstart', handleclick, false);
    //openLayers 3 API for Animate Forward Data button
    ol.control.Control.call(this, {
        element: element,
        target: options.target
    });
};//end of button animate forward function
//assigns custom control to Animate Forward Data button
ol.inherits(app.buttonforward, ol.control.Control);

//Animate Backward button and image
app.buttonbackward = function(opt_options) {
    var options = opt_options || {};
    var image = document.createElement('span');//create image element
    image.id = 'animation-backward-button';
    image.className = 'glyphicon glyphicon-backward';
    var button = document.createElement('button');//create button element 
    button.id = 'button-backward-animation';
    button.title = "Backwards One Day";
    button.appendChild(image);//append the image to the button
    var element = document.createElement('div');//create div so you can assign a class and css
    element.className = 'gdw-animation-backward ol-unselectable ol-control';
    element.appendChild(button);

    //Animate Backward Data event listener
    var handleclick = function(e) {
        $(this).blur();  //trigger event programmatically (manually)
        var src = $("#animation-backward-button").attr("src");
        var animationAction = 'backward';
    	$(document).off('mousemove', handleMouseMove);// disable mouseover event - reading of pixel data            	
        animationFunction(animationAction);
        $("#animation-backward-button").attr("src", src);
    	$(document).on('mousemove', handleMouseMove);// re-enable mouseover event
    };
    
    button.addEventListener('click', handleclick, false);
    button.addEventListener('touchstart', handleclick, false);
    //openLayers 3 API for Animate Backward Data button
    ol.control.Control.call(this, {
        element: element,
        target: options.target
    });
};//end of button animate forward function
//assigns custom control to Animate Backward Data button
ol.inherits(app.buttonbackward, ol.control.Control);

//Download Dataset button
app.buttondownload = function(opt_options) {
    var options = opt_options || {};
    var image = document.createElement('span');
    image.id = 'download-button';
    image.className = 'glyphicon glyphicon-download-alt';
    var button = document.createElement('button');
    button.id = 'button-download';
    button.title = 'Download Dataset';
    button.appendChild(image);
    var handleclick = function(e) {
        $(this).blur();        
        // get the selected depth
       	var displayedValue = document.getElementById("depth");
    	var downloadDepth = Number(displayedValue.value);
    	
    	// get current area
    	var downloadArea = app.squareextent;
    	
    	// get start date from navigation bar
	    var chart = $('#dateslider').highcharts();
    	var dateSliderStartDate = new Date(chart.scroller.xAxis.toValue(chart.scroller.zoomedMin));
        var tempStartDate = dateSliderStartDate.setHours(0,0,0,0);
        var downloadDate = new Date(tempStartDate + (1000*60*60*24));
        
        console.log("depth " + downloadDepth + " area " + downloadArea + " date " + downloadDate);
    	
        $("body").append("<iframe src='test.zip' style='display: none;' ></iframe>");
    };
    button.addEventListener('click', handleclick, false);
    button.addEventListener('touchstart', handleclick, false);
    var element = document.createElement('div');
    element.className = 'gdw-download ol-unselectable ol-control';
    element.appendChild(button);
    ol.control.Control.call(this, {
        element: element,
        target: options.target
    });
};
//assign ol control to Download Dataset button
ol.inherits(app.buttondownload, ol.control.Control);

//Create vertical graph button
app.buttongraph = function(opt_options) {
   var options = opt_options || {};
   var image = document.createElement('img');
   var button = document.createElement('button');
   button.innerHTML="V";
   button.id = 'button-graph';
   button.title = 'Create Vertical Graph';
   button.appendChild(image);
	var handleclick = function(e) {

		$(this).blur();
        $(this).css({"border-color":"#476FC4","border-width":"3px", "border-style":"solid"});
		
		$(document).off('mousemove', handleMouseMove);
		
		var createGraph = app.map.on('click', function(evt) {
					    
		    var selected = $('#milOc-layer-tree').jstree(true).get_selected();
		    
		    if(selected!='miloclt-currents'){//cannot draw vertical profile for currents
			
	         	//default to start date on dateslider only
				//note that date will be in milliseconds
			    var chart = $('#dateslider').highcharts();
	            var dateSliderStartDate = new Date(chart.scroller.xAxis.toValue(chart.scroller.zoomedMin));
	            var depthStartDate = dateSliderStartDate.setHours(0,0,0,0);// remove time element from start date - left date boundary
	            var depthStopDate = depthStartDate + (1000*60*60*24);//right date boundary because date in milliseconds
	            
	            var matchingLayers = [];
	
	            var selected = $('#milOc-layer-tree').jstree(true).get_selected();
	        	if(selected=='miloclt-vosaline'){// the only other valid selection
	        		datatypeSelected = 'vosaline';
	        	}else {// default to temperature if multiple layers showing
	        		datatypeSelected='votemper';
	        	}
	        	
	            //find all layers that match the search criteria
	            for ( var i=0 ; i < app.layers.length ; ++i ) {
	                // check to see if it matches our required data
	                if ( app.layers[i].date >= depthStartDate  &&
	                	 app.layers[i].date < depthStopDate  &&
	                	 app.layers[i].source == "3D" &&
	                     app.layers[i].datatype == datatypeSelected ) {
	                	matchingLayers.push(app.layers[i]);
	                 }
	            }
	
	            // sort list shallowest to deepest
	            matchingLayers.sort( function( a, b ) {
	                // temperature / salinity / etc
	                if ( a.depth > b.depth ) return 1;
	                if ( a.depth < b.depth ) return -1;
	                return 0;
	            });
	            
	            //extract names to send to the ajax get
	            var depthLayers = [];
	            for(i=0; i<matchingLayers.length; i++){
	            	depthLayers[i] = matchingLayers[i].name;
	            }
	            
			var url1 = "http://localhost:8080/geoserver/wms" 
		          + "?REQUEST=GetFeatureInfo"
		          + "&BBOX=" + app.map.getView().calculateExtent(app.map.getSize())
		          + "&VERSION=1.1.0"
		          + "&X="+ evt.pixel[0]
		          + "&Y="+ evt.pixel[1]
		          + "&INFO_FORMAT=text/javascript"
		          + "&QUERY_LAYERS="+ depthLayers
		          + "&LAYERS="+ depthLayers //refers to text/html selection; has to be set or errors are thrown
		          + "&FEATURE_COUNT=50"
		          + "&SRS=EPSG:3857" 
		          + "&STYLES="
		          + "&WIDTH=" + app.map.getSize()[0]
		          + "&HEIGHT=" + app.map.getSize()[1];
			
			$.ajax({
	              type: "GET",
	              url: url1,
	              jsonpCallback: 'parseResponse',//this part necessary or else errors are generated
	              dataType: "jsonp",
	              success: function(data){
	  		        
	            	//only proceed if the user hasn't selected a location over land
			        if(data.features[0].properties.GRAY_INDEX<50){// check to make sure top layer is not land
			        	var grayIndex = [];
		  		        var len = data.features.length;
			        	for (i=0; i< len; i++) {
		  		     	   	grayIndex[i]=data.features[i].properties.GRAY_INDEX;
		  		        }
			        	createVerticalGraph(evt, grayIndex);
			        } else {//user has selected a location over land
						alert('You have selected an invalid location.  Please select a location over water.');
		        	}
	              }
	         	});//end ajax
	     				
	        app.map.unByKey(createGraph);//this kills the click event so it's executed only once
	       
			$(document).on('mousemove', handleMouseMove);//enable mousemove
		
		    $("#button-graph").css({"border-style":"none"});

		    }
		});  //end createGraph
          		
	 };// end handleclick
	 
	 button.addEventListener('click', handleclick, false);
	 button.addEventListener('touchstart', handleclick, false);
     var element = document.createElement('div');
     element.className = 'gdw-graph ol-unselectable ol-control';
     element.appendChild(button);
	 ol.control.Control.call(this, {
		    element: element,
		    target: options.target
    });
};
//assign ol control to vertical draft button
ol.inherits(app.buttongraph, ol.control.Control);

//vertical graph
function createVerticalGraph(evt, graphValues) {
	
    var chart = $('#dateslider').highcharts();
    var dateSliderStartDate = new Date(chart.scroller.xAxis.toValue(chart.scroller.zoomedMin));
	var len = graphValues.length;
    var validTempValues = [];
    
    var selected = $('#milOc-layer-tree').jstree(true).get_selected();
	if(selected=='miloclt-vosaline'){
		var graphTitle = 'Vertical Salinity Profile';
		var symbol = '‰';
		var seriesName = 'Salinity';
	}else {
		var graphTitle = 'Vertical Temperature Profile';
		var symbol = '°C';
		var seriesName = 'Temperature';
	}
	
    //Mercator sets pixel values for depths that exceed the charted depth to very large numbers
    //create array with valid temps only
    for (i=0;i<len;i++){
    	if(graphValues[i]<50){
    		validTempValues.push(graphValues[i]);
    	}
    }
    
    len=validTempValues.length;
    
    var depths = [0.49, 1.54, 2.65, 3.82, 5.08, 6.44, 7.93, 9.57, 11.41, 13.47, 15.81, 18.50, 21.60, 25.21, 29.44, 34.43, 40.34, 47.37, 55.76, 65.81, 77.85, 92.33, 109.73, 130.67, 155.85, 186.13, 222.48, 266.04, 318.13, 380.21, 453.94, 541.09, 643.57, 763.33, 902.34, 1062.44, 1245.29, 1452.25, 1684.28, 1941.89, 2225.08, 2533.34, 2865.70, 3220.82, 3597.03, 3992.48, 4405.22, 4833.29, 5274.78, 5727.92];// using this for categories as its easier - for now
    var validDepths = depths.slice(0,len);//only display depths for which there are valid temps
    
    var coordinate = evt.coordinate;
    var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
        coordinate, 'EPSG:3857', 'EPSG:4326'));

    content.innerHTML = "<div id='verticalGraph'></div>";
    verticalGraphOverlay.setPosition(coordinate);
	
    var date = dateSliderStartDate.getDate();
	var month = changeMonthFormat(dateSliderStartDate.getMonth());
	var year = dateSliderStartDate.getFullYear();
	
	concatDate = date + " " + month + " " + year;

	 var verticalProfile = $('#verticalGraph').highcharts({
        chart: {
            type: 'spline',
            inverted: true
        },
        title: {
            text: graphTitle
        },
        subtitle: {
            text: 'Date - ' + concatDate
        },
        xAxis: {
            reversed: true,
            opposite: true,
            title: {
                enabled: true,
                text: 'Depth'
            },
            labels: {
                formatter: function () {
                    return this.value + 'm';
                }
            },
            maxPadding: 0.05,
            showLastLabel: true,
			categories: validDepths
        },
        yAxis: {
        	opposite: true,
            title: {
                text: seriesName
            },
            labels: {
                formatter: function () {
                    return this.value + symbol;
                }
            },
            lineWidth: 2
        },
        legend: {
            enabled: false
        },
        tooltip: {
            headerFormat: '<b>{series.name}</b><br/>',
            pointFormat: '{point.y}' + symbol,
            valueDecimals: 2
        },
        plotOptions: {
            spline: {
                marker: {
                    enable: false
                }
            }
        },
        series: [{
            name: seriesName,
            data: validTempValues
        }]
    });//end verticalProfile variable
}//end createVerticalGraph

//Elements that make up vertical graph popup
var verticalGraph = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

// Add a click handler to hide the vertical graph popup
closer.onclick = function() {
    verticalGraphOverlay.setPosition(undefined);
    closer.blur();
    return false;
};

// create vertical graph overlay
var verticalGraphOverlay = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
    element: verticalGraph,
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
}));

//ol API - draw vector box
app.rectInteraction = new ol.interaction.DragBox({
    condition: ol.events.condition.noModifierKeys,
    style: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: [0, 0, 255, 1]
        })
    })
});

//attach event handler function on drag box end
app.rectInteraction.on('boxend', function(e) {
    // features that intersect the box are added to the collection of
    // selected features, and their names are displayed in the "info"
    // div
    app.map.removeInteraction(this);
    $("#map").css("cursor", "auto");
    //var extent = rectInteraction.getGeometry().getExtent();
    $("#button-select-rectangle").css({"border-style":"none"});

    // get the new app.squareextent area
    app.squareextent = app.rectInteraction.getGeometry().getExtent();
   
    //reset extent for all layers
    for(i=0 ; i < app.mapdata.length ; ++i ) {
        var layer = app.map.getLayers().item(i+app.maptiles.length+1);
        layer.setExtent(app.squareextent);
    }
    
    //set date overlay coordinate
    setOverlayCoordinate();
    
});//end of rectInteraction event handler function

//Draw Rectangle button
app.buttonselectrectangle = function(opt_options) {
    var options = opt_options || {};
    var image = document.createElement('span');
    image.id = 'rectangle-button';
    image.className = 'glyphicon glyphicon-unchecked';
    var button = document.createElement('button');
    button.id = 'button-select-rectangle';
    button.title = 'Rectangular Location';
    button.appendChild(image);
    var element = document.createElement('div');
    element.className = 'gdw-rectangle ol-unselectable ol-control';
    element.appendChild(button);
    var handleclick = function(e) {
        $(this).blur();
        // add interaction and watch for click / drags on the map UI
        app.map.addInteraction( app.rectInteraction );
        $("#map").css("cursor", "crosshair");
        $(this).css({"border-color":"#476FC4","border-width":"3px", "border-style":"solid"});
    };
    button.addEventListener('click', handleclick, false);
    button.addEventListener('touchstart', handleclick, false);
    ol.control.Control.call(this, {
        element: element,
        target: options.target
    });
};
//assign ol control to Draw Rectangle button
ol.inherits(app.buttonselectrectangle, ol.control.Control);

app.locationLayer = new ol.source.Vector({
    projection: 'EPSG:4326'
});
app.view = new ol.View({
    center: [-3000000, 4000000], // nice map center
    zoom: 3,
    minZoom: 2,
    maxZoom: 13
});

//creation of app.squareextent object
app.squareextent = ol.proj.transformExtent([ -67, 52, -39, 39 ], 'EPSG:4326', 'EPSG:3857');//defined as world mercator; same as map view

//draw map
app.map = new ol.Map({
    layers: [
             // Open Street Map - until we get a local map source
             new ol.layer.Tile({source: new ol.source.OSM()})
             /*
			  //CANMARNET code added by Alicia for ship layer - keep for now
			    new ol.layer.Tile({
			        extent: app.squareextent,
			        source: new ol.source.TileWMS( ({
			          url: 'http://gpw.canmarnet.gc.ca/geoserver/wms',
			          params: {'LAYERS': 'NPRv2:fnKnowns', 'TILED': true },
			          serverType: 'geoserver'
			        })),
			        visible: false
			      }),
			      // vector layer for displaying location polygons
			      new ol.layer.Vector({
			          source: locationLayer,
			      })
              */
             ],
     overlays: [verticalGraphOverlay],
     controls: ol.control.defaults({
         attributionOptions: ({
             collapsible: false
         })
     }).extend([
                new ol.control.ScaleLine({
                    units: 'nautical'
                }),
                new ol.control.ZoomSlider(),
                new ol.control.MousePosition({
                    // put the mouse position in the map
                    coordinateFormat: function(coord) {
                        return ol.coordinate.toStringHDMS(coord);
                    },
                    projection: 'EPSG:4326',
                    className: 'custom-mouse-position',
                    target: document.getElementById('latitude-longitude'),
                    undefinedHTML: '&nbsp;'
                }),
                new app.buttonanimation(),
                new app.buttonbackward(),
                new app.buttonforward(),
                new app.buttondownload(),
                new app.buttonselectrectangle(),
                new app.buttongraph()
                ]),
                view: app.view,
                target: 'map'
});

//create a new date overlay
function createDateOverlay() {
    return new ol.Overlay({
        element: document.getElementById('date-overlay'),
        positioning: 'top-right'
    });
}

//set date overlay coordinate
function setOverlayCoordinate() {
    // Set position
	var topRightCorner = ol.extent.getTopRight(app.squareextent);
    overlay.setPosition(topRightCorner);
    overlay.setOffset([-20,0]);
    // Show overlay    
    $(overlay.getElement()).show(); 
}

//set date overlay date
function setOverlayDate(date) {
	
	if(typeof date==='undefined'){//if no layers are displayed hide the date overlay
		document.getElementById("date-overlay").style.visibility = "hidden";
	} else {
	    var insertText = overlay.getElement();
	    insertText.innerHTML = date;   
	    $(overlay.getElement()).show();
		document.getElementById("date-overlay").style.visibility = "visible";
	}
}// end setOverlayDate function

//creates the initial date overlay which for now is empty
var overlay = createDateOverlay();
app.map.addOverlay(overlay);

//if mouse stops moving report temperature or salinity if within square extent
var timeout = null;
$(document).on('mousemove', handleMouseMove);

function handleMouseMove(evt) {
    clearTimeout(timeout);

    //if mouse pauses for longer than 2 seconds execute this function
    timeout = setTimeout(function() {
		  
		bottomLeftX = app.squareextent[0];
		bottomLeftY = app.squareextent[1];
		topRightX = app.squareextent[2];
		topRightY = app.squareextent[3];
		  
		var eventCoordinate = app.map.getEventCoordinate(evt.originalEvent);
		mouseXCoordinate = eventCoordinate[0];
		mouseYCoordinate = eventCoordinate[1];
		
		if( bottomLeftX <= mouseXCoordinate && mouseXCoordinate <= topRightX && bottomLeftY <= mouseYCoordinate && mouseYCoordinate <= topRightY ) {
		    
		    //default to start date on dateslider only
			//note that date will be in milliseconds
		    var chart = $('#dateslider').highcharts();
            var dateSliderStartDate = new Date(chart.scroller.xAxis.toValue(chart.scroller.zoomedMin));
            var depthStartDate = dateSliderStartDate.setHours(0,0,0,0);// remove time element from start date - left date boundary
            var depthStopDate = depthStartDate + (1000*60*60*24);//right date boundary because date in milliseconds
            
        	var displayedValue = document.getElementById("depth");
        	var selectedDepth = Number(displayedValue.value);
            
            var matchingLayer;
            
        	var selected = $('#milOc-layer-tree').jstree(true).get_selected();
        	if(selected=='miloclt-vosaline'){// only other valid
        		datatypeSelected = 'vosaline';
        	}else if (selected=='miloclt-votemper'){
        		datatypeSelected='votemper';
        	}else if (selected=='miloclt-currents'){
        		datatypeSelected='currents';
        	}
             
           //find the layer that matches the search criteria
            for ( var i=0 ; i < app.layers.length ; ++i ) {
                // check to see if it matches our required data
                if ( app.layers[i].date >= depthStartDate  &&
                	 app.layers[i].date < depthStopDate  &&
                     app.layers[i].depth == selectedDepth &&
                	 app.layers[i].source == "3D" &&
                     app.layers[i].datatype == datatypeSelected ) {
                	matchingLayer = app.layers[i];
                 }
            }
            
            var depthLayer = matchingLayer.name;         
            var depthLocation = app.map.getEventPixel(evt.originalEvent);
            
		    var url1 = "http://localhost:8080/geoserver/wms" 
	          + "?REQUEST=GetFeatureInfo"
	          + "&BBOX=" + app.map.getView().calculateExtent(app.map.getSize())
	          + "&VERSION=1.1.0"
	          + "&X="+ depthLocation[0]
	          + "&Y="+ depthLocation[1]
	          + "&INFO_FORMAT=text/javascript"
	          + "&QUERY_LAYERS="+ depthLayer
	          + "&LAYERS="+ depthLayer //refers to text/html selection; has to be set or errors are thrown
	          + "&FEATURE_COUNT=50"
	          + "&SRS=EPSG:3857" 
	          + "&STYLES="
	          + "&WIDTH=" + app.map.getSize()[0]
	          + "&HEIGHT=" + app.map.getSize()[1];
		
		    $.ajax({
              type: "GET",
              url: url1,
              jsonpCallback: 'parseResponse',//this part necessary or else errors are generated
              dataType: "jsonp",
              success: function(data){
            	//only proceed if the user hasn't selected a location over land
		        if(data.features[0].properties.GRAY_INDEX<50){// check to make sure top layer is not land
		        	var grayIndex=data.features[0].properties.GRAY_INDEX;
		        	createTemperaturePopup(grayIndex);       	
		        } else {//user has selected a location over land
					alert('You have selected an invalid location.  Please select a location over water.');
	        	}
              }
         	});//end ajax
    		    
		    function createTemperaturePopup(temperatureIndex){		    	
		    	var splitData = [];
	            splitData = depthLayer.split("_");
	            datatype = splitData[5];

	            var selected = $('#milOc-layer-tree').jstree(true).get_selected();
	        	if(selected=='miloclt-vosaline'){
	        		var title="Salinity";
	            	var symbol = '‰';
	        	} else {
	        		var title="Temperature";
	            	var symbol = "°C";
	        	}
	            	            
	        	var action = "show";
			    var title = title;
			    var content = temperatureIndex.toFixed(2) + " " + symbol;
			    var locationX = evt.clientX;
			    var locationY = evt.clientY;		
			    mousePopup(action, title, content, locationX, locationY);
			    	
		    }		    
		}
    
    }, 1000 );
    
    var action = "hide";
    mousePopup(action);
}// end mousemove function

//code for mouseove popup
function  mousePopup(action, title, content, locX, locY) {
	if (action == "hide") {
		$('#mouse-popup').css('display', 'none');
	} else {
		$('#mouse-popup').css('display', 'block');
		$('#mouse-popup').css('top', locY);
		$('#mouse-popup').css('left', locX+10);//offset a little to the right from mouse position
		$('#mouse-popup-title').html(title);
		$('#mouse-popup-content').html(content);
	}
}// end mousePopup function

// called from animate data button
var preAnimationNodesSetting=[];// array that will capture current status of nodes; nodes will be reset to this point after animation if something changed

function animationFunction(animationAction){
//function that controls all animation; note that if called from the animation event handler is enters with all layers turned off
//first time enters function with layerOnTop = 0, and the nth layer is OSM

	var timer;
	for(var i=0 ; i < app.mapdata.length; ++i ) {
        app.map.getLayers().item(i + app.maptiles.length + 1).setVisible(false);// except for OSM (1st layer) sets all layer visibility values to false
    }
	
	if(animationAction!='animate'){//forward or backward button
		
		// note that you're going backwards to ascend in dates - layers are loaded from latest in forecast to date of forecast which is on top
		// so you add to go backwards and subtract to go forwards
		// this is all because we start with all layers visible so we need to add them in descending order
		// to have the current layer wind-up on top
		// if statements are in order of priority
		if(layerOnTop==1 && animationAction=='forward'){// at last day so go back to first day
			layerOnTop = app.mapdata.length;
		}else if(layerOnTop==app.mapdata.length && animationAction=='backward'){// at first day so go to last date
			layerOnTop = 1;//go to last layer in stack
		}else if(layerOnTop<=app.mapdata.length && animationAction=='forward'){// at first day or more so subtract one to go to next day
			layerOnTop = layerOnTop - 1;
		}else if(layerOnTop>=1 && animationAction=='backward'){//go backwards so add one
			layerOnTop = layerOnTop + 1;
		}

	    app.map.getLayers().item(layerOnTop).setVisible( true );
	    
	    // set date overlay date
	    setOverlayDate(overlayDates[layerOnTop-1]);
	       
	}else {//animation function
		
		userPreAnimationNodesSetting = $("#user-layer-tree").jstree("get_selected");// user pre-animation selected nodes 
		milocPreAnimationNodesSetting = $("#milOc-layer-tree").jstree("get_selected");// miloc pre-animation selected nodes
		
		app.midTreeUpdate = true;// prevent the changing of layers while animation is running
	      
		//self-invoking function that animates layers until interupted
		(function animateLayers(){
			timer = 500;// wait 0.5 seconds for valid layers only
			
			app.map.getLayers().item(layerOnTop).setVisible( false );
		
			if(layerOnTop==1){// at last day so go back to first day
				layerOnTop = app.mapdata.length;
			}else {// at first day or more so subtract one to go to next day
				layerOnTop = layerOnTop - 1;
			}
			
			app.map.getLayers().item(layerOnTop).setVisible( true );
		    
		    // set date overlay date
		    setOverlayDate(overlayDates[layerOnTop-1]);

			app.intervalId = window.setTimeout(animateLayers, timer);//infinite loop until the user selects stop
		}());//end of self invoking animate layers function
	}
}//end of animationFunction

// function invoked after animation to return node selection to its previous configuration
function fixNodeSelection(){

	var userPostAnimationNodesSetting=$("#user-layer-tree").jstree("get_selected");// post-animation selected nodes 
	var milocPostAnimationNodesSetting=$("#milOc-layer-tree").jstree("get_selected");// post-animation selected nodes 

	var nodesArray=["osm", "votemper", "vosaline", "currents"];
	var nodeSelected;
	
	var userIsEqual = false;
	var milocIsEqual = false;
	
	// check to see if nodes have changed and only take action if they have
	if(JSON.stringify(userPostAnimationNodesSetting) == JSON.stringify(userPreAnimationNodesSetting)){
		userIsEqual = true;
	}
	if(JSON.stringify(milocPostAnimationNodesSetting) == JSON.stringify(milocPreAnimationNodesSetting)){
		milocIsEqual = true;
	}
	console.log(userIsEqual + "   " + milocIsEqual);
	
	if(userIsEqual==false || milocIsEqual == false){
		
		for(j=0;j<nodesArray.length;j++){
	
		    var nodeSelected = false;// assume node is not selected
		
		    for(k=0;k<userPreAnimationNodesSetting.length;k++){
		
		        if("ult-" + nodesArray[j] == userPreAnimationNodesSetting[k]){
		
		          nodeSelected = true;// note that last time through loop changedNodes = true if last item found; therefore nothing has changed
		
		          break;// found a match so break out of loop
		
		        }
		
		    }// end currentNodeStatus loop
	
		    if(nodesArray[j] == "osm"){// still need to account for osm in currentNodeStatus but don't take action
		
		    	app.map.getLayers().item(layerOnTop).setVisible( true );
		    	
		    }
		    
		    updateTrees(nodesArray[j],nodeSelected);// this updates app.visibleDatas which is needed for updateLayerContent
		
		    }// end nodesArray for loop
		  
	  	updateLayerContent();// now update layer content
	}
	
}// end fixNodeSelection function


//self-invoked jQuery function - location selector call to server for locations and positions
// $(function() {
//     $.ajax({
//         url: "/gdwapp/LocationList",
//         dataType: "json",
//         success : function(data) {
//             var mappeddata = $.map(data, function(v,i){
//                 return {
//                     label: v.name,
//                     value: v.name,
//                     category: v.category,
//                     original: v
//                 };
//             });
//             $.widget( "custom.catcomplete", $.ui.autocomplete, {

//                 _create: function() {
//                     this._super();
//                     this.widget().menu( "option", "items", "> :not(.ui-autocomplete-category)" );
//                 },

//                 _renderMenu: function( ul, items ) {

//                     var that = this,
//                     currentCategory = "";

//                     $.each( items, function( index, item ) {
//                         var li;
//                         if ( item.category != currentCategory ) {
//                             ul.append( "<li class='ui-autocomplete-category " + item.category + "'>" + item.category + "</li>" );
//                             currentCategory = item.category;
//                         }

//                         li = that._renderItemData( ul, item );

//                         if ( item.category ) {
//                             li.attr( "aria-label", item.category + " : " + item.label );
//                         }
//                     });
//                 },

//                 _renderItem: function( ul, item ) {
//                     return $( "<li>" )
//                     .addClass(item.category)
//                     .attr( "data-value", item.value )
//                     .append( $( "<a>" ).text( item.label ) )
//                     .appendTo( ul );
//                 }
//             });
//             $( "#location" ).catcomplete({
//                 source: mappeddata,
//                 select: function(event, ui) {
//                     // remove any previous polygons
//                     app.locationLayer.clear();
//                     // add the selected item from the list
//                     var newcoordinates = $.map(ui.item.original.coordinates, function(v,i) {
//                         return [ ol.proj.transform([ v.longitude, v.latitude ], 'EPSG:4326', 'EPSG:3857') ]; 
//                     });

//                     app.locationLayer.addFeature( new ol.Feature({
//                         name: ui.item.value,
//                         geometry: new ol.geom.Polygon( [newcoordinates] )
//                     }) );
//                     // now zoom the map:

//                     flyAnimation();
//                 }
//             });
//         }
//     });
// });// end self-invoked jquery for location

var firstFly = true;
//called by jQuery location selector function - function to zoom to location chosen in Location selector
function flyAnimation() {
    var duration = 2000;
    var resolutionchange = 4 * app.view.getResolution();
    var skipzoom = false;
    var extentVisible = ol.extent.intersects( view.calculateExtent(app.map.getSize()), app.locationLayer.getExtent() );

    if ( firstFly ) {
        resolutionchange = app.view.getResolution();
        firstFly = false;
    }
    else if ( extentVisible  &&  app.view.getZoom() > 5 ) {
        duration = 500;
        resolutionchange = app.view.getResolution();
        skipzoom = true;
    }

    var start = +new Date();
    var pan = ol.animation.pan({
        duration: duration,
        source: app.view.getCenter(),
        start: start
    });
    var bounce = ol.animation.bounce({
        duration: duration,
        resolution: resolutionchange,
        start: start
    });

    app.map.beforeRender(pan);
    if ( ! skipzoom )
        app.map.beforeRender(bounce);
    app.view.fit(app.locationLayer.getExtent(), app.map.getSize());
    for(i=0 ; i < 16 ; ++i )
        app.map.getLayers().item(i+1).setExtent(app.locationLayer.getExtent());
    if ( app.view.getZoom() > 8 )
        app.view.setZoom( app.view.getZoom()-2 );
    app.locationLayer.clear();
}// end fly animation function

//self-invoked jQuery function - dateslider
$(function () {
    //$.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=aapl-c.json&callback=?', function (data) {
    // Create the chart
    $('#dateslider').highcharts('StockChart', {
        rangeSelector : {
            inputEnabled: true, //enables rangre selector boxes
            buttons: [{}], //remove button labels
            inputPosition: {
                y: -10 //moves range selector boxes up a bit
            }
        },
        exporting: {
            enabled: false
        },
        title: {
            text: "Data Display Time Frame"
        },
        yAxis: {
            height: 0,
            labels: {
                enabled: false
            },
            gridLineWidth: 0
        },
        xAxis: {
            labels: {
                enabled: false
            },
            lineWidth: 0,
            tickLength: 0,
            events: {
            	setExtremes: sliderEvent
            },
            ordinal: false
        },
        scrollbar : {
            enabled: false
        },
        credits : {
            enabled: false
        },
        series : [{
            name : 'data',
            id : 'navigator',
            enableMouseTracking: false,
            tooltip: {
                valueDecimals: 2
            }
        }]
    });
});//end self-invoked jQuery function - dateslider

//Depth selection code
$('select').val('0');//ensures Depth value displayed is 0 when page is loaded/reloaded	

//Depth display function event; activated when a depth is selected - calls updateLayerContent to turn layers on
document.getElementById("depth").onchange = function() {
	updateLayerContent();	
};
	
//self-invoked jQuery accordion widget - default set so MilOc GDM is active on initialization
$(function() {
    $( "#layers" )
    .accordion({
        active: 3,
        heightStyle: "content",
        collapsible: false,
        header: "> div > h3"
    })
});
$(function () {
    $('#user-layer-tree')
    .jstree({
        "core" : {
            "themes": {
                "name": "proton",
                "responsive": true,
            }
        },
        "checkbox" : {
            "enabled" : true,
            "keep_selected_style" : false
        },
        "plugins" : [ "wholerow", "checkbox" ]
    })
    .on("changed.jstree", function(e, data) {
        updateLayers(e, data);
    });
});
$(function () {
    $('#defined-layer-tree')
    .jstree({
        "core" : {
            "themes": {
                "name": "proton",
                "responsive": true,
            }
        },
        "checkbox" : {
            "enabled" : true,
            "keep_selected_style" : false
        },
        "plugins" : [ "wholerow", "checkbox" ]
    });
});
$(function () {
    $('#foundation-layer-tree')
    .jstree({
        "core" : {
            "themes": {
                "name": "proton",
                "responsive": true
            }
        },
        "checkbox" : {
            "keep_selected_style" : false
        },
        "plugins" : [ "wholerow", "checkbox" ]
    })
    .on("changed.jstree", function(e, data) {
        updateLayers(e, data);
    });
});
$(function () {
    $('#milOc-layer-tree')
    .jstree({
        "core" : {
            "themes": {
                "name": "proton",
                "responsive": true
            }
        },
        "checkbox" : {
            "enabled" : true,
            "keep_selected_style" : false
        },
        "plugins" : [ "wholerow", "checkbox" ]
    })
    .on("changed.jstree", function(e, data) {
        updateLayers(e, data);
    });
});
$(function () {
    $('#milMet-layer-tree')
    .jstree({
        "core" : {
            "themes": {
                "name": "proton",
                "responsive": true
            }
        },
        "checkbox" : {
            "enabled" : true,
            "keep_selected_style" : false
        },
        "plugins" : [ "wholerow", "checkbox" ]
    });
});
$(function () {
    $('#milIce-layer-tree')
    .jstree({
        "core" : {
            "themes": {
                "name": "proton",
                "responsive": true
            }
        },
        "checkbox" : {
            "enabled" : true,
            "keep_selected_style" : false
        },
        "plugins" : [ "wholerow", "checkbox" ]
    });
});
$(function () {
    $('#vectorraster-layer-tree')
    .jstree({
        "core" : {
            "themes": {
                "name": "proton",
                "responsive": true
            }
        },
        "checkbox" : {
            "enabled" : true,
            "keep_selected_style" : false
        },
        "plugins" : [ "wholerow", "checkbox" ]
    });
});

app.midTreeUpdate = false;
// called by User, Foundation, MilOc trees
function updateLayers(e, data) {
    if ( app.midTreeUpdate  ||  !data.node )
        return;
    var layerids = [];
    var nodeid;
    var doUpdateLayers = false;
    
    // Show or hide the layers based on the tree selections
    if ( data.node.text == "Open Street Maps") {
        layerids = [ 0 ];
        nodeid = "osm";
    }
    else if ( data.node.id == "miloclt-votemper" || data.node.id == "ult-votemper") {//mercator temperature
        doUpdateLayers = true;
        nodeid = "votemper";
    }
    else if ( data.node.id == "miloclt-vosaline" || data.node.id == "ult-vosaline") {//mercator salinity
        doUpdateLayers = true;
        nodeid = "vosaline";
    }
    else if ( data.node.id == "miloclt-currents" || data.node.id == "ult-currents") {//mercator currents
        doUpdateLayers = true;
        nodeid = "currents";
    }
    //following added for CANMARNET RMP
    /*else if ( data.node.text == "CANMARNET Tracks" ) {
        layerids = [ 17 ];
        nodeid = "canmarnet";
    }*/

    var selected = data.action == "select_node";//indicates if selected true or false
    for ( i=0 ; i < layerids.length ; ++i ) {
        layer = app.map.getLayers().item(layerids[i]);
        layer.setVisible( selected );
    }
    updateTrees(nodeid, selected);
    if ( doUpdateLayers ) {
        // reset the displayed layers
        updateLayerContent();
    }
}//end updatelayers function

// called by updateLayers and jQuery self-invoked tree initialization function 
function updateTrees(nodeid, selected) {
    app.midTreeUpdate = true;
    
    // go through all the trees and change the selected setting to match the layer
    if ( selected ) {
        $.jstree.reference("#user-layer-tree").check_node("ult-" + nodeid);
        $.jstree.reference("#foundation-layer-tree").check_node("flt-" + nodeid);
        //$.jstree.reference("#foundation-layer-tree").check_node("canmarnet" + nodeid);
        $.jstree.reference("#milOc-layer-tree").check_node("miloclt-" + nodeid);
        app.visibleData.push(nodeid);
    }
    else {
        $.jstree.reference("#user-layer-tree").uncheck_node("ult-" + nodeid);
        $.jstree.reference("#foundation-layer-tree").uncheck_node("flt-" + nodeid);
        //$.jstree.reference("#foundation-layer-tree").uncheck_node("canmernet" + nodeid);
        $.jstree.reference("#milOc-layer-tree").uncheck_node("miloclt-" + nodeid);
        for( i=0 ; i < app.visibleData.length ; ++i ) {
            if ( app.visibleData[i] == nodeid )
                app.visibleData.splice(i, 1);
        }
    }

    app.midTreeUpdate = false;
}//end updateTrees function

// self-invoked jQuery function that initializes tree selections
$(function() {
    updateTrees("osm", true);
    updateTrees("votemper", true);
    updateTrees("vosaline", false);
    updateTrees("currents", false);
});

//this is the code that runs the page DOM (same as window.load)
$(document).ready( function() {
    $('.ol-zoom-in, .ol-zoom-out').tooltip({ placement: 'right' });
    $('#button-download').tooltip({ placement: 'bottom' });
    $('#button-backward-animation').tooltip({ placement: 'bottom' });
    $('#button-animation').tooltip({ placement: 'bottom' });
    $('#button-forward-animation').tooltip({ placement: 'bottom' });
    $('#button-select-rectangle').tooltip({ placement: 'bottom' });
    $('#button-graph').tooltip({ placement: 'bottom' });
});

//setup dynamic maps
app.formatter = new ol.format.WMSCapabilities();//read the capabilities of the WMS server
app.layers = [];

//async call to geoserver to getCapabilities; results in a list of all available layers
//note that data is read as-is; the list is not necessarily in some sort of order
$.ajax('http://localhost:8080/geoserver/wms?request=GetCapabilities',
    {
        success: function(data){
            // use the tool to parse the data
            var response = (app.formatter.read(data));
            var counter = 0;
		    var chart = $('#dateslider').highcharts();
		    
            // this object contains all the GetCapabilities data
            var capability = response.Capability;
            
            // I want a list of names to use in my queries
            for(var i = 0; i < capability.Layer.Layer.length; i ++){
                // add the layer if we recognize it from our namespace
                // create an array object from the layer name
                var splitparse = capability.Layer.Layer[i].Name.split("_");
                // GT_yyyymmddhh_HHH_2D_varname
                // GT_yyyymmddhh_HHH_3D_zzzz_varname
                
                app.layers.push( {
                    name : capability.Layer.Layer[i].Name.replace(/^giops:/, ''),
                    date : new Date(splitparse[1].substr(0,4), splitparse[1].substr(4,2)-1, splitparse[1].substr(6,2)),
                    hour : splitparse[2],
                    source : splitparse[3],
                    depth : ( splitparse.length <= 5 ) ? 0 : splitparse[4]/100,
                    datatype : ( splitparse.length <= 5 ) ? splitparse[4] : splitparse[5],
                    //legend : capability.Layer.Layer[i].Style[0].LegendURL[0].OnlineResource,
                });
                // creates a new Date() in this format: Sat Sep 15 2023 00:00:00 GMT+0000 (Coordinated Universal Time)

            }// end of capability response data parsing
           
            // get dates to update timeslider
            //set date variables to today in preperation for finding earliest and most current dates
            var mostCurrentDate = new Date(); // most current date
            var oldestDataDate = new Date(); // oldest data date in GeoServer

            for( var i=0 ; i < app.layers.length ; ++i ) {
                if ( app.layers[i].date > mostCurrentDate )
                	mostCurrentDate = app.layers[i].date;
                if ( app.layers[i].date < oldestDataDate )
                    oldestDataDate = app.layers[i].date;
            }

            // intial setup of dateslider - go twenty days ago
            setTimeSlider(oldestDataDate, mostCurrentDate);
            
           // dynamic update of timeslider
            var dateTenDaysAgo = new Date( mostCurrentDate - (1000*60*60*24* 10 ) );  // mercator forecast is for 10 days
            chart.xAxis[0].setExtremes(dateTenDaysAgo, mostCurrentDate); // note that this is the dateslider event labelled "undefined"
            
    	updateLayerContent(dateTenDaysAgo, mostCurrentDate);
   
        },
        error: function(data) {
            window.alert("error: " + data.responseText);
        }
        
});//end ajax call to GeoServer

//slider event function
//first time function is called is during initialization by the self-invoked jQuery dateslider function - e.trigger = "updatedData"
//second time is during initialization by the $ajax get capabilities - e.trigger = "undefined"
//every other call is during execution by e.trigger = "navigator"
function sliderEvent(e){
	if(e.trigger == 'navigator' && e.DOMEvent.type=="mouseup"){
		updateLayerContent();
	}	
}

//called by $ajax to set the timeslider given the start and end dates
// note that while this is only done once and remains static, as more data is added we may want to programmatically further adjust
function setTimeSlider(startDate, endDate){

    var chart = $('#dateslider').highcharts();   	
	var data = [];

    for( var i = startDate.getTime() ; i <= endDate.getTime() ; i += 1000*60*60*24 ) {
        data.push( [ i, 0 ] );
    }

    // use milliseconds to update dateline date series - dateline is overall span of dates along slider
    // note that this is the dateslider event labelled "updatedData"
    var nav =  chart.get('navigator');
    nav.setData(data);
        
}// end setTimeSlider function

//called on initialization by updateLayers function; called thereafter by updateLayers, $ajax, depth and dateslider event functions
//changes the layers that are included in open layers
var overlayDates = [];
var layerOnTop;//variable to track which layer is on top of the layer stack - used in animation control
function updateLayerContent(dateSliderStartDate, dateSliderEndDate) {

	// get displayed depth and convert to a number
	var displayedValue = document.getElementById("depth");
	var selectedDepth = Number(displayedValue.value);
	
	
	 if(selectedDepth!=0){// current layer is only for surface so prevent choosing current at depths

        //unselect current layers
        $.jstree.reference("#user-layer-tree").uncheck_node("ult-currents");
        $.jstree.reference("#user-layer-tree").uncheck_node("ult-currents");


        for (i = 0; i < app.visibleData.length; i++) {
            if(app.visibleData[i]=="currents"){

                app.visibleData[i]=="";

            }
        };    
    }

    var chart = $('#dateslider').highcharts();

    // arguments are provided on initialization only; after that need to read the navigation bar
    // highcharts range selector and navigation bar don't always match - believe this is because reading of
    // navigation bar has a time component and range selector seems to round to next day
    // therefore rounding date read from navigation bar to next day so it matches with range selector
    if(typeof dateSliderStartDate==='undefined'){
    	var dateSliderStartDate = new Date(chart.scroller.xAxis.toValue(chart.scroller.zoomedMin));
        var dateSliderEndDate = new Date(chart.scroller.xAxis.toValue(chart.scroller.zoomedMax));

        var tempStartDate = dateSliderStartDate.setHours(0,0,0,0);
        var tempEndDate = dateSliderEndDate.setHours(0,0,0,0);
        
        dateSliderStartDate = new Date(tempStartDate + (1000*60*60*24));
        dateSliderEndDate = new Date(tempEndDate + (1000*60*60*24));
    }
    
    var addLayers = [];
    //find all matching app.layers and add to addLayers
    for ( var i=0 ; i < app.layers.length ; ++i ) {
        // check to see if it matches our required data
        if ( app.layers[i].date >= dateSliderStartDate  &&
             app.layers[i].date <= dateSliderEndDate &&
             app.layers[i].depth == selectedDepth && //depth is used as a criteria
             isDataTypeVisible(app.layers[i].datatype) ) {//selects visible data
            addLayers.push(app.layers[i]);
         }
    }
    
   // sort addLayers in ascending oder by datatype / time / depth (Q - should depth ever be an issue?)
    addLayers.sort( function( a, b ) {
        // temperature / salinity / etc
        if ( a.datatype < b.datatype ) return -1;
        if ( a.datatype > b.datatype ) return 1;
        // sooner go on top
        if ( a.date > b.date ) return 1;
        if ( a.date < b.date ) return -1;
        return 0;
    });
    
    
    // remove all data layers, then replace
    for( var i=0 ; i < app.mapdata.length ; ++i ) {
        app.map.removeLayer(app.mapdata[i]);
    }
    
    // "addLayers" adds layers on top of the map, so if the layers are added in order
    // you get the last forecasted date layer on top of the pile and it's what's showing when you start!!!
    // note - all layers are visible at start (there's no other way to avoid the layer "hiccuping" issue during animation)
    // the only way to make all this work is to load the layers in reverse order so that the earliest date (start of forecast period) is on top
    // this causes considerations in animation - specifically the date and app.mapdata arrays are not in the same order
    addLayers.reverse();
    
    // get layers from GeoServer
    //layers are added
    app.mapdata = [];
    for(var i=0  ; i < addLayers.length; i++ ) {
        // put the new layers onto the map
        var newlayer = new ol.layer.Tile({
            extent: app.squareextent,
            source: new ol.source.TileWMS({
                url: 'http://localhost:8080/geoserver/wms',
                params: {'LAYERS': addLayers[i].name, 'TILED': false},//getting each layer in order
                serverType: 'geoserver'
            })
         });
        app.mapdata.push(newlayer);//note that their pushed in reverse order (i.e., latest date at 0, forecast date at bottom)
        app.map.addLayer(newlayer);// *** this is the only place where layers are added in the gdw ***
    }// end of for loop
    
    layerOnTop = app.mapdata.length;// note - OSM layer is layer#0, and the top layer is the newest layer; reset everytime this function is called
    
    //get the dates for all the layers for date-overlay
    var datesArray=[];
    for(i=0;i<addLayers.length;i++){
    	datesArray[i] = addLayers[i].date;
    }
     
    //convert numerical dates to desired format
    overlayDates = convertDateFormat(datesArray);  
    
    //set date-overlay date with top layer's date
    setOverlayDate(overlayDates[layerOnTop-1]);
        
    //set date overlay coordinate
    setOverlayCoordinate();

}// end updateLayerContent function

//function to convert date format to dd MMM yy
function convertDateFormat(dateToParse) {
	
	var date, month, year;
	var concatDate=[];
	
	for(i=0;i<dateToParse.length;i++){	
		date = dateToParse[i].getDate();
		month = changeMonthFormat(dateToParse[i].getMonth());
		year = dateToParse[i].getFullYear();
		year = year.toString().substr(2,2);
		
		concatDate[i] = date + " " + month + " " + year;
	}
	
	return concatDate;
	
}// end mousePopup function

function changeMonthFormat(monthToChange){
	
	var monthArray = new Array();
	monthArray[0] = "Jan";
	monthArray[1] = "Feb";
	monthArray[2] = "Mar";
	monthArray[3] = "Apr";
	monthArray[4] = "May";
	monthArray[5] = "Jun";
	monthArray[6] = "Jul";
	monthArray[7] = "Aug";
	monthArray[8] = "Sep";
	monthArray[9] = "Oct";
	monthArray[10] = "Nov";
	monthArray[11] = "Dec";
	
	return monthArray[monthToChange];
}

// Check to see if the datatype is in our list of visible data
// called from updateLayerContent function
function isDataTypeVisible( datatype ) {
    if ( app.visibleData.indexOf( datatype ) > -1 )
        return true;
    return false;
}
