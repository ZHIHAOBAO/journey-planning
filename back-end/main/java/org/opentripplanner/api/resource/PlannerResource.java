/* This program is free software: you can redistribute it and/or
 modify it under the terms of the GNU Lesser General Public License
 as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>. */
package org.opentripplanner.api.resource;

import org.glassfish.grizzly.http.server.Request;
import org.onebusaway.gtfs.model.AgencyAndId;
import org.opentripplanner.api.common.RoutingResource;
import org.opentripplanner.api.model.Itinerary;
import org.opentripplanner.api.model.TripPlan;
import org.opentripplanner.api.model.error.PlannerError;
import org.opentripplanner.api.parameter.QualifiedMode;
import org.opentripplanner.api.parameter.QualifiedModeSet;
import org.opentripplanner.routing.core.RoutingRequest;
import org.opentripplanner.routing.core.TraverseModeSet;
import org.opentripplanner.routing.error.PathNotFoundException;
import org.opentripplanner.routing.impl.GraphPathFinder;
import org.opentripplanner.routing.spt.GraphPath;
import org.opentripplanner.standalone.OTPServer;
import org.opentripplanner.standalone.Router;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriInfo;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import static org.opentripplanner.api.resource.ServerInfo.Q;

/**
 * This is the primary entry point for the trip planning web service.
 * All parameters are passed in the query string. These parameters are defined as fields in the abstract
 * RoutingResource superclass, which also has methods for building routing requests from query
 * parameters. This allows multiple web services to have the same set of query parameters.
 * In order for inheritance to work, the REST resources are request-scoped (constructed at each request)
 * rather than singleton-scoped (a single instance existing for the lifetime of the OTP server).
 */
@Path("routers/{routerId}/plan") // final element needed here rather than on method to distinguish from routers API
public class PlannerResource extends RoutingResource {

    private static final Logger LOG = LoggerFactory.getLogger(PlannerResource.class);

