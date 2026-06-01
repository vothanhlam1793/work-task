let edgeIdCounter = 0;
const newEdgeId = () => `edge_auto_${Date.now()}_${edgeIdCounter++}`;

export function insertNodeBetween(sourceNodeId, targetNodeId, newNodeId, edges, setEdges) {
  const existingEdge = edges.find(
    (e) => e.source === sourceNodeId && e.target === targetNodeId
  );

  if (!existingEdge) {
    const fallbackEdges = edges.filter(
      (e) => e.source === sourceNodeId
    );
    if (fallbackEdges.length > 0) {
      const edge = fallbackEdges[0];
      setEdges((eds) => {
        const filtered = eds.filter((e) => e.id !== edge.id);
        return [
          ...filtered,
          { ...edge, id: newEdgeId(), source: sourceNodeId, target: newNodeId, sourceHandle: edge.sourceHandle, targetHandle: 'top' },
          { ...edge, id: newEdgeId(), source: newNodeId, target: edge.target, sourceHandle: 'bottom', targetHandle: edge.targetHandle },
        ];
      });
    }
    return;
  }

  setEdges((eds) => {
    const filtered = eds.filter((e) => e.id !== existingEdge.id);
    return [
      ...filtered,
      {
        ...existingEdge,
        id: newEdgeId(),
        source: sourceNodeId,
        target: newNodeId,
        sourceHandle: existingEdge.sourceHandle || 'bottom',
        targetHandle: 'top',
      },
      {
        ...existingEdge,
        id: newEdgeId(),
        source: newNodeId,
        target: targetNodeId,
        sourceHandle: 'bottom',
        targetHandle: existingEdge.targetHandle || 'top',
      },
    ];
  });
}
