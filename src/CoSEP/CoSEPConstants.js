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

CoSEPConstants.PHASE2_INITIAL_COOLING_FACTOR = 0.7;
CoSEPConstants.PHASE3_INITIAL_COOLING_FACTOR = 0.5;

// Default number of ports on one side of a node
CoSEPConstants.PORTS_PER_SIDE = 5;

// # of iterations to check for edge shifting
CoSEPConstants.EDGE_SHIFTING_PERIOD = 5;

// # of iterations to check for node rotation
CoSEPConstants.NODE_ROTATION_PERIOD = 15;

// Thresholds for Phase II
CoSEPConstants.EDGE_SHIFTING_FORCE_THRESHOLD = 3;
CoSEPConstants.NODE_ROTATION_FORCE_THRESHOLD = 20;
CoSEPConstants.ROTATION_180_RATIO_THRESHOLD = 0.5;
CoSEPConstants.ROTATION_180_ANGLE_THRESHOLD = 90;

// Polishing Force Constant
CoSEPConstants.DEFAULT_POLISHING_FORCE_STRENGTH = 5;
CoSEPConstants.GROUP_ONE_DEGREE_NODES = true;

module.exports = CoSEPConstants;