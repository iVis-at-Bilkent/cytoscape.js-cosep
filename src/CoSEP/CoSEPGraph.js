/**
 *
 * @author Alihan Okka
 *
 * @copyright i-Vis Research Group, Bilkent University, 2007 - present
 */

const CoSEGraph = require('cose-base').CoSEGraph;

function CoSEPGraph(parent, graphMgr, vGraph) {
    CoSEGraph.call(this, parent, graphMgr, vGraph);
}

CoSEPGraph.prototype = Object.create(CoSEGraph.prototype);

for (let prop in CoSEGraph) {
    CoSEPGraph[prop] = CoSEGraph[prop];
}

module.exports = CoSEPGraph;