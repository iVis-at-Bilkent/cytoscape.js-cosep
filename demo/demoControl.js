/**
 * JS control file for the demo
 *
 * @author Alihan Okka
 *
 * @copyright i-Vis Research Group, Bilkent University, 2007 - present
 */

// Variables and Constants
let selectedEdge;
let constraints = {};
const indicatorTable = document.getElementById("indicTable");
const consSelector = document.getElementById("consType");
const logsTable = document.getElementById("logsTable");

// Function to send to CoSEP Layout
let portConstraints = function( edge ){
    return constraints[edge.data('id')];
};

// Clear Selections/Options at start
document.getElementById("endpoint").selectedIndex = -1;
document.getElementById("consType").selectedIndex = -1;
document.getElementById("portsPerSide").value = 5;
document.getElementById("FPS").value = 24;
document.getElementById("FPS").disabled = true;
document.getElementById("edgeShiftingThreshold").value = 3;

// Initial Layout on opening the page

var cy = window.cy = cytoscape({
    container: document.getElementById('cy'),
    layout: {
        name: 'cose-bilkent',
        quality: 'default',
        nodeDimensionsIncludeLabels: false,
        fit: true
    },
    style: [
        {
            selector: 'node',
            style: {
                'shape' : 'rectangle',
                'label' : 'data(id)',
                'text-halign': 'center',
                'text-valign': 'center',
                'background-color': '#3a7ecf',
                'width': function (node) {
                    switch (node.data('id')) {
                        case 'n0':
                            return 40;
                        case 'n1':
                            return 100;
                        case 'n3':
                            return 70;
                        case 'n4':
                            return 100;
                        case 'n21':
                            return 50;
                        default:
                            return 30;
                    }
                },
                'height': function (node) {
                    switch (node.data('id')) {
                        case 'n0':
                            return 60;
                        case 'n3':
                            return 70;
                        case 'n4:':
                            return 150;
                        case 'n21':
                            return 50;
                        default:
                            return 30;
                    }
                }


            }
        },
        {
            selector: ':parent',
            style: {
                'background-opacity': 0.333,
                'border-color': '#3a7ecf'
            }
        },
        {
            selector: ':parent:selected',
            style: {
                'background-opacity': 0.65,
                'border-color': '#ff0000'
            }
        },
        {
            selector: 'node:selected',
            style: {
                'background-color': '#ff0000'
            }
        },
        {
            selector: 'edge',
            style: {
                'curve-style': 'straight',
                'width': 2,
                'line-color': '#3a7ecf',
                'opacity': 0.7
            }
        },
        {
            selector: 'edge:selected',
            style: {
                'line-color': '#ff0000',
                'label' : 'data(id)',
                'font-size' : 13,
                'text-opacity': 1,
                'text-rotation': 'autorotate',
                'color' : '#ff0000',
                'font-weight' : 'bold',
                'text-background-shape' : 'round-rectangle',
                'text-background-opacity' : 1,
                'text-background-padding' : 2
            },
        }
    ],
    elements: [
        {group: 'nodes', data: {id: 'n0'}, width: 200},
        {group: 'nodes', data: {id: 'n1'}},
        {group: 'nodes', data: {id: 'n2'}},
        {group: 'nodes', data: {id: 'n3'}},
        {group: 'nodes', data: {id: 'n4'}},
        {group: 'nodes', data: {id: 'n5'}},
        {group: 'nodes', data: {id: 'n10'}},
        {group: 'nodes', data: {id: 'n11', parent: 'n10'}},
        {group: 'nodes', data: {id: 'n12', parent: 'n10'}},
        {group: 'nodes', data: {id: 'n20'}},
        {group: 'nodes', data: {id: 'n21', parent: 'n20'}},
        {group: 'nodes', data: {id: 'n22', parent: 'n20'}},
        {group: 'nodes', data: {id: 'n23', parent: 'n20'}},
        {group: 'edges', data: {id: 'e0', source: 'n1', target: 'n2'}},
        {group: 'edges', data: {id: 'e1', source: 'n2', target: 'n3'}},
        {group: 'edges', data: {id: 'e2', source: 'n3', target: 'n21'}},
        {group: 'edges', data: {id: 'e3', source: 'n1', target: 'n10'}},
        {group: 'edges', data: {id: 'e4', source: 'n4', target: 'n20'}},
        {group: 'edges', data: {id: 'e5', source: 'n21', target: 'n23'}},
        {group: 'edges', data: {id: 'e6', source: 'n0', target: 'n10'}},
        {group: 'edges', data: {id: 'e7', source: 'n0', target: 'n20'}},
        {group: 'edges', data: {id: 'e8', source: 'n2', target: 'n0'}},
        {group: 'edges', data: {id: 'e9', source: 'n5', target: 'n10'}}
    ],
    wheelSensitivity: 0.3
});

