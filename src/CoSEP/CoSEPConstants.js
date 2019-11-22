/**
 *
 * @author Alihan Okka
 *
 * @copyright i-Vis Research Group, Bilkent University, 2007 - present
 */

let CoSEConstants = require('cose-base').CoSEConstants;

function CoSEPConstants() {
}

//CoSEPConstants inherits static props in FDLayoutConstants
for (let prop in CoSEConstants) {
    CoSEPConstants[prop] = CoSEConstants[prop];
}

// Default number of ports on one side of a node
CoSEPConstants.PORTS_PER_SIDE = 5;

// Ite
CoSEPConstants.EDGE_SHIFTING_PERIOD = 10;

CoSEPConstants.NODE_ROTATION_PERIOD = 50;






module.exports = CoSEPConstants;