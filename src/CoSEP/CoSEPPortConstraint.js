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

    // Holds the sum of the rotational force induced to incident node
    // Avg can be manually calculated
    this.rotationalForce = 0;

    // Holds this edges other port constraint (if any)
    this.otherPortConstraint = null;

    // Hold the other node
    this.otherNode = this.edge.getOtherEnd(this.node);

    // Holds the sum of the angle wrt to incident node and desired location.
    // Avg can be manually calculated
    this.correspondingAngle = 0;

    // Hold how many ports are available to one side
    this.portsPerSide = CoSEPConstants.PORTS_PER_SIDE;
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
// Section: Index Iterators
// -----------------------------------------------------------------------------

CoSEPPortConstraint.prototype.nextAdjacentIndex = function(){
    return ( this.portIndex + 1 )  % ( 4 * this.portsPerSide );
};

CoSEPPortConstraint.prototype.prevAdjacentIndex = function(){
    let temp = this.portIndex - 1;
    if( temp < 0 )
        temp = (4 * this.portsPerSide) - 1;

    return temp;
};

CoSEPPortConstraint.prototype.nextAcrossSideIndex = function() {
    return (this.portIndex + 1 + this.portsPerSide) % (4 * this.portsPerSide);
};

CoSEPPortConstraint.prototype.prevAcrossSideIndex = function() {
    let temp = (this.portIndex - 1 - this.portsPerSide);
    if( temp < 0)
        temp = (4 * this.portsPerSide) + temp;

    return temp;
};

// -----------------------------------------------------------------------------
// Section: Helper Functions
// -----------------------------------------------------------------------------

// Create a line function going through two given points. Line function returns true if a point is on that line
function line(x1, y1, x2, y2) {
    let slope = (y2 - y1) / (x2 - x1);
    return function (x, y) {
        return (y - y1) > slope * (x - x1);
    };
}

// Checks if the testingPoint is left of the line going through point -> otherPoint
function leftTest(point, otherPoint, testingPoint){
    let test = (otherPoint.x - point.x) * (testingPoint.y - point.y) -
        (otherPoint.y - point.y) * (testingPoint.x - point.x);

    return test > 0;
}

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
    if( this.portConstraintType === this.constraintType['Absolute'] ) {
        this.portIndex = this.portConstraintParameter;

        if( this.portIndex > this.portsPerSide * 4 - 1 )
            throw "Error: An absolute port has higher index number than total number of ports!";

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
        let otherNodeCenter = this.otherNode.getCenter();
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
        this.rotationalForce += springForceX;
        if(this.node.canBeRotated) {
            this.correspondingAngle += Math.abs(this.calcAngle());
            this.node.rotationalForce += springForceX;
        }
    } else if( this.portSide == this.sideDirection['Bottom'] ){
        this.rotationalForce -= springForceX;
        if(this.node.canBeRotated) {
            this.correspondingAngle += Math.abs(this.calcAngle());
            this.node.rotationalForce -= springForceX;
        }
    } else if( this.portSide == this.sideDirection['Right'] ){
        this.rotationalForce += springForceY;
        if(this.node.canBeRotated) {
            this.correspondingAngle += Math.abs(this.calcAngle());
            this.node.rotationalForce += springForceY;
        }
    } else {
        this.rotationalForce -= springForceY;
        if(this.node.canBeRotated) {
            this.correspondingAngle += Math.abs(this.calcAngle());
            this.node.rotationalForce -= springForceY;
        }
    }
};

/**
 * If the edge is 'Absolute' constrained then there is nothing to do.
 * Otherwise check if the average rotational force inflicted upon port if above threshold.
 * If it exceeds shift the edge (assuming constraint doesn't limit it)
 * Note that there is an additional requirement if the port is located at the 'corner' of node side
 */
