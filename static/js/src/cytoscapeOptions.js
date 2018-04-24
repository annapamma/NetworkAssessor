// import tippy from 'tippy.js'


export default {
    hideIsolateNodes(cy) {
        let count = 0;
        cy.nodes().forEach(node => {
            if (node.neighborhood().length === 0) {
                cy.remove(node);
                count += 1
            }
        });
        return count;
    },
    colorPathways(subnetwork, pathwayColors, selectedPathways, cy) {
        cy.nodes().forEach(node => {
            // pull out only the selected pathways this node's a part of
            let selectedPathwaysWithNode = node.data('pathways').filter(function(n) {
                return selectedPathways.indexOf(n) !== -1;
            });

            if (selectedPathwaysWithNode.includes('query_list') &&
                selectedPathwaysWithNode.length === 1) {
                    node.style('shape', 'rectangle');
                    node.style('width', '70px');
                    node.style('background-color', pathwayColors['query_list']);
                    node.style('text-valign', 'center');
                    node.style('text-halign', 'center');
                    // node.style('lineColor', 'red');
                    // node.style('text-outline-color', pathwayColors['query_list'])
            } else if
                (selectedPathwaysWithNode.includes('query_list') &&
                selectedPathwaysWithNode.length > 1)
            {
                node.style('shape', 'star');
                node.style('width', '50px');
                node.style('height', '50px');
                node.style('background-color', pathwayColors['query_list']);
                node.style('text-valign', 'center');
                node.style('text-halign', 'center');

                // node.style('text-outline-color', '#00ff00')
            } else if (selectedPathwaysWithNode.length > 1) {
                node.style('shape', 'ellipse');
                node.style('pie-size', '100%');
                let percentPathway = (100/(selectedPathwaysWithNode.length)).toString();
                selectedPathwaysWithNode.forEach((pathway, i) => {
                    let pie_index = i + 1;
                    node.style(`pie-${pie_index}-background-color`, pathwayColors[pathway]);
                    node.style(`pie-${pie_index}-background-size`, `${percentPathway}%`);
                });
                // node.style('background-opacity', '0.9')
                // node.style('text-outline-color', pathwayColors[selectedPathwaysWithNode[0]])
            } else {
                node.style('shape','ellipse');
                node.style('background-color', pathwayColors[selectedPathwaysWithNode[0]]);
                // node.style('background-opacity', '0.9');
                // node.style('text-outline-color', pathwayColors[selectedPathwaysWithNode[0]])
            }
        })
    },
    applyMouseEvents(cy, queryGenes, queryListColor) {
        let edgesWithQueryGenes, edgesWithoutQueryGenes;

        cy.on('mousedown', function(event){
            let evtTarget = event.target;
            if (evtTarget !== cy) {
                let edges = evtTarget.connectedEdges();
                edgesWithQueryGenes = edges.filter((edge) => {
                  return (queryGenes.includes(edge.target().id()))
                });

                edgesWithQueryGenes.animate({
                    style: {lineColor: 'red'}
                });

                edgesWithoutQueryGenes = edges.filter((edge) => {
                  return !(queryGenes.includes(edge.target().id()))
                });

                edgesWithoutQueryGenes.animate({
                    style: {lineColor: 'blue'}
                });
            }
        });
        cy.on('mouseup', (event) => {
            let evtTarget = event.target;

            if (evtTarget !== cy) {
                    edgesWithQueryGenes.animate({
                    style: {lineColor: queryListColor}
                });

                edgesWithoutQueryGenes.animate({
                    style: {lineColor: '#b7b7b7'}
                });
            }
        });
    },
    colorQueryGeneEdges(cy, queryGenes, queryListColor) {
        cy.edges().forEach((edge) => {
            if (queryGenes.includes(edge.target().id())
                || queryGenes.includes(edge.source().id())) {
                edge.style('line-color', queryListColor);
            } else {
                edge.style('line-color', '#b7b7b7')
            }
        })

    },
    coseOptions: {
      // Called on `layoutready`
      ready() {

      },
      // Called on `layoutstop`
      stop() {
      },
      // Whether to include labels in node dimensions. Useful for avoiding label overlap
      nodeDimensionsIncludeLabels: true,
      // number of ticks per frame; higher is faster but more jerky
      refresh: 30,
      // Whether to fit the network view after when done
      fit: true,
      // Padding on fit
      padding: 10,
      // Whether to enable incremental mode
      randomize: true,
      // Node repulsion (non overlapping) multiplier
      nodeRepulsion: 8000,
      // Ideal (intra-graph) edge length
      idealEdgeLength: 100,
      // Divisor to compute edge forces
      edgeElasticity: 0.45,
      // Nesting factor (multiplier) to compute ideal edge length for inter-graph edges
      nestingFactor: 0.1,
      // Gravity force (constant)
      gravity: 0.15,
      // Maximum number of iterations to perform
      numIter: 2500,
      // Whether to tile disconnected nodes
      tile: true,
      // Type of layout animation. The option set is {'during', 'end', false}
      animate: false,
      // Amount of vertical space to put between degree zero nodes during tiling (can also be a function)
      tilingPaddingVertical: 10,
      // Amount of horizontal space to put between degree zero nodes during tiling (can also be a function)
      tilingPaddingHorizontal: 10,
      // Gravity range (constant) for compounds
      gravityRangeCompound: 1.5,
      // Gravity force (constant) for compounds
      gravityCompound: 1.0,
      // Gravity range (constant)
      gravityRange: 3.8,
      // Initial cooling factor for incremental layout
      initialEnergyOnIncremental: 0.5
    }
}