document.getElementById("animate").addEventListener( 'change', function() {
    document.getElementById("FPS").disabled = !this.checked;
});

// CoSE Core Button
document.getElementById("coseButton").addEventListener("click",function(){
    let layout = window.cy.layout({
        name: 'cose-bilkent',
        refresh:1,
        tile:false,
        animate: ( document.getElementById("animate").checked) ? 'during' : false,
        randomize: !(document.getElementById("incremental").checked)
    });

    layout.run();
});

// Cosep Button
document.getElementById("cosepButton").addEventListener("click",function(){
    if( !Number.isInteger(+document.getElementById("portsPerSide").value) ){
        alert( "Please enter valid ports per node side" );
        return;
    }

    let layout = window.cy.layout({
        name: 'cosep',
        refresh:1,
        fps: +document.getElementById("FPS").value,
        animate: ( document.getElementById("animate").checked) ? 'during' : false,
        randomize: !(document.getElementById("incremental").checked),
        portConstraints: portConstraints,
        portsPerNodeSide: document.getElementById("portsPerSide").value,
        edgeShiftingThreshold: +document.getElementById("edgeShiftingThreshold").value,
    });

    if ( document.getElementById("animate").checked )
        layout.promiseOn('layoutstop').then(function( event ){ alert('CoSEP Layout is done!'); });

    layout.run();
});

// Export constraints JSON
document.getElementById("exportToFile").addEventListener("click",function(){
    saveText( JSON.stringify(constraints), "constraints.json" );

    function saveText(text, filename){
        let a = document.createElement('a');
        a.setAttribute('href', 'data:text/plain;charset=utf-u,'+encodeURIComponent(text));
        a.setAttribute('download', filename);
        a.click();
    }
});

// Import JSON object to constraints
document.getElementById('file-input').addEventListener('change', function (evt) {
    let files = evt.target.files;
    let reader = new FileReader();
    let contents;
    reader.readAsText(files[0]);
    reader.onload = function (event) {
        // Parse the input
        contents = event.target.result;
        constraints = JSON.parse( contents );

        // Clear logs table and re-write it
        if (logsTable.rows.length > 1){
            for( let i = 0; i <= logsTable.rows.length ; i++){
                logsTable.deleteRow(1);
            }
        }

        // Clear arrow heads
        window.cy.edges().style({'source-arrow-shape':'none'});
        window.cy.edges().style({'target-arrow-shape':'none'});

        Object.keys(constraints).forEach(function( key ) {
            let edgeID = key;
            let consInfo = constraints[edgeID];

            consInfo.forEach(function (cons) {
                addToHistory( window.cy.edges("[id = '" + edgeID + "']"),
                              cons.endpoint,
                              cons.portConstraintType,
                              cons.portConstraintParameter );

                changeArrowShape( window.cy.edges("[id = '" + edgeID + "']"), cons.endpoint, cons.portConstraintType );
            });
        });

    };
});

// Selecting stuff on the graph
// Get only if the selected is only one edge
cy.on('select', 'edge', function( event ){
    let selected = cy.elements(':selected');
    if( selected.length == 1 && selected.group() == 'edges' ) {
        selectedEdge = selected[0];

        // Change indicator Table ----
        // Delete prev info
        if (indicatorTable.rows.length > 1){
            for( let i = 1; i <= indicatorTable.rows.length ; i++){
                indicatorTable.deleteRow(1);
            }
        }

        // Adding node id to  node id indication
        let row = indicatorTable.insertRow();
        let cell3 = row.insertCell(0);
        let cell2 = row.insertCell(0);
        let cell1 = row.insertCell(0);
        cell1.innerHTML = selectedEdge.data('source');
        cell2.innerHTML =  '&#10230;';
        cell3.innerHTML = selectedEdge.data('target');

        // Highlight history log according to id
        for( let i = 0; i < logsTable.rows.length; i++ ){
            if( logsTable.rows[i].cells[0].innerHTML == selectedEdge.data('id') ){
                logsTable.rows[i].style.backgroundColor = '#fffc7f';
            }
        }

        // Display indicator and
        document.getElementById('addConsCard').style.display = 'block';
        document.getElementById('indicatorCard').style.display = 'block';
    }
});