CoSEPPortConstraint.prototype.checkForEdgeShifting = function(){
    if( this.portConstraintType == this.constraintType['Absolute'] )
        return;

    // Exceeds threshold?
    // Get AVG and reset the sum
    let rotationalForceAvg = this.rotationalForce / CoSEPConstants.EDGE_SHIFTING_PERIOD;
    this.rotationalForce = 0;
    if ( Math.abs( rotationalForceAvg ) < CoSEPConstants.EDGE_SHIFTING_FORCE_THRESHOLD )
        return;

    let newIndex = null;
    // If the edge wants to go clockwise or counter-clockwise
    if( Math.sign(rotationalForceAvg) == 1 ){
        // Currently on a corner port and wants to change node sides. Then check for additional requirements.
        if( (this.portIndex % this.portsPerSide) == (this.portsPerSide - 1) ){
            let nextSide = (this.portSide + 1) % 4;
            if( this.portConstraintParameter.includes( nextSide ) &&
                this.additionalRequirementForAdjacentSideChanging( nextSide ) ) {
                newIndex = this.nextAdjacentIndex();
            }
            else if ( this.portConstraintParameter.includes( (nextSide + 1) % 4 )  &&
                this.additionalRequirementForAcrossSideChanging() ){
                newIndex = this.nextAcrossSideIndex();
            }
        } else{
            newIndex = this.nextAdjacentIndex();
        }
    } else{
        if(this.portIndex % this.node.portsPerSide == 0){
            let nextSide = this.portSide;
            if (--nextSide < 0) nextSide = 3;
            if( this.portConstraintParameter.includes( nextSide ) &&
                this.additionalRequirementForAdjacentSideChanging( nextSide )) {
                newIndex = this.prevAdjacentIndex();
            }
            else{
                if (--nextSide < 0) nextSide = 3;
                if( this.portConstraintParameter.includes( nextSide ) &&
                    this.additionalRequirementForAcrossSideChanging() ){
                    newIndex = this.prevAcrossSideIndex();
                }
            }
        } else{
            newIndex = this.prevAdjacentIndex();
        }
    }

    if( newIndex ){
        let temp = this.node.getPortCoordinatesByIndex( newIndex );
        this.portIndex = newIndex;
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
    let otherNodeRect = this.otherNode.getCenter();

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
        case 1:
            if( nextSide == 0 ){
                let check = line( nodeRect.x + nodeRect.width, nodeRect.y, nodeRect.x, nodeRect.y + nodeRect.height );
                return !check( otherNodeRect.x, otherNodeRect.y );
            }
            else{
                let check = line( nodeRect.x, nodeRect.y, nodeRect.x + nodeRect.width, nodeRect.y + nodeRect.height );
                return check( otherNodeRect.x, otherNodeRect.y );
            }
        case 2:
            if ( nextSide == 3 ){
                let check = line( nodeRect.x + nodeRect.width, nodeRect.y, nodeRect.x, nodeRect.y + nodeRect.height );
                return !check( otherNodeRect.x, otherNodeRect.y );
            }
            else{
                let check = line( nodeRect.x, nodeRect.y, nodeRect.x + nodeRect.width, nodeRect.y + nodeRect.height );
                return !check( otherNodeRect.x, otherNodeRect.y );
            }
        case 3:
            if( nextSide == 2 ){
                let check = line( nodeRect.x + nodeRect.width, nodeRect.y, nodeRect.x, nodeRect.y + nodeRect.height );
                return check( otherNodeRect.x, otherNodeRect.y );
            }
            else{
                let check = line( nodeRect.x, nodeRect.y, nodeRect.x + nodeRect.width, nodeRect.y + nodeRect.height );
                return !check( otherNodeRect.x, otherNodeRect.y );
            }
    }
};

/**
 * The node needs to be in the right quadrant. Quadrants are defined by node's center.
 *
 * For line1: Node Center, horizontal, equality pointing downward
 * For line2: Node Center, vertical, equality pointing right
 *
 */
CoSEPPortConstraint.prototype.additionalRequirementForAcrossSideChanging = function(){
    let nodeRect = this.node.getCenter();
    let otherNodeRect = this.otherNode.getCenter();

    switch ( this.portSide ) {
        case 0:
            return otherNodeRect.y >= nodeRect.y;
        case 1:
            return otherNodeRect.x <= nodeRect.x;
        case 2:
            return otherNodeRect.y <= nodeRect.y;
        case 3:
            return otherNodeRect.x >= nodeRect.x;
    }
};

