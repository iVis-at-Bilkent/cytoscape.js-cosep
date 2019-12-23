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

/**
 * The component of the spring force, vertical component if the port is located at the top or bottom and horizontal
 * component otherwise, is considered to be the rotational force.
 *
 *  * The sign of the force should be positive for clockwise, negative for counter-clockwise
 *
 * @param springForceX
 * @param springForceY
 */

CoSEPPortConstraint.prototype.storeRotationalForce = function( springForceX, springForceY){
    if( this.portSide == this.sideDirection['Top'] ) {
        this.rotationalForce.add( springForceX );
    } else if( this.portSide == this.sideDirection['Bottom'] ){
        this.rotationalForce.add( -springForceX );
    } else if( this.portSide == this.sideDirection['Right'] ){
        this.rotationalForce.add( springForceY );
    } else {
        this.rotationalForce.add( -springForceY );
    }
};

/**
 * If the edge is 'Absolute' constrained then there is nothing to do.
 * Otherwise check if the average rotational force inflicted upon port if above threshold.
 * If it exceeds shift the edge (assuming constraint doesn't limit it)
 * Note that there is an additional requirement if the port is located at the 'corner' of node
 */
CoSEPPortConstraint.prototype.checkForEdgeShifting = function(){
    if( this.portConstraintParameter == this.constraintType['Absolute'] ){
        return;
    }

    // Exceeds threshold?
    let rotationalForceAvg = this.rotationalForce.getAverage();
    if ( Math.abs( rotationalForceAvg ) < CoSEPConstants.EDGE_SHIFTING_THRESHOLD ){
        return;
    }

    // If the edge wants to go clockwise or counter-clockwise
    let clockwise = ( Math.sign(rotationalForceAvg) == 1 );

    // Currently on a corner port and wants to change sides. Then we have additional requirements.
    if( this.portIndex % this.node.portsPerSide == 0 && !clockwise ) {
        let nextSide = this.portSide;

        if (--nextSide < 0) nextSide = 3;
        if( this.portConstraintParameter.includes( nextSide ) ) {
            if( this.additionalRequirementForAdjacentSideChanging(nextSide) ){
                let nextIndex = this.portIndex - 1;
                if ( nextIndex < 0) nextIndex = (4 * this.node.portsPerSide) - 1 ;
                let temp = this.node.getPortCoordinatesByIndex( nextIndex );
                this.portIndex = nextIndex;
                this.portSide = temp[0];
                this.portLocation = temp[1];
            }
            else
                return;
        }

        if (--nextSide < 0) nextSide = 3;
        if( this.portConstraintParameter.includes( nextSide ) )
            if (this.additionalRequirementForAcrossSideChanging() ){
                let nextIndex = this.portIndex - ( this.node.portsPerSide + 1);
                if ( nextIndex < 0) nextIndex = (4 * this.node.portsPerSide) + nextIndex ;
                let temp = this.node.getPortCoordinatesByIndex( nextIndex );
                this.portIndex = nextIndex;
                this.portSide = temp[0];
                this.portLocation = temp[1];
            }
            else
                return;
    }
    else if( this.portIndex % (this.node.portsPerSide) == this.node.portsPerSide - 1  && clockwise ){
        let nextSide = (this.portSide + 1) % 4;
        if( this.portConstraintParameter.includes( nextSide ) ) {
            if( this.additionalRequirementForAdjacentSideChanging(nextSide) ){
                let nextIndex = (this.portIndex + 1) % (4 * this.node.portsPerSide);
                let temp = this.node.getPortCoordinatesByIndex( nextIndex );
                this.portIndex = nextIndex;
                this.portSide = temp[0];
                this.portLocation = temp[1];
            }
            else
                return;
        }

        nextSide = (nextSide + 1) % 4;
        if( this.portConstraintParameter.includes( nextSide ) )
            if (this.additionalRequirementForAcrossSideChanging() ){
                let nextIndex = (this.portIndex + this.node.portsPerSide + 1) % (4 * this.node.portsPerSide);
                let temp = this.node.getPortCoordinatesByIndex( nextIndex );
                this.portIndex = nextIndex;
                this.portSide = temp[0];
                this.portLocation = temp[1];
            }
            else
                return;
    } else{
        let nextIndex;
        if( clockwise )
            nextIndex = (this.portIndex + 1) % (4 * this.node.portsPerSide);
        else {
            nextIndex = this.portIndex - 1;
            if ( nextIndex < 0) nextIndex = (4 * this.node.portsPerSide) - 1 ;
        }

        let temp = this.node.getPortCoordinatesByIndex( nextIndex );
        this.portIndex = nextIndex;
        this.portSide = temp[0];
        this.portLocation = temp[1];
    }
};


