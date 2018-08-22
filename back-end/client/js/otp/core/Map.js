/* This program is free software: you can redistribute it and/or
   modify it under the teMap.jsrms of the GNU Lesser General Public License
   as published by the Free Software Foundation, either version 3 of
   the License, or (at your option) any later version.
   
   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.
   
   You should have received a copy of the GNU General Public License
   along with this program.  If not, see <http://www.gnu.org/licenses/>. 
*/

otp.namespace("otp.core");


otp.core.Map = otp.Class({

    webapp          : null,

    lmap            : null,
    layerControl    : null,
    icons       : null,
    
    
    contextMenu             : null,
    contextMenuModuleItems  : null,
    contextMenuLatLng       : null,
    
    baseLayers  : {},
    
    initialize : function(webapp) {
        var this_ = this;
        this.webapp = webapp;
        
        
                
        //var baseLayers = {};
        var defaultBaseLayer = null;
        
        for(var i=0; i<otp.config.baseLayers.length; i++) { //otp.config.baseLayers.length-1; i >= 0; i--) {
            var layerConfig = otp.config.baseLayers[i];

            var layerProps = { };
            if(layerConfig.attribution) layerProps['attribution'] = layerConfig.attribution;
            if(layerConfig.subdomains) layerProps['subdomains'] = layerConfig.subdomains;

            var layer = new L.TileLayer(layerConfig.tileUrl, layerProps);

	        this.baseLayers[layerConfig.name] = layer;
            if(i == 0) defaultBaseLayer = layer;            
	        
	        if(typeof layerConfig.getTileUrl != 'undefined') {
        	    layer.getTileUrl = otp.config.getTileUrl;
            }
        }
        

        var mapProps = { 
            layers  : [ defaultBaseLayer ],
            center : (otp.config.initLatLng || new L.LatLng(0,0)),
            zoom : (otp.config.initZoom || 2),
            zoomControl : false
        }
        if(otp.config.minZoom) mapProps['minZoom'] = otp.config.minZoom;  //_.extend(mapProps, { minZoom : otp.config.minZoom });
        if(otp.config.maxZoom) mapProps['maxZoom'] = otp.config.maxZoom; //_.extend(mapProps, { maxZoom : otp.config.maxZoom });

        this.lmap = new L.Map('map', mapProps);
        this.icons = new otp.modules.planner.IconFactory();

        
        //State Libray of Victoria
    	var point01 = [-37.81003, 144.96438];
    	var greenIcon = L.icon(
    		{
    	        iconUrl: resourcePath + 'images/marker-blue-med.png',
    	        shadowUrl: null,
    	        iconSize: new L.Point(13, 23),
    	        iconAnchor: new L.Point(7, 23),
    	        popupAnchor: new L.Point(0, -23)
    	}
    	);
    	var marker01 = L.marker(point01, {icon: greenIcon});
    	marker01.addTo(this.lmap);
    	marker01.bindPopup(
    			'<b>State Libray of Victoria</b><div><br><img style="width:100%" src="https://upload.wikimedia.org/wikipedia/commons/e/e4/StateLibraryofVictoria%2C_Oct_2005.jpg" alt="image" /></div>'
    			+ "<br>Address: 328 Swanston St, Melbourne VIC 3000"
    			+ "<br>Website: <a href='http://www.slv.vic.gov.au/' target='_blank'>slv.vic.gov.au</a>"
    			+ "<br>Phone: (03) 8664 7000"

    		);

    	//QV Melbourne
    	var point02 = [-37.81089, 144.96491];
    	var greenIcon = L.icon(
    		{
    	        iconUrl: resourcePath + 'images/marker-blue-med.png',
    	        shadowUrl: null,
    	        iconSize: new L.Point(13, 23),
    	        iconAnchor: new L.Point(7, 23),
    	        popupAnchor: new L.Point(0, -23)
    	}
    	);
    	var marker02 = L.marker(point02, {icon: greenIcon});
    	marker02.addTo(this.lmap);
    	marker02.bindPopup(
    			'<b>QV Melbourne</b><div><br><img style="width:100%" src="https://upload.wikimedia.org/wikipedia/commons/3/31/Melbourne-QV_Village_2008.JPG" alt="image" /></div>'
    			+ "<br>Address: Cnr Lonsdale Street and, Swanston St, Melbourne VIC 3000"
    			+ "<br>Website: <a href='http://www.qv.com.au/' target='_blank'>qv.com.au</a>"
    			+ "<br>Phone: (03) 9207 9200"

    		);
    	
    	//Melbourne Central
    	var point03 = [-37.81035, 144.96302];
    	var greenIcon = L.icon(
    		{
    	        iconUrl: resourcePath + 'images/marker-blue-med.png',
    	        //shadowUrl: null,
    	        //iconSize: new L.Point(13, 23),
    	        //iconAnchor: new L.Point(7, 23),
    	        //popupAnchor: new L.Point(0, -23)
    	}
    	);
    	var marker03 = L.marker(point03, {icon: greenIcon});
    	marker03.addTo(this.lmap);
    	marker03.bindPopup(
    			'<b>Melbourne Central</b><div><br><img style="width:100%" src="https://upload.wikimedia.org/wikipedia/commons/9/98/Melbourne_central_1.jpg" alt="image" /></div>'
    			+ "<br>Address: La Trobe St & Swanston Street, Melbourne VIC 3000"
    			+ "<br>Website: <a href='http://www.melbournecentral.com.au/' target='_blank'>melbournecentral.com.au</a>"
    			+ "<br>Phone: (03) 9922 1100"

    		);
    	
    	//Melbourne Museum
    	var point04 = [-37.80358, 144.97181];
    	var greenIcon = L.icon(
    		{
    	        iconUrl: resourcePath + 'images/marker-blue-med.png',
    	        shadowUrl: null,
    	        iconSize: new L.Point(13, 23),
    	        iconAnchor: new L.Point(7, 23),
    	        popupAnchor: new L.Point(0, -23)
    	}
    	);
    	var marker04 = L.marker(point04, {icon: greenIcon});
    	marker04.addTo(this.lmap);
    	marker04.bindPopup(
    			'<b>Melbourne Museum</b><div><br><img style="width:100%" src="https://upload.wikimedia.org/wikipedia/commons/2/2b/Melbourne_Museum_exterior.jpg" alt="image" /></div>'
    			+ "<br>Address: 11 Nicholson St, Carlton VIC 3053"
    			+ "<br>Website: <a href='http://www.museumsvictoria.com.au/' target='_blank'>museumsvictoria.com.au</a>"
    			+ "<br>Phone: (03) 8341 7777"

    		);
    	
    	//Federation Square
    	var point05 = [-37.81798, 144.96881];
    	var greenIcon = L.icon(
    		{
    	        iconUrl: resourcePath + 'images/marker-blue-med.png',
    	        shadowUrl: null,
    	        iconSize: new L.Point(13, 23),
    	        iconAnchor: new L.Point(7, 23),
    	        popupAnchor: new L.Point(0, -23)
    	}
    	);
    	var marker05 = L.marker(point05, {icon: greenIcon});
    	marker05.addTo(this.lmap);
    	marker05.bindPopup(
    			'<b>Federation Square</b><div><br><img style="width:100%" src="https://upload.wikimedia.org/wikipedia/commons/6/60/B2.2008_fedsquare.JPG" alt="image" /></div>'
    			+ "<br>Address: Swanston St & Flinders St, Melbourne VIC 3000"
    			+ "<br>Website: <a href='http://www.fedsquare.com/' target='_blank'>fedsquare.com</a>"
    			+ "<br>Phone: (03) 9655 1900"

    		);
    	
    	//St Paul Cathedral
    	var point06 = [-37.81687, 144.96763];
    	var greenIcon = L.icon(
    		{
    	        iconUrl: resourcePath + 'images/marker-blue-med.png',
    	        shadowUrl: null,
    	        iconSize: new L.Point(13, 23),
    	        iconAnchor: new L.Point(7, 23),
    	        popupAnchor: new L.Point(0, -23)
    	}
    	);
    	var marker06 = L.marker(point06, {icon: greenIcon});
    	marker06.addTo(this.lmap);
    	marker06.bindPopup(
    			'<b>St Paul Cathedral</b><div><br><img style="width:100%" src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/St_pauls_cathedral_melbourne.jpg/199px-St_pauls_cathedral_melbourne.jpg" alt="image" /></div>'
    			+ "<br>Address: Flinders Ln & Swanston St, Melbourne VIC 3000"
    			+ "<br>Website: <a href='http://www.stpaulscathedral.org.au/' target='_blank'>stpaulscathedral.org.au</a>"
    			+ "<br>Phone: (03) 9653 4333"

    		);
    	
    	//Arts Centre Melbourne
    	var point07 = [-37.82146, 144.96850];
    	var greenIcon = L.icon(
    		{
    	        iconUrl: resourcePath + 'images/marker-blue-med.png',
    	        shadowUrl: null,
    	        iconSize: new L.Point(13, 23),
    	        iconAnchor: new L.Point(7, 23),
    	        popupAnchor: new L.Point(0, -23)
    	}
    	);
    	var marker07 = L.marker(point07, {icon: greenIcon});
    	marker07.addTo(this.lmap);
    	marker07.bindPopup(
    			'<b>Arts Centre Melbourne</b><div><br><img style="width:100%" src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/The-arts-centre-spire-melbourne.JPG/180px-The-arts-centre-spire-melbourne.JPG" alt="image" /></div>'
    			+ "<br>Address: 100 St Kilda Rd, Melbourne VIC 3004"
    			+ "<br>Website: <a href='http://www.artscentremelbourne.com.au/' target='_blank'>artscentremelbourne.com.au</a>"
    			+ "<br>Phone: (03) 1300 182 183"

    		);
    	
    	//Royal Botanic Gardens Melbourne
    	var point08 = [-37.83023, 144.97956];
    	var greenIcon = L.icon(
    		{
    	        iconUrl: resourcePath + 'images/marker-blue-med.png',
    	        shadowUrl: null,
    	        iconSize: new L.Point(13, 23),
    	        iconAnchor: new L.Point(7, 23),
    	        popupAnchor: new L.Point(0, -23)
    	}
    	);
    	var marker08 = L.marker(point08, {icon: greenIcon});
    	marker08.addTo(this.lmap);
    	marker08.bindPopup(
    			'<b>Royal Botanic Gardens Melbourne</b><div><br><img style="width:100%" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Melbourne_Australia_Royal_Botanical_Garden.JPG/180px-Melbourne_Australia_Royal_Botanical_Garden.JPG" alt="image" /></div>'
    			+ "<br>Address: Birdwood Ave, South Yarra VIC 3141"
    			+ "<br>Website: <a href='http://www.rbg.vic.gov.au/' target='_blank'>rbg.vic.gov.au</a>"
    			+ "<br>Phone: (03) 9252 2300"

    		);
    	
    	//Cooks Cottage
    	var point09 = [-37.81444, 144.97947];
    	var greenIcon = L.icon(
    		{
    	        iconUrl: resourcePath + 'images/marker-blue-med.png',
    	        shadowUrl: null,
    	        iconSize: new L.Point(13, 23),
    	        iconAnchor: new L.Point(7, 23),
    	        popupAnchor: new L.Point(0, -23)
    	}
    	);
    	var marker09 = L.marker(point09, {icon: greenIcon});
    	marker09.addTo(this.lmap);
    	marker09.bindPopup(
    			'<b>Cooks Cottage</b><div><br><img style="width:100%" src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Captain_Cooks_Cottage.jpg" alt="image" /></div>'
    			+ "<br>Address: Fitzroy Gardens, Wellington Parade, East Melbourne VIC 3002"
    			+ "<br>Website: <a href='https://whatson.melbourne.vic.gov.au/PlacesToGo/CooksCottage/Pages/CooksCottage.aspx/' target='_blank'>melbourne.vic.gov.au</a>"
    			+ "<br>Phone: (03) 9658 9658"

    		);
    	
    	//Parliament House
    	var point10 = [-37.81111, 144.97378];
    	var greenIcon = L.icon(
    		{
    	        iconUrl: resourcePath + 'images/marker-blue-med.png',
    	        shadowUrl: null,
    	        iconSize: new L.Point(13, 23),
    	        iconAnchor: new L.Point(7, 23),
    	        popupAnchor: new L.Point(0, -23)
    	}
    	);
    	var marker10 = L.marker(point10, {icon: greenIcon});
    	marker10.addTo(this.lmap);
    	marker10.bindPopup(
    			'<b>Parliament House</b><div><br><img style="width:100%" src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Parliament_House_Melbourne_2010.jpg/320px-Parliament_House_Melbourne_2010.jpg" alt="image" /></div>'
    			+ "<br>Address: Spring St, East Melbourne VIC 3002"
    			+ "<br>Website: <a href='https://www.parliament.vic.gov.au/' target='_blank'>parliament.vic.gov.au</a>"
    			+ "<br>Phone: (03) 9651 8911"

    		);
    	
    	//Flagstaff Gardens
    	var point11 = [-37.81055, 144.95433];
    	var greenIcon = L.icon(
    		{
    	        iconUrl: resourcePath + 'images/marker-blue-med.png',
    	        shadowUrl: null,
    	        iconSize: new L.Point(13, 23),
    	        iconAnchor: new L.Point(7, 23),
    	        popupAnchor: new L.Point(0, -23)
    	}
    	);
    	var marker11 = L.marker(point11, {icon: greenIcon});
    	marker11.addTo(this.lmap);
    	marker11.bindPopup(
    			'<b>Flagstaff Gardens</b><div><br><img style="width:100%" src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Flagstaff_Gardens_Melbourne.jpg/320px-Flagstaff_Gardens_Melbourne.jpg" alt="image" /></div>'
    			+ "<br>Address: 309/311 William St, West Melbourne VIC 3003"
    			+ "<br>Website: <a href='https://whatson.melbourne.vic.gov.au/Placestogo/ParksandGardens/AllParksandGardens/Pages/4435.aspx' target='_blank'>whatson.melbourne.vic.gov.au</a>"
    			+ "<br>Phone: (03) 9658 9658"

    		);
    	
    	//Emporium Melbourne
    	var point12 = [-37.81240, 144.96401];
    	var greenIcon = L.icon(
    		{
    	        iconUrl: resourcePath + 'images/marker-blue-med.png',
    	        shadowUrl: null,
    	        iconSize: new L.Point(13, 23),
    	        iconAnchor: new L.Point(7, 23),
    	        popupAnchor: new L.Point(0, -23)
    	}
    	);
    	var marker12 = L.marker(point12, {icon: greenIcon});
    	marker12.addTo(this.lmap);
    	marker12.bindPopup(
    			'<b>Emporium Melbourne</b><div><br><img style="width:100%" src="https://www.propertyobserver.com.au/images/2014/04/16/emporium-april-16-breakout.jpg" alt="image" /></div>'
    			+ "<br>Address: 287 Lonsdale St, Melbourne VIC 3000"
    			+ "<br>Website: <a href='https://https://www.emporiummelbourne.com.au/' target='_blank'>emporiummelbourne.com.au/</a>"
    			+ "<br>Phone: (03) 8609 8221"

    		);
		


        this.layer_control = L.control.layers(this.baseLayers).addTo(this.lmap);
        L.control.zoom({ position : 'topright' }).addTo(this.lmap);
        //this.lmap.addControl(new L.Control.Zoom({ position : 'topright' }));
       
        //Adds debug inspector layers overlay to layers control
        //It gets all the layers from inspector layers API
        //debug layers can be enabled in config.js or as URL query:
        //?debug_layers=true
        if (otp.config.debug_layers === true) {
            var url = otp.config.hostname + '/' + otp.config.restService + '/inspector/layers';
            $.ajax(url, {
                dataType: 'JSON',
                success: function(data) {
                    var layers = {};
                    data.layers.map(function(layer) {
                        this.layer_control.addOverlay(new L.TileLayer(
                            otp.config.hostname + '/' + otp.config.restService + '/inspector/tile/' + layer.key + '/{z}/{x}/{y}.png',
                            { maxZoom : 22}), layer.name);
                    }, this_);

                }
            });
        }

        
      
        if(!otp.config.initLatLng) {
            var url = otp.config.hostname + '/' + otp.config.restService;
            $.ajax(url, {
                data: { routerId : otp.config.routerId },            
                dataType: 'JSON',
                success: function(data) {
                	this_.lmap.fitBounds([
                         [-37.73831, 144.96185],
                         [-37.86870, 144.97147]
                     ]);
                	/*
                    this_.lmap.fitBounds([
                        [data.lowerLeftLatitude, data.lowerLeftLongitude],
                        [data.upperRightLatitude, data.upperRightLongitude]
                    ]);
                    */
                }
            });
        }
       

        /*var baseMaps = {
            'Base Layer' : tileLayer 
        };*/
        
        var overlays = { };
        
        if(typeof otp.config.overlayTileUrl != 'undefined') {
	    	var overlayTileLayer = new L.TileLayer(otp.config.overlayTileUrl);
	    	//this.lmap.addLayer(overlayTileLayer);
	    	//overlays['Overlay'] = overlayTileLayer;
        }
        
        //this.layerControl = new L.Control.Layers(baseMaps, overlays);
        //this.layerControl.addTo(this.lmap);
        
        this.lmap.on('click', function(event) {
            webapp.mapClicked(event);        
        });
        

     
        

        this.lmap.on('viewreset', function(event) {
            webapp.mapBoundsChanged(event);        
        });

        this.lmap.on('dragend', function(event) {
            webapp.mapBoundsChanged(event);        
        });
        
        // setup context menu
        var this_ = this;
        
        this.contextMenu = new otp.core.MapContextMenu(this);
      
        this.activated = true;        
    },
    
    addContextMenuItem : function(text, clickHandler) {
        this.contextMenu.addModuleItem(text, clickHandler);
    },
    
    activeModuleChanged : function(oldModule, newModule) {
        
        //console.log("actModChanged: "+oldModule+", "+newModule);
        
        // hide module-specific layers for "old" module, if applicable
        if(oldModule != null) {
            for(var layerName in oldModule.mapLayers) {
                
                var layer = oldModule.mapLayers[layerName];
                this.lmap.removeLayer(layer);                
                //this.layerControl.removeLayer(layer);
            }
        }

        // show module-specific layers for "new" module
        for(var layerName in newModule.mapLayers) {
            var layer = newModule.mapLayers[layerName];
            this.lmap.addLayer(layer);
            var this_ = this;
        }
        
        // change default BaseLayer, if specified
        if(newModule.defaultBaseLayer) {
            for(layerName in this.baseLayers) {
                var baseLayer = this.baseLayers[layerName];
                if(layerName == newModule.defaultBaseLayer)
                    this.lmap.addLayer(baseLayer, true);
                else 
                    this.lmap.removeLayer(baseLayer);
            }
        }
        
        // refresh the map context menu
        this.contextMenu.clearModuleItems();
        newModule.addMapContextMenuItems();
    },
    
    setBounds : function(bounds)
    {
    	this.lmap.fitBounds(bounds);
    },
    
    $ : function() {
        return $("#map");
    },
    
    CLASS_NAME : "otp.core.Map"
});