// Unselecting the edge
// Remove all displays
cy.on('unselect', 'edge', function(event){
    selectedEdge = null;

    // Un-highlight history
    for( let i = 0; i < logsTable.rows.length; i++ )
        logsTable.rows[i].style.backgroundColor = '';

    document.getElementById('addConsCard').style.display = 'none';
    document.getElementById('indicatorCard').style.display = 'none';
    document.getElementById('portIndexRow').style.display = "none";
    document.getElementById('nodeSidesRow').style.display = "none";
    document.getElementById("endpoint").selectedIndex = -1;
    document.getElementById("consType").selectedIndex = -1;
    document.getElementById("nodeSides").selectedIndex = -1;
    document.getElementById("portIndex").value = "";
});

// Changing Constraint Table according to type selection
consSelector.addEventListener("change", function() {
    if( consSelector.value == "Free" ){
        document.getElementById('portIndexRow').style.display = "none";
        document.getElementById('nodeSidesRow').style.display = "none";
    }else if( consSelector.value == "Sided" ){
        document.getElementById('portIndexRow').style.display = "none";
        document.getElementById('nodeSidesRow').style.display = "table-row";
    } else if( consSelector.value == "Absolute" ){
        document.getElementById('portIndexRow').style.display = "table-row";
        document.getElementById('nodeSidesRow').style.display = "none";
    }
});

// Adding Constraints
document.getElementById("addConstraint").addEventListener("click",function(){
    let endpoint;
    let portConstraintType;
    let portConstraintParameter;
    let edge = selectedEdge;

    // Endpoint selection
    switch ( document.getElementById("endpoint").selectedIndex ) {
        case -1:
            alert("Failed to add constraint: Endpoint is not specified ");
            return;
            break;
        case 0:
            endpoint = 'Source';
            break;
        case 1:
            endpoint = 'Target';
            break;
    }

    // Port constraint type selection
    switch ( document.getElementById("consType").selectedIndex  ) {
        case -1:
            alert("Failed to add constraint: Constraint type is not specified ");
            return;
            break;
        case 0:
            portConstraintType = 'Free';
            break;
        case 1:
            portConstraintType = 'Sided';
            portConstraintParameter = [];
            let nodeSides = document.getElementById("nodeSides").options;
            for( let i = 0; i < nodeSides.length; i++ ){
                if( nodeSides[i].selected )
                    portConstraintParameter.push( nodeSides[i].value );
            }

            if( nodeSides.length == 0 ){
                alert("Failed to add constraint: Node sides are not specified ");
                return;
            }
            break;
        case 2:
            portConstraintType = 'Absolute';
            portConstraintParameter = document.getElementById("portIndex").value;

            if ( !Number.isInteger( +document.getElementById("portsPerSide").value )  ||
                portConstraintParameter >= document.getElementById("portsPerSide").value * 4

            ){
                alert("Failed to add constraint: Given port index exceeds total port range");
                return;
            }
            break;
    }

    // Does this endpoint have a constraint already defined?
    if( constraints[ edge.data('id') ] == undefined || constraints[ edge.data('id') ] == null ){
        constraints[ edge.data('id') ] = [{
            endpoint: endpoint,
            portConstraintType: portConstraintType,
            portConstraintParameter: portConstraintParameter
        }];

        addToHistory( edge, endpoint, portConstraintType, portConstraintParameter );
        addImplicitPorts( edge, edge.data( endpoint.toLowerCase() ) );
    } else {
        // There is already a constraint defined. Then alter the constraint object
        let alreadyCons =  constraints[ edge.data('id') ];
        let bool = false;
        alreadyCons.forEach( function (cons) {
            if(cons.endpoint == endpoint){
                cons.portConstraintType = portConstraintType;
                cons.portConstraintParameter = portConstraintParameter;

                // Change Log files
                for( let i = 0; i < logsTable.rows.length; i++ ){
                    if( logsTable.rows[i].cells[0].innerHTML == edge.data('id') &&
                        logsTable.rows[i].cells[1].innerHTML == endpoint ){
                        logsTable.rows[i].cells[2].innerHTML = portConstraintType;
                        logsTable.rows[i].cells[3].innerHTML =  (portConstraintParameter) ? portConstraintParameter : 'N/A';
                    }
                }
                bool = true;
            }
        });

        // Other endpoint has a constraint
        if(!bool){
            constraints[ edge.data('id') ].push({
                endpoint: endpoint,
                portConstraintType: portConstraintType,
                portConstraintParameter: portConstraintParameter
            });

            addToHistory( edge, endpoint, portConstraintType, portConstraintParameter );
            addImplicitPorts( edge, edge.data( endpoint.toLowerCase() ) );
        }
    }

    changeArrowShape( edge, endpoint, portConstraintType );
});

