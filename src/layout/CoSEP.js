/**
 * Main file that controls the layout flow
 *
 * @author Alihan Okka
 *
 * @copyright i-Vis Research Group, Bilkent University, 2007 - present
 */

const HashMap = require('cose-base').layoutBase.HashMap;
const PointD = require('cose-base').layoutBase.PointD;
const DimensionD = require('cose-base').layoutBase.DimensionD;
let LayoutConstants = require('cose-base').layoutBase.LayoutConstants;
let CoSEPConstants = require('../CoSEP/CoSEPConstants');
let CoSEConstants = require('cose-base').CoSEConstants;
let FDLayoutConstants = require('cose-base').layoutBase.FDLayoutConstants;
const CoSEPLayout = require('../CoSEP/CoSEPLayout');
const CoSEPNode = require('../CoSEP/CoSEPNode');
const CoSEPPortConstraint = require('../CoSEP/CoSEPPortConstraint');

const ContinuousLayout = require('./continuous-base');
const assign = require('../assign');
const isFn = fn => typeof fn === 'function';

const optFn = (opt, ele) => {
  if(isFn(opt)){
    return opt(ele);
  } else {
    return opt;
  }
};

/**
 *  Default layout options
 */
let defaults = {
  animate: false, // whether to show the layout as it's running; special 'end' value makes the layout animate like a discrete layout
  refresh: 10, // number of ticks per frame; higher is faster but more jerky
  fps: 24, // Used to slow down time in animation:'during'
  //maxIterations: 2500, // max iterations before the layout will bail out
  maxSimulationTime: 5000, // max length in ms to run the layout
  ungrabifyWhileSimulating: false, // so you can't drag nodes during layout
  fit: true, // on every layout reposition of nodes, fit the viewport
  padding: 30, // padding around the simulation
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  // infinite layout options
  infinite: false, // overrides all other options for a forces-all-the-time mode

  // layout event callbacks
  ready: function(){}, // on layoutready
  stop: function(){}, // on layoutstop

  // positioning options
  randomize: true, // use random node positions at beginning of layout
  // Include labels in node dimensions
  nodeDimensionsIncludeLabels: false,
  // Node repulsion (non overlapping) multiplier
  nodeRepulsion: node => 4500,
  // Ideal edge (non nested) length
  idealEdgeLength: edge => 50,
  // Divisor to compute edge forces
  edgeElasticity: edge => 0.45,
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
  gravityRange: 3.8
};

/**
 * Getting options from the user
 * Some of these parameters are from Cose-bilkent. They are hard-coded to make a 'draft algorithm'
 * Quality is 0 ('Draft Layout') for phase I of the algorithm
 * @param options
 */
