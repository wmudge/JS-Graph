import { Graph } from '../src/graph';

var graph;

beforeEach(() => {
  graph = new Graph();
});

describe('Node functions', () => {
  it('Should add a Node', () => {
    const desired = new Map().set('foo', []);

    graph.addNode('foo');

    expect(graph.edges).toEqual(desired);
  });

  it('Should add multiple Nodes', () => {
    const desired = new Map().set('foo', []).set('bar', []);

    graph.addNode('foo');
    graph.addNode('bar');

    expect(graph.edges).toEqual(desired);
  });

  it('Should not duplicate Nodes', () => {
    const desired = new Map().set('foo', []);

    graph.addNode('foo');
    graph.addNode('foo');

    expect(graph.edges).toEqual(desired);
  });

  it('Should not overwrite Nodes', () => {
    const desired = new Map().set('foo', ['bar']);

    graph.edges = new Map().set('foo', ['bar']);

    graph.addNode('foo');

    expect(graph.edges).toEqual(desired);
  });

  it('Should remove a Node', () => {
    const desired = new Map().set('bar', []);

    graph.edges = new Map().set('foo', []).set('bar', []);

    graph.removeNode('foo');

    expect(graph.edges).toEqual(desired);
  });

  it('Should remove a Node from adjacency lists', () => {
    const desired = new Map().set('bar', ['blaz']);

    graph.edges = new Map().set('foo', []).set('bar', ['foo', 'blaz']);

    graph.removeNode('foo');

    expect(graph.edges).toEqual(desired);
  });

  it('Should retrieve all Nodes', () => {
    const desired = ['foo', 'bar', 'blaz'];

    graph.edges = new Map()
      .set('foo', [])
      .set('bar', [])
      .set('blaz', []);

    expect(graph.allNodes()).toEqual(desired);
  });

  it('Should retrieve adjacent Nodes', () => {
    const desired = ['foo', 'blaz'];

    graph.edges = new Map().set('foo', ['bar']).set('bar', ['foo', 'blaz']);

    expect(graph.adjacentTo('bar')).toEqual(desired);
  });

  it('Should retrieve an empty array if there are no adjacent Nodes', () => {
    graph.edges = new Map().set('foo', []).set('bar', ['foo', 'blaz']);

    expect(graph.adjacentTo('foo')).toHaveLength(0);
  });

  it('Should calculate the indegree for a Node', () => {
    graph.edges = new Map()
      .set('foo', [])
      .set('bar', ['foo', 'blaz'])
      .set('blaz', ['foo', 'bar']);

    expect(graph.indegree('foo')).toBe(2);
  });

  it('Should calculate the outdegree for a Node', () => {
    graph.edges = new Map()
      .set('foo', [])
      .set('bar', ['foo', 'blaz'])
      .set('blaz', ['foo', 'bar']);

    expect(graph.outdegree('bar')).toBe(2);
  });
});

