/*
 * 3DCityDB-Web-Map-Client
 * http://www.3dcitydb.org/
 * 
 * Copyright 2015 - 2016
 * Chair of Geoinformatics
 * Technical University of Munich, Germany
 * https://www.gis.bgu.tum.de/
 * 
 * The 3DCityDB-Web-Map-Client is jointly developed with the following
 * cooperation partners:
 * 
 * virtualcitySYSTEMS GmbH, Berlin <http://www.virtualcitysystems.de/>
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 *     
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**-----------------------------------------Separate Line-------------------------------------------------**/

	/*---------------------------------  set globe variables  ----------------------------------------*/
	// updated Bing Key
	Cesium.BingMapsApi.defaultKey = 'ApOW9LMkerqWIVSnFauilSeaZyp8df66byy1USCTjgTdMvhb4y1iAhEsUHQfCgzq';
	
	// create 3Dcitydb-web-map instance
	var shadows = CitydbUtil.parse_query_string('shadows', window.location.href);
	var terrainShadows = CitydbUtil.parse_query_string('terrainShadows', window.location.href);
	var cesiumViewer = new Cesium.Viewer('cesiumContainer', {
		selectedImageryProviderViewModel  : Cesium.createDefaultImageryProviderViewModels()[1],
		timeline: (shadows == "true"),
		animation : (shadows == "true"),
		fullscreenButton: false,
        sceneModePicker:false,
		shadows: (shadows == "true"),
		terrainShadows: (terrainShadows == "true")
	});
	
	navigationInitialization('cesiumContainer', cesiumViewer);
	document.getElementsByClassName('cesium-infoBox')[0].style.zIndex='300';

	var cesiumCamera = cesiumViewer.scene.camera;
	var webMap = new WebMap3DCityDB(cesiumViewer);	

	// set default input parameter value and bind the view and model
  	var addLayerViewModel = {


		 url : "http://localhost/dashboard/hh-complete-100-100/hh-complete_extruded_MasterJSON.json",
		name : "extruded",
		thematicDataUrl: "https://www.google.com/fusiontables/DataSource?docid=1IKfUy39P82_fXBG8ncu9758AD2jlJMUYtFCiRTiK",
		cityobjectsJsonUrl: "",
		//for 100-100
		//minLodPixels : "250",
		/*
		maxSizeOfCachedTiles : 70,
		maxCountOfVisibleTiles : 30*/


		//for 500-00
		minLodPixels : "10",
		maxLodPixels : "-1",
		maxSizeOfCachedTiles : 300,
		maxCountOfVisibleTiles : 150
	};  	
  	Cesium.knockout.track(addLayerViewModel);
	Cesium.knockout.applyBindings(addLayerViewModel, document.getElementById('citydb_addlayerpanel'));
	
  	var addWmsViewModel = {
        name : '',
        iconUrl : '',
        tooltip : '',
		url: '',
		layers : '',
		additionalParameters: '',
		proxyUrl: '/proxy/'
	};  	
  	Cesium.knockout.track(addWmsViewModel);
	Cesium.knockout.applyBindings(addWmsViewModel, document.getElementById('citydb_addwmspanel'));	
	
  	var addTerrainViewModel = {
        name : '',
        iconUrl : '',
        tooltip : '',
    	url : ''
	};  	
  	Cesium.knockout.track(addTerrainViewModel);
	Cesium.knockout.applyBindings(addTerrainViewModel, document.getElementById('citydb_addterrainpanel'));

	/*---------------------------------  Load Configurations and Layers  ----------------------------------------*/ 
	
	intiClient();
	
	function intiClient() {		
		// init progress indicator gif
		document.getElementById('loadingIndicator').style.display = 'none';

		// activate mouseClick Events		
		webMap.activateMouseClickEvents(true);
		webMap.activateMouseMoveEvents(true);
		webMap.activateViewChangedEvent(true);
		
		// add Copyrights, TUM, 3DCityDB or more...
		var citydbLogoData = 'data:image/png;base64,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';
	    var creditDisplay = cesiumViewer.scene.frameState.creditDisplay;
	    var citydbCreditLogo = new Cesium.Credit('3DCityDB', citydbLogoData, 'http://www.3dcitydb.net/');
	    creditDisplay.addDefaultCredit(citydbCreditLogo);
	    var tumCreditLogo = new Cesium.Credit('© 2015 Chair of Geoinformatics TU München', undefined, "https://www.gis.bgu.tum.de/en/home/");
	    creditDisplay.addDefaultCredit(tumCreditLogo);
	    
	    // activate debug mode
	    var debugStr = CitydbUtil.parse_query_string('debug', window.location.href);
		if (debugStr == "true") {
			cesiumViewer.extend(Cesium.viewerCesiumInspectorMixin);	
			cesiumViewer.cesiumInspector.viewModel.dropDownVisible = false;
			var cesiumInfoBoxElement = document.getElementsByClassName('cesium-infoBox')[0];
			cesiumInfoBoxElement.style.top = '90px';
			cesiumInfoBoxElement.style.zIndex='300';
		}	
		
		// set title of the web page
		var titleStr = CitydbUtil.parse_query_string('title', window.location.href);
		if (titleStr) {
			document.title = titleStr;
		}			
		
		// It's an extended Geocoder widget which can also be used for searching object by its gmlid.
		cesiumViewer.geocoder.viewModel._searchCommand.beforeExecute.addEventListener(function(info){
			var callGeocodingService = info.args[0];
			if (callGeocodingService != true) {
				var gmlId = cesiumViewer.geocoder.viewModel.searchText;
				info.cancel = true;	
				cesiumViewer.geocoder.viewModel.searchText = "Searching now......."
				zoomToObjectById(gmlId, function() {									
		        	cesiumViewer.geocoder.viewModel.searchText = gmlId;
				}, function() {
					cesiumViewer.geocoder.viewModel.searchText = gmlId;
					cesiumViewer.geocoder.viewModel.search.call(this, true);
				});
			}											
	  	});
		
		//	inspect the status of the showed and cached tiles	
		inspectTileStatus();
		
		// bind view and model of the highlighted and hidden Objects...
		observeObjectList();
		
		// Zoom to desired camera position and load layers if encoded in the url...	
		zoomToDefaultCameraPosition().then(function(info){
			console.log(info);
			var layers = getLayersFromUrl();
			loadLayerGroup(layers);
			
			var basemapConfigString = CitydbUtil.parse_query_string('basemap', window.location.href);
			if (basemapConfigString) {
				var viewMoModel = Cesium.queryToObject(Object.keys(Cesium.queryToObject(basemapConfigString))[0]);
				for (key in viewMoModel) {
					addWmsViewModel[key] = viewMoModel[key];
				}
				addWebMapServiceProvider();
			}
			
			var terrainConfigString = CitydbUtil.parse_query_string('terrain', window.location.href);
			if (terrainConfigString) {
				var viewMoModel = Cesium.queryToObject(Object.keys(Cesium.queryToObject(terrainConfigString))[0]);
				for (key in viewMoModel) {
					addTerrainViewModel[key] = viewMoModel[key];
				}
				addTerrainProvider();
			}
		})			
	}
	    
    /*---------------------------------  methods and functions  ----------------------------------------*/ 
		
	function inspectTileStatus() {
		setInterval(function() {
			var cachedTilesInspector = document.getElementById('citydb_cachedTilesInspector');
			var showedTilesInspector = document.getElementById('citydb_showedTilesInspector');
			var layers = webMap._layers;
			var numberOfshowedTiles = 0;
			var numberOfCachedTiles = 0;
			var numberOfTasks = 0;
	  		for (var i = 0; i < layers.length; i++) {
	  			if (layers[i].active) {	  				
	  				numberOfshowedTiles = numberOfshowedTiles + Object.keys(layers[i].citydbKmlTilingManager.dataPoolKml).length;
	  				numberOfCachedTiles = numberOfCachedTiles +  Object.keys(layers[i].citydbKmlTilingManager.networklinkCache).length;
	  				numberOfTasks = numberOfTasks + layers[i].citydbKmlTilingManager.taskNumber;
	  			} 	
	  		}
	  		showedTilesInspector.innerHTML = 'Number of showed Tiles: ' + numberOfshowedTiles;
			cachedTilesInspector.innerHTML = 'Number of cached Tiles: ' + numberOfCachedTiles;
			
			var loadingTilesInspector = document.getElementById('citydb_loadingTilesInspector');
			if (numberOfTasks > 0) {
				loadingTilesInspector.style.display = 'block';
	  		}
	  		else {
	  			loadingTilesInspector.style.display = 'none';
	  		}
		}, 200);		
	}
	
	function getLayersFromUrl() {
		var index = 0;
		var nLayers = new Array();
		var layerConfigString = CitydbUtil.parse_query_string('layer_' + index, window.location.href);
		while (layerConfigString) {
			var layerConfig = Cesium.queryToObject(Object.keys(Cesium.queryToObject(layerConfigString))[0]);
			nLayers.push(new CitydbKmlLayer({
				url : layerConfig.url,
				name : layerConfig.name,
				thematicDataUrl: Cesium.defaultValue(layerConfig.spreadsheetUrl, ""),
				cityobjectsJsonUrl: Cesium.defaultValue(layerConfig.cityobjectsJsonUrl, ""),
				active: (layerConfig.active == "true"),
				minLodPixels : Cesium.defaultValue(layerConfig.minLodPixels, 140),
				maxLodPixels : Cesium.defaultValue(layerConfig.maxLodPixels, Number.MAX_VALUE),
				maxSizeOfCachedTiles: layerConfig.maxSizeOfCachedTiles,
				maxCountOfVisibleTiles: layerConfig.maxCountOfVisibleTiles
			}));			
			index++;
			layerConfigString = CitydbUtil.parse_query_string('layer_' + index, window.location.href);
		}
		return nLayers;
	}
	
	function observeObjectList() {
		var observable = Cesium.knockout.getObservable(webMap, '_activeLayer');
		var highlightedObjectsSubscription = undefined;
		var hiddenObjectsSubscription = undefined;
		
		var highlightingListElement = document.getElementById("citydb_highlightinglist");
//		highlightingListElement.onchange = function() {			
//			zoomToObjectById(this.value);
//            highlightingListElement.selectedIndex = 0;
//        };
//        
		var hiddenListElement = document.getElementById("citydb_hiddenlist");
//		hiddenListElement.onchange = function() {			
//			zoomToObjectById(this.value);
//            hiddenListElement.selectedIndex = 0;
//        };
		
		observable.subscribe(function(deSelectedLayer) {
			if (Cesium.defined(highlightedObjectsSubscription)) {
				highlightedObjectsSubscription.dispose();
			}	
			if (Cesium.defined(hiddenObjectsSubscription)) {
				hiddenObjectsSubscription.dispose();
			}	
		}, observable, "beforeChange");
		
		observable.subscribe(function(selectedLayer) {
	        if (Cesium.defined(selectedLayer)) {
	      		document.getElementById(selectedLayer.id).childNodes[0].checked = true;  
	      		
	      		highlightedObjectsSubscription = Cesium.knockout.getObservable(selectedLayer, '_highlightedObjects').subscribe(function(highlightedObjects) {					
			  		while (highlightingListElement.length > 1) {
			  			highlightingListElement.remove(1);
			  		}
			  		for (var id in highlightedObjects){
			  			var option = document.createElement("option");
				  		option.text = id;
                        console.log(highlightedObjects+"highlightedObjects");
				  		highlightingListElement.add(option);						
				  	}				  		
			    });	      		
	      		selectedLayer.highlightedObjects = selectedLayer.highlightedObjects;
	      		
	      		hiddenObjectsSubscription = Cesium.knockout.getObservable(selectedLayer, '_hiddenObjects').subscribe(function(hiddenObjects) {					
			  		while (hiddenListElement.length > 1) {
			  			hiddenListElement.remove(1);
			  		}			  					  		
			  		for (var k = 0; k < hiddenObjects.length; k++){	
						var id = hiddenObjects[k];			
						var option = document.createElement("option");
				  		option.text = id;
				  		hiddenListElement.add(option);	
					}				  		
			    });	      		
	      		selectedLayer.hiddenObjects = selectedLayer.hiddenObjects;  
	      		
	      		updateAddLayerViewModel(selectedLayer);
	        } 
	        else {
	        	while (highlightingListElement.length > 1) {
		  			highlightingListElement.remove(1);
		  		}
	        	while (hiddenListElement.length > 1) {
		  			hiddenListElement.remove(1);
		  		}
	        }
	    });		
		
		function updateAddLayerViewModel(selectedLayer) {
			addLayerViewModel.url = selectedLayer.url;
			addLayerViewModel.name = selectedLayer.name;
			addLayerViewModel.thematicDataUrl = selectedLayer.thematicDataUrl;
			addLayerViewModel.cityobjectsJsonUrl = selectedLayer.cityobjectsJsonUrl;
			addLayerViewModel.minLodPixels = selectedLayer.minLodPixels;
			addLayerViewModel.maxLodPixels = selectedLayer.maxLodPixels;
			addLayerViewModel.maxSizeOfCachedTiles = selectedLayer.maxSizeOfCachedTiles;
			addLayerViewModel.maxCountOfVisibleTiles = selectedLayer.maxCountOfVisibleTiles;	    
		}
	}
	
	function saveLayerSettings() {
		var activeLayer = webMap.activeLayer;		
		applySaving('url', activeLayer);
		applySaving('name', activeLayer);
		applySaving('thematicDataUrl', activeLayer);
		applySaving('cityobjectsJsonUrl', activeLayer);
		applySaving('minLodPixels', activeLayer);
		applySaving('maxLodPixels', activeLayer);
		applySaving('maxSizeOfCachedTiles', activeLayer);
		applySaving('maxCountOfVisibleTiles', activeLayer);
		console.log(activeLayer);
		
		// update GUI:
		var nodes = document.getElementById('citydb_layerlistpanel').childNodes;
		for (var i = 0; i < nodes.length; i += 3) {
			var layerOption = nodes[i];
			if (layerOption.id == activeLayer.id) {
				layerOption.childNodes[2].innerHTML = activeLayer.name;
			};
		}
		
		document.getElementById('loadingIndicator').style.display = 'block';	
		var promise = activeLayer.reActivate();
		Cesium.when(promise, function(result){
			document.getElementById('loadingIndicator').style.display = 'none';
		},function(error){
			document.getElementById('loadingIndicator').style.display = 'none';
		})
		
		function applySaving(propertyName, activeLayer) {			
			var newValue = addLayerViewModel[propertyName];
			if (Cesium.isArray(newValue)) {			           
	            activeLayer[propertyName] = newValue[0];
        	}
        	else {
        		activeLayer[propertyName] = newValue;
        	}
		}		
	}

	function loadLayerGroup(_layers) {
		var k = 0;		
		registerLayerEventHandler(_layers[k]);
		
		function registerLayerEventHandler(_layer) {
			var tempMenuOption;
			var startLoadingHandler = function(thisLayer) {
				document.getElementById('loadingIndicator').style.display = 'block';				
			}
			_layer.registerEventHandler("STARTLOADING", startLoadingHandler);
			var finishLoadingHandler = function(thisLayer) {
				console.log(thisLayer);
				addEventListeners(thisLayer);			
				document.getElementById('loadingIndicator').style.display = 'none';
				addLayerToList(thisLayer);
				thisLayer.removeEventHandler("STARTLOADING", startLoadingHandler);
				thisLayer.removeEventHandler("FINISHLOADING", finishLoadingHandler);
				k++;
				if (k < _layers.length) {
					var currentLayer = _layers[k];
					registerLayerEventHandler(currentLayer);
					webMap.addLayer(currentLayer);
				}
				else {
					webMap.activeLayer = _layers[0];
				}
			}
			_layer.registerEventHandler("FINISHLOADING", finishLoadingHandler);
		}
		
		// adding layer to Cesium Map          	          	
    	webMap.addLayer(_layers[0]); 
	}
	
  	function addLayerToList(layer) {
  		var radio = document.createElement('input');
  		radio.type = "radio";
  		radio.name = "dummyradio";
  		radio.onchange = function(event) {	    	
	        var targetRadio = event.target;
	        var layerId = targetRadio.parentNode.id;
	        webMap.activeLayer = webMap.getLayerbyId(layerId);
	        console.log(webMap.activeLayer);
	    };
  		
  		var checkbox = document.createElement('input');
	    checkbox.type = "checkbox";
	    checkbox.id = "id";
	    checkbox.checked = layer.active;
	    checkbox.onchange = function(event) {	    	
	        var checkbox = event.target;
	        var layerId = checkbox.parentNode.id;
	        var citydbLayer = webMap.getLayerbyId(layerId);
	        if (checkbox.checked) {
	            console.log("Layer " + citydbLayer.name + " is visible now!");
	            citydbLayer.activate(true);
	        } else {
	        	console.log("Layer " + citydbLayer.name + " is not visible now!");
	        	citydbLayer.activate(false);
	        }
	    };
	    
	    var label = document.createElement('label')
	    label.appendChild(document.createTextNode(layer.name));
	    
	    var layerOption = document.createElement('div');
	    layerOption.id = layer.id;
//	    layerOption.appendChild(radio);
	    layerOption.appendChild(checkbox);
	    layerOption.appendChild(label);
	    
	    label.ondblclick = function(event) {
	    	event.preventDefault();
	    	var layerId = event.target.parentNode.id;
	    	var citydbLayer = webMap.getLayerbyId(layerId);
	    	citydbLayer.zoomToStartPosition();
	    }

	    var layerlistpanel = document.getElementById("citydb_layerlistpanel")
	    layerlistpanel.appendChild(layerOption);
  	}
	
	function addEventListeners(citydbKmlLayer) {
		// clickEvent Handler for Highlighting...	
		var highlightColor = new Cesium.Color(1, 1, 1, 1.0);
		var mouseOverhighlightColor = new Cesium.Color(1, 1, 1, 1.0);
		var mainMouseOverhighlightColor = new Cesium.Color(0.0, 0.4, 0.0, 1.0);
		var subMouseOverhighlightColor = new Cesium.Color(0.0, 0.5, 0.0, 1.0);
		
		citydbKmlLayer.registerEventHandler("CLICK", function(object) {
            console.log("object is clicked");
			var targetEntity = object.id;
			var primitive = object.primitive;
			console.log(citydbKmlLayer);
	 		console.log(primitive);
            console.log(object.name);

	 		var globeId = targetEntity.name; 
	 		console.log(object.name);
	 		createInfoTable(globeId, targetEntity, citydbKmlLayer);
	 		
	 		if (citydbKmlLayer.isInHighlightedList(globeId))
				return; 
	 	    // clear all other Highlighting status and just highlight the clicked object...
			citydbKmlLayer.unHighlightAllObjects();  									
			var highlightThis = {};
			
			highlightThis[globeId] = highlightColor;
			citydbKmlLayer.highlight(highlightThis); 						
		});
		
		// CtrlclickEvent Handler for Multi-Selection and Highlighting...
		citydbKmlLayer.registerEventHandler("CTRLCLICK", function(object) {
			var targetEntity = object.id;
	 		var primitive = object.primitive;

	 		var globeId = targetEntity.name;; 
	 		
			if (citydbKmlLayer.isInHighlightedList(globeId)) {
				citydbKmlLayer.unHighlight([globeId]);
			}else {
				var highlightThis = {};				
				highlightThis[globeId] = highlightColor;
				citydbKmlLayer.highlight(highlightThis); 
			}								
		});
		
		// MouseIn- and MouseOut-Event Handler for MouseOver-Highlighting
		citydbKmlLayer.registerEventHandler("MOUSEIN", function(object) {
			var targetEntity = object.id;
	 		var primitive = object.primitive;
            console.log("object in mousein");
	 		console.log(object);
	 		if (citydbKmlLayer.isInHighlightedList(targetEntity.name))
				return;
	 		
			if (primitive instanceof Cesium.Model) {
                cosole.log("primitive instanceof Cesium.Model")
				var materials = object.mesh._materials;
               
				for (var i = 0; i < materials.length; i++) {
					// do mouseOver highlighting
					materials[i].setValue('emission',Cesium.Cartesian4.fromColor(mouseOverhighlightColor));
                    console.log("materials[i]",materials[i]);
				} 
			}
			else if (primitive instanceof Cesium.Primitive) {
                console.log("primitive instanceof Cesium.Primitive")
				try{
					var parentEntity = targetEntity._parent;	
					var childrenEntities = parentEntity._children;	
                     console.log("inside try");
                    console.log("parentEntity is ",parentEntity);
                      console.log("childrenEntities are ",childrenEntities);
				}
				catch(e){return;} // not valid entities
                
				_doMouseoverHighlighting(childrenEntities, primitive, mouseOverhighlightColor);
                
			}
		});
		
        
        //shahab
        
//			var x = document.getElementById("a6caa080-605c-4514-abb9-90d789017b67");
//	 			var materials = x.mesh._materials;
//				for (var i = 0; i < materials.length; i++) {
//					// do mouseOver highlighting
//					materials[i].setValue('emission',Cesium.Cartesian4.fromColor(mouseOverhighlightColor));
//				} 
			
		
        
        
        
        
        
        
        
	 	citydbKmlLayer.registerEventHandler("MOUSEOUT", function(object) {
	 		var primitive = object.primitive;
	 		var targetEntity = object.id;
	 		if (citydbKmlLayer.isInHighlightedList(targetEntity.name))
				return; 
			if (primitive instanceof Cesium.Model) {				
				var materials = object.mesh._materials;
				for (var i = 0; i < materials.length; i++) {
					// dismiss highlighting
					materials[i].setValue('emission', new Cesium.Cartesian4(0.0, 0.0, 0.0, 1));
				} 
			}
			else if (primitive instanceof Cesium.Primitive) {				
				try{
					var parentEntity = targetEntity._parent;	
					var childrenEntities = parentEntity._children;		
					
				}
				catch(e){return;} // not valid entities
				_dismissMouseoverHighlighting(childrenEntities, primitive);	
			}
		})	 
	 	
		function _doMouseoverHighlighting(_childrenEntities, _primitive, _mouseOverhighlightColor) {
			for (var i = 0; i < _childrenEntities.length; i++){
				var childEntity = _childrenEntities[i];
				var attributes = _primitive.getGeometryInstanceAttributes(childEntity);
//                console.log(childEntity);


//                var tessssst="DEHH_9d4c8b35-56b8-4fae-9228-46a2686391d8".parent;
//                console.log(tessssst);
//
				if (!Cesium.defined(childEntity.originalSurfaceColor)) {
					childEntity.addProperty("originalSurfaceColor");
				}
				childEntity.originalSurfaceColor = attributes.color;
				attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(_mouseOverhighlightColor);
			}
		}
		
		function _dismissMouseoverHighlighting(_childrenEntities, _primitive) {
			for (var i = 0; i < _childrenEntities.length; i++){	
				var childEntity = _childrenEntities[i];	
				var originalSurfaceColor = childEntity.originalSurfaceColor;
				try{
					var attributes = _primitive.getGeometryInstanceAttributes(childEntity);
					attributes.color = originalSurfaceColor; 
				}
				catch(e){
					console.log(e);
					/* escape the DeveloperError exception: "This object was destroyed..." */
				}
			}
		}
	}
 	
	function zoomToDefaultCameraPosition() {	
		var deferred = Cesium.when.defer();
		var latitudeStr = CitydbUtil.parse_query_string('latitude', window.location.href);
	    var longitudeStr = CitydbUtil.parse_query_string('longitude', window.location.href);
	    var heightStr = CitydbUtil.parse_query_string('height', window.location.href);
	    var headingStr = CitydbUtil.parse_query_string('heading', window.location.href);
	    var pitchStr = CitydbUtil.parse_query_string('pitch', window.location.href);
	    var rollStr = CitydbUtil.parse_query_string('roll', window.location.href);
	    
	    if (latitudeStr && longitudeStr && heightStr && headingStr && pitchStr && rollStr) {
	    	var cameraPostion = {
    			latitude: parseFloat(latitudeStr),
            	longitude: parseFloat(longitudeStr),
            	height: parseFloat(heightStr),
            	heading: parseFloat(headingStr),
            	pitch: parseFloat(pitchStr),
            	roll: parseFloat(rollStr)	
	    	}
	    	return flyToCameraPosition(cameraPostion);
	    }
	    else {
	    	return zoomToDefaultCameraPosition_expired();
	    }

	    return deferred;
	}
	
	function zoomToDefaultCameraPosition_expired() {	
		var deferred = Cesium.when.defer();
		var cesiumCamera = cesiumViewer.scene.camera;
		var latstr = CitydbUtil.parse_query_string('lat', window.location.href);
	    var lonstr = CitydbUtil.parse_query_string('lon', window.location.href);
	    
	    if (latstr && lonstr) {	    	
	        var lat = parseFloat(latstr);
	        var lon = parseFloat(lonstr);
	        var range = 800;
	        var heading = 6;
	        var tilt = 49;
	        var altitude = 40;

	        var rangestr = CitydbUtil.parse_query_string('range', window.location.href);
	        if (rangestr) 
	        	range = parseFloat(rangestr);

	        var headingstr = CitydbUtil.parse_query_string('heading', window.location.href);
	        if (headingstr) 
	        	heading = parseFloat(headingstr);

	        var tiltstr = CitydbUtil.parse_query_string('tilt', window.location.href);
	        if (tiltstr) 
	        	tilt = parseFloat(tiltstr);

	        var altitudestr = CitydbUtil.parse_query_string('altitude', window.location.href);
	        if (altitudestr) 
	        	altitude = parseFloat(altitudestr);

	        var _center = Cesium.Cartesian3.fromDegrees(lon, lat);
	        var _heading = Cesium.Math.toRadians(heading);
	        var _pitch = Cesium.Math.toRadians(tilt - 90);
	        var _range = range;
	        cesiumCamera.flyTo({
	            destination : Cesium.Cartesian3.fromDegrees(lon, lat, _range),
	            complete: function() {
	            	cesiumCamera.lookAt(_center, new Cesium.HeadingPitchRange(_heading, _pitch, _range));
	            	cesiumCamera.lookAtTransform(Cesium.Matrix4.IDENTITY);	            		    	    	
	    	    	deferred.resolve("fly to the desired camera position");
	            }
	        })
	    } 
	    else {
	    	// default camera postion
	    	deferred.resolve("fly to the default camera position");;
	    }
	    return deferred;
	}

	function flyToCameraPosition(cameraPosition) {
		var deferred = Cesium.when.defer();
		var cesiumCamera = cesiumViewer.scene.camera;    
		var longitude = cameraPosition.longitude;
		var latitude = cameraPosition.latitude;
		var height = cameraPosition.height;
        cesiumCamera.flyTo({
            destination : Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
            complete: function() {
            	cesiumCamera.setView({
            		destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
            		orientation: {
            			heading : Cesium.Math.toRadians(cameraPosition.heading),
            		    pitch : Cesium.Math.toRadians(cameraPosition.pitch),
            		    roll : Cesium.Math.toRadians(cameraPosition.roll)
            		}
            	});
            	deferred.resolve("fly to the desired camera position");
            }
        });	
        return deferred;
	}


	
    // Creation of a scene link for sharing with other people..
	function showSceneLink() {
		var sceneLink = generateLink();
		CitydbUtil.showAlertWindow("OK", "Scene Link", '<a href="' + sceneLink + '" style="color:#c0c0c0" target="_blank">' + sceneLink + '</a>');
	}
	
 	function generateLink(){
		var cameraPosition = getCurrentCameraPostion();
		var	projectLink = location.protocol + '//' + location.host + location.pathname + '?';
		var gltf_version = CitydbUtil.parse_query_string('gltf_version', window.location.href);
		var batchSize = CitydbUtil.parse_query_string('batchSize', window.location.href);
		
		if (!batchSize) 
			batchSize = 3
			
		if (gltf_version)
			projectLink = projectLink + 'gltf_version=' + gltf_version + "&";
		
		projectLink = projectLink +			
			'title=' + document.title +
			'&batchSize=' + batchSize +
			'&shadows=' + cesiumViewer.shadows +
			'&terrainShadows=' + cesiumViewer.terrainShadows +
			'&latitude=' + cameraPosition.latitude +
			'&longitude=' + cameraPosition.longitude +
			'&height=' + cameraPosition.height +
			'&heading=' + cameraPosition.heading +
			'&pitch=' + cameraPosition.pitch +
			'&roll=' + cameraPosition.roll + 
			'&' + layersToQuery();      		
		var basemap = basemapToQuery();
		if (basemap != null) {
			projectLink = projectLink + '&' + basemap;
		}
		
		var terrain = terrainToQuery();
		if (terrain != null) {
			projectLink = projectLink + '&' + terrain;
		}
		
		return projectLink;
  	};
  	
  	function getCurrentCameraPostion(){
  		var cesiumCamera = cesiumViewer.scene.camera;
        var position = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cesiumCamera.position);
        var latitude = Cesium.Math.toDegrees(position.latitude);
        var longitude = Cesium.Math.toDegrees(position.longitude);
        var height = position.height;
        var heading = Cesium.Math.toDegrees(cesiumCamera.heading);
        var pitch = Cesium.Math.toDegrees(cesiumCamera.pitch);
        var roll = Cesium.Math.toDegrees(cesiumCamera.roll);
        return {
        	latitude: latitude,
        	longitude: longitude,
        	height: height,
        	heading: heading,
        	pitch: pitch,
        	roll: roll
        }
  	}
  	
  	function layersToQuery() {
  		var layerGroupObject = new Object();
  		var layers = webMap._layers;
  		for (var i = 0; i < layers.length; i++) {
  			var layer = layers[i];
  			var layerConfig = {
				url : layer.url,
				name : layer.name,
				active: layer.active,
				spreadsheetUrl: layer.thematicDataUrl,
				cityobjectsJsonUrl: layer.cityobjectsJsonUrl,
				minLodPixels: layer.minLodPixels,
				maxLodPixels: layer.maxLodPixels,
				maxSizeOfCachedTiles: layer.maxSizeOfCachedTiles,
				maxCountOfVisibleTiles: layer.maxCountOfVisibleTiles,
  			}
  			layerGroupObject["layer_" + i] = Cesium.objectToQuery(layerConfig); 			
  		} 
  		
  		return Cesium.objectToQuery(layerGroupObject)
  	}
  	
  	function basemapToQuery() {  		
  		var baseLayerPickerViewModel = cesiumViewer.baseLayerPicker.viewModel;
  		var baseLayerProviderFunc = baseLayerPickerViewModel.selectedImagery.creationCommand();
  		if (baseLayerProviderFunc instanceof Cesium.WebMapServiceImageryProvider) {
  			return Cesium.objectToQuery({
  				basemap: Cesium.objectToQuery(addWmsViewModel)
  			});
  		}
  		else {
  			return null;
  		}
  	}
  	
  	function terrainToQuery() {
  		var baseLayerPickerViewModel = cesiumViewer.baseLayerPicker.viewModel;
  		var baseLayerProviderFunc = baseLayerPickerViewModel.selectedTerrain.creationCommand();
  		if (baseLayerProviderFunc instanceof Cesium.CesiumTerrainProvider) {
  			return Cesium.objectToQuery({
  				terrain: Cesium.objectToQuery(addTerrainViewModel)
  			});
  		}
  		else {
  			return null;
  		}
  	}
  	
  	// Clear Highlighting effect of all highlighted objects
  	function clearhighlight(){   		
  		var layers = webMap._layers;
  		for (var i = 0; i < layers.length; i++) {
  			if (layers[i].active) {
  				layers[i].unHighlightAllObjects();
  			} 			
  		} 
  		cesiumViewer.selectedEntity = undefined;
  	};
  	
    // hide the selected objects
  	function hideSelectedObjects(){ 	 		
  		var layers = webMap._layers;
  		var objectIds;
  		for (var i = 0; i < layers.length; i++) {
  			if (layers[i].active) {
  	  			objectIds = Object.keys(layers[i].highlightedObjects);
  	  			layers[i].hideObjects(objectIds); 
  			} 	
  		}
  	};
  	
    // show the hidden objects
  	function showHiddenObjects(){
  		var layers = webMap._layers;
  		for (var i = 0; i < layers.length; i++) {
  			if (layers[i].active) {
  				layers[i].showAllObjects();
  			} 	  			
  		}
  	};
  	
  	function zoomToObjectById (gmlId, callBackFunc, errorCallbackFunc) {
  		gmlId = gmlId.trim();
		var activeLayer = webMap._activeLayer;
		if (Cesium.defined(activeLayer)) {
			var cityobjectsJsonData = activeLayer.cityobjectsJsonData;
            console.log(gmlId);
			var obj = cityobjectsJsonData[gmlId];
             console.log(obj);
	        if (obj) {
	            var lon = (obj.envelope[0] + obj.envelope[2]) / 2.0;
	            var lat = (obj.envelope[1] + obj.envelope[3]) / 2.0;
	            flyToMapLocation(lat, lon, callBackFunc);          
	        }	
			else {
				var thematicDataUrl = webMap.activeLayer.thematicDataUrl;  
				var promise = fetchDataFromGoogleFusionTable(gmlId, thematicDataUrl);
				Cesium.when(promise, function(result) {
					var centroid = result["CENTROID"];
			        if (centroid) {	  
			        	var res = centroid.match(/\(([^)]+)\)/)[1].split(",");
			            var lon = parseFloat(res[0]);
			            var lat = parseFloat(res[1]);
			            flyToMapLocation(lat, lon, callBackFunc);  
			        }
			        else {
			        	if (Cesium.defined(errorCallbackFunc)) {
							errorCallbackFunc.call(this);
		            	}
			        }
				}, function() {
					if (Cesium.defined(errorCallbackFunc)) {
						errorCallbackFunc.call(this);
	            	}
				});		
			}
		}		
	};
  	
  	function flyToMapLocation(lat, lon, callBackFunc) {
		var cesiumWidget = webMap._cesiumViewerInstance.cesiumWidget; 
		var scene = cesiumWidget.scene;
    	var camera = scene.camera;
    	var canvas = scene.canvas;
    	var globe = scene.globe;
    	var clientWidth = canvas.clientWidth;
		var clientHeight = canvas.clientHeight;	          
        camera.flyTo({
            destination : Cesium.Cartesian3.fromDegrees(lon, lat, 2000),
            complete: function() {
            	var timer = setInterval(function(){
            		if (webMap._cesiumViewerInstance.scene.globe._surface._tileLoadQueue.length == 0) { 
            			var intersectedPoint = globe.pick(camera.getPickRay(new Cesium.Cartesian2(clientWidth/2 , clientHeight/2)), scene);
                    	var terrainHeight = Cesium.Ellipsoid.WGS84.cartesianToCartographic(intersectedPoint).height;
                    	var center = Cesium.Cartesian3.fromDegrees(lon, lat, terrainHeight);
                        var heading = Cesium.Math.toRadians(0);
                        var pitch = Cesium.Math.toRadians(-50);
                    	var range = 200;   
                    	camera.lookAt(center, new Cesium.HeadingPitchRange(heading, pitch, range));
                    	camera.lookAtTransform(Cesium.Matrix4.IDENTITY); 
                    	if (Cesium.defined(callBackFunc)) {
                    		callBackFunc.call(this);
                    	}
                    	clearInterval(timer);
            		}	
            	}, 1000)            	
            }
        })		
	}
  	
  	function addNewLayer() {
  		var _layers = new Array();
  		
		_layers.push(new CitydbKmlLayer({
			url : addLayerViewModel.url,
			name : addLayerViewModel.name,
			thematicDataUrl : addLayerViewModel.thematicDataUrl,
			cityobjectsJsonUrl : addLayerViewModel.cityobjectsJsonUrl,
			minLodPixels: addLayerViewModel.minLodPixels,
			maxLodPixels : addLayerViewModel.maxLodPixels == -1? Number.MAX_VALUE : addLayerViewModel.maxLodPixels,
			maxSizeOfCachedTiles: addLayerViewModel.maxSizeOfCachedTiles,
			maxCountOfVisibleTiles : addLayerViewModel.maxCountOfVisibleTiles
		}));
		
		loadLayerGroup(_layers);	
  	}  
  	
  	function removeSelectedLayer() {
  		var layer = webMap.activeLayer;
  		if (Cesium.defined(layer)) {
  			var layerId = layer.id;
  	  		document.getElementById(layerId).remove();
  	  		webMap.removeLayer(layerId);
  	  		// update active layer of the globe webMap
  	  		var webMapLayers = webMap._layers;
  	  		if (webMapLayers.length > 0) {
  	  			webMap.activeLayer = webMapLayers[0];
  	  		}
  	  		else {
  	  			webMap.activeLayer = undefined;
  	  		}
  		} 		
  	}
  	
	function addWebMapServiceProvider() {
		var baseLayerPickerViewModel = cesiumViewer.baseLayerPicker.viewModel;
		console.log(addWmsViewModel.proxyUrl);
		var wmsProviderViewModel = new Cesium.ProviderViewModel({
	        name : addWmsViewModel.name,
	        iconUrl : addWmsViewModel.iconUrl,
	        tooltip : addWmsViewModel.tooltip,
	        creationFunction : function() {
	            return new Cesium.WebMapServiceImageryProvider({
	    			url: addWmsViewModel.url,
	    			layers : addWmsViewModel.layers,
	    			parameters: Cesium.queryToObject(addWmsViewModel.additionalParameters),
	    			proxy: new Cesium.DefaultProxy(addWmsViewModel.proxyUrl)
	    		});
	        }
	    });
		baseLayerPickerViewModel.imageryProviderViewModels.push(wmsProviderViewModel);
		baseLayerPickerViewModel.selectedImagery = wmsProviderViewModel;
	}
	
	function removeImageryProvider() {
		var baseLayerPickerViewModel = cesiumViewer.baseLayerPicker.viewModel;
		var selectedImagery = baseLayerPickerViewModel.selectedImagery;
		baseLayerPickerViewModel.imageryProviderViewModels.remove(selectedImagery);
		baseLayerPickerViewModel.selectedImagery = baseLayerPickerViewModel.imageryProviderViewModels[0];
	}	  	

	function addTerrainProvider() {
		var baseLayerPickerViewModel = cesiumViewer.baseLayerPicker.viewModel;
		var demProviderViewModel = new Cesium.ProviderViewModel({
	        name : addTerrainViewModel.name,
	        iconUrl : addTerrainViewModel.iconUrl,
	        tooltip : addTerrainViewModel.tooltip,
	        creationFunction : function() {
	            return new Cesium.CesiumTerrainProvider({
	    			url : addTerrainViewModel.url
	    		});
	        }
	    })
		baseLayerPickerViewModel.terrainProviderViewModels.push(demProviderViewModel);
		baseLayerPickerViewModel.selectedTerrain = demProviderViewModel;
	}
	
	function removeTerrainProvider() {
		var baseLayerPickerViewModel = cesiumViewer.baseLayerPicker.viewModel;
		var selectedTerrain = baseLayerPickerViewModel.selectedTerrain;
		baseLayerPickerViewModel.terrainProviderViewModels.remove(selectedTerrain);
		baseLayerPickerViewModel.selectedTerrain = baseLayerPickerViewModel.terrainProviderViewModels[0];
	}
	
	function createScreenshot() {
  		cesiumViewer.render();
  		var imageUri = cesiumViewer.canvas.toDataURL();
  		var imageWin = window.open("");
  		imageWin.document.write("<html><head>" +
  				"<title>" + imageUri + "</title></head><body>" +
  				'<img src="' + imageUri + '"width="100%">' + 
  				"</body></html>");
  		return imageWin;
	}
	
	function printCurrentview() {
  		var imageWin = createScreenshot();
  		imageWin.document.close();
  		imageWin.focus();
  		imageWin.print();
  		imageWin.close();
	}
	
	function toggleShadows() {
		cesiumViewer.shadows = !cesiumViewer.shadows;
		if (cesiumViewer.shadows && !cesiumViewer.timeline) {
			CitydbUtil.showAlertWindow("YESNO", "Switching on shadows now", 'Do you want to display the timeline which' +
					' allows you to change the current date and time? Please note that "Yes" will reload the entire scene in the browser window.', 
			function() {
				window.location.href = generateLink();	
			});	
		}	
		if (!cesiumViewer.shadows) {
			cesiumViewer.terrainShadows = false;
		}
	}
	
	function toggleTerrainShadows() {
		cesiumViewer.terrainShadows = !cesiumViewer.terrainShadows;
		if (cesiumViewer.terrainShadows && !cesiumViewer.shadows) {
			CitydbUtil.showAlertWindow("OK", "Switching on terrain shadows now", 'Please note that shadows for 3D models will also be switched on.', 
			function() {
				toggleShadows();		
			});	
		}		
	}
	
	function createInfoTable(gmlid, cesiumEntity, citydbLayer) {
		var thematicDataUrl = citydbLayer.thematicDataUrl;
		cesiumEntity.description = "Loading feature information...";
		
		fetchDataFromGoogleFusionTable(gmlid, thematicDataUrl).then(function(kvp){
			console.log(kvp);
			var html = '<table class="cesium-infoBox-defaultTable" style="font-size:10pt"><tbody>';
	        for (var key in kvp) {
	            html += '<tr><td>' + key + '</td><td>' + kvp[key] + '</td></tr>';
	        }
	        html += '</tbody></table>';
	        
	        cesiumEntity.description = html;
		}).otherwise(function(error) {
			cesiumEntity.description = 'No feature information found';
		});		
	}
	
	function fetchDataFromGoogleSpreadsheet(gmlid, thematicDataUrl) {
		var kvp = {};
		var deferred = Cesium.when.defer();
		
		var spreadsheetKey = thematicDataUrl.split("/")[5];
		var metaLink = 'https://spreadsheets.google.com/feeds/worksheets/' + spreadsheetKey + '/public/full?alt=json-in-script';
		
		Cesium.jsonp(metaLink).then(function(meta) {
			console.log(meta);			
			var feedCellUrl = meta.feed.entry[0].link[1].href;
			feedCellUrl += '?alt=json-in-script&min-row=1&max-row=1';
			Cesium.jsonp(feedCellUrl).then(function(cellData) {
				var feedListUrl = meta.feed.entry[0].link[0].href;
				feedListUrl += '?alt=json-in-script&sq=gmlid%3D';
				feedListUrl += gmlid;
				Cesium.jsonp(feedListUrl).then(function(listData) {
					for (var i = 1; i < cellData.feed.entry.length; i++) {
						var key = cellData.feed.entry[i].content.$t;
						var value = listData.feed.entry[0]['gsx$' + key.toLowerCase().replace(/_/g,'')].$t;
						kvp[key] = value;
					}
					deferred.resolve(kvp);
				}).otherwise(function(error) {
					deferred.reject(error);
				});
			}).otherwise(function(error) {
				deferred.reject(error);
			});
		}).otherwise(function(error) {
			deferred.reject(error);
		});
		
		return deferred.promise;
	}
	
	function fetchDataFromGoogleFusionTable(gmlid, thematicDataUrl) {
		var kvp = {};
		var deferred = Cesium.when.defer();
		
		var tableID = CitydbUtil.parse_query_string('docid', thematicDataUrl); 		
		var sql = "sql=SELECT * FROM " + tableID + " WHERE GMLID = '" + gmlid + "'";
		var apiKey = "AIzaSyAm9yWCV7JPCTHCJut8whOjARd7pwROFDQ";		
		var queryLink = "https://www.googleapis.com/fusiontables/v2/query?" + sql + "&key=" + apiKey; 	

		Cesium.loadJson(queryLink).then(function(data) {
			console.log(data);
			var columns = data.columns;
			var rows = data.rows;
			for (var i = 0; i < columns.length; i++) {
				var key = columns[i];
				var value = rows[0][i];
				kvp[key] = value;
			}
			console.log(kvp);
			deferred.resolve(kvp);
		}).otherwise(function(error) {
			deferred.reject(error);
		});
		return deferred.promise;
	}
	
	
	function showInExternalMaps() {
		var mapOptionList = document.getElementById('citydb_showinexternalmaps');
		var selectedIndex = mapOptionList.selectedIndex; 
		mapOptionList.selectedIndex = 0;
		
		var selectedEntity = cesiumViewer.selectedEntity;
		if (!Cesium.defined(selectedEntity))
			return;

		var selectedEntityPosition = selectedEntity.position;
		var wgs84OCoordinate;
		
		if (!Cesium.defined(selectedEntityPosition)) {
			var boundingSphereScratch = new Cesium.BoundingSphere();
			cesiumViewer._dataSourceDisplay.getBoundingSphere(selectedEntity, false, boundingSphereScratch);
			wgs84OCoordinate = Cesium.Ellipsoid.WGS84.cartesianToCartographic(boundingSphereScratch.center);
		}
		else {		
			wgs84OCoordinate = Cesium.Ellipsoid.WGS84.cartesianToCartographic(selectedEntityPosition._value);

		}
		var lat = Cesium.Math.toDegrees(wgs84OCoordinate.latitude);
		var lon = Cesium.Math.toDegrees(wgs84OCoordinate.longitude);
		var mapLink = "";		

		switch (selectedIndex) {
			case 1:
				mapLink = 'http://data.mapchannels.com/dualmaps5/map.htm?lat=' + lat + '&lng=' + lon + '&z=18&slat=' + lat + '&slng=' + lon + '&sh=-150.75&sp=-0.897&sz=1&gm=0&bm=2&panel=s&mi=1&md=0';
				break;
			case 2:
				mapLink = 'http://www.openstreetmap.org/index.html?lat=' + lat + '&lon=' + lon + '&zoom=20'; 
				break;
			case 3:
				mapLink = 'http://www.bing.com/maps/default.aspx?v=2&cp=' + lat + '~' + lon + '&lvl=19&style=o';
				break;
			case 4:
				mapLink = 'http://data.dualmaps.com/dualmaps4/map.htm?x=' + lon + '&y=' + lat + '&z=16&gm=0&ve=4&gc=0&bz=0&bd=0&mw=1&sv=1&sva=1&svb=0&svp=0&svz=0&svm=2&svf=0&sve=1';
				break;
			default:
				//	do nothing...
		}
		
		window.open(mapLink);
	}