let getUserOptions = function (options) {
  if (options.nestingFactor != null)
    CoSEPConstants.PER_LEVEL_IDEAL_EDGE_LENGTH_FACTOR = CoSEConstants.PER_LEVEL_IDEAL_EDGE_LENGTH_FACTOR = FDLayoutConstants.PER_LEVEL_IDEAL_EDGE_LENGTH_FACTOR = options.nestingFactor;
  if (options.gravity != null)
    CoSEPConstants.DEFAULT_GRAVITY_STRENGTH = CoSEConstants.DEFAULT_GRAVITY_STRENGTH = FDLayoutConstants.DEFAULT_GRAVITY_STRENGTH = options.gravity;
  if (options.gravityRange != null)
    CoSEPConstants.DEFAULT_GRAVITY_RANGE_FACTOR = CoSEConstants.DEFAULT_GRAVITY_RANGE_FACTOR = FDLayoutConstants.DEFAULT_GRAVITY_RANGE_FACTOR = options.gravityRange;
  if (options.gravityCompound != null)
    CoSEPConstants.DEFAULT_COMPOUND_GRAVITY_STRENGTH = CoSEConstants.DEFAULT_COMPOUND_GRAVITY_STRENGTH = FDLayoutConstants.DEFAULT_COMPOUND_GRAVITY_STRENGTH = options.gravityCompound;
  if (options.gravityRangeCompound != null)
    CoSEPConstants.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR = CoSEConstants.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR = FDLayoutConstants.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR = options.gravityRangeCompound;

  CoSEPConstants.TILING_PADDING_VERTICAL = CoSEConstants.TILING_PADDING_VERTICAL =
      typeof options.tilingPaddingVertical === 'function' ? options.tilingPaddingVertical.call() : options.tilingPaddingVertical;
  CoSEPConstants.TILING_PADDING_HORIZONTAL = CoSEConstants.TILING_PADDING_HORIZONTAL =
      typeof options.tilingPaddingHorizontal === 'function' ? options.tilingPaddingHorizontal.call() : options.tilingPaddingHorizontal;

  LayoutConstants.DEFAULT_UNIFORM_LEAF_NODE_SIZES = false;

  // Phase I of the algorithm
  // Draft layout for skeleton
  LayoutConstants.QUALITY = 0;

  // We don't need to animate CoSE-Bilkent part of the algorithm.
  // This will change after phase I
  CoSEPConstants.ANIMATE = CoSEConstants.ANIMATE = FDLayoutConstants.ANIMATE = LayoutConstants.ANIMATE = 'end';

  // # of ports on a node's side
  if(options.portsPerNodeSide != null)
    CoSEPConstants.PORTS_PER_SIDE = +options.portsPerNodeSide;

  // Labels are ignored
  CoSEPConstants.NODE_DIMENSIONS_INCLUDE_LABELS = CoSEConstants.NODE_DIMENSIONS_INCLUDE_LABELS
      = FDLayoutConstants.NODE_DIMENSIONS_INCLUDE_LABELS
      = LayoutConstants.NODE_DIMENSIONS_INCLUDE_LABELS
      = false;

  // Our incremental would be to skip over Phase I
  CoSEPConstants.DEFAULT_INCREMENTAL = CoSEConstants.DEFAULT_INCREMENTAL
      = FDLayoutConstants.DEFAULT_INCREMENTAL
      = LayoutConstants.DEFAULT_INCREMENTAL
      = false;

  // Tiling is disabled because CoSE Graphmanager is deleting nodes
  // Do this after CoSE
  CoSEPConstants.TILE = CoSEConstants.TILE = false;

  // Thresholds for force in Phase II
  if (options.edgeEndShiftingForceThreshold != null)
    CoSEPConstants.EDGE_END_SHIFTING_FORCE_THRESHOLD = options.edgeEndShiftingForceThreshold;
  if (options.nodeRotationForceThreshold != null)
    CoSEPConstants.NODE_ROTATION_FORCE_THRESHOLD = options.nodeRotationForceThreshold;
  if (options.rotation180RatioThreshold != null)
    CoSEPConstants.ROTATION_180_RATIO_THRESHOLD = options.rotation180RatioThreshold;
  if (options.rotation180AngleThreshold != null)
    CoSEPConstants.ROTATION_180_ANGLE_THRESHOLD = options.rotation180AngleThreshold;

  // Periods for Phase II
  if (options.edgeEndShiftingPeriod != null)
    CoSEPConstants.EDGE_END_SHIFTING_PERIOD = options.edgeEndShiftingPeriod;
  if (options.nodeRotationPeriod != null)
    CoSEPConstants.NODE_ROTATION_PERIOD = options.nodeRotationPeriod;

  // Polishing Force
  if (options.polishingForce != null)
    CoSEPConstants.DEFAULT_POLISHING_FORCE_STRENGTH = options.polishingForce;

  // Further Handling of 1-Degree Nodes
  if (options.furtherHandlingOneDegreeNodes != null)
    CoSEPConstants.FURTHER_HANDLING_ONE_DEGREE_NODES = options.furtherHandlingOneDegreeNodes;
  if (options.furtherHandlingOneDegreeNodesPeriod != null)
    CoSEPConstants.FURTHER_HANDLING_ONE_DEGREE_NODES_PERIOD = options.furtherHandlingOneDegreeNodesPeriod;
};

class Layout extends ContinuousLayout {
  constructor(options){
    options = assign({}, defaults, options);
    super(options);

    getUserOptions(options);
  }

