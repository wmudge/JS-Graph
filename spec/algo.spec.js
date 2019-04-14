import { Graph } from '../src/graph';
import {
  depthFirstSearch as DFS,
  topologicalSort as TS,
  dijkstra as SPF
} from '../src/algo';

var singleGraph;
var disconnectedGraph;
var comingledGraph;

beforeEach(() => {
  singleGraph = new Graph()
    .addNode('A')
    .addNode('B')
    .addNode('C')
    .addNode('D')
    .addNode('E')
    .addNode('F')
    .addNode('G')
    .addNode('H')
    .addEdge('A', 'B')
    .addEdge('A', 'C', 2)
    .addEdge('A', 'H', 3)
    .addEdge('B', 'D')
    .addEdge('C', 'E', 2)
    .addEdge('D', 'F', 3)
    .addEdge('E', 'D')
    .addEdge('E', 'G', 2)
    .addEdge('E', 'H', 3)
    .addEdge('F', 'B');

  disconnectedGraph = new Graph()
    .addNode('A')
    .addNode('B')
    .addNode('C')
    .addNode('D')
    .addNode('E')
    .addNode('F')
    .addNode('G')
    .addNode('H')
    .addEdge('A', 'B')
    .addEdge('A', 'H')
    .addEdge('B', 'D')
    .addEdge('C', 'E')
    .addEdge('D', 'F')
    .addEdge('E', 'D')
    .addEdge('E', 'G')
    .addEdge('E', 'H')
    .addEdge('F', 'B');

  comingledGraph = new Graph()
    .addNode('A')
    .addNode('B')
    .addNode('C')
    .addNode('D')
    .addNode('E')
    .addNode('F')
    .addNode('G')
    .addNode('H')
    .addEdge('A', 'B')
    .addEdge('A', 'C')
    .addEdge('B', 'C')
    .addEdge('B', 'E')
    .addEdge('C', 'D')
    .addEdge('D', 'E')
    .addEdge('F', 'B')
    .addEdge('F', 'E')
    .addEdge('G', 'C')
    .addEdge('G', 'H')
    .addEdge('H', 'D');
});

describe('Depth-first search', () => {
  it('Should execute on all nodes of a connected graph', () => {
    const desired = ['F', 'D', 'B', 'G', 'H', 'E', 'C', 'A'];
    expect(DFS(singleGraph)).toEqual(desired);
  });

  it('Should execute on all nodes, excluding the source node(s), of a connected graph', () => {
    const desired = ['F', 'D', 'B', 'G', 'H', 'E', 'C'];
    expect(DFS(singleGraph, undefined, false)).toEqual(desired);
  });

  it('Should execute on a starting set of nodes of a connected graph', () => {
    const desired = ['B', 'F', 'D', 'G', 'H', 'E', 'C'];
    expect(DFS(singleGraph, ['C'])).toEqual(desired);
  });

  it('Should execute on a starting set of nodes, excluding source node(s), of a connected graph', () => {
    const desired = ['B', 'F', 'D', 'G', 'H', 'E'];
    expect(DFS(singleGraph, ['C'], false)).toEqual(desired);
  });

  it('Should execute on all nodes of two disconnected graphs', () => {
    const desired = ['F', 'D', 'B', 'H', 'A', 'G', 'E', 'C'];
    expect(DFS(disconnectedGraph)).toEqual(desired);
  });

  it('Should execute on all nodes, excluding the source node(s), of two disconnected graphs', () => {
    const desired = ['F', 'D', 'B', 'H', 'G', 'E'];
    expect(DFS(disconnectedGraph, undefined, false)).toEqual(desired);
  });

  it('Should execute on a subset of nodes of two disconnected graphs', () => {
    const desired = ['B', 'F', 'D'];
    expect(DFS(disconnectedGraph, ['D'])).toEqual(desired);
  });

  it('Should execute on a subset of nodes, excluding the source node(s), of two disconnected graphs', () => {
    const desired = ['F', 'D'];
    expect(DFS(disconnectedGraph, ['B'], false)).toEqual(desired);
  });

  it('Should execute on all nodes of three comingled graphs', () => {
    const desired = ['E', 'D', 'C', 'B', 'A', 'F', 'H', 'G'];
    expect(DFS(comingledGraph)).toEqual(desired);
  });

  it('Should execute on all nodes, excluding the source node(s), of three comingled graphs', () => {
    const desired = ['E', 'D', 'C', 'B', 'H'];
    expect(DFS(comingledGraph, undefined, false)).toEqual(desired);
  });

  it('Should execute on a subset of nodes of three comingled graphs', () => {
    const desired = ['E', 'D', 'C', 'H', 'G'];
    expect(DFS(comingledGraph, ['G'])).toEqual(desired);
  });

  it('Should execute on a subset of nodes, excluding the source node(s), of three comingled graphs', () => {
    const desired = ['E', 'D', 'C', 'B'];
    expect(DFS(comingledGraph, ['F'], false)).toEqual(desired);
  });
});

