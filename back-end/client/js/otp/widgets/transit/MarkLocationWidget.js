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

otp.widgets.transit.MarkLocationWidget =
    otp.Class(otp.widgets.Widget, {
    
    module : null,
    agency_id : null,
    mark:null,
    activeLeg : null,
    timeIndex : null,

    routeLookup : [], // for retrieving route obj from numerical index in <select> element

    lastSize : null,
    //variantIndexLookup : null,

    initialize : function(id, module) {

        otp.widgets.Widget.prototype.initialize.call(this, id, module, {
            title : _tr('Mark Location'),
            cssClass : 'otp-markloc',
            closeable : true,
            openInitially : false,
            persistOnClose : true,
            mark:false,
        });
        

        this.module = module;

        var this_ = this;
        
        this.activeTime = moment().unix() * 1000;

        var translated_template = {
            
        	name: _tr('Name'),
        	//TRANSLATORS: Date: date chooser (In stop viewer)
            comment: _tr('Comment'),
            //TRANSLATORS: Button
            find_stops: _tr('Mark'),
            
            Cancel_mark_function: _tr('X'),
            //TRANSLATORS: When no public transit stops were selected in stop viewer
            no_stops_selected: _tr('(No Stop Selected)'),

        }
            
        ich['otp-markloc'](translated_template).appendTo(this.mainDiv);
              
        var currentDate = new Date();
        this.datePicker = this.mainDiv.find(".otp-markloc-dateInput");
        
        this.mainDiv.find(".otp-markloc-markloc").click(function() {
        	
        	this_.mark=true;

        	
        });
        
        this.mainDiv.find(".otp-markloc-back").click(function() {
        	this_.mark=false;
        });
    },

   
});
