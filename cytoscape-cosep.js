(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("cosep-base"));
	else if(typeof define === 'function' && define.amd)
		define(["cosep-base"], factory);
	else if(typeof exports === 'object')
		exports["cytoscapeCosep"] = factory(require("cosep-base"));
	else
		root["cytoscapeCosep"] = factory(root["cosepBase"]);
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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Redirection to CoSEP Algorithm
 */

module.exports = __webpack_require__(4);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var impl = __webpack_require__(2);

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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Main file that controls the layout flow
 *
 * @author Alihan Okka
 *
 * @copyright i-Vis Research Group, Bilkent University, 2007 - present
 */

var HashMap = __webpack_require__(0).coseBase.layoutBase.HashMap;
var PointD = __webpack_require__(0).coseBase.layoutBase.PointD;
var DimensionD = __webpack_require__(0).coseBase.layoutBase.DimensionD;
var LayoutConstants = __webpack_require__(0).coseBase.layoutBase.LayoutConstants;
var CoSEPConstants = __webpack_require__(0).CoSEPConstants;
var CoSEConstants = __webpack_require__(0).coseBase.CoSEConstants;
var FDLayoutConstants = __webpack_require__(0).coseBase.layoutBase.FDLayoutConstants;
var CoSEPLayout = __webpack_require__(0).CoSEPLayout;
var CoSEPNode = __webpack_require__(0).CoSEPNode;
var CoSEPPortConstraint = __webpack_require__(0).CoSEPPortConstraint;

var ContinuousLayout = __webpack_require__(5);
var assign = __webpack_require__(1);
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
  refresh: 30, // number of ticks per frame; higher is faster but more jerky
  fps: 30, // Used to slow down time in animation:'during'
  //maxIterations: 2500, // max iterations before the layout will bail out
  //maxSimulationTime: 5000, // max length in ms to run the layout
  ungrabifyWhileSimulating: false, // so you can't drag nodes during layout
  fit: true, // on every layout reposition of nodes, fit the viewport
  padding: 30, // padding around the simulation
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  // infinite layout options
  infinite: false, // overrides all other options for a forces-all-the-time mode

  // positioning options
  randomize: true, // use random node positions at beginning of layout
  // Include labels in node dimensions
  nodeDimensionsIncludeLabels: false,
  // Node repulsion (non overlapping) multiplier
  nodeRepulsion: function nodeRepulsion(node) {
    return 4500;
  },
  // Ideal edge (non nested) length
  idealEdgeLength: function idealEdgeLength(edge) {
    return 50;
  },
  // Divisor to compute edge forces
  edgeElasticity: function edgeElasticity(edge) {
    return 0.45;
  },
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

  // port support related options
  // the number of ports on one node's side
  portsPerNodeSide: 3,
  // port constraints information
  portConstraints: function portConstraints(edge) {
    return null;
  },
  nodeRotations: function nodeRotations(node) {
    return true;
  },
  nodeSwaps: function nodeSwaps(node) {
    return true;
  },
  // Thresholds for force in Phase II
  edgeEndShiftingForceThreshold: 1,
  nodeRotationForceThreshold: 20,
  rotation180RatioThreshold: 0.5,
  rotation180AngleThreshold: 130,
  // Periods for Phase II
  edgeEndShiftingPeriod: 5,
  nodeRotationPeriod: 15,
  // Polishing Force
  polishingForce: 0.1,
  // Grouping 1-Degree Nodes Across Ports
  furtherHandlingOneDegreeNodes: true,
  furtherHandlingOneDegreeNodesPeriod: 50,

  // layout event callbacks
  ready: function ready() {}, // on layoutready
  stop: function stop() {} // on layoutstop  
};

/**
 * Getting options from the user
 * Some of these parameters are from Cose-bilkent. They are hard-coded to make a 'draft algorithm'
 * Quality is 0 ('Draft Layout') for phase I of the algorithm
 * @param options
 */
