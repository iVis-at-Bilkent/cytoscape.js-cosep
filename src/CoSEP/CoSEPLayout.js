/**
 *
 * @author Alihan Okka
 *
 * @copyright i-Vis Research Group, Bilkent University, 2007 - present
 */

const PointD = require('cose-base').layoutBase.PointD;
const DimensionD = require('cose-base').layoutBase.DimensionD;
const FDLayoutConstants = require('cose-base').layoutBase.FDLayoutConstants;
const CoSELayout = require('cose-base').CoSELayout;
const CoSEPConstants = require('./CoSEPConstants');
const CoSEPGraphManager = require('./CoSEPGraphManager');
const CoSEPGraph = require('./CoSEPGraph');
const CoSEPNode = require('./CoSEPNode');
const CoSEPEdge = require('./CoSEPEdge');

// Constructor
function CoSEPLayout() {
    CoSELayout.call(this);

    // Hold how many ports are available to one side
    this.portsPerSide = CoSEPConstants.PORTS_PER_SIDE;

    // Current phase of the algorithm
    this.phase = CoSEPLayout.PHASE_CORE;
}

CoSEPLayout.prototype = Object.create(CoSELayout.prototype);

for (let property in CoSELayout) {
    CoSEPLayout[property] = CoSELayout[property];
}

// -----------------------------------------------------------------------------
// Section: Class constants
// -----------------------------------------------------------------------------

CoSEPLayout.PHASE_CORE = 1;
CoSEPLayout.PHASE_SECOND = 2;
CoSEPLayout.PHASE_THIRD = 3;

// -----------------------------------------------------------------------------
// Section: Class methods related to Graph Manager
// -----------------------------------------------------------------------------
CoSEPLayout.prototype.newGraphManager = function(){
    this.graphManager = new CoSEPGraphManager(this);
    return this.graphManager;
};

CoSEPLayout.prototype.newGraph = function (vGraph) {
    return new CoSEPGraph(null, this.graphManager, vGraph);
};

CoSEPLayout.prototype.newNode = function (vNode) {
    return new CoSEPNode(this.graphManager, vNode);
};

CoSEPLayout.prototype.newEdge = function (vEdge) {
    return new CoSEPEdge(null, null, vEdge);
};

// -----------------------------------------------------------------------------
// Section: Other Methods
// -----------------------------------------------------------------------------

/**
 * This method introduces port constraints to associated edges. The original CoSE concept is considering edges as a line
 * segment which goes through source node center to target node center but is clipped with respect to node shapes. Now,
 * we want to make sure this point corresponds to a feasible port.
 */
CoSEPLayout.prototype.initialPortConfiguration = function(){
    for(let i = 0; i < this.graphManager.edgesWithPorts.length; i++){
        let pEdge = this.graphManager.edgesWithPorts[i];
        pEdge.initialPortConfiguration();
    }
};

CoSEPLayout.prototype.secondPhaseInit = function(){
    this.phase = CoSEPLayout.PHASE_SECOND;

    this.totalIterations = 0;

    // variables for cooling
    this.coolingCycle = 0;
    this.maxCoolingCycle = this.maxIterations / FDLayoutConstants.CONVERGENCE_CHECK_PERIOD;
    this.finalTemperature = FDLayoutConstants.CONVERGENCE_CHECK_PERIOD / this.maxIterations;
    this.coolingAdjuster = 1;
};

/**
 * This method implements a spring embedder used by Phase 2 and 3 with
 * potentially different parameters.
 */
CoSEPLayout.prototype.runSpringEmbedderTick = function () {
    this.totalIterations++;
    console.log( this.totalIterations );

    this.totalDisplacement = 0;
    this.graphManager.updateBounds();
    this.calcSpringForces();
    this.calcRepulsionForces();
    this.calcGravitationalForces();
    this.moveNodes();

};

module.exports = CoSEPLayout;