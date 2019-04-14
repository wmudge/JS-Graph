import { Graph } from './graph';

/**
 * Depth First Search algorithm, inspired by Cormen et al. "Introduction to Algorithms"
 * 3rd Ed. p. 604.
 * This variant includes an additional option `includeSourceNodes` to specify
 * whether to include or exclude the source nodes from the result (true by default).
 * If `sourceNodes` is not specified, all nodes in the graph are used as source nodes.
 * @param {Graph} graph the graph
 * @param {?array} sourceNodes source nodes
 * @param {?boolean} includeSourceNodes source node inclusion
 */
export function depthFirstSearch(
  graph,
  sourceNodes = undefined,
  includeSourceNodes = true
) {
  if (!sourceNodes) {
    sourceNodes = graph.allNodes();
  }

  if (typeof includeSourceNodes !== 'boolean') {
    includeSourceNodes = true;
  }

  const visited = new Map();
  const nodeList = [];

  function DFSVisit(node) {
    if (!visited.has(node)) {
      visited.set(node, true);
      graph.adjacentTo(node).forEach(DFSVisit);
      nodeList.push(node);
    }
  }

  if (includeSourceNodes) {
    sourceNodes.forEach(DFSVisit);
  } else {
    sourceNodes.forEach(n => {
      visited.set(n, true);
      graph.adjacentTo(n).forEach(DFSVisit);
    });
  }

  return nodeList;
}

/**
 * The topological sort algorithm yields a list of visited nodes, such that for each visited
 * edge (u, v), u comes before v in the list.
 * Amazingly, this comes from just reversing the result from depth first search.
 * Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 613
 * @param {Graph} graph the graph
 * @param {?array} sourceNodes source nodes
 * @param {?boolean} includeSourceNodes source node inclusion
 */
export function topologicalSort(
  graph,
  sourceNodes = undefined,
  includeSourceNodes = true
) {
  return depthFirstSearch(graph, sourceNodes, includeSourceNodes).reverse();
}

/**
 * Dijkstra's Shortest Path Algorithm.
 * Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 658
 * Variable and function names correspond to names in the book.
 * @param {Graph} graph the graph
 * @param {any} source the source node
 * @param {any} destination the destination node
 * @param {filter} filter the node filter
 */
export function dijkstra(
  graph,
  source,
  destination,
  filter = node => {
    return node;
  }
) {
  // Upper bounds for shortest path weights from source.
  const d = new Map();

  // Predecessors.
  const p = new Map();

  // Poor man's priority queue, keyed on d.
  const q = new Set();

  function initializeSingleSource() {
    graph.allNodes().forEach(node => d.set(node, Infinity));

    if (d.get(source) !== Infinity) {
      throw new Error('Source node is not in the graph');
    }

    if (d.get(destination) !== Infinity) {
      throw new Error('Destination node is not in the graph');
    }

    d.set(source, 0);
  }

  // Adds entries in q for all nodes.
  function initializePriorityQueue() {
    graph
      .allNodes()
      .filter(filter)
      .forEach(node => q.add(node));
  }

  // Linear search to extract (find and remove) min from q.
  function extractMin() {
    let min = Infinity;
    let minNode;

    q.forEach(node => {
      if (d.get(node) < min) {
        min = d.get(node);
        minNode = node;
      }
    });

    if (minNode === undefined) {
      // If we reach here, there's a disconnected subgraph, and we're done.
      q.clear();
      return null;
    }

    q.delete(minNode);

    return minNode;
  }

  function relax(u, v) {
    const w = graph.getEdgeWeight(u, v);

    if (d.get(v) > d.get(u) + w) {
      d.set(v, d.get(u) + w);
      p.set(v, u);
    }
  }

  function dijkstra() {
    initializeSingleSource();
    initializePriorityQueue();
    while (q.size > 0) {
      const u = extractMin();
      graph.adjacentTo(u).forEach(v => relax(u, v));
    }
  }

  // Assembles the shortest path by traversing the
  // predecessor subgraph from destination to source.
  function path() {
    const nodeList = [];
    let weight = 0;
    let node = destination;

    while (p.has(node)) {
      nodeList.push(node);
      weight += graph.getEdgeWeight(p.get(node), node);
      node = p.get(node);
    }

    if (node !== source) {
      throw new Error('No path found');
    }

    nodeList.push(node);
    nodeList.reverse();

    return { path: nodeList, distance: weight };
  }

  dijkstra();

  return path();
}

/**
 * Filters a node, returning the node if it satisfies the criteria.
 * @callback filter
 * @param {*} candidate node
 * @returns {*} the accepted node
 */