var getUserOptions = function getUserOptions(options) {
  if (options.nestingFactor != null) CoSEPConstants.PER_LEVEL_IDEAL_EDGE_LENGTH_FACTOR = CoSEConstants.PER_LEVEL_IDEAL_EDGE_LENGTH_FACTOR = FDLayoutConstants.PER_LEVEL_IDEAL_EDGE_LENGTH_FACTOR = options.nestingFactor;
  if (options.gravity != null) CoSEPConstants.DEFAULT_GRAVITY_STRENGTH = CoSEConstants.DEFAULT_GRAVITY_STRENGTH = FDLayoutConstants.DEFAULT_GRAVITY_STRENGTH = options.gravity;
  if (options.gravityRange != null) CoSEPConstants.DEFAULT_GRAVITY_RANGE_FACTOR = CoSEConstants.DEFAULT_GRAVITY_RANGE_FACTOR = FDLayoutConstants.DEFAULT_GRAVITY_RANGE_FACTOR = options.gravityRange;
  if (options.gravityCompound != null) CoSEPConstants.DEFAULT_COMPOUND_GRAVITY_STRENGTH = CoSEConstants.DEFAULT_COMPOUND_GRAVITY_STRENGTH = FDLayoutConstants.DEFAULT_COMPOUND_GRAVITY_STRENGTH = options.gravityCompound;
  if (options.gravityRangeCompound != null) CoSEPConstants.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR = CoSEConstants.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR = FDLayoutConstants.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR = options.gravityRangeCompound;

  CoSEPConstants.TILING_PADDING_VERTICAL = CoSEConstants.TILING_PADDING_VERTICAL = typeof options.tilingPaddingVertical === 'function' ? options.tilingPaddingVertical.call() : options.tilingPaddingVertical;
  CoSEPConstants.TILING_PADDING_HORIZONTAL = CoSEConstants.TILING_PADDING_HORIZONTAL = typeof options.tilingPaddingHorizontal === 'function' ? options.tilingPaddingHorizontal.call() : options.tilingPaddingHorizontal;

  LayoutConstants.DEFAULT_UNIFORM_LEAF_NODE_SIZES = false;

  // Phase I of the algorithm
  // Draft layout for skeleton
  LayoutConstants.QUALITY = 0;

  // We don't need to animate CoSE-Bilkent part of the algorithm.
  // This will change after phase I
  CoSEPConstants.ANIMATE = CoSEConstants.ANIMATE = FDLayoutConstants.ANIMATE = LayoutConstants.ANIMATE = 'end';

  // # of ports on a node's side
  if (options.portsPerNodeSide != null) CoSEPConstants.PORTS_PER_SIDE = +options.portsPerNodeSide;

  // Labels are ignored
  CoSEPConstants.NODE_DIMENSIONS_INCLUDE_LABELS = CoSEConstants.NODE_DIMENSIONS_INCLUDE_LABELS = FDLayoutConstants.NODE_DIMENSIONS_INCLUDE_LABELS = LayoutConstants.NODE_DIMENSIONS_INCLUDE_LABELS = false;

  // Our incremental would be to skip over Phase I
  CoSEPConstants.DEFAULT_INCREMENTAL = CoSEConstants.DEFAULT_INCREMENTAL = FDLayoutConstants.DEFAULT_INCREMENTAL = LayoutConstants.DEFAULT_INCREMENTAL = false;

  // Tiling is disabled because CoSE Graphmanager is deleting nodes
  // Do this after CoSE
  CoSEPConstants.TILE = CoSEConstants.TILE = false;

  // Thresholds for force in Phase II
  if (options.edgeEndShiftingForceThreshold != null) CoSEPConstants.EDGE_END_SHIFTING_FORCE_THRESHOLD = options.edgeEndShiftingForceThreshold;
  if (options.nodeRotationForceThreshold != null) CoSEPConstants.NODE_ROTATION_FORCE_THRESHOLD = options.nodeRotationForceThreshold;
  if (options.rotation180RatioThreshold != null) CoSEPConstants.ROTATION_180_RATIO_THRESHOLD = options.rotation180RatioThreshold;
  if (options.rotation180AngleThreshold != null) CoSEPConstants.ROTATION_180_ANGLE_THRESHOLD = options.rotation180AngleThreshold;

  // Periods for Phase II
  if (options.edgeEndShiftingPeriod != null) CoSEPConstants.EDGE_END_SHIFTING_PERIOD = options.edgeEndShiftingPeriod;
  if (options.nodeRotationPeriod != null) CoSEPConstants.NODE_ROTATION_PERIOD = options.nodeRotationPeriod;

  // Polishing Force
  if (options.polishingForce != null) CoSEPConstants.DEFAULT_POLISHING_FORCE_STRENGTH = options.polishingForce;

  // Further Handling of 1-Degree Nodes
  if (options.furtherHandlingOneDegreeNodes != null) CoSEPConstants.FURTHER_HANDLING_ONE_DEGREE_NODES = options.furtherHandlingOneDegreeNodes;
  if (options.furtherHandlingOneDegreeNodesPeriod != null) CoSEPConstants.FURTHER_HANDLING_ONE_DEGREE_NODES_PERIOD = options.furtherHandlingOneDegreeNodesPeriod;
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
      this.idToLNode = {};

      // Used to update Cytoscape port visualization
      // lEdge -> Cytoscape edge
      this.lEdgeToCEdge = new HashMap();

      // Holds edges with ports
      // id -> LEdge
      this.portConstrainedEdges = {};

      // Hold the Lnodes that have port constrained edges
      this.nodesWithPorts = {};

      // Get port information from the options
      var portConstraints = void 0;
      if (this.options.portConstraints != null && this.options.portConstraints != undefined && typeof this.options.portConstraints === 'function') portConstraints = this.options.portConstraints;else throw "There are no port constraints defined as a function named 'portConstraints'";

      // Initialize CoSEP elements
      var cosepLayout = this.cosepLayout = new CoSEPLayout();
      var graphManager = this.graphManager = cosepLayout.newGraphManager();
      this.root = graphManager.addRoot();

      // Establishing node relations in the GraphManager object
      this.processChildrenList(this.root, this.getTopMostNodes(nodes), cosepLayout);

      // Adding edges to GraphManager
      var idealLengthTotal = 0;
      var edgeCount = 0;
      for (var i = 0; i < edges.length; i++) {
        var edge = edges[i];
        var sourceNode = this.idToLNode[edge.data("source")];
        var targetNode = this.idToLNode[edge.data("target")];
        if (sourceNode !== targetNode && sourceNode.getEdgesBetween(targetNode).length === 0) {
          (function () {
            var gmEdge = graphManager.add(cosepLayout.newEdge(), sourceNode, targetNode);
            gmEdge.id = edge.id();
            gmEdge.idealLength = optFn(_this2.options.idealEdgeLength, edge);
            gmEdge.edgeElasticity = optFn(_this2.options.edgeElasticity, edge);
            idealLengthTotal += gmEdge.idealLength;
            edgeCount++;

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
                if (portInfo.endpoint === 'Source') {
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

      // We need to update the ideal edge length constant with the avg. ideal length value after processing edges
      // in case there is no edge, use other options
      if (this.options.idealEdgeLength != null) {
        if (edgeCount > 0) CoSEPConstants.DEFAULT_EDGE_LENGTH = CoSEConstants.DEFAULT_EDGE_LENGTH = FDLayoutConstants.DEFAULT_EDGE_LENGTH = idealLengthTotal / edgeCount;else if (!isFn(this.options.idealEdgeLength)) // in case there is no edge, but option gives a value to use
          CoSEPConstants.DEFAULT_EDGE_LENGTH = CoSEConstants.DEFAULT_EDGE_LENGTH = FDLayoutConstants.DEFAULT_EDGE_LENGTH = this.options.idealEdgeLength;else // in case there is no edge and we cannot get a value from option (because it's a function)
          CoSEPConstants.DEFAULT_EDGE_LENGTH = CoSEConstants.DEFAULT_EDGE_LENGTH = FDLayoutConstants.DEFAULT_EDGE_LENGTH = 50;
        // we need to update these constant values based on the ideal edge length constant
        CoSEPConstants.MIN_REPULSION_DIST = CoSEConstants.MIN_REPULSION_DIST = FDLayoutConstants.MIN_REPULSION_DIST = FDLayoutConstants.DEFAULT_EDGE_LENGTH / 10.0;
        CoSEPConstants.DEFAULT_RADIAL_SEPARATION = CoSEConstants.DEFAULT_RADIAL_SEPARATION = FDLayoutConstants.DEFAULT_EDGE_LENGTH;
      }

      // Saving the references
      this.graphManager.nodesWithPorts = Object.values(this.nodesWithPorts);

      // First phase of the algorithm
      // If incremental is true, skip over Phase I
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
        this.graphManager.updateBounds();
        this.cosepLayout.level = 0;
        this.cosepLayout.initSpringEmbedder();
      }

      // Initialize ports
      this.addImplicitPortConstraints();
      cosepLayout.initialPortConfiguration();

      // Initialize node rotations
      // Default: Nodes with ports are allowed to rotate
      this.rotatableNodes = new HashMap();
      if (this.options.nodeRotations !== null && this.options.nodeRotations !== undefined && typeof this.options.nodeRotations === 'function') {
        var _loop = function _loop(_i) {
          var node = cosepLayout.graphManager.nodesWithPorts[_i];
          var cyNode = _this2.state.nodes.filter(function (n) {
            return n.data('id') == node.id;
          });
          if (_this2.options.nodeRotations(cyNode) === false) {
            node.canBeRotated = false;
          } else {
            // Default option
            node.canBeRotated = true;
            _this2.rotatableNodes.put(node, cyNode);
          }
        };

        // There are nodes that can't rotate
        for (var _i = 0; _i < cosepLayout.graphManager.nodesWithPorts.length; _i++) {
          _loop(_i);
        }
      } else {
        var _loop2 = function _loop2(_i2) {
          var node = cosepLayout.graphManager.nodesWithPorts[_i2];
          var cyNode = _this2.state.nodes.filter(function (n) {
            return n.data('id') == node.id;
          });
          node.canBeRotated = true;
          _this2.rotatableNodes.put(node, cyNode);
        };

        // All nodes can rotate
        for (var _i2 = 0; _i2 < cosepLayout.graphManager.nodesWithPorts.length; _i2++) {
          _loop2(_i2);
        }
      }

      // Initialize node swaps - swap and rotate are separated here, but we use rotatableNodes map jointly 
      // Default: Nodes with ports are allowed to swap
      if (this.options.nodeSwaps !== null && this.options.nodeSwaps !== undefined && typeof this.options.nodeSwaps === 'function') {
        var _loop3 = function _loop3(_i3) {
          var node = cosepLayout.graphManager.nodesWithPorts[_i3];
          var cyNode = _this2.state.nodes.filter(function (n) {
            return n.data('id') == node.id;
          });
          if (_this2.options.nodeSwaps(cyNode) === false) {
            node.canBeSwapped = false;
          } else {
            // Default option
            node.canBeSwapped = true;
            _this2.rotatableNodes.put(node, cyNode);
          }
        };

        // There are nodes that can't swap
        for (var _i3 = 0; _i3 < cosepLayout.graphManager.nodesWithPorts.length; _i3++) {
          _loop3(_i3);
        }
      } else {
        var _loop4 = function _loop4(_i4) {
          var node = cosepLayout.graphManager.nodesWithPorts[_i4];
          var cyNode = _this2.state.nodes.filter(function (n) {
            return n.data('id') == node.id;
          });
          node.canBeSwapped = true;
          _this2.rotatableNodes.put(node, cyNode);
        };

        // All nodes can swap
        for (var _i4 = 0; _i4 < cosepLayout.graphManager.nodesWithPorts.length; _i4++) {
          _loop4(_i4);
        }
      }

      // Specifying tile option
      if (state.tile != null) {
        CoSEPConstants.TILE = CoSEConstants.TILE = state.tile;
      } else {
        CoSEPConstants.TILE = CoSEConstants.TILE = true;
      }

      // Pre-tile methods
      // CoSE-Base does nothing if CoSEConstants.TILE is false
      this.cosepLayout.tilingPreLayout();

      if (this.cosepLayout.toBeTiled) {
        // Reset the graphManager settings
        this.graphManager.resetAllNodesToApplyGravitation();
        this.cosepLayout.initParameters();
        this.cosepLayout.nodesWithGravity = this.cosepLayout.calculateNodesToApplyGravitationTo();
        this.graphManager.setAllNodesToApplyGravitation(this.cosepLayout.nodesWithGravity);
        this.cosepLayout.calcNoOfChildrenForAllNodes();
        this.graphManager.calcLowestCommonAncestors();
        this.graphManager.calcInclusionTreeDepths();
        this.graphManager.getRoot().calcEstimatedSize();
        //      Ideal edge lengths should be calculated once and it's done above,
        //      this is because calcIdealEdgeLengths doesn't calculate ideal lengths from a constant anymore 
        //      this.cosepLayout.calcIdealEdgeLengths();  
        this.graphManager.updateBounds();
        this.cosepLayout.level = 0;
        this.cosepLayout.initSpringEmbedder();

        // Don't let tiled nodes rotate
        // Does it matter?
        Object.keys(this.cosepLayout.toBeTiled).forEach(function (key) {
          if (_this2.cosepLayout.toBeTiled[key] && _this2.idToLNode[key]) _this2.idToLNode[key].canBeRotated = false;
        });
      }

      // Initialize second phase of the algorithm
      this.cosepLayout.secondPhaseInit();
      this.state.maxIterations = this.cosepLayout.maxIterations * 2; // Does this even matter?
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
        // Attach id and repulsion value to the layout node
        theNode.id = theChild.data("id");
        theNode.nodeRepulsion = optFn(this.options.nodeRepulsion, theChild);

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
      var isDone = this.cosepLayout.runSpringEmbedderTick();

      state.tickIndex = this.cosepLayout.totalIterations;

      // For changing Phase from II to III
      // and post-tile methods if enabled
      if (isDone) {
        if (this.cosepLayout.phase === CoSEPLayout.PHASE_SECOND) {
          isDone = false;
          state.phaseIIiterationCount = state.tickIndex;
          this.cosepLayout.polishingPhaseInit();
        } else if (this.cosepLayout.phase === CoSEPLayout.PHASE_POLISHING) {
          state.phaseIIIiterationCount = state.tickIndex;
          this.cosepLayout.tilingPostLayout();
        }
      }

      // Update node positions
      this.state.nodes.forEach(function (n) {
        var s = _this3.getScratch(n);
        var location = _this3.idToLNode[n.data('id')];
        s.x = location.getCenterX();
        s.y = location.getCenterY();
      });

      // Update Cytoscape visualization in 'during' layout
      if (state.animateContinuously) self.updateCytoscapePortVisualization();

      return isDone;
    }

    // run this function after the layout is done ticking

  }, {
    key: 'postrun',
    value: function postrun() {
      this.updateCytoscapePortVisualization();

      /*
      console.log('***************************************************************************************');
      console.log('** Phase II -- iteration count: ' + JSON.stringify(this.state.phaseIIiterationCount));
      console.log('** Phase Polishing -- iteration count: ' + JSON.stringify(this.state.phaseIIIiterationCount));
      console.log('** Running time(ms) : ' + JSON.stringify(this.state.duration));
      console.log('** Graph Manager');
      console.log(this.graphManager);
      console.log('** idToLNode');
      console.log(this.idToLNode);
      console.log('** Nodes with ports');
      console.log(this.nodesWithPorts);
      console.log('** lEdgeToCEdge');
      console.log(this.lEdgeToCEdge);
      console.log('** portConstrainedEdges');
      console.log(this.portConstrainedEdges); */
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

      // Update Nodes
      var nodeWPorts = Object.values(this.nodesWithPorts);
      for (var i = 0; i < nodeWPorts.length; i++) {
        var _node = nodeWPorts[i];
        var _cyNode = this.rotatableNodes.get(_node);
        if (_cyNode) {
          var w = _cyNode.width();
          var h = _cyNode.height();
          var orientation = 0;

          for (var j = 0; j < _node.rotationList.length; j++) {
            if (_node.rotationList[j] == "clockwise") {
              var temp = w;
              w = h;
              h = temp;

              if (orientation == 0) orientation = 1;else if (orientation == 1) orientation = 2;else if (orientation == 2) orientation = 3;else orientation = 0;
            } else if (_node.rotationList[j] == "counterclockwise") {
              var _temp = w;
              w = h;
              h = _temp;

              if (orientation == 0) orientation = 3;else if (orientation == 1) orientation = 0;else if (orientation == 2) orientation = 1;else orientation = 2;
            }
          }

          _cyNode.style({ 'width': w });
          _cyNode.style({ 'height': h });
          if (orientation > 0) this.refreshBackgroundImage(_cyNode, orientation);
        }
      }

      // Update Edges
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
  }, {
    key: 'refreshBackgroundImage',
    value: function refreshBackgroundImage(cyNode, orientation) {
      var img = new Image();
      img.src = cyNode.style('background-image');
      var canvas = document.createElement("canvas");
      img.onload = function () {
        if (orientation == 1) {
          var ctx = canvas.getContext("2d");
          canvas.width = img.height;
          canvas.height = img.width;
          canvas.style.position = "absolute";
          ctx.rotate(Math.PI / 2);
          ctx.drawImage(img, 0, -img.height);
          cyNode.css('background-image', canvas.toDataURL("image/png"));
        } else if (orientation == 2) {
          var _ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          canvas.style.position = "absolute";
          _ctx.rotate(Math.PI);
          _ctx.drawImage(img, -img.width, -img.height);
          cyNode.css('background-image', canvas.toDataURL("image/png"));
        } else {
          var _ctx2 = canvas.getContext("2d");
          canvas.width = img.height;
          canvas.height = img.width;
          canvas.style.position = "absolute";
          _ctx2.rotate(3 * Math.PI / 2);
          _ctx2.drawImage(img, -img.width, 0);
          cyNode.css('background-image', canvas.toDataURL("image/png"));
        }
      };
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 A generic continuous layout class
 */

var assign = __webpack_require__(1);
var makeBoundingBox = __webpack_require__(6);

var _require = __webpack_require__(7),
    setInitialPositionState = _require.setInitialPositionState,
    refreshPositions = _require.refreshPositions,
    getNodePositionData = _require.getNodePositionData;

var _require2 = __webpack_require__(8),
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

        // SLOWING DOWN ANIMATE
        s.fpsInterval = 1000 / s.fps;
        s.then = Date.now();

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
/* 6 */
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var assign = __webpack_require__(1);

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
/* 8 */
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

  s.duration = Date.now() - s.startTime;

  return !s.infinite && tickIndicatesDone;
};

var multitick = function multitick(state) {
  var onNotDone = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : nop;
  var onDone = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : nop;

  var done = false;
  var s = state;

  // SLOWING DOWN ANIMATE
  if (s.animateContinuously) {
    s.now = Date.now();
    s.elapsed = s.now - s.then;
    if (s.elapsed > s.fpsInterval) {
      // Get ready for next frame by setting then=now, but also adjust for your
      // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
      s.then = s.now - s.elapsed % s.fpsInterval;

      // Put your drawing code here
      for (var i = 0; i < s.refresh; i++) {
        done = !s.running || tick(s);

        if (done) {
          break;
        }
      }
    }
  } else {
    for (var _i = 0; _i < s.maxIterations; _i++) {
      done = !s.running || tick(s);

      if (done) {
        break;
      }
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