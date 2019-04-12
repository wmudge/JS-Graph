// TODO: add config object in constructor for un/directed form and edge encoder separator
/**
 * A directed, weighted graph data structure
 */
export class Graph {
  /**
   * Create a graph.
   * @param {?serialization} serialized
   */
  constructor(serialized = undefined) {
    // The adjacency list of the graph.
    // Keys are node ids, values are adjacent node id arrays.
    this.edges = new Map();

    // The weights of edges.
    // Keys are string encodings of edges, values are weights (numbers).
    this.edgeWeights = new Map();

    // If a serialized graph was passed into the constructor, deserialize it.
    if (serialized) {
      this.deserialize(serialized);
    }
  }

  /**
   * Adds a node to the graph.
   * If node was already added, this function does nothing.
   * If node was not already added, this function sets up an empty adjacency list.
   * @param {any} node
   */
  addNode(node) {
    if (!this.edges.has(node)) {
      this.edges.set(node, this.adjacentTo(node));
    }

    return this;
  }

  /**
   * Removes a node from the graph.
   * Also removes incoming and outgoing edges.
   * @param {any} node
   */
  removeNode(node) {
    // Remove incoming edges.
    for (const u of this.edges.keys()) {
      this.edges.get(u).forEach(v => {
        if (v === node) {
          this.removeEdge(u, v);
        }
      });
    }

    // Remove outgoing edges.
    this.edges.delete(node);

    return this;
  }

  /**
   * Gets the list of nodes that have been added to the graph according to topographical sort.
   */
  allNodes() {
    const nodeSet = new Map();

    for (const u of this.edges.keys()) {
      nodeSet.set(u, true);
      this.edges.get(u).forEach(v => {
        nodeSet.set(v, true);
      });
    }

    return Array.from(nodeSet.keys());
  }

  /**
   * Gets the adjacent node list for the given node.
   * Returns an empty array for unknown nodes.
   * @param {*} node
   */
  adjacentTo(node) {
    return this.edges.get(node) || [];
  }

  /**
   * Computes a string encoding of an edge for use as a key in an object.
   * @param {*} u Source node
   * @param {*} v Target node
   */
  _encodeEdge(u, v) {
    return u + '|' + v;
  }

  /**
   * Sets the weight of the given edge.
   * @param {any} u Source node
   * @param {any} v Target node
   * @param {?number} weight Edge weight
   */
  setEdgeWeight(u, v, weight = undefined) {
    if (weight !== 1) {
      this.edgeWeights.set(this._encodeEdge(u, v), weight);
    }
  }

  /**
   * Gets the weight of the given edge.
   * Returns 1 if no weight is set.
   * @param {any} u Source node
   * @param {any} v Target node
   */
  getEdgeWeight(u, v) {
    const weight = this.edgeWeights.get(this._encodeEdge(u, v));
    return weight === undefined ? 1 : weight;
  }

  /**
   * Deletes the weight of the given edge.
   * Does not remove the edge itself.
   * Effectively resets the weight to the default.
   * @param {any} u Source node
   * @param {any} v Target node
   */
  removeEdgeWeight(u, v) {
    this.edgeWeights.delete(this._encodeEdge(u, v));
  }

  /**
   * Adds an edge from node u to node v.
   * Implicitly adds the nodes if they were not already added.
   * @param {any} u Source node
   * @param {any} v Target node
   * @param {?number} weight Edge weight
   */
  addEdge(u, v, weight = undefined) {
    this.addNode(u);
    this.addNode(v);
    this.adjacentTo(u).push(v);

    if (weight !== undefined) {
      this.setEdgeWeight(u, v, weight);
    }

    return this;
  }

  /**
   * Removes the edge from node u to node v.
   * Does not remove the nodes.
   * Does nothing if the edge does not exist.
   * @param {any} u Source node
   * @param {any} v Target node
   */
  removeEdge(u, v) {
    if (this.edges.has(u)) {
      this.edges.set(u, this.adjacentTo(u).filter(_v => _v !== v));
      this.removeEdgeWeight(u, v);
    }

    return this;
  }

  /**
   * Computes the indegree (number of inbound edges) for the given node.
   * Not very efficient, costs O(E) where E = number of edges.
   * @param {any} node
   */
  indegree(node) {
    let degree = 0;

    for (const u of this.edges.keys()) {
      this.edges.get(u).forEach(v => {
        if (v === node) {
          degree++;
        }
      });
    }

    return degree;
  }

  /**
   * Computes the outdegree for the given node.
   * @param {any} node
   * @returns {number} The number of degrees
   */
  outdegree(node) {
    return this.edges.has(node) ? this.edges.get(node).length : 0;
  }

  /**
   * Serializes the graph.
   * @returns {serialization}
   */
  serialize() {
    const serialized = {
      nodes: this.allNodes().map(function(id) {
        return { id: id };
      }),
      links: []
    };

    serialized.nodes.forEach(node => {
      const source = node.id;
      this.adjacentTo(source).forEach(target => {
        serialized.links.push({
          source: source,
          target: target,
          weight: this.getEdgeWeight(source, target)
        });
      });
    });

    return serialized;
  }

  /**
   * Deserializes the given serialized graph.
   * @param {serialization} serialized
   */
  deserialize(serialized) {
    serialized.nodes.forEach(node => {
      this.addNode(node.id);
    });

    serialized.links.forEach(link => {
      this.addEdge(link.source, link.target, link.weight);
    });
  }
}

/**
* The serialization of a graph.
* @typedef {Object} serialization
* @property {Object[]} serialization.nodes an array of node objects
* @property {string} serialization.nodes[].id the node identifier
* @property {Object[]} serialization.links an array of objects representing edges
* @property {string} serialization.links[].source - the node identifier string of
* the source node (u)
* @property {string} serialization.links[].target - the node identifier of the
* target node (v)
* @property {number} serialization.links[].weight - the weight of the edge between
* the source and target nodes
*/
