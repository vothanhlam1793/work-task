import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { deserializeWorkflow, serializeWorkflow } from '../../../src/lib/serializer';

describe('serializeWorkflow', () => {
  const nodes = [
    {
      id: 'n1',
      type: 'workflowCircle',
      position: { x: 100, y: 200 },
      data: {
        label: 'Goal',
        deadline: '2026-06-15T18:00',
        smart_specific: 'Specific',
        smart_measurable: 'KPI',
      },
    },
    {
      id: 'n2',
      type: 'workflowRect',
      position: { x: 120, y: 320 },
      data: {
        label: 'Task',
        mode: 'delegate',
        status: 'running',
        priority: 'high',
        assignee: 'Huy',
        progress: 45,
      },
    },
  ];

  const edges = [
    {
      id: 'e1-2',
      source: 'n1',
      target: 'n2',
      sourceHandle: 'bottom',
      targetHandle: 'top',
      data: { waypoints: [{ x: 1, y: 2 }] },
    },
  ];

  beforeEach(() => {
    vi.stubGlobal('crypto', {
      randomUUID: vi.fn(() => 'wf-fixed-id'),
    });
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-31T10:00:00.000Z'));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('serializes workflow nodes and edges into persistence format', () => {
    const result = serializeWorkflow(nodes, edges, 'My Workflow');

    expect(result).toMatchObject({
      id: 'wf-fixed-id',
      name: 'My Workflow',
      is_template: false,
      parent_node_id: null,
      nodes: [
        {
          id: 'n1',
          type: 'Circle',
          label: 'Goal',
          position_x: 100,
          position_y: 200,
          deadline: '2026-06-15T18:00',
          metadata: {
            smart_specific: 'Specific',
            smart_measurable: 'KPI',
          },
        },
        {
          id: 'n2',
          type: 'Rect',
          mode: 'delegate',
          status: 'running',
          priority: 'high',
          assignee: 'Huy',
          progress: 45,
        },
      ],
      edges: [
        {
          id: 'e1-2',
          source_node_id: 'n1',
          target_node_id: 'n2',
          source_handle: 'bottom',
          target_handle: 'top',
          data: { waypoints: [{ x: 1, y: 2 }] },
        },
      ],
      created_at: '2026-05-31T10:00:00.000Z',
      updated_at: '2026-05-31T10:00:00.000Z',
    });
  });

  it('falls back safely when optional node data is missing', () => {
    const result = serializeWorkflow([
      { id: 'n3', type: 'workflowDiamond', position: { x: 0, y: 0 }, data: {} },
    ], [], undefined);

    expect(result.name).toBe('Untitled');
    expect(result.nodes[0]).toMatchObject({
      type: 'Diamond',
      label: '',
      deadline: null,
      child_workflow_id: null,
    });
  });
});

describe('deserializeWorkflow', () => {
  it('deserializes persisted workflow data back into canvas state', () => {
    const workflow = {
      name: 'Workflow A',
      nodes: [
        {
          id: 'n1',
          type: 'circle',
          label: 'Target',
          position_x: 11,
          position_y: 22,
          deadline: '2026-06-10T08:00',
          metadata: {
            smart_specific: 'S',
            smart_measurable: 'M',
            condition: 'unused',
          },
        },
      ],
      edges: [
        {
          id: 'e1',
          source_node_id: 'n1',
          target_node_id: 'n2',
          source_handle: 'right',
          target_handle: 'left',
          data: { label: 'Yes' },
        },
      ],
    };

    const result = deserializeWorkflow(workflow);

    expect(result.name).toBe('Workflow A');
    expect(result.nodes[0]).toEqual({
      id: 'n1',
      type: 'workflowCircle',
      position: { x: 11, y: 22 },
      data: {
        label: 'Target',
        mode: undefined,
        status: undefined,
        priority: undefined,
        assignee: undefined,
        progress: undefined,
        deadline: '2026-06-10T08:00',
        childWorkflowId: undefined,
        smart_specific: 'S',
        smart_measurable: 'M',
        smart_achievable: undefined,
        smart_relevant: undefined,
        smart_timebound: undefined,
        condition: 'unused',
      },
    });

    expect(result.edges[0]).toMatchObject({
      id: 'e1',
      source: 'n1',
      target: 'n2',
      sourceHandle: 'right',
      targetHandle: 'left',
      type: 'workflowEdge',
      data: { label: 'Yes' },
    });
  });

  it('omits empty handles during deserialization', () => {
    const result = deserializeWorkflow({
      name: 'Workflow B',
      nodes: [],
      edges: [{ id: 'e2', source_node_id: 'a', target_node_id: 'b', source_handle: '', target_handle: '', data: {} }],
    });

    expect(result.edges[0].sourceHandle).toBeUndefined();
    expect(result.edges[0].targetHandle).toBeUndefined();
  });
});
