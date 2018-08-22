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

otp.namespace("otp.widgets.transit");

otp.widgets.transit.ShareToWidget =
    otp.Class(otp.widgets.Widget, {

    module : null,

    agency_id : null,

    activeLeg : null,
    timeIndex : null,

    routeLookup : [], // for retrieving route obj from numerical index in <select> element

    lastSize : null,
    //variantIndexLookup : null,

    initialize : function(id, module) {
    	this.module = module;
    	
        var this_ = this;
    	
    	otp.widgets.Widget.prototype.initialize.call(this, id, module, {
            title : _tr('Share to...'),
            cssClass : 'otp-shareto',
            closeable : true,
            openInitially : false,
            persistOnClose : true,
        });
    	
    	addthis_config = {
   	         pubid: otp.config.addThisPubId,
   	         data_track_clickback: false
   	    };
   	    $.getScript("http://s7.addthis.com/js/250/addthis_widget.js#pubid="+otp.config.addThisPubId, function() {
	        var addThisHtml = '<div id="addthis" class="addthis_toolbox addthis_default_style"\n';
	        addThisHtml += 'addthis:url="'+otp.config.siteUrl+'"\n';
	        addThisHtml += 'addthis:title="'+otp.config.addThisTitle+'"\n';
	        addThisHtml += 'addthis:description="'+otp.config.siteDescription+'">\n';
	        addThisHtml += '<a class="addthis_button_twitter"></a>\n';
	        addThisHtml += '<a class="addthis_button_facebook"></a>\n';
	        addThisHtml += '<a class="addthis_button_google_plusone_share"></a>\n';
	        addThisHtml += '<a class="addthis_button_preferred_1"></a>\n';
	        addThisHtml += '<a class="addthis_button_compact"></a>\n';
	        addThisHtml += '<a class="addthis_counter addthis_bubble_style"></a>\n';
	        addThisHtml += '</div>';

	        this_.mainDiv.append(addThisHtml);
   	    });
    },   
});
