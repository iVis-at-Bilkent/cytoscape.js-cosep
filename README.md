# cytoscape.js-cosep

## Description

Compound Spring Embedder with Ports (CoSEP) is force-directed layout algorithm 
based on the [CoSE (Compound Spring Embedder)](https://github.com/cytoscape/cytoscape.js-cose-bilkent) to 
support port constraints on compound graphs. Further improvements are achieved by shifting port constrained 
edges around the node and by rotating nodes. 


The algorithm is implemented as a Cytoscape.js extension by [i-Vis Lab](http://cs.bilkent.edu.tr/~ivis/) in
 Bilkent University ([demo](https://raw.githack.com/iVis-at-Bilkent/cytoscape.js-cosep/unstable/demo/demo.html)).

## Dependencies

 * Cytoscape.js: ^3.2.0
 * cose-base ^1.0.1

## Documentation

Port constraints are mainly associated with edges and can have two port constraints defined on each of its
endpoints. When an edge endpoint doesnt’t have a specified port constraint, it’s assumed that it connects 
the center of the source/target node (the edge is typically rendered as w.r.t. to the source/target node 
shape’s center however). 

The ports are realized as discrete points distributed evenly around a node. The ports then can be indexed 
clock-wise as {0, 1, 2, … , 4k-1} starting at the top-left where k (user given as 1 ≤ k) is the number of 
ports on one side.

Various degrees of port constraints can be defined on edge endpoints:
 * Free: The edge can be placed at any vacant port.
 * Fixed Side(s): A set s of directions can be assigned to an edge in which s ⊆ {top, west, bottom, east}.
 * Absolute Position: Using the indices of ports, edges can be assigned static positions.
 * Fixed Order: A set of edges are assigned a specific order. The order is assumed to be clockwise and circular. 
 
 ## API
 
When calling the layout, e.g. `cy.layout({ name: 'cosep', ... })`, the following options are supported:

``` js
var options = {
    // -------- Mandatory parameters --------
    name = 'cosep',
    
    // This is the number specifying the number of ports on one node's side. If three is given, there would be 
    // twelve ports on one node.  
    portsPerSide: 3,
    
    
    
    portConstraints: portInfo,
    
    
 ```