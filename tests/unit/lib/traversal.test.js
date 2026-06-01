import { describe, expect, it } from 'vitest';
import {
  findAllCirclesDownstream,
  getDownstreamNodes,
  getUpstreamNodes,
} from '../../../src/lib/graph/traversal';

const nodes = [
  { id: 'n1', type: 'workflowCircle' },
  { id: 'n2', type: 'workflowRect' },
  { id: 'n3', type: 'workflowCircle' },
  { id: 'n4', type: 'workflowDiamond' },
  { id: 'n5', type: 'workflowCircle' },
  { id: 'n6', type: 'workflowRect' },
];

const edges = [
  { source: 'n1', target: 'n2' },
  { source: 'n2', target: 'n3' },
  { source: 'n3', target: 'n4' },
  { source: 'n4', target: 'n5' },
  { source: 'n5', target: 'n2' },
  { source: 'n4', target: 'n6' },
];

describe('graph traversal helpers', () => {
  it('returns downstream nodes in breadth-first discovery order without looping forever', () => {
    const result = getDownstreamNodes('n1', edges, nodes);

    expect(result.map((node) => node.id)).toEqual(['n2', 'n3', 'n4', 'n5', 'n6']);
  });

  it('returns upstream nodes in breadth-first discovery order without duplicates', () => {
    const result = getUpstreamNodes('n5', edges, nodes);

    expect(result.map((node) => node.id)).toEqual(['n4', 'n3', 'n2', 'n1']);
  });

  it('filters only circle nodes downstream', () => {
    const result = findAllCirclesDownstream('n1', edges, nodes);

    expect(result.map((node) => node.id)).toEqual(['n3', 'n5']);
  });
});
