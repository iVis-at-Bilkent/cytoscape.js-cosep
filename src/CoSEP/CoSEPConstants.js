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

// Initial cooling factors
CoSEPConstants.PHASE2_INITIAL_COOLING_FACTOR = 0.7;
CoSEPConstants.PHASE3_INITIAL_COOLING_FACTOR = 0.5;

// Max iterations for each phase
CoSEPConstants.PHASE1_MAX_ITERATIONS = 2500;
CoSEPConstants.PHASE2_MAX_ITERATIONS = 2500;
CoSEPConstants.PHASE3_MAX_ITERATIONS = 2500;

// Prevent layout from finishing too early for both phases
CoSEPConstants.NOT_TOO_EARLY = 200;

// Default number of ports on one side of a node
CoSEPConstants.PORTS_PER_SIDE = 5;

// # of iterations to check for edge end shifting
CoSEPConstants.EDGE_END_SHIFTING_PERIOD = 5;

// # of iterations to check for node rotation
CoSEPConstants.NODE_ROTATION_PERIOD = 15;

// Thresholds for Phase II
CoSEPConstants.EDGE_END_SHIFTING_FORCE_THRESHOLD = 1;
CoSEPConstants.NODE_ROTATION_FORCE_THRESHOLD = 20;
CoSEPConstants.ROTATION_180_RATIO_THRESHOLD = 0.5;
CoSEPConstants.ROTATION_180_ANGLE_THRESHOLD = 130;

// Polishing (Phase III) Force Constants
CoSEPConstants.DEFAULT_POLISHING_FORCE_STRENGTH = 0.1;

// Further Handling of 1-Degree Nodes
CoSEPConstants.FURTHER_HANDLING_ONE_DEGREE_NODES = true;
CoSEPConstants.FURTHER_HANDLING_ONE_DEGREE_NODES_PERIOD = 50;

module.exports = CoSEPConstants;
