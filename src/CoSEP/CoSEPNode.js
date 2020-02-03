/**
 *
 * @author Alihan Okka
 *
 * @copyright i-Vis Research Group, Bilkent University, 2007 - present
 */

const CoSEPConstants = require('./CoSEPConstants');
const CoSENode = require('cose-base').CoSENode;
const PointD = require('cose-base').layoutBase.PointD;

function CoSEPNode(gm, loc, size, vNode) {
    CoSENode.call(this, gm, loc, size, vNode);

    // Hold how many ports are available to one side
    this.portsPerSide = CoSEPConstants.PORTS_PER_SIDE;

    // Indicator for having a port constrained edge which the constraint is associated with this node
    this.hasPortConstrainedEdge = false;

    // If the above is true, then this will hold the particular CoSEPPortConstraint classes
    this.associatedPortConstraints = [];

    // In phase II, we will allow nodes with port constrained edges to rotate
    this.canBeRotated = true;

    // If the above remains true. CoSEPLayout will assign a CoSEPRotationalForce to this variable
    this.rotationalForce = null;
}

CoSEPNode.prototype = Object.create(CoSENode.prototype);

for (let prop in CoSENode) {
    CoSEPNode[prop] = CoSENode[prop];
}

// -----------------------------------------------------------------------------
// Section: Methods
// -----------------------------------------------------------------------------

/**
 * This method returns the given port's side and location
 *
 * @param index
 * @returns {any[]}
 *      0 -> Node side
 *      1 -> PointD of port location
 */
CoSEPNode.prototype.getPortCoordinatesByIndex = function ( index ){
    let quotient = Math.floor( index / this.portsPerSide );
    let remainder = Math.floor( index % this.portsPerSide );
    let position;

    switch( quotient ){
        case 0:
            position = new PointD( this.rect.x + this.rect.width * (remainder + 1) / (this.portsPerSide + 1) ,
                this.rect.y );
            break;
        case 1:
            position = new PointD( this.rect.x + this.rect.width,
                this.rect.y + this.rect.height * ( remainder + 1) / ( this.portsPerSide + 1 ) );
            break;
        case 2:
            position = new PointD( this.rect.x + this.rect.width *
                (this.portsPerSide - remainder) / (this.portsPerSide + 1),
                this.rect.y + this.rect.height );
            break;
        case 3:
            position = new PointD( this.rect.x,
                this.rect.y + this.rect.height * ( this.portsPerSide - remainder ) / ( this.portsPerSide + 1) );
            break;
    }

    return [quotient, position];
};

/**
 * This method returns the 'corner' ports of a given side. If there is only one port per side then that port in the only
 * corner port.
 * @param nodeSide
 * @returns {Map<number, [PointD, number]>}
 */
CoSEPNode.prototype.getCornerPortsOfNodeSide = function( nodeSide ){
    let result = new Map();

    if ( this.portsPerSide > 1){
        // Indexes of the ports
        let firstPortIndex = this.portsPerSide * nodeSide;
        let lastPortIndex = this.portsPerSide * ( nodeSide + 1 ) - 1;

        result.set( firstPortIndex, this.getPortCoordinatesByIndex( firstPortIndex ) )
            .set( lastPortIndex, this.getPortCoordinatesByIndex( lastPortIndex ) );
    }
    else
        result.set( nodeSide, this.getPortCoordinatesByIndex( nodeSide ) );

    return result;
};

/**
 * This methods updates all of the associated port constraints locations around itself
 */
CoSEPNode.prototype.updatePortLocations = function (){
    for( let i = 0; i < this.associatedPortConstraints.length; i++){
        let portConst = this.associatedPortConstraints[i];
        let temp =  this.getPortCoordinatesByIndex( portConst.portIndex );
        portConst.portSide = temp[0];
        portConst.portLocation = temp[1];
    }
};

/**
 * Moving a node needs to move its port constraints as well
 *
 * @override
 * @param dx
 * @param dy
 */
CoSEPNode.prototype.moveBy = function (dx, dy) {
    this.rect.x += dx;
    this.rect.y += dy;

    this.associatedPortConstraints.forEach( function ( portConstraint ) {
        portConstraint.portLocation.x += dx;
        portConstraint.portLocation.y += dy;
    });
};

/**
 * Rotating the node if rotational force inflicted upon is greater than threshold.
 * Sometimes a 180 degree rotation is needed when the above metric does not detect a needed rotation.
 */
CoSENode.prototype.checkForNodeRotation = function(){
    if( !this.canBeRotated )
        return;

    // Exceeds threshold?
    let rotationalForceAvg = this.rotationalForce.getAverage();
    if ( Math.abs( rotationalForceAvg ) < CoSEPConstants.NODE_ROTATION_FORCE_THRESHOLD )
        return;

    // If this is to be rotated clockwise or counter-clockwise
    let clockwise = Math.sign(rotationalForceAvg) == 1;

    for( let i = 0; i < this.associatedPortConstraints.length; i++){
        let portConst = this.associatedPortConstraints[i];

        if( clockwise ) {
            portConst.portIndex = (portConst.portIndex + this.portsPerSide) % (4 * this.portsPerSide);

            if( portConst.portConstraintType === portConst.constraintType['Sided'] )
                for(let i = 0; i < portConst.portConstraintParameter.length; i++)
                    portConst.portConstraintParameter[i] = (portConst.portConstraintParameter[i] + 1) % 4 ;
        }
        else {
            portConst.portIndex = (portConst.portIndex - this.portsPerSide);
            if( portConst.portIndex < 0 ) portConst.portIndex = 4 * this.portsPerSide + portConst.portIndex;

            if( portConst.portConstraintType === portConst.constraintType['Sided'] )
                for(let i = 0; i < portConst.portConstraintParameter.length; i++)
                    if (--portConst.portConstraintParameter[i] < 0) portConst.portConstraintParameter[i] = 3;
        }

        let temp =  this.getPortCoordinatesByIndex( portConst.portIndex );
        portConst.portSide = temp[0];
        portConst.portLocation = temp[1];
    }

};

module.exports = CoSEPNode;