/**
 * Returns the desired location of the other node/port. It is one idealLength away from this port.
 *
 * @returns {PointD}
 */
CoSEPPortConstraint.prototype.getPointOfDesiredLocation = function(){
    switch ( this.portSide ) {
        case 0:
            return new PointD( this.portLocation.x, this.portLocation.y - this.edge.idealLength - this.otherNode.getHeight() / 2);
        case 1:
            return new PointD( this.portLocation.x + this.edge.idealLength + this.otherNode.getWidth() / 2, this.portLocation.y );
        case 2:
            return new PointD( this.portLocation.x, this.portLocation.y + this.edge.idealLength  + this.otherNode.getHeight() / 2 );
        case 3:
            return new PointD( this.portLocation.x - this.edge.idealLength - this.otherNode.getWidth() / 2, this.portLocation.y );
    }
};

/**
 * Calculates the angle between other node/port, this port and desired location of other node/port
 *
 * @returns {number}
 */
CoSEPPortConstraint.prototype.calcAngle = function(){
    let otherPoint;
    if( this.otherPortConstraint )
        otherPoint = this.otherPortConstraint.portLocation;
    else
        otherPoint = this.otherNode.getCenter();

    let desired = this.getPointOfDesiredLocation();

    let point1 = new PointD( desired.x - this.portLocation.x, desired.y - this.portLocation.y);
    let point2 = new PointD( otherPoint.x - this.portLocation.x, otherPoint.y - this.portLocation.y );

    if (Math.abs(point1.x) < 0)
        point1.x = 0.0001;
    if (Math.abs(point1.y) < 0)
        point1.y = 0.0001;

    let angleValue = (point1.x * point2.x + point1.y * point2.y)
        / (Math.sqrt(point1.x * point1.x + point1.y * point1.y)
            * Math.sqrt(point2.x * point2.x + point2.y * point2.y));

    let absAngle = Math.abs(Math.acos(angleValue)* 180 / Math.PI);

    return ( leftTest(this.portLocation, otherPoint, desired) ) ? -absAngle : absAngle;
};

/**
 * Calculates the polishing force
 */
CoSEPPortConstraint.prototype.calcPolishingForces = function(){
    let edgeVector = new PointD();
    let polishingForceVector = new PointD();

    let otherPoint;
    if( this.otherPortConstraint )
        otherPoint = this.otherPortConstraint.portLocation;
    else
        otherPoint = this.otherNode.getCenter();

    let desired = this.getPointOfDesiredLocation();

    // Finding the unit vector of the edge
    if( this.edge.getSource() === this.node ){
        edgeVector.setX(this.edge.lengthX / this.edge.length);
        edgeVector.setY(this.edge.lengthY / this.edge.length);
    } else{
        edgeVector.setX(-this.edge.lengthX / this.edge.length);
        edgeVector.setY(-this.edge.lengthY / this.edge.length);
    }

    // Finding which ortogonal unit vector is the one we want
    if( !leftTest(this.portLocation, otherPoint, desired)){
        polishingForceVector.setX( edgeVector.getY() );
        polishingForceVector.setY( -edgeVector.getX() );
    } else{
        polishingForceVector.setX( -edgeVector.getY() );
        polishingForceVector.setY( edgeVector.getX() );
    }

    let distance = Math.hypot( otherPoint.getX() - desired.getX(), otherPoint.getY() - desired.getY() );

    let polishingForceX = CoSEPConstants.DEFAULT_POLISHING_FORCE_STRENGTH  * polishingForceVector.getX() * distance / 2;
    let polishingForceY = CoSEPConstants.DEFAULT_POLISHING_FORCE_STRENGTH  * polishingForceVector.getY() * distance / 2;

    this.otherNode.polishingForceX += polishingForceX;
    this.otherNode.polishingForceY += polishingForceY;
    this.node.polishingForceX -= polishingForceX;
    this.node.polishingForceY -= polishingForceY;
};

module.exports = CoSEPPortConstraint;