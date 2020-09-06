/**
 *
 * @author Alihan Okka
 *
 * @copyright i-Vis Research Group, Bilkent University, 2007 - present
 */

const CoSEGraphManager = require('cose-base').CoSEGraphManager;

function CoSEPGraphManager(layout) {
    CoSEGraphManager.call(this, layout);

    // All edges with port constraints in this graph manager. The references are hold for efficiency purposes
    this.edgesWithPorts = [];

    // All nodes incident to a port constrained edge.
    this.nodesWithPorts = [];

    // All port constraint endpoints
    this.portConstraints = [];
}

CoSEPGraphManager.prototype = Object.create(CoSEGraphManager.prototype);

for (let prop in CoSEGraphManager) {
    CoSEPGraphManager[prop] = CoSEGraphManager[prop];
}

/**
 * This function needs to update port locations as well.
 */
CoSEPGraphManager.prototype.updateBounds = function () {
    this.rootGraph.updateBounds(true);

    for( let i = 0; i < this.nodesWithPorts.length; i++){
        this.nodesWithPorts[i].updatePortLocations();
    }
};

module.exports = CoSEPGraphManager;