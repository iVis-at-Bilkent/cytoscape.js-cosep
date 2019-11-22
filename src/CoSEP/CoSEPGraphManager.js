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
}

CoSEPGraphManager.prototype = Object.create(CoSEGraphManager.prototype);

for (let prop in CoSEGraphManager) {
    CoSEPGraphManager[prop] = CoSEGraphManager[prop];
}

module.exports = CoSEPGraphManager;