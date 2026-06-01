import { describe, expect, it, vi } from 'vitest';
import { propagateDeadline, resetDeadlines } from '../../../src/lib/graph/propagate';

const nodes = [
  { id: 'start', type: 'workflowCircle', data: { deadline: '2026-06-01T08:00' } },
  { id: 'task', type: 'workflowRect', data: {} },
  { id: 'goal-a', type: 'workflowCircle', data: { deadline: '2026-06-02T09:00' } },
  { id: 'goal-b', type: 'workflowCircle', data: { deadline: '2026-06-03T10:30' } },
  { id: 'no-deadline', type: 'workflowCircle', data: {} },
];

const edges = [
  { source: 'start', target: 'task' },
  { source: 'task', target: 'goal-a' },
  { source: 'goal-a', target: 'goal-b' },
  { source: 'task', target: 'no-deadline' },
];

function runNodeUpdater(callback, currentNodes = nodes) {
  let updatedNodes = null;
  const setNodes = vi.fn((updater) => {
    updatedNodes = updater(currentNodes);
  });

  callback(setNodes);

  return { setNodes, updatedNodes };
}

describe('deadline propagation helpers', () => {
  it('pushes deadlines forward only for downstream circles with an existing deadline', () => {
    const { setNodes, updatedNodes } = runNodeUpdater((setNodesSpy) => {
      propagateDeadline('task', 90, edges, nodes, setNodesSpy);
    });

    expect(setNodes).toHaveBeenCalledTimes(1);
    const goalA = updatedNodes.find((n) => n.id === 'goal-a').data;
    const goalB = updatedNodes.find((n) => n.id === 'goal-b').data;
    const expectedGoalADeadline = new Date(new Date('2026-06-02T09:00').getTime() + 90 * 60 * 1000).toISOString().slice(0, 16);
    const expectedGoalBDeadline = new Date(new Date('2026-06-03T10:30').getTime() + 90 * 60 * 1000).toISOString().slice(0, 16);

    expect(goalA._originalDeadline).toBe('2026-06-02T09:00');
    expect(goalA._delayMinutes).toBe(90);
    expect(goalB._originalDeadline).toBe('2026-06-03T10:30');
    expect(goalB._delayMinutes).toBe(90);
    expect(goalA.deadline).toBe(expectedGoalADeadline);
    expect(goalB.deadline).toBe(expectedGoalBDeadline);
    expect(updatedNodes.find((n) => n.id === 'no-deadline').data).toEqual({});
  });

  it('removes temporary propagation metadata during reset', () => {
    const currentNodes = [
      ...nodes.map((node) => {
        if (node.id === 'goal-a') {
          return { ...node, data: { ...node.data, _originalDeadline: '2026-06-02T09:00', _delayMinutes: 90 } };
        }
        return node;
      }),
    ];

    const { updatedNodes } = runNodeUpdater((setNodesSpy) => {
      resetDeadlines('task', edges, currentNodes, setNodesSpy);
    }, currentNodes);

    expect(updatedNodes.find((n) => n.id === 'goal-a').data).toEqual({
      deadline: '2026-06-02T09:00',
    });
  });
});