    // We inject info about the incoming request so we can include the incoming query
    // parameters in the outgoing response. This is a TriMet requirement.
    // Jersey uses @Context to inject internal types and @InjectParam or @Resource for DI objects.
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML + Q, MediaType.TEXT_XML + Q })
    public Response plan(@Context UriInfo uriInfo, @Context Request grizzlyRequest) {

        /*
         * TODO: add Lang / Locale parameter, and thus get localized content (Messages & more...)
         * TODO: from/to inputs should be converted / geocoded / etc... here, and maybe send coords 
         *       or vertex ids to planner (or error back to user)
         * TODO: org.opentripplanner.routing.module.PathServiceImpl has COOORD parsing. Abstract that
         *       out so it's used here too...
         */

        // Create response object, containing a copy of all request parameters. Maybe they should be in the debug section of the response.
        Response response = new Response(uriInfo);
        RoutingRequest request = null;
        Router router = null;
        List<GraphPath> paths = null;
        try {
            if(this.intermediatePlaces != null && this.intermediatePlaces.size() > 0) {  	     	
            	// Save the start and end, as we overwrite them.
            	String initalStart = this.fromPlace;
            	String intialEnd = this.toPlace;
            	
            	List<String> intermediatePoints = this.intermediatePlaces;
            	this.intermediatePlaces = null; // Stops the existing multiple point code from running
            	
            	List<GraphPath> disjointPaths = new ArrayList<>();
                      
            	ArrayList<RoutingRequest> requestArray = new ArrayList<RoutingRequest>();
            	
            	for(int i = 0; i <= intermediatePoints.size(); ++i) {	
            		if(i != 0) { // If on first, keep the initial start point		   	
            			this.fromPlace = this.toPlace; // Use the last destination as the starting point 
            		}
            		
            		// 
            		if(i < intermediatePoints.size()) {
            			this.toPlace = intermediatePoints.get(i);
            		}
            		else {
            			// End of the loop, use the initialEndpoint
            			this.toPlace = intialEnd;
            		}
            		
            		// TODO: Get mode
            		this.modes = this.intermediateModes.get(i);
   		
            		// TODO: Get travel delay
            		
            		// Build request and get path
                    request = super.buildRequest();
                    router = otpServer.getRouter(request.routerId);
                	
                    requestArray.add(request);
                                        
                    /* Find some good GraphPaths through the OTP Graph. */
                    GraphPathFinder gpFinder = new GraphPathFinder(router); // we could also get a persistent router-scoped GraphPathFinder but there's no setup cost here
                	
                    // Get paths from point A to B
                    List<GraphPath> partialPaths = gpFinder.graphPathFinderEntryPoint(request);
                    
                    if (partialPaths == null || partialPaths.size() == 0) {
                        LOG.debug("Path not found: " + request.from + " : " + request.to);
                        request.rctx.debugOutput.finishedRendering(); // make sure we still report full search time
                        throw new PathNotFoundException();
                    }
                                        
                    // Add to list of disjoint paths to be joined into a complete journey
                    GraphPath path = partialPaths.get(0);
                    disjointPaths.add(path);                  
            	}   
            	
            	if(disjointPaths != null) {
            		paths = Collections.singletonList(GraphPathFinder.joinPathsWithModes(disjointPaths, requestArray));
                }
            }
            else {
            	/* Fill in request fields from query parameters via shared superclass method, catching any errors. */
                request = super.buildRequest();
                router = otpServer.getRouter(request.routerId);
            	
                /* Find some good GraphPaths through the OTP Graph. */
                GraphPathFinder gpFinder = new GraphPathFinder(router); // we could also get a persistent router-scoped GraphPathFinder but there's no setup cost here
            	
            	paths = gpFinder.graphPathFinderEntryPoint(request);
            }
            
            
            /* Convert the internal GraphPaths to a TripPlan object that is included in an OTP web service Response. */
            TripPlan plan = GraphPathToTripPlanConverter.generatePlan(paths, request);
            response.setPlan(plan);

        } catch (Exception e) {
            PlannerError error = new PlannerError(e);
            if(!PlannerError.isPlanningError(e.getClass()))
                LOG.warn("Error while planning path: ", e);
            response.setError(error);
        } finally {
            if (request != null) {
                if (request.rctx != null) {
                    response.debugOutput = request.rctx.debugOutput;
                }
                request.cleanup(); // TODO verify that this cleanup step is being done on Analyst web services
            }
        }

        /* Populate up the elevation metadata */
        response.elevationMetadata = new ElevationMetadata();
        response.elevationMetadata.ellipsoidToGeoidDifference = router.graph.ellipsoidToGeoidDifference;
        response.elevationMetadata.geoidElevation = request.geoidElevation;

        /* Log this request if such logging is enabled. */
        if (request != null && router != null && router.requestLogger != null) {
            StringBuilder sb = new StringBuilder();
            String clientIpAddress = grizzlyRequest.getRemoteAddr();
            //sb.append(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
            sb.append(clientIpAddress);
            sb.append(' ');
            sb.append(request.arriveBy ? "ARRIVE" : "DEPART");
            sb.append(' ');
            sb.append(LocalDateTime.ofInstant(Instant.ofEpochSecond(request.dateTime), ZoneId.systemDefault()));
            sb.append(' ');
            sb.append(request.modes.getAsStr());
            sb.append(' ');
            sb.append(request.from.lat);
            sb.append(' ');
            sb.append(request.from.lng);
            sb.append(' ');
            sb.append(request.to.lat);
            sb.append(' ');
            sb.append(request.to.lng);
            sb.append(' ');
            if (paths != null) {
                for (GraphPath path : paths) {
                    sb.append(path.getDuration());
                    sb.append(' ');
                    sb.append(path.getTrips().size());
                    sb.append(' ');
                }
            }
            router.requestLogger.info(sb.toString());
        }
        return response;
    }

}
