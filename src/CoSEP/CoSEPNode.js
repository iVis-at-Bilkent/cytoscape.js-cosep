/**
 *
 * @author Alihan Okka
 *
 * @copyright i-Vis Research Group, Bilkent University, 2007 - present
 */

const CoSEPConstants = require('./CoSEPConstants');
const CoSENode = require('cose-base').CoSENode;
const PointD = require('cose-base').layoutBase.PointD;
const IMath = require('cose-base').layoutBase.IMath;

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
    
    // In phase II, we will allow nodes with port constrained edges to swap
    this.canBeSwapped = true;
    
    // Keep rotation history of the node, values to be added: clockwise, counterclockwise, topbottom, rightleft
    // Edit: node rotation and swap are separated later but we continue to use rotationList jointly for both operation
    this.rotationList = [];    

    // If the above remains true it will hold the sum of the rotational force induced to this node.
    // Avg can be manually calculated
    this.rotationalForce = 0;

    // This holds the additional force introduced in polishing phase
    this.polishingForceX = 0;
    this.polishingForceY = 0;
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
CoSEPNode.prototype.checkForNodeRotation = function(){
    if( !this.canBeRotated && !this.canBeSwapped)
        return;

    // Exceeds threshold? If not then how about 180 degree check for swap (node should also be marked as canBeSwapped)
    let rotationalForceAvg = this.rotationalForce / CoSEPConstants.NODE_ROTATION_PERIOD / this.associatedPortConstraints.length;
    this.rotationalForce = 0;
    if ( Math.abs( rotationalForceAvg ) < CoSEPConstants.NODE_ROTATION_FORCE_THRESHOLD && this.canBeSwapped){
        let topBottomRotation = false;
        let rightLeftRotation = false;
        let topBottomPorts = 0;
        let topBottomObstruceAngles = 0;
        let rightLeftPorts = 0;
        let rightLeftObstruceAngles = 0;

        for( let i = 0; i < this.associatedPortConstraints.length; i++){
            let portConst = this.associatedPortConstraints[i];

            // Don't include one degree nodes to the heuristic
            if( portConst.otherNode.getEdges().length === 1 )
                continue;

            if( portConst.portSide == portConst.sideDirection['Top'] || portConst.portSide == portConst.sideDirection['Bottom']){
                topBottomPorts++;
                let avgCorrespondingAngle = portConst.correspondingAngle / CoSEPConstants.NODE_ROTATION_PERIOD;
                portConst.correspondingAngle = 0;
                if( avgCorrespondingAngle > CoSEPConstants.ROTATION_180_ANGLE_THRESHOLD ){
                    topBottomObstruceAngles++;
                }
            } else{
                rightLeftPorts++;
                let avgCorrespondingAngle = portConst.correspondingAngle / CoSEPConstants.NODE_ROTATION_PERIOD;
                portConst.correspondingAngle = 0;
                if(  avgCorrespondingAngle > CoSEPConstants.ROTATION_180_ANGLE_THRESHOLD ){
                    rightLeftObstruceAngles++;
                }
            }
        }

        if( (topBottomObstruceAngles / topBottomPorts) >= CoSEPConstants.ROTATION_180_RATIO_THRESHOLD )
            topBottomRotation = true;

        if( (rightLeftObstruceAngles / rightLeftPorts) >= CoSEPConstants.ROTATION_180_RATIO_THRESHOLD )
            rightLeftRotation = true;

        if( topBottomRotation ){
            for( let i = 0; i < this.associatedPortConstraints.length; i++){
                let portConst = this.associatedPortConstraints[i];

                if( portConst.portSide == portConst.sideDirection['Top'] ){
                    portConst.portIndex = this.portsPerSide - 1 - portConst.portIndex;
                    portConst.portIndex = portConst.portIndex + this.portsPerSide * 2;
                    let temp =  this.getPortCoordinatesByIndex( portConst.portIndex );
                    portConst.portSide = temp[0];
                    portConst.portLocation = temp[1];

                    if( portConst.portConstraintType === portConst.constraintType['Sided'] )
                        for(let i = 0; i < portConst.portConstraintParameter.length; i++)
                            if (portConst.portConstraintParameter[i] == 0) portConst.portConstraintParameter[i] = 2;

                } else if(portConst.portSide == portConst.sideDirection['Bottom']) {
                    portConst.portIndex = portConst.portIndex % this.portsPerSide;
                    portConst.portIndex = this.portsPerSide - 1 - portConst.portIndex;
                    let temp =  this.getPortCoordinatesByIndex( portConst.portIndex );
                    portConst.portSide = temp[0];
                    portConst.portLocation = temp[1];

                    if( portConst.portConstraintType === portConst.constraintType['Sided'] )
                        for(let i = 0; i < portConst.portConstraintParameter.length; i++)
                            if (portConst.portConstraintParameter[i] == 2) portConst.portConstraintParameter[i] = 0;
                }
            }
            this.rotationList.push("topbottom");
        }
        else if( rightLeftRotation ){
            for( let i = 0; i < this.associatedPortConstraints.length; i++){
                let portConst = this.associatedPortConstraints[i];

                if( portConst.portSide == portConst.sideDirection['Right'] ){
                    portConst.portIndex = portConst.portIndex % this.portsPerSide;
                    portConst.portIndex = this.portsPerSide - 1 - portConst.portIndex;
                    portConst.portIndex = portConst.portIndex + this.portsPerSide * 3;
                    let temp =  this.getPortCoordinatesByIndex( portConst.portIndex );
                    portConst.portSide = temp[0];
                    portConst.portLocation = temp[1];

                    if( portConst.portConstraintType === portConst.constraintType['Sided'] )
                        for(let i = 0; i < portConst.portConstraintParameter.length; i++)
                            if (portConst.portConstraintParameter[i] == 1) portConst.portConstraintParameter[i] = 3;

                } else if(portConst.portSide == portConst.sideDirection['Left']) {
                    portConst.portIndex = portConst.portIndex % this.portsPerSide;
                    portConst.portIndex = this.portsPerSide - 1 - portConst.portIndex;
                    portConst.portIndex = portConst.portIndex + this.portsPerSide;
                    let temp =  this.getPortCoordinatesByIndex( portConst.portIndex );
                    portConst.portSide = temp[0];
                    portConst.portLocation = temp[1];

                    if( portConst.portConstraintType === portConst.constraintType['Sided'] )
                        for(let i = 0; i < portConst.portConstraintParameter.length; i++)
                            if (portConst.portConstraintParameter[i] == 3) portConst.portConstraintParameter[i] = 1;
                }
            }
            this.rotationList.push("rightleft");
        }

        return;
    }
    
    // Exceeds threshold? If yes then rotate node (node should also be marked as canBeRotated)
    if ( Math.abs( rotationalForceAvg ) >= CoSEPConstants.NODE_ROTATION_FORCE_THRESHOLD && this.canBeRotated) {
        // If this is to be rotated clockwise or counter-clockwise
        let clockwise = Math.sign(rotationalForceAvg) == 1;

        // Change dimension of the node
        let width = this.getWidth();
        let height = this.getHeight();
        this.setWidth( height );
        this.setHeight( width );

        if( clockwise ) {
          this.rotationList.push("clockwise");
        }
        else {
          this.rotationList.push("counterclockwise");
        }

        // Change port locations
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
    }
};