// Changes arrow types
function changeArrowShape( edge, endpoint, portConstraintType ) {
    switch( portConstraintType ){
        case 'Free':
            if( endpoint == 'Source' )
                edge.style({ 'source-arrow-shape': 'vee', 'source-arrow-color': '#3a7ecf' });
            else
                edge.style({ 'target-arrow-shape': 'vee', 'target-arrow-color': '#3a7ecf' });
            break;
        case 'Sided':
            if( endpoint == 'Source' )
                edge.style({ 'source-arrow-shape': 'triangle-tee', 'source-arrow-color': '#3a7ecf' });
            else
                edge.style({ 'target-arrow-shape': 'triangle-tee', 'target-arrow-color': '#3a7ecf' });
            break;
        case 'Absolute':
            if( endpoint == 'Source' )
                edge.style({ 'source-arrow-shape': 'circle', 'source-arrow-color': '#3a7ecf' });
            else
                edge.style({ 'target-arrow-shape': 'circle', 'target-arrow-color': '#3a7ecf' });
            break;
    }
}

// Add to history
function addToHistory( edge, endpoint, portConstraintType, portConstraintParameter ) {
    let row = logsTable.insertRow();
    let cell4 = row.insertCell(0);
    let cell3 = row.insertCell(0);
    let cell2 = row.insertCell(0);
    let cell1 = row.insertCell(0);
    cell1.innerHTML = edge.data('id');
    cell2.innerHTML = endpoint;
    cell3.innerHTML = portConstraintType;
    cell4.innerHTML = (portConstraintParameter) ? portConstraintParameter : 'N/A';
}

// Add ports that should be free
function addImplicitPorts( cytoEdge, nodeID ) {
    let node = cy.nodes().filter( "[id = '" + nodeID + "']" );
    let edges = node.connectedEdges();
    for(let i = 0; i < edges.length; i++){
        let edge = edges[i];
        if(edge == cytoEdge){
            continue;
        }

        let endpoint;
        if( edge.source().data('id') == node.data('id'))
            endpoint = 'Source';
        else
            endpoint = 'Target';

        // Does this endpoint have a constraint already defined?
        if( constraints[ edge.data('id') ] == undefined || constraints[ edge.data('id') ] == null ){
            constraints[ edge.data('id') ] = [{
                endpoint: endpoint,
                portConstraintType: 'Free',
                portConstraintParameter: 'N/A'
            }];

            addToHistory( edge, endpoint, 'Free', 'N/A' );
            changeArrowShape( edge, endpoint, 'Free' );
        } else {
            let alreadyCons =  constraints[ edge.data('id') ];
            let bool = false;
            alreadyCons.forEach( function (cons) {
                if(cons.endpoint == endpoint){
                    bool = true;
                }
            });

            // Other endpoint has a constraint
            if(!bool){
                constraints[ edge.data('id') ].push({
                    endpoint: endpoint,
                    portConstraintType: 'Free',
                    portConstraintParameter: 'N/A'
                });

                addToHistory( edge, endpoint, 'Free', 'N/A' );
                changeArrowShape( edge, endpoint, 'Free' );
            }
        }
    }
}