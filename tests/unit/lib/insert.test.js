import { describe, expect, it, vi } from 'vitest';
import { insertNodeBetween } from '../../../src/lib/graph/insert';

function applyEdgeUpdate(edges, invokeInsert) {
  let updatedEdges = null;
  const setEdges = vi.fn((updater) => {
    updatedEdges = updater(edges);
  });

  invokeInsert(setEdges);

  return { setEdges, updatedEdges };
}

describe('insertNodeBetween', () => {
  it('splits an exact matching edge into two edges around the inserted node', () => {
    const edges = [
      { id: 'e1', source: 'a', target: 'b', sourceHandle: 'bottom', targetHandle: 'top', type: 'workflowEdge' },
    ];

    const { updatedEdges } = applyEdgeUpdate(edges, (setEdges) => {
      insertNodeBetween('a', 'b', 'x', edges, setEdges);
    });

    expect(updatedEdges).toHaveLength(2);
    expect(updatedEdges[0]).toMatchObject({ source: 'a', target: 'x', sourceHandle: 'bottom', targetHandle: 'top' });
    expect(updatedEdges[1]).toMatchObject({ source: 'x', target: 'b', sourceHandle: 'bottom', targetHandle: 'top' });
    expect(updatedEdges[0].id).not.toBe('e1');
    expect(updatedEdges[1].id).not.toBe('e1');
  });

  it('falls back to the first outgoing edge when exact edge is absent', () => {
    const edges = [
      { id: 'e1', source: 'a', target: 'b', sourceHandle: 'right', targetHandle: 'left' },
      { id: 'e2', source: 'c', target: 'd', sourceHandle: 'bottom', targetHandle: 'top' },
    ];

    const { updatedEdges } = applyEdgeUpdate(edges, (setEdges) => {
      insertNodeBetween('a', 'missing', 'x', edges, setEdges);
    });

    expect(updatedEdges).toHaveLength(3);
    expect(updatedEdges.filter((edge) => edge.source === 'a' || edge.target === 'b').length).toBe(2);
    expect(updatedEdges.find((edge) => edge.id === 'e2')).toBeTruthy();
  });

  it('does nothing when there is no exact edge and no fallback outgoing edge', () => {
    const edges = [{ id: 'e1', source: 'c', target: 'd' }];
    const setEdges = vi.fn();

    insertNodeBetween('a', 'b', 'x', edges, setEdges);

    expect(setEdges).not.toHaveBeenCalled();
  });
});
