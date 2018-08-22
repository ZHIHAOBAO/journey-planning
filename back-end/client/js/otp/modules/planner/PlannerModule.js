/* This program is free software: you can redistribute it and/or
   modify it under the terms of the GNU Lesser General Public License
   as published by the Free Software Foundation, either version 3 of
   the License, or (at your option) any later version.
   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.
   You should have received a copy of the GNU General Public License
   along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

otp.namespace("otp.modules.planner");

otp.modules.planner.defaultQueryParams = {
    startPlace                      : null,
    endPlace                        : null,
    time                            : moment().format(otp.config.locale.time.time_format),
    date                            : moment().format(otp.config.locale.time.date_format),
    arriveBy                        : false,
    wheelchair                      : false,
    mode                            : "TRANSIT,WALK",
    maxWalkDistance                 : 804.672, // 1/2 mi.
    metricDefaultMaxWalkDistance    : 750, // meters
    imperialDefaultMaxWalkDistance  : 804.672, // 0.5 mile
    preferredRoutes                 : null,
    otherThanPreferredRoutesPenalty : 300,
    bannedTrips                     : null,
    optimize                        : null,
    triangleTimeFactor              : 0.333,
    triangleSlopeFactor             : 0.333,
    triangleSafetyFactor            : 0.334,
}

otp.modules.planner.PlannerModule =
    otp.Class(otp.modules.Module, {

    moduleName  : "Trip Planner",
    
    a : [],
    b : [],
    
    
  
    
    markerLayer     : null,
    pathLayer       : null,
    pathMarkerLayer : null,
    highlightLayer  : null,
    markLocationLayer : null,
    maxPoints: 5,
    pointCount : 0,
    pointLatLngs : [],
    pointNames : [],
    
    startMarker : null,
    itinMarkers : [],
    
    //marklocation var
    markPointCount : 0,
    markPointLatLngs : [],
    markPointNames : [],
    markPointMarkers : [],
    
    pointMarkers : [],

    tipWidget       : null,
    noTripWidget    : null,
    tipStep         : 0,
    
    noTripWidget2   : null,   

    currentRequest  : null,
    currentHash : null,

    planTripFunction : null,
    sortBy: null,
    // current trip query parameters:
    /*
    startName               : null,
    endName                 : null,
    startLatLng             : null,
    endLatLng               : null,
    time                    : null,
    date                    : null,
    arriveBy                : false,
    mode                    : "TRANSIT,WALK",
    maxWalkDistance         : null,
    preferredRoutes         : null,
    bannedTrips             : null,
    optimize                : null,
    triangleTimeFactor      : 0.333,
    triangleSlopeFactor     : 0.333,
    triangleSafetyFactor    : 0.334,
    */

    // the defaults params, as modified in the module-specific config
    defaultQueryParams  : null,

    startTimePadding    : 0,

    // copy of query param set from last /plan request
    lastQueryParams : null,

    icons       : null,

    // this messages are used in noTripFound localization. Values are copied
    // from Java source and Message properties.
    error_messages : {
        500 : _tr("We're sorry. The trip planner is temporarily unavailable. Please try again later."),
        503 : _tr("We're sorry. The trip planner is temporarily unavailable. Please try again later."),
        400 : _tr("Trip is not possible.  You might be trying to plan a trip outside the map data boundary."),
        404 : _tr("No trip found. There may be no transit service within the maximum specified distance or at the specified time, or your start or end point might not be safely accessible."),
        406 : _tr("No transit times available. The date may be past or too far in the future or there may not be transit service for your trip at the time you chose."),
        408 : _tr("The trip planner is taking way too long to process your request. Please try again later."),
        413 : _tr("The request has errors that the server is not willing or able to process."),
        440 : _tr("Origin is unknown. Can you be a bit more descriptive?"),
        450 : _tr("Destination is unknown.  Can you be a bit more descriptive?"),
        460 : _tr("Both origin and destination are unknown. Can you be a bit more descriptive?"),
        470 : _tr("Both origin and destination are not wheelchair accessible"),
        409 : _tr("Origin is within a trivial distance of the destination."),

        340 : _tr("The trip planner is unsure of the location you want to start from. Please select from the following options, or be more specific."),
        350 : _tr("The trip planner is unsure of the destination you want to go to. Please select from the following options, or be more specific."),
        360 : _tr("Both origin and destination are ambiguous. Please select from the following options, or be more specific."),

        370 : _tr("All of triangleSafetyFactor, triangleSlopeFactor, and triangleTimeFactor must be set if any are"),
        371 : _tr("The values of triangleSafetyFactor, triangleSlopeFactor, and triangleTimeFactor must sum to 1"),
        372 : _tr("If triangleSafetyFactor, triangleSlopeFactor, and triangleTimeFactor are provided, OptimizeType must be TRIANGLE"),
        373 : _tr("If OptimizeType is TRIANGLE, triangleSafetyFactor, triangleSlopeFactor, and triangleTimeFactor must be set"),
    },
    
    


    //templateFile : 'otp/modules/planner/planner-templates.html',

    initialize : function(webapp, id, options) {
        otp.modules.Module.prototype.initialize.apply(this, arguments);
        this.templateFiles.push('otp/modules/planner/planner-templates.html');

        this.icons = new otp.modules.planner.IconFactory();

        this.planTripFunction = this.planTrip;

        this.defaultQueryParams = _.clone(otp.modules.planner.defaultQueryParams);

        if (otp.config.metric) {
            this.defaultQueryParams.maxWalkDistance = this.defaultQueryParams.metricDefaultMaxWalkDistance;
        } else {
            this.defaultQueryParams.maxWalkDistance = this.defaultQueryParams.imperialDefaultMaxWalkDistance;
        }

        _.extend(this.defaultQueryParams, this.getExtendedQueryParams());

        if(_.has(this.options, 'defaultQueryParams')) {
            _.extend(this.defaultQueryParams, this.options.defaultQueryParams);
        }

        _.extend(this, _.clone(otp.modules.planner.defaultQueryParams));
    },

    activate : function() {
        if(this.activated) return;
        var this_ = this;

        // set up layers
        this.markerLayer = new L.LayerGroup();
        this.markLocationLayer = new L.LayerGroup();
        this.pathLayer = new L.LayerGroup();
        this.pathMarkerLayer = new L.LayerGroup();
        this.highlightLayer = new L.LayerGroup();

        this.addLayer("Highlights", this.highlightLayer);
        this.addLayer("Start/End Markers", this.markerLayer);
        this.addLayer("MarkLoction",this.markLocationLayer);
        this.addLayer("Paths", this.pathLayer);
        this.addLayer("Path Markers", this.pathMarkerLayer);

        //this.webapp.indexApi.loadAgencies(this);
        this.webapp.indexApi.loadRoutes(this, function() {
            this.routesLoaded();
        });
        
        
        
        
        this.activated = true;
        
        

        // set up primary widgets (TODO: move to bike planner module)
        /*this.tipWidget = this.createWidget("otp-tipWidget", "", this);
        this.addWidget(this.tipWidget);
        this.updateTipStep(1);
        this.bikestationsWidget = new otp.widgets.BikeStationsWidget('otp-bikestationsWidget', this);
        this.addWidget(this.bikestationsWidget);
        this.noTripWidget = new otp.widgets.Widget('otp-noTripWidget', this);
        this.addWidget(this.noTripWidget);*/
        
        
    },
    
    
    
    
    

    restore : function() {
        // check URL params for restored trip
        if("fromPlace" in this.webapp.urlParams && "toPlace" in this.webapp.urlParams) {
            if("itinIndex" in this.webapp.urlParams) this.restoredItinIndex = this.webapp.urlParams["itinIndex"];
            this.restoreTrip(_.omit(this.webapp.urlParams, ["module", "itinIndex"]));
        }
    },

    addMapContextMenuItems : function() {
        var this_ = this;
        //TRANSLATORS: Context menu
        this.webapp.map.addContextMenuItem(_tr("Add new point"), function(latlng) {
            this_.setPoint(latlng, true, null, this_.pointCount);
        });
    },

    handleClick : function(event) {	
    	var this_ = this;
  	
    	if(this.markLocationWidgt.mark) {			
	        this.setMarkPoint(new L.LatLng(event.latlng.lat, event.latlng.lng), true, null, this.markPointCount);
    	} else if(this.pointCount < this.maxPoints) {
        	this.setPoint(new L.LatLng(event.latlng.lat, event.latlng.lng), true, null, this.pointCount);
        }   	
    },
   
    favouriteSavePressed : function(pointList) {
    	this.invokeHandlers("favouriteSavePressed", [this.pointNames, this.pointLatLngs]);
    },
    
    favouriteLoadPoints : function(pointNames, pointLatLngs) { 	
    	// clear points
    	this.clearTrip();

    	for(var pointIdx = 0; pointIdx < pointLatLngs.length; ++pointIdx) {
    		var pointName = pointNames[pointIdx];
    		var pointLatLng = pointLatLngs[pointIdx];
    		
    		if(pointLatLng != null && pointLatLng != undefined){		
    			this.setPoint(pointLatLng, false, pointName, pointIdx); 
    		}
    	}
    	
    	this.invokeHandlers("loadPointsFromArray", [pointNames, pointLatLngs]);   	
    	
    	this.planTrip();
    },
    
    removeLastPoint : function() {
    	var pointIdx = this.pointCount-1;
    	
    	this.pointNames.splice(pointIdx, 1);
    	this.pointLatLngs.splice(pointIdx, 1);
	
		var marker = this.pointMarkers[pointIdx];	
		if(marker) {
			this.markerLayer.removeLayer(marker);		
		}
		this.pointMarkers.splice(pointIdx, 1);

    	--this.pointCount;
    	
    	// Find the last marker and set it as the end.
		for(var loopIdx = (this.maxPoints - 1); loopIdx > 0; --loopIdx)
		{			
			if(this.pointMarkers[loopIdx] != null){
				this.pointMarkers[loopIdx].setIcon(this.icons.endFlag);
				break;
			}
		}
    	
    	this.pathLayer.clearLayers();
    },
    
    setPoint : function(latlng, update, name, pointNum) {
    	var currentPointNum = this.pointCount;

		if(this.pointLatLngs[pointNum] == null) {
    		++this.pointCount
    	}

    	this.pointNames[pointNum] = (typeof name !== 'undefined') ? name : null; 	
    	this.pointLatLngs[pointNum] = latlng;

    	var marker = this.pointMarkers[pointNum];

    	// If marker does not exist, create at latlng pos and apply events
    	if(marker == null) {

    		var iconFlag = null;
    		if(pointNum == 0) {
    			iconFlag = this.icons.startFlag;
    		}
    		else {
    			iconFlag = this.icons.intermediateFlag;		
    		}

    		marker = new L.Marker(latlng, {icon: iconFlag, draggable: true});


    		var flagPopupInfo = 'Point ' + (pointNum+1);	
    		marker.bindPopup('<strong>' + pgettext('popup', flagPopupInfo) + '</strong>');
  		
            // Drag event
            marker.on('dragend', $.proxy(function() {
                this.webapp.hideSplash();
                this.setPoint(marker.getLatLng(), false, null, pointNum);        
                // clear any name that was set
                this.pointNames[pointNum] = null;

                this.invokeHandlers("pointChanged", [this.pointLatLngs[pointNum], null, pointNum]);
                if(typeof this.userPlanTripStart == 'function') this.userPlanTripStart();
                this.planTripFunction.apply(this);//planTrip();
            }, this));

            this.markerLayer.addLayer(marker);	
    	}
    	
    	else {
    		marker.setLatLng(latlng);
    	}

    	this.pointMarkers[pointNum] = marker;

    	// TODO: Do this when adding marker.
    	// Find last marker and set it to EndFlag, change all others to intermediate(except last)
    	var iconFlagToSet = this.icons.endFlag;

		for(var loopIdx = (this.maxPoints - 1); loopIdx > 0; --loopIdx)
		{			
			if(this.pointMarkers[loopIdx] != null){
				this.pointMarkers[loopIdx].setIcon(iconFlagToSet);

				iconFlagToSet = this.icons.intermediateFlag; // Now set all others to intermediate icons
			}
		}

        this.invokeHandlers("pointChanged", [latlng, name, pointNum]);

        if(update) {
        	// If start point is set, then send the plan request
            if(latlng) {
                if(typeof this.userPlanTripStart == 'function') this.userPlanTripStart();
                this.planTripFunction.apply(this);//this.planTrip();
            }
        }
    },
    
    showOkDialog : function(message, title) {
        var dialog = ich['otp-okDialog']({
            message : message,
            ok : _tr('OK')
            
        }).dialog({
            title : "Reminder",
            appendTo: 'body',
            modal: true,
            zIndex: 100000,
            wideth : "280",
            height: "180",
        });
        
        dialog.find(".okButton").button().click(function() {
            dialog.dialog("close");
        });
    },  
    
    showSharetoDialog : function(message, title) {
        var dialog = ich['otp-showSharetoDialog']({
            message : message,
            ok : _tr('OK')
            
        }).dialog({
            title : "Share",
            appendTo: 'body',
            modal: true,
            zIndex: 100000,
            wideth : "280",
            height: "180",
        });
        
        dialog.find(".okButton").button().click(function() {
            dialog.dialog("close");
        });
    },  
    
    

    //input mark about location name and its comments
    showCommentDialog : function(message, title, callback, marker) {
        
    	var this_= this;
    	
    	var dialog = ich['otp-commentDialog']({
            message : message
            
        }).dialog({
            title : "Mark Function",
            appendTo: 'body',
            //modal: true,
            zIndex: 100000,
            //Resized the width and height
            width : "280",
            height : "200",  
            
        });
        
        
        
    	//mark version 1.2
        
        dialog.find(".okButton").button().click(function() {
        	
        	dialog.dialog("close");

        	
        	a = dialog.find('.inputlocname').val();
        	b = dialog.find('.inputComname').val();
        	
        	//console.log(a+b);
        	//console.log(marker);
    		
        	var flagPopupInfo = 'Name: ' + a + '<br/>Comments: ' + b +'<br/><br/>' ;
        	var space = '&nbsp;';
        	marker.bindPopup('<strong>' + pgettext('popup', flagPopupInfo) 
        								+ "<input type='button' value='X' class='marker-delete-button'/>"
        								+ pgettext('spc', space)
        								+ "<input type='button' value='Share' class='marker-share-button'/>"
        								+ '</strong>').openPopup();
        	
            //delete single maker  mark version 1.3
        	$(".marker-delete-button").click(function() {
            	
            	var msg= "you delete this marker";
            	this_.showOkDialog(msg);
            	this_.markLocationLayer.removeLayer(marker);
            
        	});
            
        	//share to social media  mark version 1.3
            $(".marker-share-button").click(function() {
            	
            	var msg= "Share button is on Bottom Right";
            	this_.showSharetoDialog(msg);
 
        	});
            
        });


        dialog.find(".cancelButton").button().click(function() {
        	
            dialog.dialog("close");
            var msg = "You cancelled set this marker"
            this_.showOkDialog(msg);

        });
        
        
        dialog.find(".deleteButton").button().click(function() {
			
			this_.markLocationLayer.clearLayers();

		});
    },
        

    
    //setMark
    setMarkPoint : function(latlng, update, name, pointNum) {	
    	var this_ = this;
  	
    	//var currentPointNum = this.markPointCount;

		//if(this.markPointLatLngs[pointNum] == null) {
    	//	++this.markPointCount
    	//}

    	//this.markPointNames[pointNum] = (typeof name !== 'undefined') ? name : null; 	
    	//this.markPointLatLngs[pointNum] = latlng;
    	

    	var marker = this.markPointMarkers[pointNum];

    	// If marker does not exist, create at latlng pos and apply events
    	if(marker == null) {
    		
    		var iconFlag = this.icons.smallBlue;
    		marker = new L.Marker(latlng, {icon: iconFlag, draggable: true});
    		
    		
    		this_.markLocationLayer.addLayer(marker);
    		
    		this.showCommentDialog(undefined, undefined, undefined, marker);
    		
    	}
    },
    
    openInfowindow : function(name,iWidth,iHeight){    	
    	name = null;
    	var iWidth; 
    	var iHeight;   	    	
    },

    getStartPoint : function() {
    	var result = null;

    	if(this.pointCount > 0) {
    		var pointName = this.pointNames[0];
    		var	pointLatLng = this.pointLatLngs[0];

    		if(pointLatLng != null) {
    			result = (pointName !== null ? pointName + "::" : "")
    						+ pointLatLng.lat + ',' + pointLatLng.lng;
    		}
    	}

    	return result;	
    },
    
    getEndPoint : function() {
    	var result = null;

    	for(var loopIdx = (this.maxPoints - 1); loopIdx > 0; --loopIdx)
		{			 	 		
    		var pointName = this.pointNames[loopIdx];
    		var	pointLatLng = this.pointLatLngs[loopIdx];

			if(pointLatLng != null && pointLatLng != undefined){	
	    		result = (pointName !== null ? pointName + "::" : "")
							+ pointLatLng.lat + ',' + pointLatLng.lng;						
				break;
			}
		}

    	return result;
    },

    getIntermediatePoints : function() {
    	var result = null;

    	var resultCount = 0; 	
    	var skippedLastPoint = false;

    	if(this.pointCount > 2)
    	{
    		for(var loopIdx = (this.maxPoints - 1); loopIdx > 0; --loopIdx)
    		{			
	    		var pointName = this.pointNames[loopIdx];
	    		var	pointLatLng = this.pointLatLngs[loopIdx];

	    		if(pointLatLng != null && pointLatLng != undefined)
	    		{
	    			if(!skippedLastPoint) {	
	    				skippedLastPoint = true;
	    			}
	    			else {	
	    				if(result == null) result = [];

	    				result[result.length] = (pointName !== null ? pointName + "::" : "")
													+ pointLatLng.lat + ',' + pointLatLng.lng;
	    			}	    				
	    		}
	    	}
    	}

    	if(result != null) {
    		result = result.reverse();
    	}


    	return result;
    },
    
    setIntermediateMode : function(mode, pointNum) {
    	if(this.intermediateModes == null) {
    		this.intermediateModes = [];
    	}
    	
    	this.intermediateModes[pointNum-1] = mode;
    },
    
    restoreTrip : function(queryParams) {
        this.restoreMarkers(queryParams);
        this.planTripFunction.call(this, queryParams);
    },

    restoreMarkers : function(queryParams) {
        this.startLatLng = otp.util.Geo.stringToLatLng(otp.util.Itin.getLocationPlace(queryParams.fromPlace));
        this.setStartPoint(this.startLatLng, false,this.startName);

        // TODO: if intermediate points, then use
        
        this.endLatLng = otp.util.Geo.stringToLatLng(otp.util.Itin.getLocationPlace(queryParams.toPlace));
        this.setEndPoint(this.endLatLng, false,this.endName);
    },

    planTrip : function(existingQueryParams, apiMethod) {
        if(typeof this.planTripStart == 'function') this.planTripStart();

        //this.noTripWidget.hide();

    	if(this.currentRequest !== null)
        {
    		//console.log("Canceling current request.");
        	this.currentRequest.abort();
        	this.currentRequest = null;
        }

    	apiMethod = apiMethod || 'plan';
        var url = otp.config.hostname + '/' + otp.config.restService + '/' + apiMethod;
        this.pathLayer.clearLayers();

        var this_ = this;

        var queryParams = null;

        if(existingQueryParams) {
        	queryParams = existingQueryParams;
        }
        else
        {
            if(this.getStartPoint() == null || this.getEndPoint() == null) {
                // TODO: alert user
                return;
            }
            
            var addToStart = this.arriveBy ? 0 : this.startTimePadding;
       	    queryParams = {
                fromPlace: this.getStartPoint(),
                toPlace: this.getEndPoint(),
                time : (this.time) ? otp.util.Time.correctAmPmTimeString(this.time) : moment().format("h:mma"),
                //time : (this.time) ? moment(this.time).add("s", addToStart).format("h:mma") : moment().add("s", addToStart).format("h:mma"),
                date : (this.date) ? moment(this.date, otp.config.locale.time.date_format).format("MM-DD-YYYY") : moment().format("MM-DD-YYYY"),
                mode: this.mode,
                maxWalkDistance: this.maxWalkDistance
            };
  
       	    var intermediatePoints = this.getIntermediatePoints();
       	    if(intermediatePoints != null) {
       	    	_.extend(queryParams, { intermediatePlaces : intermediatePoints } );
       	    }     
       	    
       	    var intermediateModes = this.intermediateModes;
    	    if(intermediateModes != null) {
    	    	_.extend(queryParams, { intermediateModes : intermediateModes } );
    	    } 
       	    

            if(this.sortBy !== null && this.sortBy !== "Please Select") _.extend(queryParams, { sortBy : this.sortBy } );

            if(this.arriveBy !== null) _.extend(queryParams, { arriveBy : this.arriveBy } );
            if(this.wheelchair !== null) _.extend(queryParams, { wheelchair : this.wheelchair });
            if(this.preferredRoutes !== null) {
                queryParams.preferredRoutes = this.preferredRoutes;
                if(this.otherThanPreferredRoutesPenalty !== null)
                    queryParams.otherThanPreferredRoutesPenalty = this.otherThanPreferredRoutesPenalty;
            }
            if(this.bannedRoutes !== null) _.extend(queryParams, { bannedRoutes : this.bannedRoutes } );
            if(this.bannedTrips !== null) _.extend(queryParams, { bannedTrips : this.bannedTrips } );
            if(this.optimize !== null) _.extend(queryParams, { optimize : this.optimize } );
            if(this.optimize === 'TRIANGLE') {
                _.extend(queryParams, {
                    triangleTimeFactor: this_.triangleTimeFactor,
                    triangleSlopeFactor: this_.triangleSlopeFactor,
                    triangleSafetyFactor: this_.triangleSafetyFactor
                });
            }
            if(this.maxHours) queryParams.maxHours = this.maxHours;
            if(this.numItineraries) queryParams.numItineraries = this.numItineraries;
            if(this.minTransferTime) queryParams.minTransferTime = this.minTransferTime;
            if(this.showIntermediateStops) queryParams.showIntermediateStops = this.showIntermediateStops;

            if(otp.config.routerId !== undefined) {
                queryParams.routerId = otp.config.routerId;
            }
        }
        $('#otp-spinner').show();

        //sends wanted translation to server
        _.extend(queryParams, {locale : otp.config.locale.config.locale_short} );

        this.lastQueryParams = queryParams;

        this.planTripRequestCount = 0;

        this.planTripRequest(url, queryParams, function(tripPlan) {
            var restoring = (existingQueryParams !== undefined)
            this_.processPlan(tripPlan, restoring);

            this_.updateTipStep(3);
        });
    },

    planTripRequest : function(url, queryParams, successCallback) {
        var this_ = this;
        this.currentRequest = $.ajax(url, {
            data:       queryParams,
            dataType:   'JSON',
            //Sends arrays as &b=1&b=2 instead of b[]=1&b[]=2 which is what
            //Jersey expects
            traditional: true,

            success: function(data) {
                $('#otp-spinner').hide();

                if (otp.config.debug) {
                    otp.debug.processRequest(data)
                }

                if(data.plan) {
                    // allow for optional pre-processing step (used by Fieldtrip module)
                    if(typeof this_.preprocessPlan == 'function') {
                        this_.preprocessPlan(data.plan, queryParams, function() {
                            this_.planReceived(data.plan, url, queryParams, successCallback);
                        });
                    }
                    else {
                        this_.planReceived(data.plan, url, queryParams, successCallback);
                    }
                }
                else {
                    this_.noTripFound(data.error);
                    //this_.noTripWidget.setContent(data.error.msg);
                    //this_.noTripWidget.show();
                }
            }
        });

    },

    planReceived : function(plan, url, queryParams, successCallback) {
        // compare returned plan.date to sent date/time to determine timezone offset (unless set explicitly in config.js)
        otp.config.timeOffset = (otp.config.timeOffset) ||
            (moment(queryParams.date+" "+queryParams.time, "MM-DD-YYYY h:mma") - moment(plan.date))/3600000;

        var tripPlan = new otp.modules.planner.TripPlan(plan, queryParams);

        var invalidTrips = [];

        // check trip validity
        if(typeof this.checkTripValidity == 'function') {
            for(var i = 0; i < tripPlan.itineraries.length; i++) {
                var itin = tripPlan.itineraries[i];
                for(var l = 0; l < itin.itinData.legs.length; l++) {
                    var leg = itin.itinData.legs[l];
                    if(otp.util.Itin.isTransit(leg.mode)) {
                        if(!this.checkTripValidity(leg.tripId, leg, itin)) {
                            invalidTrips.push(leg.tripId);
                        }
                    }
                }
            }
        }

        if(invalidTrips.length == 0) { // all trips are valid; proceed with this tripPlan
            successCallback.call(this, tripPlan);
        }
        else { // run planTrip again w/ invalid trips banned
            this.planTripRequestCount++;
            if(this.planTripRequestCount > 10) {
                this.noTripFound({ 'msg' : 'Number of trip requests exceeded without valid results'});
            }
            else {
                if(queryParams.bannedTrips && queryParams.bannedTrips.length > 0) {
                    queryParams.bannedTrips += ',' + invalidTrips.join(',');
                }
                else {
                    queryParams.bannedTrips = invalidTrips.join(',');
                }
                this.planTripRequest(url, queryParams, successCallback);
            }
        }
    },

    getExtendedQueryParams : function() {
        return { };
    },

    processPlan : function(tripPlan, restoring) {
    },

    noTripFound : function(error) {
        var msg = error.msg;
        if (error.id in this.error_messages) {
            msg = this.error_messages[error.id];
        }
        //TRANSLATORS: Used in showing why trip wasn't found
        if(error.id) msg += ' (' + _tr('Error %(error_id)d', {'error_id': error.id}) + ')';
        //TRANSLATORS: Title of no trip dialog
        otp.widgets.Dialogs.showOkDialog(msg, _tr('No Trip Found'));
    },
    
    clear: function(){
        this.pathLayer.clearLayers();
        this.pathMarkerLayer.clearLayers();    	
    },

    drawItinerary : function(itin, inactive) {
        var this_ = this;
        
        //this.pathLayer.clearLayers();
        //this.pathMarkerLayer.clearLayers();

        var queryParams = itin.tripPlan.queryParams;

        for(var i=0; i < itin.itinData.legs.length; i++) {
            var leg = itin.itinData.legs[i];

            // draw the polyline
            var polyline = new L.Polyline(otp.util.Geo.decodePolyline(leg.legGeometry.points));
            var weight = 8;
            polyline.setStyle({ color : this.getModeColor(leg.mode, inactive), weight: weight});
            this.pathLayer.addLayer(polyline);
            polyline.leg = leg;
            polyline.bindPopup("("+leg.routeShortName+") "+leg.routeLongName);

            /* Attempt at hover functionality for trip segments on map; disabled due to "flickering" problem
               Alt. future approach: create invisible polygon buffers around polylines
            polyline.on('mouseover', function(e) {
                if(e.target.hover) return;
                console.log('mouseover');
                this_.highlightLeg(e.target.leg);
                this_.pathMarkerLayer.clearLayers();
                this_.drawStartBubble(e.target.leg, true);
                this_.drawEndBubble(e.target.leg, true);
                e.target.hover = true;
            });
            polyline.on('mouseout', function(e) {
                var lpt = e.layerPoint, minDist = 100;
                for(var p=0; p<e.target._parts[0].length-1; p++) {
                    var dist = L.LineUtil.pointToSegmentDistance(lpt, e.target._parts[0][p], e.target._parts[0][p+1]);
                    minDist = Math.min(minDist, dist)
                }
                console.log("minDist: "+minDist);
                if(minDist < weight/2) return;
                this_.clearHighlights();
                this_.pathMarkerLayer.clearLayers();
                this_.drawAllStartBubbles(itin);
                e.target.hover = false;
            });
            */

            if(otp.util.Itin.isTransit(leg.mode)) {
                this.drawStartBubble(leg, false);
            }
            else if(leg.mode === 'BICYCLE') {
                if(queryParams.mode === 'WALK,BICYCLE_RENT') { // bikeshare trip
                        //TRANSLATORS: shown when clicked on route on map
                	polyline.bindPopup(_tr('Your %(bike_share_name)s route', {'bike_share_name': otp.config.bikeshareName}));
                    //var start_and_end_stations = this.processStations(polyline.getLatLngs()[0], polyline.getLatLngs()[polyline.getLatLngs().length-1]);
                }
                else { // regular bike trip
                        //TRANSLATORS: Text which is shown when clicking bike route
                        //in a map
                	polyline.bindPopup(_tr('Your bike route'));
                	//this.resetStationMarkers();
                }
            }
            else if(leg.mode === 'WALK') {
                if(queryParams.mode === 'WALK,BICYCLE_RENT') {
                    if(i == 0) {
                        //TRANSLATORS:Shown in map when clicking on a route
                    	polyline.bindPopup(_tr('Walk to the %(bike_share_name)s dock.', {'bike_share_name': otp.config.bikeshareName}));
                    }
                    if(i == 2) {
                        //TRANSLATORS: Shown in map when clicking on a route
                    	polyline.bindPopup(_tr('Walk from the %(bike_share_name)s dock to your destination.', {'bike_share_name': otp.config.bikeshareName}));
                    }
                }
                else { // regular walking trip
                    //TRANSLATORS: Text which is shown when clicking walking
                    //route in a map
                	polyline.bindPopup(_tr('Your walk route'));
                	//this.resetStationMarkers();
                }
            }
            //FIXME: CAR is missing
        }
        if (otp.config.zoomToFitResults) this.webapp.map.lmap.fitBounds(itin.getBoundsArray());
    },

    highlightLeg : function(leg) {
        if(!leg.legGeometry) return;
        var polyline = new L.Polyline(otp.util.Geo.decodePolyline(leg.legGeometry.points));
        polyline.setStyle({ color : "yellow", weight: 16, opacity: 0.3 });
        this.highlightLayer.addLayer(polyline);
    },

    clearHighlights : function() {
        this.highlightLayer.clearLayers();
    },

    drawStartBubble : function(leg, highlight) {
        var quadrant = (leg.from.lat < leg.to.lat ? 's' : 'n')+(leg.from.lon < leg.to.lon ? 'w' : 'e');
        var modeIcon = this.icons.getModeBubble(quadrant, leg.startTime, leg.mode, true, highlight);
        var marker = L.marker([leg.from.lat, leg.from.lon], {icon: modeIcon});
        this.pathMarkerLayer.addLayer(marker);
    },

    drawEndBubble : function(leg, highlight) {
        var quadrant = (leg.from.lat < leg.to.lat ? 'n' : 's')+(leg.from.lon < leg.to.lon ? 'e' : 'w');
        var modeIcon = this.icons.getModeBubble(quadrant, leg.endTime, leg.mode, false, highlight);
        var marker = L.marker([leg.to.lat, leg.to.lon], {icon: modeIcon});
        this.pathMarkerLayer.addLayer(marker);
    },

    drawAllStartBubbles : function(itin) {
        itin = itin.itinData;
        for(var i=0; i < itin.legs.length; i++) {
            var leg = itin.legs[i];
            if(otp.util.Itin.isTransit(leg.mode)) {
                this.drawStartBubble(leg, false);
            }
        }
    },

    getModeColor : function(mode, inactive) {
    	
        if(mode === "WALK") return '#444';
        if(mode === "BICYCLE") return '#0073e5';
        if(mode === "SUBWAY") return '#f00';
        if(mode === "RAIL") return '#b00';
        if(mode === "BUS") return '#080';
        if(mode === "TRAM") return '#800';
        if(mode === "CAR") return '#444';
        if(mode === "AIRPLANE") return '#f0f';
        return '#aaa';
    },

    clearTrip : function() {
    	var this_ = this;
    	
        for(var pointIdx = 0; pointIdx < this.pointCount; ++pointIdx) {
        	//this_.pointNames[pointIdx] = null;
        	//this_.pointLatLngs[pointIdx] = null;
    	
    		var marker = this_.pointMarkers[pointIdx];	
    		if(marker) this_.markerLayer.removeLayer(marker);
    		this_.pointMarkers[pointIdx] = null;
    	}
              
        this_.pointNames = [];
        this_.pointLatLngs = [];
        
        this.pathLayer.clearLayers();
        this.pathMarkerLayer.clearLayers();        
        this.pointCount = 0;   
    },

    savePlan : function(data) {
    	var data_ = {data: data, startLat: this.startLatLng.lat, startLon: this.startLatLng.lng, endLat: this.endLatLng.lat, endLon: this.endLatLng.lng, parrent : this.currentHash };
    	otp.util.DataStorage.store(data_, this );
    },

    // legacy -- deprecated by restoreTrip (above)
    restorePlan : function(data){

        this.startLatLng = new L.LatLng(data.startLat, data.startLon);
        this.setStartPoint(this.startLatLng, false,this.startName);

        this.endLatLng = new L.LatLng(data.endLat, data.endLon);
        this.setEndPoint(this.endLatLng, false,this.endName);

        this.webapp.setBounds(new L.LatLngBounds([this.startLatLng, this.endLatLng]));

        this.planTrip(data.data, true);
    },


    newTrip : function(hash) {
    	this.currentHash = hash;

    	window.location.hash = this.currentHash;

        var shareRoute = $("#share-route");
        shareRoute.find(".addthis_toolbox").attr("addthis:url", otp.config.siteUrl+"/#"+this.currentHash);
        addthis.toolbox(".addthis_toolbox_route");
    },

    distance : function(x1, y1, x2, y2) {
        return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
    },

    updateTipStep : function(step) { // TODO: factor out to widget class
    	/*
        if (step <= this.tipStep) return;
        if(step == 1) this.tipWidget.setContent("To Start: Click on the Map to Plan a Trip.");
        if(step == 2) this.tipWidget.setContent("Next: Click Again to Add Your Trip's End Point.");
        if(step == 3) this.tipWidget.setContent("Tip: Drag the Start or End Flags to Modify Your Trip.");
        */
        this.tipStep = step;
    },

    routesLoaded : function() {
    },

    CLASS_NAME : "otp.modules.planner.PlannerModule"
});