/**
 * The node needs to be in the right quadrant. Quadrants are defined by node's corner points.
 * Equalities are facing downwards.
 *
 * For line1: Top-Left to Bottom-Right
 * For line2: Top-Right to Bottom-Left
 *
 * @param nextSide
 */
CoSEPPortConstraint.prototype.additionalRequirementForAdjacentSideChanging = function( nextSide ){
    let nodeRect = this.node.rect;
    let otherNodeRect = this.edge.getOtherEnd( this.node ).getCenter();

    switch ( this.portSide ) {
        case 0:
            if( nextSide == 1 ){
                let check = line( nodeRect.x + nodeRect.width, nodeRect.y, nodeRect.x, nodeRect.y + nodeRect.height );
                return check( otherNodeRect.x, otherNodeRect.y );
            }
            else{
                let check = line( nodeRect.x, nodeRect.y, nodeRect.x + nodeRect.width, nodeRect.y + nodeRect.height );
                return check( otherNodeRect.x, otherNodeRect.y );
            }
            break;
        case 1:
            if( nextSide == 0 ){
                let check = line( nodeRect.x + nodeRect.width, nodeRect.y, nodeRect.x, nodeRect.y + nodeRect.height );
                return !check( otherNodeRect.x, otherNodeRect.y );
            }
            else{
                let check = line( nodeRect.x, nodeRect.y, nodeRect.x + nodeRect.width, nodeRect.y + nodeRect.height );
                return check( otherNodeRect.x, otherNodeRect.y );
            }
            break;
        case 2:
            if ( nextSide == 3 ){
                let check = line( nodeRect.x + nodeRect.width, nodeRect.y, nodeRect.x, nodeRect.y + nodeRect.height );
                return !check( otherNodeRect.x, otherNodeRect.y );
            }
            else{
                let check = line( nodeRect.x, nodeRect.y, nodeRect.x + nodeRect.width, nodeRect.y + nodeRect.height );
                return !check( otherNodeRect.x, otherNodeRect.y );
            }
            break;
        case 3:
            if( nextSide == 2 ){
                let check = line( nodeRect.x + nodeRect.width, nodeRect.y, nodeRect.x, nodeRect.y + nodeRect.height );
                return check( otherNodeRect.x, otherNodeRect.y );
            }
            else{
                let check = line( nodeRect.x, nodeRect.y, nodeRect.x + nodeRect.width, nodeRect.y + nodeRect.height );
                return !check( otherNodeRect.x, otherNodeRect.y );
            }
            break;
    }

    function line(x1, y1, x2, y2) {
        let slope = (y2 - y1) / (x2 - x1);
        return function (x, y) {
            return (y - y1) > slope * (x - x1);
        }
    }
};

/**
 * The node needs to be in the right quadrant. Quadrants are defined by node's center.
 *
 * For line1: Node Center, horizontal, equality pointing downward
 * For line2: Node Center, vertical, equality pointing right
 *
 * @param nextSide
 */
CoSEPPortConstraint.prototype.additionalRequirementForAcrossSideChanging = function(){
    let nodeRect = this.node.getCenter();
    let otherNodeRect = this.edge.getOtherEnd( this.node ).getCenter();
    let check;

    switch ( this.portSide ) {
        case 0:
            check = line( nodeRect.x, nodeRect.y, nodeRect.x + nodeRect.width, nodeRect.y);
            return check( otherNodeRect.x, otherNodeRect.y );
            break;
        case 1:
            check = line( nodeRect.x, nodeRect.y, nodeRect.x, nodeRect.y, + nodeRect.height);
            return !check( otherNodeRect.x, otherNodeRect.y );
            break;
        case 2:
            check = line( nodeRect.x, nodeRect.y, nodeRect.x + nodeRect.width, nodeRect.y);
            return !check( otherNodeRect.x, otherNodeRect.y );
            break;
        case 3:
            check = line( nodeRect.x, nodeRect.y, nodeRect.x, nodeRect.y, + nodeRect.height);
            return check( otherNodeRect.x, otherNodeRect.y );
            break;
    }

    function line(x1, y1, x2, y2) {
        let slope = (y2 - y1) / (x2 - x1);
        return function (x, y) {
            return (y - y1) > slope * (x - x1);
        }
    }
};


module.exports = CoSEPPortConstraint;