/**
 *
 * @author Alihan Okka
 *
 * @copyright i-Vis Research Group, Bilkent University, 2007 - present
 */

const CoSEEdge = require('cose-base').CoSEEdge;
const IGeometry = require('cose-base').layoutBase.IGeometry;

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
    if( !this.isPortConstrainedEdge() ){
        return;
    }

    if( this.sourceConstraint ){
        this.sourceConstraint.initialPortConfiguration();
    }

    if( this.targetConstraint ){
        this.targetConstraint.initialPortConfiguration();
    }
};

module.exports = CoSEPEdge;