//shahab
function highlightWithId(){
 citydbKmlLayer.highlight(
{
"DEHH_1ab21131-6c4f-4af7-8b88-5bbff054ad1b": Cesium.Color.RED,
"DEHH_06744083-69db-42d0-b472-c131a3b845fe": Cesium.Color.YELLOW,
"DEHH_271806a0-bf0a-4967-8008-d468607ef0bb": Cesium.Color.BLUE
}
); 
}

function flyToHH(){
    cesiumCamera.flyTo({
            
        
                        destination : Cesium.Cartesian3.fromDegrees(10.093, 53.65, 500),
//         destination : Cesium.Cartesian3.fromDegrees(9.99, 53.52, 8500),
      
        
        orientation : {
        heading : Cesium.Math.toRadians(0),
        pitch : Cesium.Math.toRadians(-80),
        roll : 0.0
        }
        
    }
                       
                       )
}
                       
function changeToFP(){

//500-500
addLayerViewModel.url = "http://localhost/dashboard/500*500_FP_part/500_footprint_MasterJSON.json",
		addLayerViewModel.name = "Footprint"
                            }

//100-100
    /*addLayerViewModel.url = "http://localhost/dashboard/hh-complete-100-100/hh-complete_footprint_MasterJSON.json",
		addLayerViewModel.name = "Footprint"
                            }
*/
function changeToEX(){
    addLayerViewModel.url = "http://localhost/dashboard/hh-complete-100-100/hh-complete_extruded_MasterJSON.json",
		addLayerViewModel.name = "Extruded"

                            }

function changeToGE(){
    addLayerViewModel.url = "http://localhost/dashboard/hh-complete-100-100/hh-complete_GEOMETRY_MasterJSON.json",
		addLayerViewModel.name = "Geometry"
                            }

function Berlin(){
    addLayerViewModel.url = "http://localhost/dashboard/Berlin_New/Berlin_Buildings_rgbTexture_collada_MasterJSON.json",

        addLayerViewModel.name = "Berlin"

}

//var setRed = function(){
//      setStyle(Cesium.Color.CRIMSON);
//    } 
//
//

