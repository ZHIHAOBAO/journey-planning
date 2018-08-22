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

otp.widgets.transit.DistanceWidget =
    otp.Class(otp.widgets.Widget, {

    module : null,

    agency_id : null,

    activeLeg : null,
    timeIndex : null,

    routeLookup : [], // for retrieving route obj from numerical index in <select> element

    lastSize : null,
    //variantIndexLookup : null,

    initialize : function(id, module) {

        otp.widgets.Widget.prototype.initialize.call(this, id, module, {
            title : _tr('Distance'),
            cssClass : 'otp-distance',
            closeable : true,
            openInitially : false,
            persistOnClose : true,
            resizable: false,
        });
              
        this.module = module;

        var this_ = this;
        
        this.activeTime = moment().unix() * 1000;

        var translated_template = {
                //TRANSLATORS: Date: date chooser (In stop viewer)
                
                //TRANSLATORS: Button
                find_stops: _tr('Measure Dis..'),
                //TRANSLATORS: When no public transit stops were selected in stop viewer       
        }
    
        
        ich['otp-distance'](translated_template).appendTo(this.mainDiv);
        
        
        this.mainDiv.find(".otp-distance-distance").click(function() {
        	
        	//distant method about planner module

        }); 
    },

    
});
