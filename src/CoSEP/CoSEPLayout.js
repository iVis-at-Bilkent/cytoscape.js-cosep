/**
 *
 * @author Alihan Okka
 *
 * @copyright i-Vis Research Group, Bilkent University, 2007 - present
 */

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
CoSEPLayout.PHASE_POLISHING = 3;

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
// Section: Limit Phase I CoSE to Specified maxIterations
// -----------------------------------------------------------------------------
CoSEPLayout.prototype.initSpringEmbedder = function () {
    var s = this.getAllNodes().length;
    if(s > FDLayoutConstants.ADAPTATION_LOWER_NODE_LIMIT){
        this.coolingFactor = Math.max(FDLayoutConstants.COOLING_ADAPTATION_FACTOR, 1.0 -
            (s-FDLayoutConstants.ADAPTATION_LOWER_NODE_LIMIT)/(FDLayoutConstants.ADAPTATION_UPPER_NODE_LIMIT-FDLayoutConstants.ADAPTATION_LOWER_NODE_LIMIT)*(1-FDLayoutConstants.COOLING_ADAPTATION_FACTOR));
    }
    else {
        this.coolingFactor = 1.0;
    }
    this.initialCoolingFactor = this.coolingFactor;
    this.maxNodeDisplacement = FDLayoutConstants.MAX_NODE_DISPLACEMENT;

    this.maxIterations = CoSEPConstants.PHASE1_MAX_ITERATIONS;

    // Reassign this attribute by using new constant value
    this.displacementThresholdPerNode = (3.0 * FDLayoutConstants.DEFAULT_EDGE_LENGTH) / 100;
    this.totalDisplacementThreshold =
        this.displacementThresholdPerNode * this.getAllNodes().length;

    this.repulsionRange = this.calcRepulsionRange();
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

/**
 * Initialize or reset variables related to the spring embedder
 */
CoSEPLayout.prototype.secondPhaseInit = function(){
    this.phase = CoSEPLayout.PHASE_SECOND;
    this.totalIterations = 0;
    this.maxIterations = CoSEPConstants.PHASE2_MAX_ITERATIONS;
    //this.maxIterations = Math.max(this.getAllNodes().length * 5, CoSEPConstants.PHASE2_MAX_ITERATIONS);

    // Reset variables for cooling
    this.initialCoolingFactor = CoSEPConstants.PHASE2_INITIAL_COOLING_FACTOR;
    this.coolingCycle = 0;
    this.maxCoolingCycle = this.maxIterations / FDLayoutConstants.CONVERGENCE_CHECK_PERIOD;
    this.finalTemperature = FDLayoutConstants.CONVERGENCE_CHECK_PERIOD / this.maxIterations;
    this.coolingAdjuster = 1;

    // Calc of spring forces have to be changes according to ports and stored for edge shifting and rotation
    this.calcSpringForce = function(edge, idealLength){
        let sourceNode = edge.getSource();
        let targetNode = edge.getTarget();

        // Update edge length
        if ( edge.isPortConstrainedEdge() )
            edge.updateLengthWithPorts();
        else
            edge.updateLength();

        if ( edge.isOverlapingSourceAndTarget )
            return;

        let length = edge.getLength();

        if(length == 0)
            return;

        // Calculate spring forces
        let springForce = edge.edgeElasticity * (length - idealLength);

        // Project force onto x and y axes
        let springForceX = springForce * (edge.lengthX / length);
        let springForceY = springForce * (edge.lengthY / length);

        // Apply forces on the end nodes
        sourceNode.springForceX += springForceX;
        sourceNode.springForceY += springForceY;
        targetNode.springForceX -= springForceX;
        targetNode.springForceY -= springForceY;

        // Store the forces to be used in edge shifting and rotation
        edge.storeRotationalForce( springForceX, springForceY );
    };
};

/**
 * Initialize or reset variables related to the spring embedder
 */
CoSEPLayout.prototype.polishingPhaseInit = function(){
    this.phase = CoSEPLayout.PHASE_POLISHING;
    this.totalIterations = 0;
    this.maxIterations = CoSEPConstants.PHASE3_MAX_ITERATIONS;
    //this.maxIterations = Math.max(this.getAllNodes().length * 5, CoSEPConstants.PHASE3_MAX_ITERATIONS);

    // Node Rotation Related Variables -- No need for rotations
    // This is for increasing performance in polishing phase
    for(let i = 0; i < this.graphManager.nodesWithPorts.length; i++) {
        let node = this.graphManager.nodesWithPorts[i];
        node.canBeRotated = false;
    }

    // Reset variables for cooling
    this.initialCoolingFactor = CoSEPConstants.PHASE3_INITIAL_COOLING_FACTOR;
    this.coolingCycle = 0;
    this.maxCoolingCycle = this.maxIterations / FDLayoutConstants.CONVERGENCE_CHECK_PERIOD;
    this.finalTemperature = FDLayoutConstants.CONVERGENCE_CHECK_PERIOD / this.maxIterations;
    this.coolingAdjuster = 1;
};

/**
 * Here we override the moveNodes method to its FD format again because CoSEP is written 
 * before the changes on the moveNodes method in cose-level are done.
 * So, let's keep its original format to avoid possible effects of the cose-level change.
 */
CoSEPLayout.prototype.moveNodes = function () {
  var lNodes = this.getAllNodes();
  var node;

  for (var i = 0; i < lNodes.length; i++)
  {
    node = lNodes[i];
    node.move();
  }
};

/**
 * This method implements a spring embedder used by Phase 2 and 3 (polishing) with
 * potentially different parameters.
 *
 * Instead of overloading important functions (e.g. movenodes) we call another fcn so that core CoSE is not affected
 */
CoSEPLayout.prototype.runSpringEmbedderTick = function () {
    this.totalIterations++;

    if ( (this.totalIterations % CoSEPConstants.CONVERGENCE_CHECK_PERIOD) === 0){
        // If the system is converged
        // But not too early
        if ( this.totalIterations >= CoSEPConstants.NOT_TOO_EARLY && this.isConverged() ) {
            return true;
        }

        // Update Cooling Temp
        this.coolingCycle++;
        this.coolingAdjuster = this.coolingCycle / 3;
        this.coolingFactor = Math.max(this.initialCoolingFactor
            - Math.pow(this.coolingCycle, Math.log(100 * (this.initialCoolingFactor - this.finalTemperature))
                / Math.log(this.maxCoolingCycle))/100 * this.coolingAdjuster, this.finalTemperature);
    }

    this.totalDisplacement = 0;

    // This updates the bounds of compound nodes along with its' ports
    this.graphManager.updateBounds();

    this.calcSpringForces();
    this.calcRepulsionForces();
    this.calcGravitationalForces();
    if(this.phase === CoSEPLayout.PHASE_POLISHING){
        this.calcPolishingForces();
    }
    this.moveNodes();

    if (this.phase === CoSEPLayout.PHASE_SECOND ){
        if (this.totalIterations % CoSEPConstants.NODE_ROTATION_PERIOD === 0) {
            this.checkForNodeRotation();
        } else if (this.totalIterations % CoSEPConstants.EDGE_END_SHIFTING_PERIOD === 0) {
            this.checkForEdgeShifting();
        }
    }

    if ( CoSEPConstants.FURTHER_HANDLING_ONE_DEGREE_NODES && this.totalIterations % CoSEPConstants.FURTHER_HANDLING_ONE_DEGREE_NODES_PERIOD === 0 ) {
        this.groupOneDegreeNodesAcrossPorts();
    }

    // If we reached max iterations
    return this.totalIterations >= this.maxIterations;
};

/**
 *  Edge shifting during phase II of the algorithm.
 */
CoSEPLayout.prototype.checkForEdgeShifting = function(){
    for(let i = 0; i < this.graphManager.portConstraints.length; i++) {
        this.graphManager.portConstraints[i].checkForEdgeShifting();
    }
};

/**
 * Node Rotation during phase II of the algorithm.
 */
CoSEPLayout.prototype.checkForNodeRotation = function(){
    for(let i = 0; i < this.graphManager.nodesWithPorts.length; i++) {
        this.graphManager.nodesWithPorts[i].checkForNodeRotation();
    }
};

/**
 * Calc polishing forces for ports during phase III (polishing phase)
 */
CoSEPLayout.prototype.calcPolishingForces = function(){
    for(let i = 0; i < this.graphManager.portConstraints.length; i++) {
        this.graphManager.portConstraints[i].calcPolishingForces();
    }
};

/**
 * For one degree nodes incident to port constrained edges, we put them to their desired location if they are not compound nodes
 * and there is one constraint on the edge.
 */
CoSEPLayout.prototype.groupOneDegreeNodesAcrossPorts = function(){
    for(let i = 0; i < this.graphManager.edgesWithPorts.length; i++) {
        let pEdge = this.graphManager.edgesWithPorts[i];
        if (pEdge.sourceConstraint && pEdge.targetConstraint)
            continue;

        let portConst = pEdge.sourceConstraint || pEdge.targetConstraint;
        if( portConst.otherNode.getEdges().length === 1 ){
            let desiredLocation = portConst.getPointOfDesiredLocation();
            portConst.otherNode.setLocation(desiredLocation.getX(), desiredLocation.getY() );
        }
    }
};

module.exports = CoSEPLayout;