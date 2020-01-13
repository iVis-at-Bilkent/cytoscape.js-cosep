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

// # of iterations to check for edge shifting
CoSEPConstants.EDGE_SHIFTING_PERIOD = 10;

// # of iterations to check for node rotation
CoSEPConstants.NODE_ROTATION_PERIOD = 50;

// Thresholds for Phase II
CoSEPConstants.EDGE_SHIFTING_THRESHOLD = 3;
CoSEPConstants.NODE_ROTATION_THRESHOLD = 100;

module.exports = CoSEPConstants;