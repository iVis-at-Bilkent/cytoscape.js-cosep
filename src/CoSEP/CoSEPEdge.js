/**
 *
 * @author Alihan Okka
 *
 * @copyright i-Vis Research Group, Bilkent University, 2007 - present
 */

const CoSEEdge = require('cose-base').CoSEEdge;
const IGeometry = require('cose-base').layoutBase.IGeometry;
const IMath = require('cose-base').layoutBase.IMath;
const RectangleD = require('cose-base').layoutBase.RectangleD;

function CoSEPEdge(source, target, vEdge) {
    CoSEEdge.call(this, source, target, vEdge);

    // These hold the port constraint for their endpoints.
    // They are divided for easy access
    this.sourceConstraint = null;
    this.targetConstraint = null;
}

CoSEPEdge.prototype = Object.create(CoSEEdge.prototype);

for (let prop in CoSEEdge) {
    CoSEPEdge[prop] = CoSEEdge[prop];
}

// -----------------------------------------------------------------------------
// Section: Getter
// -----------------------------------------------------------------------------

CoSEPEdge.prototype.getSourceConstraint = function(){
    return this.sourceConstraint;
};

CoSEPEdge.prototype.getTargetConstraint = function(){
    return this.targetConstraint;
};

// -----------------------------------------------------------------------------
// Section: Methods
// -----------------------------------------------------------------------------

/**
 * General flag indicating if this edge has any port constraints
 * @returns {boolean}
 */
CoSEPEdge.prototype.isPortConstrainedEdge = function(){
    return !!(this.sourceConstraint || this.targetConstraint);
};

/**
 * Redirects the call to its ports (if any)
 */
CoSEPEdge.prototype.initialPortConfiguration = function(){
    if( !this.isPortConstrainedEdge() )
        return;

    if( this.sourceConstraint )
        this.sourceConstraint.initialPortConfiguration();

    if( this.targetConstraint )
        this.targetConstraint.initialPortConfiguration();

    if( this.targetConstraint && this.sourceConstraint ) {
        this.targetConstraint.otherPortConstraint = this.sourceConstraint;
        this.sourceConstraint.otherPortConstraint = this.targetConstraint;
    }
};
/**
 * Changes the calc of edge length based on ports.
 */
CoSEPEdge.prototype.updateLengthWithPorts = function () {
    // If both ends are port constrained then calculate the euler distance between ports
    if( this.sourceConstraint && this.targetConstraint ){
        // If nodes intersect do nothing
        if( this.target.getRect().intersects( this.source.getRect()) ) {
            this.isOverlapingSourceAndTarget = true;
            return;
        }

        this.isOverlapingSourceAndTarget = false;

        let portSourcePoint = this.sourceConstraint.portLocation;
        let portTargetPoint = this.targetConstraint.portLocation;
        this.lengthX = portTargetPoint.x - portSourcePoint.x;
        this.lengthY = portTargetPoint.y - portSourcePoint.y;
        if (Math.abs(this.lengthX) < 1.0)  this.lengthX = IMath.sign(this.lengthX);
        if (Math.abs(this.lengthY) < 1.0)  this.lengthY = IMath.sign(this.lengthY);

        this.length = Math.sqrt(
            this.lengthX * this.lengthX + this.lengthY * this.lengthY);

    }
    // Otherwise, the edge is between one port to a clipping point
    else {
        let clipPointCoordinates = new Array(4);

        if( this.sourceConstraint ){
            this.isOverlapingSourceAndTarget = IGeometry.getIntersection(
                this.target.getRect(),
                new RectangleD( this.sourceConstraint.portLocation.x, this.sourceConstraint.portLocation.y, 0, 0 ),
                clipPointCoordinates);
        }
        if( this.targetConstraint ){
            this.isOverlapingSourceAndTarget = IGeometry.getIntersection(
                new RectangleD( this.targetConstraint.portLocation.x, this.targetConstraint.portLocation.y, 0, 0 ),
                this.source.getRect(),
                clipPointCoordinates);
        }

        if (!this.isOverlapingSourceAndTarget)
        {
            this.lengthX = clipPointCoordinates[0] - clipPointCoordinates[2];
            this.lengthY = clipPointCoordinates[1] - clipPointCoordinates[3];

            if (Math.abs(this.lengthX) < 1.0)  this.lengthX = IMath.sign(this.lengthX);

            if (Math.abs(this.lengthY) < 1.0)  this.lengthY = IMath.sign(this.lengthY);

            this.length = Math.sqrt(this.lengthX * this.lengthX + this.lengthY * this.lengthY);
        }
    }
};

/**
 * Redirects the call to its ports (if any).
 * Note: Direction is important
 */
CoSEPEdge.prototype.storeRotationalForce = function( springForceX, springForceY ){
    if( !this.isPortConstrainedEdge() ){
        return;
    }

    if( this.sourceConstraint )
        this.sourceConstraint.storeRotationalForce( springForceX, springForceY );

    if( this.targetConstraint )
        this.targetConstraint.storeRotationalForce( -springForceX, -springForceY );
};

module.exports = CoSEPEdge;