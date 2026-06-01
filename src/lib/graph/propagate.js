import { findAllCirclesDownstream } from './traversal';

export function propagateDeadline(nodeId, delayMinutes, edges, nodes, setNodes) {
  const downstreamCircles = findAllCirclesDownstream(nodeId, edges, nodes);

  setNodes((nds) =>
    nds.map((n) => {
      if (!downstreamCircles.find((c) => c.id === n.id)) return n;
      if (!n.data.deadline) return n;

      const currentDeadline = new Date(n.data.deadline);
      const newDeadline = new Date(currentDeadline.getTime() + delayMinutes * 60 * 1000);

      return {
        ...n,
        data: {
          ...n.data,
          deadline: newDeadline.toISOString(),
          _originalDeadline: n.data._originalDeadline || n.data.deadline,
          _delayMinutes: (n.data._delayMinutes || 0) + delayMinutes,
        },
      };
    })
  );
}

export function resetDeadlines(nodeId, edges, nodes, setNodes) {
  const downstreamCircles = findAllCirclesDownstream(nodeId, edges, nodes);

  setNodes((nds) =>
    nds.map((n) => {
      if (!downstreamCircles.find((c) => c.id === n.id)) return n;
      const { _originalDeadline, _delayMinutes, ...cleanData } = n.data;
      return {
        ...n,
        data: {
          ...cleanData,
          deadline: _originalDeadline || cleanData.deadline,
        },
      };
    })
  );
}