  prerun(){
    let self = this;
    let state = this.state; // options object combined with current state

    // Get graph information from Cytoscape
    let nodes = state.nodes;
    let edges = state.edges;
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
    let portConstraints;
    if(this.options.portConstraints != null && this.options.portConstraints != undefined && typeof this.options.portConstraints === 'function')
      portConstraints = this.options.portConstraints;
    else
      throw "There are no port constraints defined as a function named 'portConstraints'";

    // Initialize CoSEP elements
    let cosepLayout = this.cosepLayout = new CoSEPLayout();
    let graphManager = this.graphManager = cosepLayout.newGraphManager();
    this.root = graphManager.addRoot();

    // Establishing node relations in the GraphManager object
    this.processChildrenList(this.root, this.getTopMostNodes(nodes), cosepLayout);

    // Adding edges to GraphManager
    let idealLengthTotal = 0;
    let edgeCount = 0;    
    for (let i = 0; i < edges.length; i++) {
      let edge = edges[i];
      let sourceNode = this.idToLNode[edge.data("source")];
      let targetNode = this.idToLNode[edge.data("target")];
      if(sourceNode !== targetNode && sourceNode.getEdgesBetween(targetNode).length === 0){
        let gmEdge = graphManager.add(cosepLayout.newEdge(), sourceNode, targetNode);
        gmEdge.id = edge.id();
        gmEdge.idealLength = optFn(this.options.idealEdgeLength, edge);
        gmEdge.edgeElasticity = optFn(this.options.edgeElasticity, edge);        
        idealLengthTotal += gmEdge.idealLength;
        edgeCount++;        

        /**
         *  Setting variables related to port constraints
         */
        let edgePortInfos = portConstraints(edge);
        if (edgePortInfos != null && edgePortInfos != undefined && edgePortInfos.length > 0){

          // Save the references
          this.portConstrainedEdges[ edge.data('id') ] = gmEdge;
          this.lEdgeToCEdge.put(gmEdge, edge);
          this.graphManager.edgesWithPorts.push(gmEdge);

          edgePortInfos.forEach(function (portInfo) {
            let constraint;
            // If the info is about source
            if(portInfo.endpoint === 'Source') {
              constraint = new CoSEPPortConstraint(gmEdge, gmEdge.source);
              gmEdge.sourceConstraint = constraint;

              self.nodesWithPorts[ gmEdge.getSource().id ] =  gmEdge.getSource();
            }
            else{ // or target
              constraint = new CoSEPPortConstraint(gmEdge, gmEdge.target);
              gmEdge.targetConstraint = constraint;

              self.nodesWithPorts[ gmEdge.getTarget().id ] =  gmEdge.getTarget();
            }

            // Type of the constraint is defined
            constraint.portConstraintType = constraint.constraintType[portInfo.portConstraintType];

            switch(constraint.portConstraintType){
              case 0: // Free, add all directions via enum
                constraint.portConstraintParameter = [
                  constraint.sideDirection[ 'Top' ],
                  constraint.sideDirection[ 'Right' ],
                  constraint.sideDirection[ 'Bottom' ],
                  constraint.sideDirection[ 'Left' ]
                ];
                break;
              case 1: // Need to enum directions
                constraint.portConstraintParameter = [];
                portInfo.portConstraintParameter.forEach(function (direction) {
                  constraint.portConstraintParameter.push(constraint.sideDirection[ direction ]);
                });
                break;
              case 2: // Getting absolute position
                constraint.portConstraintParameter = +portInfo.portConstraintParameter; // if '5' -> 5
                break;
            }
          });
        }
      }
    }
    
    // We need to update the ideal edge length constant with the avg. ideal length value after processing edges
    // in case there is no edge, use other options
    if (this.options.idealEdgeLength != null){
      if (edges.length > 0)
        CoSEPConstants.DEFAULT_EDGE_LENGTH = CoSEConstants.DEFAULT_EDGE_LENGTH = FDLayoutConstants.DEFAULT_EDGE_LENGTH = idealLengthTotal / edgeCount;
      else if(!isFn(this.options.idealEdgeLength)) // in case there is no edge, but option gives a value to use
        CoSEPConstants.DEFAULT_EDGE_LENGTH = CoSEConstants.DEFAULT_EDGE_LENGTH = FDLayoutConstants.DEFAULT_EDGE_LENGTH = this.options.idealEdgeLength;
      else  // in case there is no edge and we cannot get a value from option (because it's a function)
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
    } else{
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
    if(this.options.nodeRotations !== null && this.options.nodeRotations !== undefined && typeof this.options.nodeRotations === 'function'){
      // There are nodes that can't rotate
      for(let i = 0; i < cosepLayout.graphManager.nodesWithPorts.length; i++){
        let node = cosepLayout.graphManager.nodesWithPorts[i];
        let cyNode = this.state.nodes.filter(n => n.data('id') == node.id);
        if(this.options.nodeRotations(cyNode) === false) {
          node.canBeRotated = false;
        }
        else{
          // Default option
          node.canBeRotated = true;
          this.rotatableNodes.put(node, cyNode);
        }
      }
    } else{
      // All nodes can rotate
      for(let i = 0; i < cosepLayout.graphManager.nodesWithPorts.length; i++){
        let node = cosepLayout.graphManager.nodesWithPorts[i];
        let cyNode = this.state.nodes.filter(n => n.data('id') == node.id);
        node.canBeRotated = true;
        this.rotatableNodes.put(node, cyNode);
      }
    }

    // Specifying tile option
    if(state.tile != null){
      CoSEPConstants.TILE = CoSEConstants.TILE = state.tile;
    } else{
      CoSEPConstants.TILE = CoSEConstants.TILE = true;
    }

    // Pre-tile methods
    // CoSE-Base does nothing if CoSEConstants.TILE is false
    this.cosepLayout.tilingPreLayout();


    if(this.cosepLayout.toBeTiled) {
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
      Object.keys(this.cosepLayout.toBeTiled).forEach(key => {
        if (this.cosepLayout.toBeTiled[key] && this.idToLNode[key])
          this.idToLNode[key].canBeRotated = false;
      });
    }

    // Initialize second phase of the algorithm
    this.cosepLayout.secondPhaseInit();
    this.state.maxIterations = this.cosepLayout.maxIterations * 2; // Does this even matter?
  }

  // Get the top most ones of a list of nodes
  // Note: Taken from CoSE-Bilkent !!
  getTopMostNodes(nodes) {
    let nodesMap = {};
    for (let i = 0; i < nodes.length; i++) {
      nodesMap[nodes[i].id()] = true;
    }
    return nodes.filter(function (ele, i) {
      if (typeof ele === "number") {
        ele = i;
      }
      let parent = ele.parent()[0];
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
  processChildrenList (parent, children, layout) {
    let size = children.length;
    for (let i = 0; i < size; i++) {
      let theChild = children[i];
      let children_of_children = theChild.children();
      let theNode;

      let dimensions = theChild.layoutDimensions({
        nodeDimensionsIncludeLabels: false
      });

      if (theChild.outerWidth() != null
          && theChild.outerHeight() != null) {
        theNode = parent.add(new CoSEPNode(layout.graphManager,
            new PointD(theChild.position('x') - dimensions.w / 2, theChild.position('y') - dimensions.h / 2),
            new DimensionD(parseFloat(dimensions.w), parseFloat(dimensions.h))));
      }
      else {
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
        let theNewGraph;
        theNewGraph = layout.getGraphManager().add(layout.newGraph(), theNode);
        this.processChildrenList(theNewGraph, children_of_children, layout);
      }
    }
  }

  // run this each iteraction
  tick(){
    let state = this.state;
    let self = this;
    let isDone = this.cosepLayout.runSpringEmbedderTick();

    state.tickIndex = this.cosepLayout.totalIterations;

    // For changing Phase from II to III
    // and post-tile methods if enabled
    if(isDone){
      if(this.cosepLayout.phase === CoSEPLayout.PHASE_SECOND) {
        isDone = false;
        state.phaseIIiterationCount = state.tickIndex;
        this.cosepLayout.polishingPhaseInit();
      } else if(this.cosepLayout.phase === CoSEPLayout.PHASE_POLISHING){
        state.phaseIIIiterationCount = state.tickIndex;
        this.cosepLayout.tilingPostLayout();
      }
    }

    // Update node positions
    this.state.nodes.forEach(n => {
      let s = this.getScratch(n);
      let location = this.idToLNode[n.data('id')];
      s.x = location.getCenterX();
      s.y = location.getCenterY();
    });

    // Update Cytoscape visualization in 'during' layout
    if(state.animateContinuously)
      self.updateCytoscapePortVisualization();

    return isDone;
  }

  // run this function after the layout is done ticking
  postrun(){
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
  addImplicitPortConstraints(){
    let self = this;
    Object.keys(this.nodesWithPorts).forEach(function(key) {
      let lNode = self.idToLNode[ key ];
      for(let i = 0; i < lNode.getEdges().length; i++){
        let lEdge = lNode.getEdges()[i];

        // If the node is the 'source' of edge
        if (lEdge.getSource().id == lNode.id){
          // If there is already a port constraint
          if (!lEdge.getSourceConstraint()){
            // Create port constraint
            let constraint = new CoSEPPortConstraint(lEdge, lEdge.source);
            lEdge.sourceConstraint = constraint;

            constraint.portConstraintType = constraint.constraintType[ 'Free' ];

            constraint.portConstraintParameter = [
              constraint.sideDirection[ 'Top' ],
              constraint.sideDirection[ 'Right' ],
              constraint.sideDirection[ 'Bottom' ],
              constraint.sideDirection[ 'Left' ]
            ];

            // Adding references
            self.lEdgeToCEdge.put(lEdge, self.state.cy.getElementById(lEdge.id));
            self.portConstrainedEdges[ lEdge.id ] = lEdge;
            self.graphManager.edgesWithPorts.push(lEdge);
          }
        }
        else{
          if (!lEdge.getTargetConstraint()){
            // Create port constraint
            let constraint = new CoSEPPortConstraint(lEdge, lEdge.target);
            lEdge.targetConstraint = constraint;

            constraint.portConstraintType = constraint.constraintType[ 'Free' ];

            constraint.portConstraintParameter = [
              constraint.sideDirection[ 'Top' ],
              constraint.sideDirection[ 'Right' ],
              constraint.sideDirection[ 'Bottom' ],
              constraint.sideDirection[ 'Left' ]
            ];

            // Adding references
            self.lEdgeToCEdge.put(lEdge, self.state.cy.getElementById(lEdge.id));
            self.portConstrainedEdges[ lEdge.id ] = lEdge;
            self.graphManager.edgesWithPorts.push(lEdge);
          }
        }
      }
    });
  }

  /**
   * Update Cytoscape so that edges with ports are properly shown
   */
  updateCytoscapePortVisualization(){
    let self = this;

    // Update Nodes
    let nodeWPorts = Object.values(this.nodesWithPorts);
    for (let i = 0; i < nodeWPorts.length; i++){
      let node = nodeWPorts[i];
      let cyNode = this.rotatableNodes.get(node);
      if(cyNode) {
        let w = cyNode.height();
        let h = cyNode.width();
        cyNode.style({'width': w});
        cyNode.style({'height': h});
      }
    }

    // Update Edges
    Object.keys(this.portConstrainedEdges).forEach(function(key) {
      let lEdge = self.portConstrainedEdges[key];
      let cytoEdge = self.lEdgeToCEdge.get(lEdge);

      let sourceConstraint = lEdge.getSourceConstraint();
      if(sourceConstraint){
        let relativePos = sourceConstraint.getRelativeRatiotoNodeCenter();
        cytoEdge.style({ 'source-endpoint': +relativePos.x + "% "+ +relativePos.y + '%' });
      }

      let targetConstraint = lEdge.getTargetConstraint();
      if(targetConstraint){
        let relativePos = targetConstraint.getRelativeRatiotoNodeCenter();
        cytoEdge.style({ 'target-endpoint': +relativePos.x + "% "+ +relativePos.y + '%' });
      }
    });
  }

  // clean up any object refs that could prevent garbage collection, etc.
  destroy(){
    super.destroy();

    return this;
  }
}

module.exports = Layout;
