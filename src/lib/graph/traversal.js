export function getDownstreamNodes(nodeId, edges, nodes) {
  const visited = new Set();
  const result = [];
  const queue = [nodeId];

  while (queue.length > 0) {
    const current = queue.shift();
    if (visited.has(current)) continue;
    visited.add(current);

    const outEdges = edges.filter((e) => e.source === current);
    for (const edge of outEdges) {
      const targetNode = nodes.find((n) => n.id === edge.target);
      if (targetNode && !visited.has(targetNode.id)) {
        result.push(targetNode);
        queue.push(targetNode.id);
      }
    }
  }

  return result;
}

export function getUpstreamNodes(nodeId, edges, nodes) {
  const visited = new Set();
  const result = [];
  const queue = [nodeId];

  while (queue.length > 0) {
    const current = queue.shift();
    if (visited.has(current)) continue;
    visited.add(current);

    const inEdges = edges.filter((e) => e.target === current);
    for (const edge of inEdges) {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      if (sourceNode && !visited.has(sourceNode.id)) {
        result.push(sourceNode);
        queue.push(sourceNode.id);
      }
    }
  }

  return result;
}

export function findAllCirclesDownstream(circleNodeId, edges, nodes) {
  const downstream = getDownstreamNodes(circleNodeId, edges, nodes);
  return downstream.filter((n) => n.type === 'workflowCircle');
}
