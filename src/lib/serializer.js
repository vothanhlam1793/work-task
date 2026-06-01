export function serializeWorkflow(nodes, edges, name = 'Untitled') {
  return {
    id: crypto.randomUUID?.() || `wf_${Date.now()}`,
    name,
    is_template: false,
    parent_node_id: null,
    nodes: nodes.map((n) => ({
      id: n.id,
      type: n.type?.replace('workflow', '') || n.type,
      label: n.data?.label || '',
      position_x: n.position.x,
      position_y: n.position.y,
      mode: n.data?.mode,
      status: n.data?.status,
      priority: n.data?.priority,
      assignee: n.data?.assignee,
      progress: n.data?.progress,
      deadline: n.data?.deadline || null,
      child_workflow_id: n.data?.childWorkflowId || null,
      metadata: {
        smart_specific: n.data?.smart_specific,
        smart_measurable: n.data?.smart_measurable,
        smart_achievable: n.data?.smart_achievable,
        smart_relevant: n.data?.smart_relevant,
        smart_timebound: n.data?.smart_timebound,
        condition: n.data?.condition,
      },
    })),
    edges: edges.map((e) => ({
      id: e.id,
      source_node_id: e.source,
      target_node_id: e.target,
      source_handle: e.sourceHandle || '',
      target_handle: e.targetHandle || '',
      data: e.data || {},
    })),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export function deserializeWorkflow(workflow) {
  const nodes = (workflow.nodes || []).map((n) => ({
    id: n.id,
    type: `workflow${n.type.charAt(0).toUpperCase() + n.type.slice(1)}`,
    position: { x: n.position_x, y: n.position_y },
    data: {
      label: n.label || '',
      mode: n.mode,
      status: n.status,
      priority: n.priority,
      assignee: n.assignee,
      progress: n.progress,
      deadline: n.deadline,
      childWorkflowId: n.child_workflow_id,
      smart_specific: n.metadata?.smart_specific,
      smart_measurable: n.metadata?.smart_measurable,
      smart_achievable: n.metadata?.smart_achievable,
      smart_relevant: n.metadata?.smart_relevant,
      smart_timebound: n.metadata?.smart_timebound,
      condition: n.metadata?.condition,
    },
  }));

  const edges = (workflow.edges || []).map((e) => ({
    id: e.id,
    source: e.source_node_id,
    target: e.target_node_id,
    sourceHandle: e.source_handle || undefined,
    targetHandle: e.target_handle || undefined,
    type: 'workflowEdge',
    style: { strokeWidth: 2, stroke: '#64748b' },
    markerEnd: { type: 'arrowclosed', width: 20, height: 20, color: '#64748b' },
    data: e.data || {},
  }));

  return { nodes, edges, name: workflow.name };
}