describe('Edge functions', () => {
  it('Should concatenate an Edge path', () => {
    expect(graph._encodeEdge('foo', 'bar')).toBe('foo|bar');
  });

  it('Should set an Edge Weight', () => {
    const desired = new Map().set('foo|bar', 5);

    graph.setEdgeWeight('foo', 'bar', 5);

    expect(graph.edgeWeights).toEqual(desired);
  });

  it('Should set multiple Edge Weights', () => {
    const desired = new Map().set('foo|bar', 5).set('foo|blaz', 9);

    graph.setEdgeWeight('foo', 'bar', 5);
    graph.setEdgeWeight('foo', 'blaz', 9);

    expect(graph.edgeWeights).toEqual(desired);
  });

  it('Should overwrite an Edge Weight', () => {
    const desired = new Map().set('foo|bar', 5);

    graph.edgeWeights.set('foo|bar', 10);

    graph.setEdgeWeight('foo', 'bar', 5);

    expect(graph.edgeWeights).toEqual(desired);
  });

  it('Should get an Edge Weight', () => {
    graph.edgeWeights.set('foo|bar', 5);
    graph.edgeWeights.set('foo|blaz', 9);

    expect(graph.getEdgeWeight('foo', 'bar')).toBe(5);
  });

  it('Should get a default Edge Weight', () => {
    expect(graph.getEdgeWeight('foo', 'bar')).toBe(1);
  });

  it('Should remove an Edge Weight', () => {
    const desired = new Map().set('foo|blaz', 9);

    graph.edgeWeights.set('foo|bar', 5);
    graph.edgeWeights.set('foo|blaz', 9);

    graph.removeEdgeWeight('foo', 'bar');

    expect(graph.edgeWeights).toEqual(desired);
  });

  it('Should add an Edge with Edge Weight', () => {
    const desiredEdgeWeight = new Map().set('foo|bar', 5);
    const desiredEdges = new Map().set('foo', ['bar']).set('bar', []);

    graph.addEdge('foo', 'bar', 5);

    expect(graph.edgeWeights).toEqual(desiredEdgeWeight);
    expect(graph.edges).toEqual(desiredEdges);
  });

  it('Should add an Edge without an Edge Weight', () => {
    const desiredEdgeWeight = new Map();
    const desiredEdges = new Map().set('foo', ['bar']).set('bar', []);

    graph.addEdge('foo', 'bar');

    expect(graph.edgeWeights).toEqual(desiredEdgeWeight);
    expect(graph.edges).toEqual(desiredEdges);
  });

  it('Should add an Edge with a default Edge Weight', () => {
    const desiredEdgeWeight = new Map();
    const desiredEdges = new Map().set('foo', ['bar']).set('bar', []);

    graph.addEdge('foo', 'bar', 1);

    expect(graph.edgeWeights).toEqual(desiredEdgeWeight);
    expect(graph.edges).toEqual(desiredEdges);
  });

  it('Should remove an Edge with an Edge Weight', () => {
    const desiredEdgeWeight = new Map();
    const desiredEdges = new Map().set('foo', []).set('bar', []);

    graph.edgeWeights = new Map().set('foo|bar', 5);
    graph.edges = new Map().set('foo', ['bar']).set('bar', []);

    graph.removeEdge('foo', 'bar');

    expect(graph.edgeWeights).toEqual(desiredEdgeWeight);
    expect(graph.edges).toEqual(desiredEdges);
  });

  it('Should remove an Edge without an Edge Weight', () => {
    const desiredEdgeWeight = new Map();
    const desiredEdges = new Map().set('foo', []).set('bar', []);

    graph.edges = new Map().set('foo', ['bar']).set('bar', []);

    graph.removeEdge('foo', 'bar');

    expect(graph.edgeWeights).toEqual(desiredEdgeWeight);
    expect(graph.edges).toEqual(desiredEdges);
  });

  it('Should ignore removal if Edge does not exist', () => {
    const desiredEdgeWeight = new Map();
    const desiredEdges = new Map().set('foo', ['bar']).set('bar', []);

    graph.edges = new Map().set('foo', ['bar']).set('bar', []);

    graph.removeEdge('foo', 'blaz');

    expect(graph.edgeWeights).toEqual(desiredEdgeWeight);
    expect(graph.edges).toEqual(desiredEdges);
  });
});

describe('Serialization functions', () => {
  it('Should serialize a simple graph into a JSON object', () => {
    const desired = {
      nodes: [{ id: 'foo' }, { id: 'bar' }, { id: 'blaz' }],
      links: []
    };

    graph.edges = new Map()
      .set('foo', [])
      .set('bar', [])
      .set('blaz', []);

    expect(graph.serialize()).toEqual(desired);
  });

  it('Should serialize a graph with edge weights into a JSON object', () => {
    const desired = {
      nodes: [{ id: 'foo' }, { id: 'bar' }, { id: 'blaz' }],
      links: [
        { source: 'foo', target: 'bar', weight: 7 },
        { source: 'bar', target: 'foo', weight: 1 },
        { source: 'bar', target: 'blaz', weight: 1 }
      ]
    };

    graph.edges = new Map()
      .set('foo', ['bar'])
      .set('bar', ['foo', 'blaz'])
      .set('blaz', []);

    graph.edgeWeights = new Map().set('foo|bar', 7);

    expect(graph.serialize()).toEqual(desired);
  });

  it('Should deserialize a simple JSON object into a graph', () => {
    const desired = new Map()
      .set('foo', [])
      .set('bar', [])
      .set('blaz', []);

    const input = {
      nodes: [{ id: 'foo' }, { id: 'bar' }, { id: 'blaz' }],
      links: []
    };

    graph.deserialize(input);

    expect(graph.edges).toEqual(desired);
  });

  it('Should deserialize a JSON object into a graph with edge weights', () => {
    const desiredEdges = new Map()
      .set('foo', ['bar'])
      .set('bar', ['foo', 'blaz'])
      .set('blaz', []);

    const desiredEdgeWeights = new Map().set('foo|bar', 7);

    const input = {
      nodes: [{ id: 'foo' }, { id: 'bar' }, { id: 'blaz' }],
      links: [
        { source: 'foo', target: 'bar', weight: 7 },
        { source: 'bar', target: 'foo', weight: 1 },
        { source: 'bar', target: 'blaz', weight: 1 }
      ]
    };

    graph.deserialize(input);

    expect(graph.edges).toEqual(desiredEdges);
    expect(graph.edgeWeights).toEqual(desiredEdgeWeights);
  });
});
