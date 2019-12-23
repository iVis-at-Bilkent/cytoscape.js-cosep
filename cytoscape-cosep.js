(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("cose-base"));
	else if(typeof define === 'function' && define.amd)
		define(["cose-base"], factory);
	else if(typeof exports === 'object')
		exports["cytoscapeCosep"] = factory(require("cose-base"));
	else
		root["cytoscapeCosep"] = factory(root["coseBase"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 *
 * @author Alihan Okka
 *
 * @copyright i-Vis Research Group, Bilkent University, 2007 - present
 */

var CoSEConstants = __webpack_require__(0).CoSEConstants;

function CoSEPConstants() {}

//CoSEPConstants inherits static props in FDLayoutConstants
for (var prop in CoSEConstants) {
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

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Simple, internal Object.assign() polyfill for options objects etc.

module.exports = Object.assign != null ? Object.assign.bind(Object) : function (tgt) {
  for (var _len = arguments.length, srcs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    srcs[_key - 1] = arguments[_key];
  }

  srcs.forEach(function (src) {
    Object.keys(src).forEach(function (k) {
      return tgt[k] = src[k];
    });
  });

  return tgt;
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 *
 * @author Alihan Okka
 *
 * @copyright i-Vis Research Group, Bilkent University, 2007 - present
 */

var CoSEPConstants = __webpack_require__(1);
var CoSENode = __webpack_require__(0).CoSENode;
var PointD = __webpack_require__(0).layoutBase.PointD;

function CoSEPNode(gm, loc, size, vNode) {
    CoSENode.call(this, gm, loc, size, vNode);

    // Hold how many ports are available to one side
    this.portsPerSide = CoSEPConstants.PORTS_PER_SIDE;

    // Indicator for having a port constrained edge which the constraint is associated with this node
    this.hasPortConstrainedEdge = false;

    // If the above is true, then this will hold the particular CoSEPPortConstraint classes
    this.associatedPortConstraints = [];
}

CoSEPNode.prototype = Object.create(CoSENode.prototype);

for (var prop in CoSENode) {
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
CoSEPNode.prototype.getPortCoordinatesByIndex = function (index) {
    var quotient = Math.floor(index / this.portsPerSide);
    var remainder = Math.floor(index % this.portsPerSide);
    var position = void 0;

    switch (quotient) {
        case 0:
            position = new PointD(this.rect.x + this.rect.width * (remainder + 1) / (this.portsPerSide + 1), this.rect.y);
            break;
        case 1:
            position = new PointD(this.rect.x + this.rect.width, this.rect.y + this.rect.height * (remainder + 1) / (this.portsPerSide + 1));
            break;
        case 2:
            position = new PointD(this.rect.x + this.rect.width * (this.portsPerSide - remainder) / (this.portsPerSide + 1), this.rect.y + this.rect.height);
            break;
        case 3:
            position = new PointD(this.rect.x, this.rect.y + this.rect.height * (this.portsPerSide - remainder) / (this.portsPerSide + 1));
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
CoSEPNode.prototype.getCornerPortsOfNodeSide = function (nodeSide) {
    var result = new Map();

    if (this.portsPerSide > 1) {
        // Indexes of the ports
        var firstPortIndex = this.portsPerSide * nodeSide;
        var lastPortIndex = this.portsPerSide * (nodeSide + 1) - 1;

        result.set(firstPortIndex, this.getPortCoordinatesByIndex(firstPortIndex)).set(lastPortIndex, this.getPortCoordinatesByIndex(lastPortIndex));
    } else result.set(nodeSide, this.getPortCoordinatesByIndex(nodeSide));

    return result;
};

/**
 * This methods updates all of the associated port constraints locations around itself
 */
CoSEPNode.prototype.updatePortLocations = function () {
    for (var i = 0; i < this.associatedPortConstraints.length; i++) {
        var portConst = this.associatedPortConstraints[i];
        portConst.portLocation = this.getPortCoordinatesByIndex(portConst.portIndex)[1];
    }
};

/**
 * Moving a node needs to move its port constraints as well
 * @param dx
 * @param dy
 */
CoSEPNode.prototype.moveBy = function (dx, dy) {
    this.rect.x += dx;
    this.rect.y += dy;

    this.associatedPortConstraints.forEach(function (portConstraint) {
        portConstraint.portLocation.x += dx;
        portConstraint.portLocation.y += dy;
    });
};

module.exports = CoSEPNode;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Redirection to CoSEP Algorithm
 */

module.exports = __webpack_require__(12);

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 *
 * @author Alihan Okka
 *
 * @copyright i-Vis Research Group, Bilkent University, 2007 - present
 */

var CoSEEdge = __webpack_require__(0).CoSEEdge;
var IGeometry = __webpack_require__(0).layoutBase.IGeometry;
var IMath = __webpack_require__(0).layoutBase.IMath;
var RectangleD = __webpack_require__(0).layoutBase.RectangleD;

function CoSEPEdge(source, target, vEdge) {
    CoSEEdge.call(this, source, target, vEdge);

    // These hold the port constraint for their endpoints.
    // They are divided for easy access
    this.sourceConstraint = null;
    this.targetConstraint = null;
}

CoSEPEdge.prototype = Object.create(CoSEEdge.prototype);

for (var prop in CoSEEdge) {
    CoSEPEdge[prop] = CoSEEdge[prop];
}

// -----------------------------------------------------------------------------
// Section: Getter
// -----------------------------------------------------------------------------

CoSEPEdge.prototype.getSourceConstraint = function () {
    return this.sourceConstraint;
};

CoSEPEdge.prototype.getTargetConstraint = function () {
    return this.targetConstraint;
};

// -----------------------------------------------------------------------------
// Section: Methods
// -----------------------------------------------------------------------------

/**
 * General flag indicating if this edge has any port constraints
 * @returns {boolean}
 */
CoSEPEdge.prototype.isPortConstrainedEdge = function () {
    return !!(this.sourceConstraint || this.targetConstraint);
};

/**
 * Redirects the call to its ports (if any)
 */
CoSEPEdge.prototype.initialPortConfiguration = function () {
    if (!this.isPortConstrainedEdge()) {
        return;
    }

    if (this.sourceConstraint) {
        this.sourceConstraint.initialPortConfiguration();
    }

    if (this.targetConstraint) {
        this.targetConstraint.initialPortConfiguration();
    }
};
/**
 * Changes the calc of edge length based on ports.
 */
CoSEPEdge.prototype.updateLengthWithPorts = function () {
    // If both ends are port constrained then calculate the euler distance between ports
    if (this.sourceConstraint && this.targetConstraint) {
        // If nodes intersect do nothing
        if (this.target.getRect().intersects(this.source.getRect())) {
            this.isOverlapingSourceAndTarget = true;
            return;
        }

        this.isOverlapingSourceAndTarget = false;

        var portSourcePoint = this.sourceConstraint.portLocation;
        var portTargetPoint = this.targetConstraint.portLocation;
        this.lengthX = portTargetPoint.x - portSourcePoint.x;
        this.lengthY = portTargetPoint.y - portSourcePoint.y;
        if (Math.abs(this.lengthX) < 1.0) this.lengthX = IMath.sign(this.lengthX);
        if (Math.abs(this.lengthY) < 1.0) this.lengthY = IMath.sign(this.lengthY);

        this.length = Math.sqrt(this.lengthX * this.lengthX + this.lengthY * this.lengthY);
    }
    // Otherwise, the edge is between one port to a clipping point
    else {
            var clipPointCoordinates = new Array(4);

            if (this.sourceConstraint) {
                this.isOverlapingSourceAndTarget = IGeometry.getIntersection(this.target.getRect(), new RectangleD(this.sourceConstraint.portLocation.x, this.sourceConstraint.portLocation.y, 0, 0), clipPointCoordinates);
            }
            if (this.targetConstraint) {
                this.isOverlapingSourceAndTarget = IGeometry.getIntersection(new RectangleD(this.targetConstraint.portLocation.x, this.targetConstraint.portLocation.y, 0, 0), this.source.getRect(), clipPointCoordinates);
            }

            if (!this.isOverlapingSourceAndTarget) {
                this.lengthX = clipPointCoordinates[0] - clipPointCoordinates[2];
                this.lengthY = clipPointCoordinates[1] - clipPointCoordinates[3];

                if (Math.abs(this.lengthX) < 1.0) {
                    this.lengthX = IMath.sign(this.lengthX);
                }

                if (Math.abs(this.lengthY) < 1.0) {
                    this.lengthY = IMath.sign(this.lengthY);
                }

                this.length = Math.sqrt(this.lengthX * this.lengthX + this.lengthY * this.lengthY);
            }
        }
};

/**
 * Redirects the call to its ports (if any).
 * Note: Direction is important
 */
CoSEPEdge.prototype.storeRotationalForce = function (springForceX, springForceY) {
    if (!this.isPortConstrainedEdge()) {
        return;
    }

    if (this.sourceConstraint) this.sourceConstraint.storeRotationalForce(springForceX, springForceY);

    if (this.targetConstraint) this.targetConstraint.storeRotationalForce(-springForceX, -springForceY);
};

module.exports = CoSEPEdge;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 *
 * @author Alihan Okka
 *
 * @copyright i-Vis Research Group, Bilkent University, 2007 - present
 */

var CoSEGraph = __webpack_require__(0).CoSEGraph;

function CoSEPGraph(parent, graphMgr, vGraph) {
    CoSEGraph.call(this, parent, graphMgr, vGraph);
}

CoSEPGraph.prototype = Object.create(CoSEGraph.prototype);

for (var prop in CoSEGraph) {
    CoSEPGraph[prop] = CoSEGraph[prop];
}

module.exports = CoSEPGraph;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 *
 * @author Alihan Okka
 *
 * @copyright i-Vis Research Group, Bilkent University, 2007 - present
 */

var CoSEGraphManager = __webpack_require__(0).CoSEGraphManager;

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

for (var prop in CoSEGraphManager) {
    CoSEPGraphManager[prop] = CoSEGraphManager[prop];
}

/**
 * This function needs to update port locations as well.
 */
CoSEPGraphManager.prototype.updateBounds = function () {
    this.rootGraph.updateBounds(true);

    for (var i = 0; i < this.nodesWithPorts.length; i++) {
        this.nodesWithPorts[i].updatePortLocations();
    }
};

module.exports = CoSEPGraphManager;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 *
 * @author Alihan Okka
 *
 * @copyright i-Vis Research Group, Bilkent University, 2007 - present
 */

var PointD = __webpack_require__(0).layoutBase.PointD;
var DimensionD = __webpack_require__(0).layoutBase.DimensionD;
var FDLayoutConstants = __webpack_require__(0).layoutBase.FDLayoutConstants;
var CoSELayout = __webpack_require__(0).CoSELayout;
var CoSEPConstants = __webpack_require__(1);
var CoSEPGraphManager = __webpack_require__(7);
var CoSEPGraph = __webpack_require__(6);
var CoSEPNode = __webpack_require__(3);
var CoSEPEdge = __webpack_require__(5);

// Constructor
function CoSEPLayout() {
    CoSELayout.call(this);

    // Hold how many ports are available to one side
    this.portsPerSide = CoSEPConstants.PORTS_PER_SIDE;

    // Current phase of the algorithm
    this.phase = CoSEPLayout.PHASE_CORE;
}

CoSEPLayout.prototype = Object.create(CoSELayout.prototype);

for (var property in CoSELayout) {
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
CoSEPLayout.prototype.newGraphManager = function () {
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
CoSEPLayout.prototype.initialPortConfiguration = function () {
    for (var i = 0; i < this.graphManager.edgesWithPorts.length; i++) {
        var pEdge = this.graphManager.edgesWithPorts[i];
        pEdge.initialPortConfiguration();
    }
};

/**
 * Initialize or reset variables related to the spring embedder
 */
CoSEPLayout.prototype.secondPhaseInit = function () {
    this.phase = CoSEPLayout.PHASE_SECOND;

    this.totalIterations = 0;

    // Reset variables for cooling
    this.initialCoolingFactor = 0.7;
    this.coolingCycle = 0;
    this.maxCoolingCycle = this.maxIterations / FDLayoutConstants.CONVERGENCE_CHECK_PERIOD;
    this.finalTemperature = FDLayoutConstants.CONVERGENCE_CHECK_PERIOD / this.maxIterations;
    this.coolingAdjuster = 1;

    // Calc of spring forces have to be changes according to ports and stored for edge shifting and rotation
    this.calcSpringForce = function (edge, idealLength) {
        var sourceNode = edge.getSource();
        var targetNode = edge.getTarget();

        // Update edge length
        if (edge.isPortConstrainedEdge()) edge.updateLengthWithPorts();else edge.updateLength();

        if (edge.isOverlapingSourceAndTarget) return;

        var length = edge.getLength();

        if (length == 0) return;

        // Calculate spring forces
        var springForce = this.springConstant * (length - idealLength);

        // Project force onto x and y axes
        var springForceX = springForce * (edge.lengthX / length);
        var springForceY = springForce * (edge.lengthY / length);

        // Apply forces on the end nodes
        sourceNode.springForceX += springForceX;
        sourceNode.springForceY += springForceY;
        targetNode.springForceX -= springForceX;
        targetNode.springForceY -= springForceY;

        // Store the forces to be used in edge shifting and rotation
        edge.storeRotationalForce(springForceX, springForceY);
    };
};

/**
 * This method implements a spring embedder used by Phase 2 and 3 with
 * potentially different parameters.
 *
 * Instead of overloading important functions (e.g. movenodes) we call another fcn so that core CoSE is not affected
 */
CoSEPLayout.prototype.runSpringEmbedderTick = function () {
    this.totalIterations++;

    if (this.totalIterations % CoSEPConstants.CONVERGENCE_CHECK_PERIOD === 0) {
        // If the system is converged
        if (this.isConverged()) {
            return true;
        }

        // Update Cooling Temp
        this.coolingCycle++;
        this.coolingAdjuster = this.coolingCycle / 3;
        this.coolingFactor = Math.max(this.initialCoolingFactor - Math.pow(this.coolingCycle, Math.log(100 * (this.initialCoolingFactor - this.finalTemperature)) / Math.log(this.maxCoolingCycle)) / 100 * this.coolingAdjuster, this.finalTemperature);
    }

    this.totalDisplacement = 0;

    // This updates the bounds of compound nodes along with its' ports
    this.graphManager.updateBounds();

    this.calcSpringForces();
    this.calcRepulsionForces();
    this.calcGravitationalForces();
    this.moveNodes();

    if (this.totalIterations % CoSEPConstants.EDGE_SHIFTING_PERIOD === 0) {
        this.checkForEdgeShifting();
    }

    // If we reached max iterations
    return this.totalIterations >= this.maxIterations;
};

/**
 *  Edge shifting during phase II of the algorithm.
 */
CoSEPLayout.prototype.checkForEdgeShifting = function () {
    for (var i = 0; i < this.graphManager.portConstraints.length; i++) {
        this.graphManager.portConstraints[i].checkForEdgeShifting();
    }
};

module.exports = CoSEPLayout;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 *
 * This object represents the port constraint related to corresponding endpoint
 *
 * @author Alihan Okka
 *
 * @copyright i-Vis Research Group, Bilkent University, 2007 - present
 *
 */

var PointD = __webpack_require__(0).layoutBase.PointD;
var CoSEPRotationalForce = __webpack_require__(10);
var CoSEPConstants = __webpack_require__(1);

function CoSEPPortConstraint(edge, node) {
    // Associated CoSEP Edge
    this.edge = edge;

    // Incident Node of the associated edge
    this.node = node;

    // Holds the type of the constraint using 'enum' object constraintType
    this.portConstraintType = null;

    // Holds additional information related to port's constraint. For instance,
    // Free -> [0, 1, 2, 3]
    // Absolute -> 5    // any numerical value
    // Sided -> [0, 1]   // array of feasible directions
    this.portConstraintParameter = null;

    // Holds the current index at which the port is located at
    this.portIndex = null;

    // Holds the current coordinates of the port
    // { x: - , y: -}
    this.portLocation = null;

    // Holds the direction of the side the port is on
    this.portSide = null;

    // Holds the angle
    this.correspondingAngle = null;

    // Holds the rotational force induced to incident node
    this.rotationalForce = new CoSEPRotationalForce(CoSEPConstants.EDGE_SHIFTING_PERIOD);
}

CoSEPPortConstraint.prototype = Object.create(null);

// -----------------------------------------------------------------------------
// Section: Enumerations
// In some cases, enums are decided implicitly (Top being 0 etc). Thus, be careful when modifying these values
// -----------------------------------------------------------------------------

// An enum to differentiate between different types of constraints
CoSEPPortConstraint.prototype.constraintType = Object.freeze({
    Free: 0,
    Sided: 1,
    Absolute: 2
});

// An enum to  differentiate between different node directions
CoSEPPortConstraint.prototype.sideDirection = Object.freeze({
    Top: 0,
    Right: 1,
    Bottom: 2,
    Left: 3
});

// -----------------------------------------------------------------------------
// Section: Methods
// -----------------------------------------------------------------------------

/**
 * This method assigns a feasible port to this edge endpoint as follows. For each feasible node side, find the ports
 * closest to node corners. The port with the shortest distance to the other incident node's center is assigned to this
 * port. Obviously, If the port constraint is Absolute, there is nothing to find.
 *
 * Also, add references to CoSEPNode's.
 */
CoSEPPortConstraint.prototype.initialPortConfiguration = function () {
    if (this.portConstraintType == this.constraintType['Absolute']) {
        this.portIndex = this.portConstraintParameter;

        var temp = this.node.getPortCoordinatesByIndex(this.portIndex);
        this.portSide = temp[0];
        this.portLocation = temp[1];

        this.portIndex = this.portConstraintParameter;
    } else {
        // First get all feasible ports
        var allFeasibleCornerPorts = new Map();
        for (var i = 0; i < this.portConstraintParameter.length; i++) {
            var _temp = this.node.getCornerPortsOfNodeSide(this.portConstraintParameter[i]);

            // Merge all feasible ports into allFeasibleCornerPorts
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = _temp[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var prop = _step.value;

                    allFeasibleCornerPorts.set(prop[0], prop[1]);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }

        // Find min short distance between ports and other nodes center and assign the port
        var otherNodeCenter = this.edge.getOtherEnd(this.node).getCenter();
        var shortestDistance = Number.MAX_SAFE_INTEGER;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = allFeasibleCornerPorts[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var entry = _step2.value;

                var distance = Math.hypot(entry[1][1].getX() - otherNodeCenter.getX(), entry[1][1].getY() - otherNodeCenter.getY());

                if (distance < shortestDistance) {
                    shortestDistance = distance;
                    this.portIndex = entry[0];
                    this.portSide = entry[1][0];
                    this.portLocation = entry[1][1];
                }
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }
    }

    // Adding references
    this.node.hasPortConstrainedEdge = true;
    this.node.associatedPortConstraints.push(this);
    this.node.graphManager.portConstraints.push(this);
};

/**
 * Returns the relative position of port location to related node's center
 * @returns {PointD}
 */
CoSEPPortConstraint.prototype.getRelativeRatiotoNodeCenter = function () {
    var node = this.node;
    return new PointD((this.portLocation.x - node.getCenter().x) / node.getWidth() * 100, (this.portLocation.y - node.getCenter().y) / node.getHeight() * 100);
};

/**
 * The component of the spring force, vertical component if the port is located at the top or bottom and horizontal
 * component otherwise, is considered to be the rotational force.
 *
 *  * The sign of the force should be positive for clockwise, negative for counter-clockwise
 *
 * @param springForceX
 * @param springForceY
 */

CoSEPPortConstraint.prototype.storeRotationalForce = function (springForceX, springForceY) {
    if (this.portSide == this.sideDirection['Top']) {
        this.rotationalForce.add(springForceX);
    } else if (this.portSide == this.sideDirection['Bottom']) {
        this.rotationalForce.add(-springForceX);
    } else if (this.portSide == this.sideDirection['Right']) {
        this.rotationalForce.add(springForceY);
    } else {
        this.rotationalForce.add(-springForceY);
    }
};

/**
 * If the edge is 'Absolute' constrained then there is nothing to do.
 * Otherwise check if the average rotational force inflicted upon port if above threshold.
 * If it exceeds shift the edge (assuming constraint doesn't limit it)
 * Note that there is an additional requirement if the port is located at the 'corner' of node
 */
CoSEPPortConstraint.prototype.checkForEdgeShifting = function () {
    if (this.portConstraintParameter == this.constraintType['Absolute']) {
        return;
    }

    // Exceeds threshold?
    var rotationalForceAvg = this.rotationalForce.getAverage();
    if (Math.abs(rotationalForceAvg) < CoSEPConstants.EDGE_SHIFTING_THRESHOLD) {
        return;
    }

    // If the edge wants to go clockwise or counter-clockwise
    var clockwise = Math.sign(rotationalForceAvg) == 1;

    // Currently on a corner port and wants to change sides. Then we have additional requirements.
    if (this.portIndex % this.node.portsPerSide == 0 && !clockwise) {
        var nextSide = this.portSide;

        if (--nextSide < 0) nextSide = 3;
        if (this.portConstraintParameter.includes(nextSide)) {
            if (this.additionalRequirementForAdjacentSideChanging(nextSide)) {
                var nextIndex = this.portIndex - 1;
                if (nextIndex < 0) nextIndex = 4 * this.node.portsPerSide - 1;
                var temp = this.node.getPortCoordinatesByIndex(nextIndex);
                this.portIndex = nextIndex;
                this.portSide = temp[0];
                this.portLocation = temp[1];
            } else return;
        }

        if (--nextSide < 0) nextSide = 3;
        if (this.portConstraintParameter.includes(nextSide)) if (this.additionalRequirementForAcrossSideChanging()) {
            var _nextIndex = this.portIndex - (this.node.portsPerSide + 1);
            if (_nextIndex < 0) _nextIndex = 4 * this.node.portsPerSide + _nextIndex;
            var _temp2 = this.node.getPortCoordinatesByIndex(_nextIndex);
            this.portIndex = _nextIndex;
            this.portSide = _temp2[0];
            this.portLocation = _temp2[1];
        } else return;
    } else if (this.portIndex % this.node.portsPerSide == this.node.portsPerSide - 1 && clockwise) {
        var _nextSide = (this.portSide + 1) % 4;
        if (this.portConstraintParameter.includes(_nextSide)) {
            if (this.additionalRequirementForAdjacentSideChanging(_nextSide)) {
                var _nextIndex2 = (this.portIndex + 1) % (4 * this.node.portsPerSide);
                var _temp3 = this.node.getPortCoordinatesByIndex(_nextIndex2);
                this.portIndex = _nextIndex2;
                this.portSide = _temp3[0];
                this.portLocation = _temp3[1];
            } else return;
        }

        _nextSide = (_nextSide + 1) % 4;
        if (this.portConstraintParameter.includes(_nextSide)) if (this.additionalRequirementForAcrossSideChanging()) {
            var _nextIndex3 = (this.portIndex + this.node.portsPerSide + 1) % (4 * this.node.portsPerSide);
            var _temp4 = this.node.getPortCoordinatesByIndex(_nextIndex3);
            this.portIndex = _nextIndex3;
            this.portSide = _temp4[0];
            this.portLocation = _temp4[1];
        } else return;
    } else {
        var _nextIndex4 = void 0;
        if (clockwise) _nextIndex4 = (this.portIndex + 1) % (4 * this.node.portsPerSide);else {
            _nextIndex4 = this.portIndex - 1;
            if (_nextIndex4 < 0) _nextIndex4 = 4 * this.node.portsPerSide - 1;
        }

        var _temp5 = this.node.getPortCoordinatesByIndex(_nextIndex4);
        this.portIndex = _nextIndex4;
        this.portSide = _temp5[0];
        this.portLocation = _temp5[1];
    }
};

/**
 * The node needs to be in the right quadrant. Quadrants are defined by node's corner points.
 * Equalities are facing downwards.
 *
 * For line1: Top-Left to Bottom-Right
 * For line2: Top-Right to Bottom-Left
 *
 * @param nextSide
 */
CoSEPPortConstraint.prototype.additionalRequirementForAdjacentSideChanging = function (nextSide) {
    var nodeRect = this.node.rect;
    var otherNodeRect = this.edge.getOtherEnd(this.node).getCenter();

    switch (this.portSide) {
        case 0:
            if (nextSide == 1) {
                var check = line(nodeRect.x + nodeRect.width, nodeRect.y, nodeRect.x, nodeRect.y + nodeRect.height);
                return check(otherNodeRect.x, otherNodeRect.y);
            } else {
                var _check = line(nodeRect.x, nodeRect.y, nodeRect.x + nodeRect.width, nodeRect.y + nodeRect.height);
                return _check(otherNodeRect.x, otherNodeRect.y);
            }
            break;
        case 1:
            if (nextSide == 0) {
                var _check2 = line(nodeRect.x + nodeRect.width, nodeRect.y, nodeRect.x, nodeRect.y + nodeRect.height);
                return !_check2(otherNodeRect.x, otherNodeRect.y);
            } else {
                var _check3 = line(nodeRect.x, nodeRect.y, nodeRect.x + nodeRect.width, nodeRect.y + nodeRect.height);
                return _check3(otherNodeRect.x, otherNodeRect.y);
            }
            break;
        case 2:
            if (nextSide == 3) {
                var _check4 = line(nodeRect.x + nodeRect.width, nodeRect.y, nodeRect.x, nodeRect.y + nodeRect.height);
                return !_check4(otherNodeRect.x, otherNodeRect.y);
            } else {
                var _check5 = line(nodeRect.x, nodeRect.y, nodeRect.x + nodeRect.width, nodeRect.y + nodeRect.height);
                return !_check5(otherNodeRect.x, otherNodeRect.y);
            }
            break;
        case 3:
            if (nextSide == 2) {
                var _check6 = line(nodeRect.x + nodeRect.width, nodeRect.y, nodeRect.x, nodeRect.y + nodeRect.height);
                return _check6(otherNodeRect.x, otherNodeRect.y);
            } else {
                var _check7 = line(nodeRect.x, nodeRect.y, nodeRect.x + nodeRect.width, nodeRect.y + nodeRect.height);
                return !_check7(otherNodeRect.x, otherNodeRect.y);
            }
            break;
    }

    function line(x1, y1, x2, y2) {
        var slope = (y2 - y1) / (x2 - x1);
        return function (x, y) {
            return y - y1 > slope * (x - x1);
        };
    }
};

/**
 * The node needs to be in the right quadrant. Quadrants are defined by node's center.
 *
 * For line1: Node Center, horizontal, equality pointing downward
 * For line2: Node Center, vertical, equality pointing right
 *
 * @param nextSide
 */
CoSEPPortConstraint.prototype.additionalRequirementForAcrossSideChanging = function () {
    var nodeRect = this.node.getCenter();
    var otherNodeRect = this.edge.getOtherEnd(this.node).getCenter();
    var check = void 0;

    switch (this.portSide) {
        case 0:
            check = line(nodeRect.x, nodeRect.y, nodeRect.x + nodeRect.width, nodeRect.y);
            return check(otherNodeRect.x, otherNodeRect.y);
            break;
        case 1:
            check = line(nodeRect.x, nodeRect.y, nodeRect.x, nodeRect.y, +nodeRect.height);
            return !check(otherNodeRect.x, otherNodeRect.y);
            break;
        case 2:
            check = line(nodeRect.x, nodeRect.y, nodeRect.x + nodeRect.width, nodeRect.y);
            return !check(otherNodeRect.x, otherNodeRect.y);
            break;
        case 3:
            check = line(nodeRect.x, nodeRect.y, nodeRect.x, nodeRect.y, +nodeRect.height);
            return check(otherNodeRect.x, otherNodeRect.y);
            break;
    }

    function line(x1, y1, x2, y2) {
        var slope = (y2 - y1) / (x2 - x1);
        return function (x, y) {
            return y - y1 > slope * (x - x1);
        };
    }
};

module.exports = CoSEPPortConstraint;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 *
 * This object is data structure holding rotational forces. The size should match the periods of phase 2 in order for
 * this class to work properly.
 *
 * The stored force could be:
 * 1) The force inflicted upon a port by the edge
 * 2) A node's total rotational force done by all of its' edges
 *
 * @author Alihan Okka
 *
 * @copyright i-Vis Research Group, Bilkent University, 2007 - present
 *
 */
function CoSEPRotationalForce(size) {
    this.size = size;
    this.data = new Array(this.size);
    this.current = 0;
}

CoSEPRotationalForce.prototype = Object.create(null);

/**
 * Adds a number to the array
 * @param number
 */
CoSEPRotationalForce.prototype.add = function (number) {
    this.data[this.current] = number;
    this.current = ++this.current % this.size;
};

/**
 * Returns the average of the forces stored.
 * @returns {number}
 */
CoSEPRotationalForce.prototype.getAverage = function () {
    var result = 0;
    for (var i = 0; i < this.size; i++) {
        result += this.data[i] / this.size;
    }return result;
};

module.exports = CoSEPRotationalForce;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var impl = __webpack_require__(4);

// registers the extension on a cytoscape lib ref
var register = function register(cytoscape) {
  if (!cytoscape) {
    return;
  } // can't register if cytoscape unspecified

  cytoscape('layout', 'cosep', impl); // register with cytoscape.js
};

if (typeof cytoscape !== 'undefined') {
  // expose to global cytoscape (i.e. window.cytoscape)
  register(cytoscape);
}

module.exports = register;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 *
 * @author Alihan Okka
 *
 * @copyright i-Vis Research Group, Bilkent University, 2007 - present
 */

var HashMap = __webpack_require__(0).layoutBase.HashMap;
var PointD = __webpack_require__(0).layoutBase.PointD;
var DimensionD = __webpack_require__(0).layoutBase.DimensionD;
var LayoutConstants = __webpack_require__(0).layoutBase.LayoutConstants;
var CoSEPConstants = __webpack_require__(1);
var CoSEConstants = __webpack_require__(0).CoSEConstants;
var FDLayoutConstants = __webpack_require__(0).layoutBase.FDLayoutConstants;
var CoSEPLayout = __webpack_require__(8);
var CoSEPNode = __webpack_require__(3);
var CoSEPPortConstraint = __webpack_require__(9);

var ContinuousLayout = __webpack_require__(13);
var assign = __webpack_require__(2);
var isFn = function isFn(fn) {
  return typeof fn === 'function';
};

var optFn = function optFn(opt, ele) {
  if (isFn(opt)) {
    return opt(ele);
  } else {
    return opt;
  }
};

/**
 *  Default layout options
 */
var defaults = {
  animate: false, // whether to show the layout as it's running; special 'end' value makes the layout animate like a discrete layout
  refresh: 10, // number of ticks per frame; higher is faster but more jerky
  //maxIterations: 2500, // max iterations before the layout will bail out
  //maxSimulationTime: 5000, // max length in ms to run the layout
  ungrabifyWhileSimulating: false, // so you can't drag nodes during layout
  fit: true, // on every layout reposition of nodes, fit the viewport
  padding: 30, // padding around the simulation
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  // infinite layout options
  infinite: false, // overrides all other options for a forces-all-the-time mode

  // layout event callbacks
  ready: function ready() {}, // on layoutready
  stop: function stop() {}, // on layoutstop

  // positioning options
  randomize: true, // use random node positions at beginning of layout
  // Include labels in node dimensions
  nodeDimensionsIncludeLabels: false,
  // Whether or not simple nodes (non-compound nodes) are of uniform dimensions
  uniformNodeDimensions: false,
  // Node repulsion (non overlapping) multiplier
  nodeRepulsion: 4500,
  // Ideal edge (non nested) length
  idealEdgeLength: 50,
  // Divisor to compute edge forces
  edgeElasticity: 0.45,
  // Nesting factor (multiplier) to compute ideal edge length for nested edges
  nestingFactor: 0.1,
  // Gravity force (constant)
  gravity: 0.25,
  // For enabling tiling
  tile: true,
  // Represents the amount of the vertical space to put between the zero degree members during the tiling operation(can also be a function)
  tilingPaddingVertical: 10,
  // Represents the amount of the horizontal space to put between the zero degree members during the tiling operation(can also be a function)
  tilingPaddingHorizontal: 10,
  // Gravity range (constant) for compounds
  gravityRangeCompound: 1.5,
  // Gravity force (constant) for compounds
  gravityCompound: 1.0,
  // Gravity range (constant)
  gravityRange: 3.8,
  // Initial cooling factor for incremental layout
  initialEnergyOnIncremental: 0.5
};

/**
 * Getting options from the user
 * Some of these parameters are from Cose-bilkent. They are hard-coded to make a 'draft algorithm'
 * Quality is 0 ('Draft Layout') for phase I of the algorithm
 * @param options
 */
var getUserOptions = function getUserOptions(options) {
  if (options.nodeRepulsion != null) CoSEPConstants.DEFAULT_REPULSION_STRENGTH = CoSEConstants.DEFAULT_REPULSION_STRENGTH = FDLayoutConstants.DEFAULT_REPULSION_STRENGTH = options.nodeRepulsion;
  if (options.idealEdgeLength != null) CoSEPConstants.DEFAULT_EDGE_LENGTH = CoSEConstants.DEFAULT_EDGE_LENGTH = FDLayoutConstants.DEFAULT_EDGE_LENGTH = options.idealEdgeLength;
  if (options.edgeElasticity != null) CoSEPConstants.DEFAULT_SPRING_STRENGTH = CoSEConstants.DEFAULT_SPRING_STRENGTH = FDLayoutConstants.DEFAULT_SPRING_STRENGTH = options.edgeElasticity;
  if (options.nestingFactor != null) CoSEPConstants.PER_LEVEL_IDEAL_EDGE_LENGTH_FACTOR = CoSEConstants.PER_LEVEL_IDEAL_EDGE_LENGTH_FACTOR = FDLayoutConstants.PER_LEVEL_IDEAL_EDGE_LENGTH_FACTOR = options.nestingFactor;
  if (options.gravity != null) CoSEPConstants.DEFAULT_GRAVITY_STRENGTH = CoSEConstants.DEFAULT_GRAVITY_STRENGTH = FDLayoutConstants.DEFAULT_GRAVITY_STRENGTH = options.gravity;
  if (options.gravityRange != null) CoSEPConstants.DEFAULT_GRAVITY_RANGE_FACTOR = CoSEConstants.DEFAULT_GRAVITY_RANGE_FACTOR = FDLayoutConstants.DEFAULT_GRAVITY_RANGE_FACTOR = options.gravityRange;
  if (options.gravityCompound != null) CoSEPConstants.DEFAULT_COMPOUND_GRAVITY_STRENGTH = CoSEConstants.DEFAULT_COMPOUND_GRAVITY_STRENGTH = FDLayoutConstants.DEFAULT_COMPOUND_GRAVITY_STRENGTH = options.gravityCompound;
  if (options.gravityRangeCompound != null) CoSEPConstants.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR = CoSEConstants.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR = FDLayoutConstants.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR = options.gravityRangeCompound;
  if (options.initialEnergyOnIncremental != null) CoSEPConstants.DEFAULT_COOLING_FACTOR_INCREMENTAL = CoSEConstants.DEFAULT_COOLING_FACTOR_INCREMENTAL = FDLayoutConstants.DEFAULT_COOLING_FACTOR_INCREMENTAL = options.initialEnergyOnIncremental;

  // Phase I of the algorithm
  LayoutConstants.QUALITY = 0;

  CoSEPConstants.ANIMATE = CoSEConstants.ANIMATE = FDLayoutConstants.ANIMATE = LayoutConstants.ANIMATE = 'end';

  // # of ports on a node's side
  if (options.portsPerNodeSide != null) CoSEPConstants.PORTS_PER_SIDE = +options.portsPerNodeSide;

  CoSEPConstants.NODE_DIMENSIONS_INCLUDE_LABELS = CoSEConstants.NODE_DIMENSIONS_INCLUDE_LABELS = FDLayoutConstants.NODE_DIMENSIONS_INCLUDE_LABELS = LayoutConstants.NODE_DIMENSIONS_INCLUDE_LABELS = false;

  CoSEPConstants.DEFAULT_INCREMENTAL = CoSEConstants.DEFAULT_INCREMENTAL = FDLayoutConstants.DEFAULT_INCREMENTAL = LayoutConstants.DEFAULT_INCREMENTAL = !true; // options.randomize

  CoSEPConstants.TILE = CoSEConstants.TILE = options.tile;
  CoSEPConstants.TILING_PADDING_VERTICAL = CoSEConstants.TILING_PADDING_VERTICAL = typeof options.tilingPaddingVertical === 'function' ? options.tilingPaddingVertical.call() : options.tilingPaddingVertical;
  CoSEPConstants.TILING_PADDING_HORIZONTAL = CoSEConstants.TILING_PADDING_HORIZONTAL = typeof options.tilingPaddingHorizontal === 'function' ? options.tilingPaddingHorizontal.call() : options.tilingPaddingHorizontal;

  LayoutConstants.DEFAULT_UNIFORM_LEAF_NODE_SIZES = options.uniformNodeDimensions;
};

var Layout = function (_ContinuousLayout) {
  _inherits(Layout, _ContinuousLayout);

  function Layout(options) {
    _classCallCheck(this, Layout);

    options = assign({}, defaults, options);

    var _this = _possibleConstructorReturn(this, (Layout.__proto__ || Object.getPrototypeOf(Layout)).call(this, options));

    getUserOptions(options);
    return _this;
  }

  _createClass(Layout, [{
    key: 'prerun',
    value: function prerun() {
      var _this2 = this;

      var self = this;
      var state = this.state; // options object combined with current state

      // Get graph information from Cytoscape
      var nodes = state.nodes;
      var edges = state.edges;
      var idToLNode = this.idToLNode = {};

      // Used to update Cytoscape port visualization
      // lEdge -> Cytoscape edge
      var lEdgeToCEdge = this.lEdgeToCEdge = new HashMap();

      // Holds edges with ports
      // id -> LEdge
      var portConstrainedEdges = this.portConstrainedEdges = {};

      // Hold the Lnodes that have port constrained edges
      var nodesWithPorts = this.nodesWithPorts = {};

      // Get port information from the options
      var portConstraints = void 0;
      if (this.options.portConstraints != null && this.options.portConstraints != undefined && typeof this.options.portConstraints === 'function') portConstraints = this.options.portConstraints;else throw "There are no port constraints defined as a function named 'portConstraints'";

      // Initialize CoSEP elements
      var cosepLayout = this.cosepLayout = new CoSEPLayout();
      var graphManager = this.graphManager = cosepLayout.newGraphManager();
      var root = this.root = graphManager.addRoot();

      // Establishing node relations in the GraphManager object
      this.processChildrenList(this.root, this.getTopMostNodes(nodes), cosepLayout);

      // Adding edges to GraphManager
      for (var i = 0; i < edges.length; i++) {
        var edge = edges[i];
        var sourceNode = this.idToLNode[edge.data("source")];
        var targetNode = this.idToLNode[edge.data("target")];
        if (sourceNode !== targetNode && sourceNode.getEdgesBetween(targetNode).length === 0) {
          (function () {
            var gmEdge = graphManager.add(cosepLayout.newEdge(), sourceNode, targetNode);
            gmEdge.id = edge.id();

            /**
             *  Setting variables related to port constraints
             */
            var edgePortInfos = portConstraints(edge);
            if (edgePortInfos != null && edgePortInfos != undefined && edgePortInfos.length > 0) {

              // Save the references
              _this2.portConstrainedEdges[edge.data('id')] = gmEdge;
              _this2.lEdgeToCEdge.put(gmEdge, edge);
              _this2.graphManager.edgesWithPorts.push(gmEdge);

              edgePortInfos.forEach(function (portInfo) {
                var constraint = void 0;
                // If the info is about source
                if (portInfo.endpoint == 'Source') {
                  constraint = new CoSEPPortConstraint(gmEdge, gmEdge.source);
                  gmEdge.sourceConstraint = constraint;

                  self.nodesWithPorts[gmEdge.getSource().id] = gmEdge.getSource();
                } else {
                  // or target
                  constraint = new CoSEPPortConstraint(gmEdge, gmEdge.target);
                  gmEdge.targetConstraint = constraint;

                  self.nodesWithPorts[gmEdge.getTarget().id] = gmEdge.getTarget();
                }

                // Type of the constraint is defined
                constraint.portConstraintType = constraint.constraintType[portInfo.portConstraintType];

                switch (constraint.portConstraintType) {
                  case 0:
                    // Free, add all directions via enum
                    constraint.portConstraintParameter = [constraint.sideDirection['Top'], constraint.sideDirection['Right'], constraint.sideDirection['Bottom'], constraint.sideDirection['Left']];
                    break;
                  case 1:
                    // Need to enum directions
                    constraint.portConstraintParameter = [];
                    portInfo.portConstraintParameter.forEach(function (direction) {
                      constraint.portConstraintParameter.push(constraint.sideDirection[direction]);
                    });
                    break;
                  case 2:
                    // Getting absolute position
                    constraint.portConstraintParameter = +portInfo.portConstraintParameter; // if '5' -> 5
                    break;
                }
              });
            }
          })();
        }
      }

      // Saving the references
      this.graphManager.nodesWithPorts = Object.values(this.nodesWithPorts);

      // First phase of the algorithm
      if (state.randomize) {
        this.cosepLayout.runLayout();
      } else {
        this.cosepLayout.initParameters();
        this.cosepLayout.nodesWithGravity = this.cosepLayout.calculateNodesToApplyGravitationTo();
        this.graphManager.setAllNodesToApplyGravitation(this.cosepLayout.nodesWithGravity);
        this.cosepLayout.calcNoOfChildrenForAllNodes();
        this.graphManager.calcLowestCommonAncestors();
        this.graphManager.calcInclusionTreeDepths();
        this.graphManager.getRoot().calcEstimatedSize();
        this.cosepLayout.calcIdealEdgeLengths();
        //   this.graphManager.updateBounds();
        this.cosepLayout.level = 0;
        this.cosepLayout.initSpringEmbedder();
      }

      // Initialize ports
      this.addImplicitPortConstraints();
      cosepLayout.initialPortConfiguration();

      // Update Cytoscape Port Visualizations
      this.updateCytoscapePortVisualization();

      // Initialize second phase of the algorithm
      this.cosepLayout.secondPhaseInit();
    }

    // Get the top most ones of a list of nodes
    // Note: Taken from CoSE-Bilkent !!

  }, {
    key: 'getTopMostNodes',
    value: function getTopMostNodes(nodes) {
      var nodesMap = {};
      for (var i = 0; i < nodes.length; i++) {
        nodesMap[nodes[i].id()] = true;
      }
      return nodes.filter(function (ele, i) {
        if (typeof ele === "number") {
          ele = i;
        }
        var parent = ele.parent()[0];
        while (parent != null) {
          if (nodesMap[parent.id()]) {
            return false;
          }
          parent = parent.parent()[0];
        }
        return true;
      });
    }

    // Note: Taken from CoSE-Bilkent !!
    // MODIFIED TO NOT TAKE LABEL INFO/DIMENSIONS

  }, {
    key: 'processChildrenList',
    value: function processChildrenList(parent, children, layout) {
      var size = children.length;
      for (var i = 0; i < size; i++) {
        var theChild = children[i];
        var children_of_children = theChild.children();
        var theNode = void 0;

        var dimensions = theChild.layoutDimensions({
          nodeDimensionsIncludeLabels: false
        });

        if (theChild.outerWidth() != null && theChild.outerHeight() != null) {
          theNode = parent.add(new CoSEPNode(layout.graphManager, new PointD(theChild.position('x') - dimensions.w / 2, theChild.position('y') - dimensions.h / 2), new DimensionD(parseFloat(dimensions.w), parseFloat(dimensions.h))));
        } else {
          theNode = parent.add(new CoSEPNode(this.graphManager));
        }
        // Attach id to the layout node
        theNode.id = theChild.data("id");

        // Attach the paddings of cy node to layout node
        theNode.paddingLeft = parseInt(theChild.css('padding'));
        theNode.paddingTop = parseInt(theChild.css('padding'));
        theNode.paddingRight = parseInt(theChild.css('padding'));
        theNode.paddingBottom = parseInt(theChild.css('padding'));

        // Map the layout node
        this.idToLNode[theChild.data("id")] = theNode;

        if (isNaN(theNode.rect.x)) {
          theNode.rect.x = 0;
        }

        if (isNaN(theNode.rect.y)) {
          theNode.rect.y = 0;
        }

        if (children_of_children != null && children_of_children.length > 0) {
          var theNewGraph = void 0;
          theNewGraph = layout.getGraphManager().add(layout.newGraph(), theNode);
          this.processChildrenList(theNewGraph, children_of_children, layout);
        }
      }
    }

    // run this each iteraction

  }, {
    key: 'tick',
    value: function tick() {
      var _this3 = this;

      var state = this.state;
      var self = this;
      var isDone = void 0;

      // TODO update state for this iteration
      this.state.nodes.forEach(function (n) {
        var s = _this3.getScratch(n);

        // We let compound node's locations to be figured out by Cytoscape
        //  if (n.not(":parent").length !== 0) {
        var location = _this3.idToLNode[n.data('id')];
        s.x = location.getCenterX();
        s.y = location.getCenterY();
        //  }
      });

      isDone = this.cosepLayout.runSpringEmbedderTick();

      self.updateCytoscapePortVisualization();

      state.tickIndex = this.cosepLayout.totalIterations;

      return isDone;
    }

    // run this function after the layout is done ticking

  }, {
    key: 'postrun',
    value: function postrun() {
      var self = this;

      console.log('** Done in ' + this.cosepLayout.totalIterations + ' iterations');
      console.log('** Graph Manager');
      console.log(this.graphManager);
      console.log('** idToLNode');
      console.log(this.idToLNode);
      console.log('** Nodes with ports');
      console.log(this.nodesWithPorts);
      console.log('** lEdgeToCEdge');
      console.log(this.lEdgeToCEdge);
      console.log('** portConstrainedEdges');
      console.log(this.portConstrainedEdges);
    }

    /**
     * If a node has an incident port constrained edge, the other incident edges should at least be a 'Free constrained'
     * edge. These are defined as implicit port constraints
     */

  }, {
    key: 'addImplicitPortConstraints',
    value: function addImplicitPortConstraints() {
      var self = this;
      Object.keys(this.nodesWithPorts).forEach(function (key) {
        var lNode = self.idToLNode[key];
        for (var i = 0; i < lNode.getEdges().length; i++) {
          var lEdge = lNode.getEdges()[i];

          // If the node is the 'source' of edge
          if (lEdge.getSource().id == lNode.id) {
            // If there is already a port constraint
            if (!lEdge.getSourceConstraint()) {
              // Create port constraint
              var constraint = new CoSEPPortConstraint(lEdge, lEdge.source);
              lEdge.sourceConstraint = constraint;

              constraint.portConstraintType = constraint.constraintType['Free'];

              constraint.portConstraintParameter = [constraint.sideDirection['Top'], constraint.sideDirection['Right'], constraint.sideDirection['Bottom'], constraint.sideDirection['Left']];

              // Adding references
              self.lEdgeToCEdge.put(lEdge, self.state.cy.getElementById(lEdge.id));
              self.portConstrainedEdges[lEdge.id] = lEdge;
              self.graphManager.edgesWithPorts.push(lEdge);
            }
          } else {
            if (!lEdge.getTargetConstraint()) {
              // Create port constraint
              var _constraint = new CoSEPPortConstraint(lEdge, lEdge.target);
              lEdge.targetConstraint = _constraint;

              _constraint.portConstraintType = _constraint.constraintType['Free'];

              _constraint.portConstraintParameter = [_constraint.sideDirection['Top'], _constraint.sideDirection['Right'], _constraint.sideDirection['Bottom'], _constraint.sideDirection['Left']];

              // Adding references
              self.lEdgeToCEdge.put(lEdge, self.state.cy.getElementById(lEdge.id));
              self.portConstrainedEdges[lEdge.id] = lEdge;
              self.graphManager.edgesWithPorts.push(lEdge);
            }
          }
        }
      });
    }

    /**
     * Update Cytoscape so that edges with ports are properly shown
     */

  }, {
    key: 'updateCytoscapePortVisualization',
    value: function updateCytoscapePortVisualization() {
      var self = this;

      Object.keys(this.portConstrainedEdges).forEach(function (key) {
        var lEdge = self.portConstrainedEdges[key];
        var cytoEdge = self.lEdgeToCEdge.get(lEdge);

        var sourceConstraint = lEdge.getSourceConstraint();
        if (sourceConstraint) {
          var relativePos = sourceConstraint.getRelativeRatiotoNodeCenter();
          cytoEdge.style({ 'source-endpoint': +relativePos.x + "% " + +relativePos.y + '%' });
        }

        var targetConstraint = lEdge.getTargetConstraint();
        if (targetConstraint) {
          var _relativePos = targetConstraint.getRelativeRatiotoNodeCenter();
          cytoEdge.style({ 'target-endpoint': +_relativePos.x + "% " + +_relativePos.y + '%' });
        }
      });
    }

    // clean up any object refs that could prevent garbage collection, etc.

  }, {
    key: 'destroy',
    value: function destroy() {
      _get(Layout.prototype.__proto__ || Object.getPrototypeOf(Layout.prototype), 'destroy', this).call(this);

      return this;
    }
  }]);

  return Layout;
}(ContinuousLayout);

module.exports = Layout;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 A generic continuous layout class
 */

var assign = __webpack_require__(2);
var makeBoundingBox = __webpack_require__(14);

var _require = __webpack_require__(15),
    setInitialPositionState = _require.setInitialPositionState,
    refreshPositions = _require.refreshPositions,
    getNodePositionData = _require.getNodePositionData;

var _require2 = __webpack_require__(16),
    multitick = _require2.multitick;

var Layout = function () {
  function Layout(options) {
    _classCallCheck(this, Layout);

    var o = this.options = options;

    var s = this.state = assign({}, o, {
      layout: this,
      nodes: o.eles.nodes(),
      edges: o.eles.edges(),
      tickIndex: 0,
      firstUpdate: true
    });

    s.animateEnd = o.animate && o.animate === 'end';
    s.animateContinuously = o.animate && !s.animateEnd;
  }

  _createClass(Layout, [{
    key: 'getScratch',
    value: function getScratch(el) {
      var name = this.state.name;
      var scratch = el.scratch(name);

      if (!scratch) {
        scratch = {};

        el.scratch(name, scratch);
      }

      return scratch;
    }
  }, {
    key: 'run',
    value: function run() {
      var l = this;
      var s = this.state;

      s.tickIndex = 0;
      s.firstUpdate = true;
      s.startTime = Date.now();
      s.running = true;

      s.currentBoundingBox = makeBoundingBox(s.boundingBox, s.cy);

      if (s.ready) {
        l.one('ready', s.ready);
      }
      if (s.stop) {
        l.one('stop', s.stop);
      }

      s.nodes.forEach(function (n) {
        return setInitialPositionState(n, s);
      });

      l.prerun(s);

      if (s.animateContinuously) {
        var ungrabify = function ungrabify(node) {
          if (!s.ungrabifyWhileSimulating) {
            return;
          }

          var grabbable = getNodePositionData(node, s).grabbable = node.grabbable();

          if (grabbable) {
            node.ungrabify();
          }
        };

        var regrabify = function regrabify(node) {
          if (!s.ungrabifyWhileSimulating) {
            return;
          }

          var grabbable = getNodePositionData(node, s).grabbable;

          if (grabbable) {
            node.grabify();
          }
        };

        var updateGrabState = function updateGrabState(node) {
          return getNodePositionData(node, s).grabbed = node.grabbed();
        };

        var onGrab = function onGrab(_ref) {
          var target = _ref.target;

          updateGrabState(target);
        };

        var onFree = onGrab;

        var onDrag = function onDrag(_ref2) {
          var target = _ref2.target;

          var p = getNodePositionData(target, s);
          var tp = target.position();

          p.x = tp.x;
          p.y = tp.y;
        };

        var listenToGrab = function listenToGrab(node) {
          node.on('grab', onGrab);
          node.on('free', onFree);
          node.on('drag', onDrag);
        };

        var unlistenToGrab = function unlistenToGrab(node) {
          node.removeListener('grab', onGrab);
          node.removeListener('free', onFree);
          node.removeListener('drag', onDrag);
        };

        var fit = function fit() {
          if (s.fit && s.animateContinuously) {
            s.cy.fit(s.padding);
          }
        };

        var onNotDone = function onNotDone() {
          refreshPositions(s.nodes, s);
          fit();

          requestAnimationFrame(_frame);
        };

        var _frame = function _frame() {
          multitick(s, onNotDone, _onDone);
        };

        var _onDone = function _onDone() {
          refreshPositions(s.nodes, s);
          fit();

          s.nodes.forEach(function (n) {
            regrabify(n);
            unlistenToGrab(n);
          });

          s.running = false;

          l.emit('layoutstop');
        };

        l.emit('layoutstart');

        s.nodes.forEach(function (n) {
          ungrabify(n);
          listenToGrab(n);
        });

        _frame(); // kick off
      } else {
        var done = false;
        var _onNotDone = function _onNotDone() {};
        var _onDone2 = function _onDone2() {
          return done = true;
        };

        while (!done) {
          multitick(s, _onNotDone, _onDone2);
        }

        s.eles.layoutPositions(this, s, function (node) {
          var pd = getNodePositionData(node, s);

          return { x: pd.x, y: pd.y };
        });
      }

      l.postrun(s);

      return this; // chaining
    }
  }, {
    key: 'prerun',
    value: function prerun() {}
  }, {
    key: 'postrun',
    value: function postrun() {}
  }, {
    key: 'tick',
    value: function tick() {}
  }, {
    key: 'stop',
    value: function stop() {
      this.state.running = false;

      return this; // chaining
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      return this; // chaining
    }
  }]);

  return Layout;
}();

module.exports = Layout;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (bb, cy) {
  if (bb == null) {
    bb = { x1: 0, y1: 0, w: cy.width(), h: cy.height() };
  } else {
    // copy
    bb = { x1: bb.x1, x2: bb.x2, y1: bb.y1, y2: bb.y2, w: bb.w, h: bb.h };
  }

  if (bb.x2 == null) {
    bb.x2 = bb.x1 + bb.w;
  }
  if (bb.w == null) {
    bb.w = bb.x2 - bb.x1;
  }
  if (bb.y2 == null) {
    bb.y2 = bb.y1 + bb.h;
  }
  if (bb.h == null) {
    bb.h = bb.y2 - bb.y1;
  }

  return bb;
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var assign = __webpack_require__(2);

var setInitialPositionState = function setInitialPositionState(node, state) {
  var p = node.position();
  var bb = state.currentBoundingBox;
  var scratch = node.scratch(state.name);

  if (scratch == null) {
    scratch = {};

    node.scratch(state.name, scratch);
  }

  assign(scratch, { x: p.x, y: p.y });

  scratch.locked = node.locked();
};

var getNodePositionData = function getNodePositionData(node, state) {
  return node.scratch(state.name);
};

var refreshPositions = function refreshPositions(nodes, state) {
  nodes.positions(function (node) {
    var scratch = node.scratch(state.name);

    return {
      x: scratch.x,
      y: scratch.y
    };
  });
};

module.exports = { setInitialPositionState: setInitialPositionState, getNodePositionData: getNodePositionData, refreshPositions: refreshPositions };

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var nop = function nop() {};

var tick = function tick(state) {
  var s = state;
  var l = state.layout;

  var tickIndicatesDone = l.tick(s);

  if (s.firstUpdate) {
    if (s.animateContinuously) {
      // indicate the initial positions have been set
      s.layout.emit('layoutready');
    }
    s.firstUpdate = false;
  }

  var duration = Date.now() - s.startTime;

  return !s.infinite && tickIndicatesDone; // || s.tickIndex >= s.maxIterations || duration >= s.maxSimulationTime );
};

var multitick = function multitick(state) {
  var onNotDone = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : nop;
  var onDone = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : nop;

  var done = false;
  var s = state;

  for (var i = 0; i < s.refresh; i++) {
    done = !s.running || tick(s);

    if (done) {
      break;
    }
  }

  if (!done) {
    onNotDone();
  } else {
    onDone();
  }
};

module.exports = { tick: tick, multitick: multitick };

/***/ })
/******/ ]);
});