/**
 *
 * This object represents the port constraint related to corresponding endpoint
 *
 * @author Alihan Okka
 *
 * @copyright i-Vis Research Group, Bilkent University, 2007 - present
 *
 */

const PointD = require('cose-base').layoutBase.PointD;
const CoSEPRotationalForce = require('./CoSEPRotationalForce');
const CoSEPConstants = require('./CoSEPConstants');

function CoSEPPortConstraint(edge, node) {
    // Associated CoSEP Edge
    this.edge = edge;

    // Incident Node of the associated edge
    this.node = node;

    // Holds the type of the constraint using 'enum' object constraintType
    this.portConstraintType = null;

    // Holds additional information related to port's constraint. For instance,
    // Free -> [0, 1, 2, 3]
    // Absolute -> 5    // any numerical value
    // Sided -> [0, 1]   // array of feasible directions
    this.portConstraintParameter = null;

    // Holds the current index at which the port is located at
    this.portIndex = null;

    // Holds the current coordinates of the port
    // { x: - , y: -}
    this.portLocation = null;

    // Holds the direction of the side the port is on
    this.portSide = null;

    // Holds the angle
    this.correspondingAngle = null;

    // Holds the rotational force induced to incident node
    this.rotationalForce = new CoSEPRotationalForce( CoSEPConstants.EDGE_SHIFTING_PERIOD );
}

CoSEPPortConstraint.prototype = Object.create(null);

// -----------------------------------------------------------------------------
// Section: Enumerations
// In some cases, enums are decided implicitly (Top being 0 etc). Thus, be careful when modifying these values
// -----------------------------------------------------------------------------

// An enum to differentiate between different types of constraints
CoSEPPortConstraint.prototype.constraintType = Object.freeze({
    Free : 0,
    Sided : 1,
    Absolute : 2
});

// An enum to  differentiate between different node directions
CoSEPPortConstraint.prototype.sideDirection = Object.freeze({
    Top : 0,
    Right : 1,
    Bottom : 2,
    Left : 3
});

// -----------------------------------------------------------------------------
// Section: Methods
// -----------------------------------------------------------------------------

/**
 * This method assigns a feasible port to this edge endpoint as follows. For each feasible node side, find the ports
 * closest to node corners. The port with the shortest distance to the other incident node's center is assigned to this
 * port. Obviously, If the port constraint is Absolute, there is nothing to find.
 *
 * Also, add references to CoSEPNode's.
 */
CoSEPPortConstraint.prototype.initialPortConfiguration = function(){
    if( this.portConstraintType == this.constraintType['Absolute'] ) {
        this.portIndex = this.portConstraintParameter;

        let temp = this.node.getPortCoordinatesByIndex( this.portIndex );
        this.portSide = temp[0];
        this.portLocation = temp[1];

        this.portIndex = this.portConstraintParameter;
    }
    else{
        // First get all feasible ports
        let allFeasibleCornerPorts = new Map();
        for(let i = 0; i < this.portConstraintParameter.length; i++){
            let temp = this.node.getCornerPortsOfNodeSide( this.portConstraintParameter[i] );

            // Merge all feasible ports into allFeasibleCornerPorts
            for ( let prop of temp )
                allFeasibleCornerPorts.set( prop[0], prop[1] );
        }

        // Find min short distance between ports and other nodes center and assign the port
        let otherNodeCenter = this.edge.getOtherEnd( this.node ).getCenter();
        let shortestDistance = Number.MAX_SAFE_INTEGER;
        for( let entry of allFeasibleCornerPorts ){
            let distance = Math.hypot( entry[1][1].getX() - otherNodeCenter.getX(),
                                              entry[1][1].getY() - otherNodeCenter.getY() );

            if( distance < shortestDistance ){
                shortestDistance = distance;
                this.portIndex = entry[0];
                this.portSide = entry[1][0];
                this.portLocation = entry[1][1];
            }
        }
    }

    // Adding references
    this.node.hasPortConstrainedEdge = true;
    this.node.associatedPortConstraints.push( this );
    this.node.graphManager.portConstraints.push( this );
};

/**
 * Returns the relative position of port location to related node's center
 * @returns {PointD}
 */
CoSEPPortConstraint.prototype.getRelativeRatiotoNodeCenter = function(){
    let node = this.node;
    return new PointD( (this.portLocation.x - node.getCenter().x) / node.getWidth() * 100,
                       (this.portLocation.y -  node.getCenter().y) / node.getHeight() * 100);
};

CoSEPPortConstraint.prototype.storeRotationalForce = function( springForceX, springForceY){
    if( this.portSide == this.sideDirection['Top'] || this.portSide == this.sideDirection['Bottom'] ){
        this.rotationalForce.add( springForceX );
    }
    else{
        this.rotationalForce.add( springForceY );
    }
};

module.exports = CoSEPPortConstraint;