/**
 * Modified version of cose to include polishing force
 */
CoSEPNode.prototype.move = function(){
    var layout = this.graphManager.getLayout();
    this.displacementX = layout.coolingFactor *
        (this.springForceX + this.repulsionForceX + this.gravitationForceX + this.polishingForceX) / this.noOfChildren;

    this.displacementY = layout.coolingFactor *
        (this.springForceY + this.repulsionForceY + this.gravitationForceY + this.polishingForceY) / this.noOfChildren;

    if (Math.abs(this.displacementX) > layout.coolingFactor * layout.maxNodeDisplacement)
    {
        this.displacementX = layout.coolingFactor * layout.maxNodeDisplacement *
            IMath.sign(this.displacementX);
    }

    if (Math.abs(this.displacementY) > layout.coolingFactor * layout.maxNodeDisplacement)
    {
        this.displacementY = layout.coolingFactor * layout.maxNodeDisplacement *
            IMath.sign(this.displacementY);
    }

    // a simple node, just move it
    if (this.child == null)
    {
        this.moveBy(this.displacementX, this.displacementY);
    }
    // an empty compound node, again just move it
    else if (this.child.getNodes().length == 0)
    {
        this.moveBy(this.displacementX, this.displacementY);
    }
    // non-empty compound node, propogate movement to children as well
    else
    {
        this.propogateDisplacementToChildren(this.displacementX,
            this.displacementY);
    }

    layout.totalDisplacement +=
        Math.abs(this.displacementX) + Math.abs(this.displacementY);

    this.springForceX = 0;
    this.springForceY = 0;
    this.repulsionForceX = 0;
    this.repulsionForceY = 0;
    this.gravitationForceX = 0;
    this.gravitationForceY = 0;
    this.polishingForceX = 0;
    this.polishingForceY = 0;
    this.displacementX = 0;
    this.displacementY = 0;
};

/**
 * Overriden here to its old format again 
 * to avoid possible effects of the changes done in cose-level
 * 
 * @param dX
 * @param dY
 */
CoSEPNode.prototype.propogateDisplacementToChildren = function (dX, dY)
{
  var nodes = this.getChild().getNodes();
  var node;
  for (var i = 0; i < nodes.length; i++)
  {
    node = nodes[i];
    if (node.getChild() == null)
    {
      node.moveBy(dX, dY);
      node.displacementX += dX;
      node.displacementY += dY;
    }
    else
    {
      node.propogateDisplacementToChildren(dX, dY);
    }
  }
};

module.exports = CoSEPNode;