describe('Topological sort', () => {
  it('Should execute on all nodes of a connected graph', () => {
    const desired = ['F', 'D', 'B', 'G', 'H', 'E', 'C', 'A'].reverse();
    expect(TS(singleGraph)).toEqual(desired);
  });

  it('Should execute on all nodes, excluding the source node(s), of a connected graph', () => {
    const desired = ['F', 'D', 'B', 'G', 'H', 'E', 'C'].reverse();
    expect(TS(singleGraph, undefined, false)).toEqual(desired);
  });

  it('Should execute on a starting set of nodes of a connected graph', () => {
    const desired = ['B', 'F', 'D', 'G', 'H', 'E', 'C'].reverse();
    expect(TS(singleGraph, ['C'])).toEqual(desired);
  });

  it('Should execute on a starting set of nodes, excluding source node(s), of a connected graph', () => {
    const desired = ['B', 'F', 'D', 'G', 'H', 'E'].reverse();
    expect(TS(singleGraph, ['C'], false)).toEqual(desired);
  });

  it('Should execute on all nodes of two disconnected graphs', () => {
    const desired = ['F', 'D', 'B', 'H', 'A', 'G', 'E', 'C'].reverse();
    expect(TS(disconnectedGraph)).toEqual(desired);
  });

  it('Should execute on all nodes, excluding the source node(s), of two disconnected graphs', () => {
    const desired = ['F', 'D', 'B', 'H', 'G', 'E'].reverse();
    expect(TS(disconnectedGraph, undefined, false)).toEqual(desired);
  });

  it('Should execute on a subset of nodes of two disconnected graphs', () => {
    const desired = ['B', 'F', 'D'].reverse();
    expect(TS(disconnectedGraph, ['D'])).toEqual(desired);
  });

  it('Should execute on a subset of nodes, excluding the source node(s), of two disconnected graphs', () => {
    const desired = ['F', 'D'].reverse();
    expect(TS(disconnectedGraph, ['B'], false)).toEqual(desired);
  });

  it('Should execute on all nodes of three comingled graphs', () => {
    const desired = ['E', 'D', 'C', 'B', 'A', 'F', 'H', 'G'].reverse();
    expect(TS(comingledGraph)).toEqual(desired);
  });

  it('Should execute on all nodes, excluding the source node(s), of three comingled graphs', () => {
    const desired = ['E', 'D', 'C', 'B', 'H'].reverse();
    expect(TS(comingledGraph, undefined, false)).toEqual(desired);
  });

  it('Should execute on a subset of nodes of three comingled graphs', () => {
    const desired = ['E', 'D', 'C', 'H', 'G'].reverse();
    expect(TS(comingledGraph, ['G'])).toEqual(desired);
  });

  it('Should execute on a subset of nodes, excluding the source node(s), of three comingled graphs', () => {
    const desired = ['E', 'D', 'C', 'B'].reverse();
    expect(TS(comingledGraph, ['F'], false)).toEqual(desired);
  });
});

describe("Dijkstra's Shortest Path First", () => {
  it('Should find the shortest path between two nodes', () => {
    const desired = { path: ['A', 'B', 'D', 'F'], distance: 5 };
    expect(SPF(singleGraph, 'A', 'F')).toEqual(desired);
  });

  it('Should find the shortest path between two nodes, adjusted positive weight', () => {
    const desired = { path: ['A', 'C', 'E', 'D', 'F'], distance: 8 };

    singleGraph.setEdgeWeight('B', 'D', 5);

    expect(SPF(singleGraph, 'A', 'F')).toEqual(desired);
  });

  it('Should find the shortest path between two nodes, adjusted negative weight', () => {
    const desired = { path: ['A', 'C', 'E', 'D', 'F'], distance: 4 };

    singleGraph.setEdgeWeight('E', 'D', -3);

    expect(SPF(singleGraph, 'A', 'F')).toEqual(desired);
  });

  it('Should not find a shortest path between two nodes', () => {
    expect(() => {
      SPF(singleGraph, 'D', 'H');
    }).toThrow('No path found');
  });

  it('Should not find the source node', () => {
    expect(() => {
      SPF(singleGraph, 'I', 'H');
    }).toThrow();
  });

  it('Should not find the destination node', () => {
    expect(() => {
      SPF(singleGraph, 'D', 'I');
    }).toThrow();
  });

  it('Should find the shortest path between two nodes with a filter', () => {
    const desired = { path: ['A', 'C', 'E', 'D', 'F'], distance: 8 };

    singleGraph
      .addEdge('Filter', 'A')
      .addEdge('Filter', 'C')
      .addEdge('Filter', 'E')
      .addEdge('Filter', 'D')
      .addEdge('Filter', 'F');

    expect(
      SPF(singleGraph, 'A', 'F', node => {
        if (singleGraph.adjacentTo('Filter').includes(node)) {
          return node;
        }
      })
    ).toEqual(desired);
  });

  it('Should not find the shortest path between two nodes with a filter', () => {
    singleGraph
      .addEdge('Filter', 'A')
      .addEdge('Filter', 'C')
      .addEdge('Filter', 'D')
      .addEdge('Filter', 'F');

    expect(() => {
      SPF(singleGraph, 'A', 'F', node => {
        if (singleGraph.adjacentTo('Filter').includes(node)) {
          return node;
        }
      });
    }).toThrow('No path found');
  });
});