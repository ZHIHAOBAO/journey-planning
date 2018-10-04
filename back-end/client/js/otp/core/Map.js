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
		
		/*
    	 *  Code by Jeremy
    	 * 04/09/2018 6:03pm
    	 */
    	
    	 //MedicalOne - QV
               var point13 = [-37.81111, 144.96497];
               var greenIcon = L.icon(
                    {
                        iconUrl: resourcePath + 'images/icons8-medical.png',
                        shadowUrl: null,
                        iconSize: new L.Point(13, 23),
                        iconAnchor: new L.Point(7, 23),
                        popupAnchor: new L.Point(0, -23)
                }
                );
                var marker13 = L.marker(point13, {icon: greenIcon});
                marker13.addTo(this.lmap);
                marker13.bindPopup(
                        '<b>MedicalOne - QV</b><div><br><img style="width:100%" src="https://upload.wikimedia.org/wikipedia/commons/1/14/MedicalOne-image-Jeremy.jpg" alt="image" /></div>'
                        + "<br>Address: Level 3,23 QV Terrace,292 Swanston Street, Melbourne VIC 3000"
                        + "<br>Website: <a href='https://www.medicalone.com.au/centre/medical-one-qv' target='_blank'>https://www.medicalone.com.au/centre/medical-one-qv</a>"
                        + "<br>Phone: (03) 8663 7000"

                    );
                
                
                
                
                //Swanston  Street Medical Centre
                var point14 = [-37.81198, 144.96515];
                var greenIcon = L.icon(
                    {
                        iconUrl: resourcePath + 'images/icons8-medical.png',
                        shadowUrl: null,
                        iconSize: new L.Point(13, 23),
                        iconAnchor: new L.Point(7, 23),
                        popupAnchor: new L.Point(0, -23)
                }
                );
                var marker14 = L.marker(point14, {icon: greenIcon});
                marker14.addTo(this.lmap);
                marker14.bindPopup(
                        '<b>Swanston Street Medical Centre</b><div><br><img style="width:100%" src="https://upload.wikimedia.org/wikipedia/commons/9/9d/Swanston-Street-Medical-Centre-Left-RGB.png" alt="image" /></div>'
                        + "<br>Address: Level 3,255 Bourke Street, Melbourne VIC 3000"
                        + "<br>Website: <a href='https://swanstonstreetmedicalcentre.com.au' target='_blank'>https://swanstonstreetmedicalcentre.com.au</a>"
                        + "<br>Phone: (03) 9205 7500"

                    );
                
                //CBD Doctors Melbourne
                var point15 = [-37.81765, 144.96164];
                var greenIcon = L.icon(
                    {
                        iconUrl: resourcePath + 'images/icons8-medical.png',
                        shadowUrl: null,
                        iconSize: new L.Point(13, 23),
                        iconAnchor: new L.Point(7, 23),
                        popupAnchor: new L.Point(0, -23)
                }
                );
                var marker15 = L.marker(point15, {icon: greenIcon});
                marker15.addTo(this.lmap);
                marker15.bindPopup(
                        '<b>CBD Doctors Melbourne</b><div><br><img style="width:100%" src="https://upload.wikimedia.org/wikipedia/commons/1/14/CBD_Doctors_Melbourne.jpg" alt="image" /></div>'
                        + "<br>Address: 10/53 Queen Street, Melbourne VIC 3000"
                        + "<br>Website: <a href='https://cbddoctorsmelbourne.com.au' target='_blank'>https://www.cbddoctorsmelbourne.com.au/</a>"
                        + "<br>Phone: (03) 9077 9912"

                    );
                
                //The Town Medical Centre
                var point16 = [-37.81427, 144.96021];
                var greenIcon = L.icon(
                    {
                        iconUrl: resourcePath + 'images/icons8-medical.png',
                        shadowUrl: null,
                        iconSize: new L.Point(13, 23),
                        iconAnchor: new L.Point(7, 23),
                        popupAnchor: new L.Point(0, -23)
                }
                );
                var marker16 = L.marker(point16, {icon: greenIcon});
                marker16.addTo(this.lmap);
                marker16.bindPopup(
                        '<b>The Town Medical Centre</b><div><br><img style="width:100%" src="https://upload.wikimedia.org/wikipedia/commons/b/bd/TheTownMedicalCentre.jpg" alt="image" /></div>'
                        + "<br>Address: 5/179 Queen Street, Melbourne VIC 3000"
                        + "<br>Website: <a href='https://townmedicalcentre.com.au' target='_blank'>http://www.townmedicalcentre.com.au</a>"
                        + "<br>Phone: (03) 9670 5777"

                    );
                
                
                

                //Barry Road Medical Centre
                var point17 = [-37.81556, 144.95341];
                var greenIcon = L.icon(
                    {
                        iconUrl: resourcePath + 'images/icons8-medical.png',
                        shadowUrl: null,
                        iconSize: new L.Point(13, 23),
                        iconAnchor: new L.Point(7, 23),
                        popupAnchor: new L.Point(0, -23)
                }
                );
                var marker17 = L.marker(point17, {icon: greenIcon});
                marker17.addTo(this.lmap);
                marker17.bindPopup(
                        '<b>Barry Road Medical Centre</b><div><br><img style="width:100%" src="https://upload.wikimedia.org/wikipedia/commons/8/8a/BarryRoadMedicalCentre.jpg" alt="image" /></div>'
                        + "<br>Address: 347 Barry Rd, Campbellfield VIC 3061"
                        + "<br>Website: <a href='https://barryroadmedicalcentre.com.au' target='_blank'>barryroadmedicalcentre.com.au</a>"
                        + "<br>Phone: (03) 9357 0202"
                    );
                
                
                
                //La Trobe St Medical
                var point18 = [-37.80991, 144.96351];
                var greenIcon = L.icon(
                    {
                        iconUrl: resourcePath + 'images/icons8-medical.png',
                        shadowUrl: null,
                        iconSize: new L.Point(13, 23),
                        iconAnchor: new L.Point(7, 23),
                        popupAnchor: new L.Point(0, -23)
                }
                );
                var marker18 = L.marker(point18, {icon: greenIcon});
                marker18.addTo(this.lmap);
                marker18.bindPopup(
                        '<b>La Trobe St Medical</b><div><br><img style="width:100%" src="https://upload.wikimedia.org/wikipedia/commons/7/72/LaTrobeMedical.jpg" alt="image" /></div>'
                        + "<br>Address: 211 La Trobe St, Melbourne VIC 3000"
                        + "<br>Website: <a href='melbournecentralpharmacy.com.au' target='_blank'>melbournecentralpharmacy.com.au</a>"
                        + "<br>Phone: (03) 9650 0023"
                    );
                
                
                //Victoria Habour Medical Centre
                var point19 = [-37.82097, 144.94458];
                var greenIcon = L.icon(
                    {
                        iconUrl: resourcePath + 'images/icons8-medical.png',
                        shadowUrl: null,
                        iconSize: new L.Point(13, 23),
                        iconAnchor: new L.Point(7, 23),
                        popupAnchor: new L.Point(0, -23)
                }
                );
                var marker19 = L.marker(point19, {icon: greenIcon});
                marker19.addTo(this.lmap);
                marker19.bindPopup(
                        '<b>Victoria Habour Medical Centre</b><div><br><img style="width:100%" src="https://upload.wikimedia.org/wikipedia/commons/c/cf/VicHabourMedical.jpg" alt="image" /></div>'
                        + "<br>Address: 2/3/850 Collins St, Docklands VIC 3008"
                        + "<br>Website: <a href='victoriaharbourmedicalcentre.com.au' target='_blank'>victoriaharbourmedicalcentre.com.au</a>"
                        + "<br>Phone: (03) 9629 1414"

                    );
                
                //Melbourne West Police Station
                var point20 = [-37.81353, 144.95120];
                var greenIcon = L.icon(
                    {
                        iconUrl: resourcePath + 'images/icons8-policestation.png',
                        shadowUrl: null,
                        iconSize: new L.Point(13, 23),
                        iconAnchor: new L.Point(7, 23),
                        popupAnchor: new L.Point(0, -23)
                }
                );
                var marker20 = L.marker(point20, {icon: greenIcon});
                marker20.addTo(this.lmap);
                marker20.bindPopup(
                        '<b>Melbourne West Police Station</b><div><br><img style="width:100%" src="https://upload.wikimedia.org/wikipedia/commons/f/fe/WestPolice.jpg" alt="image" /></div>'
                        + "<br>Address: 313 Spencer St, Docklands VIC 3008"
                        + "<br>Website: <a href='police.vic.gov.au' target='_blank'>police.vic.gov.au</a>"
                        + "<br>Phone: (03) 8690 4444"
                    );
                
                //Victoria Police Centre
                var point21 = [-37.82195, 144.95348];
                var greenIcon = L.icon(
                    {
                        iconUrl: resourcePath + 'images/icons8-policestation.png',
                        shadowUrl: null,
                        iconSize: new L.Point(13, 23),
                        iconAnchor: new L.Point(7, 23),
                        popupAnchor: new L.Point(0, -23)
                }
                );
                var marker21 = L.marker(point21, {icon: greenIcon});
                marker21.addTo(this.lmap);
                marker21.bindPopup(
                        '<b>Victoria Police Centre</b><div><br><img style="width:100%" src="https://upload.wikimedia.org/wikipedia/commons/2/29/VIcPoliceCentre.jpg" alt="image" /></div>'
                        + "<br>Address: 637 Flinders St, Melbourne VIC 3008"
                        + "<br>Website: <a href='police.vic.gov.au' target='_blank'>police.vic.gov.au</a>"
                        + "<br>Phone: (03) 9247 6666"
                    );
                
                //Melbourne East Police Station
                var point22 = [-37.82195, 144.95348];
                var greenIcon = L.icon(
                    {
                        iconUrl: resourcePath + 'images/icons8-policestation.png',
                        shadowUrl: null,
                        iconSize: new L.Point(13, 23),
                        iconAnchor: new L.Point(7, 23),
                        popupAnchor: new L.Point(0, -23)
                }
                );
                var marker22 = L.marker(point22, {icon: greenIcon});
                marker22.addTo(this.lmap);
                marker22.bindPopup(
                        '<b>Melbourne East Police Station</b><div><br><img style="width:100%" src="https://upload.wikimedia.org/wikipedia/commons/a/ab/EastPolice.jpg" alt="image" /></div>'
                        + "<br>Address: 226 Flinders Ln, Melbourne VIC 3000"
                        + "<br>Website: <a href='police.vic.gov.au' target='_blank'>police.vic.gov.au</a>"
                        + "<br>Phone: (03) 9637 1100"
                    );
                
                //Hospitals
                //St.Vincent's Hospital
                var point23 = [-37.82195, 144.95348];
                var greenIcon = L.icon(
                    {
                        iconUrl: resourcePath + 'images/icons8-policestation.png',
                        shadowUrl: null,
                        iconSize: new L.Point(13, 23),
                        iconAnchor: new L.Point(7, 23),
                        popupAnchor: new L.Point(0, -23)
                }
                );
                var marker23 = L.marker(point23, {icon: greenIcon});
                marker23.addTo(this.lmap);
                marker23.bindPopup(
                        '<b>St.Vincent"s Hospital</b><div><br><img style="width:100%" src="https://upload.wikimedia.org/wikipedia/commons/8/8a/St_vincent%27s_hosp.jpg" alt="image" /></div>'
                        + "<br>Address: 41 Victoria Parade, Fitzroy VIC 3065"
                        + "<br>Website: <a href='svhm.org.au' target='_blank'>svhm.org.au</a>"
                        + "<br>Phone: (03) 9231 2211"
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

