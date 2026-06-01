import React, { useCallback, useEffect, useRef } from 'react';
import { BaseEdge, getSmoothStepPath, useReactFlow } from '@xyflow/react';
import './WorkflowEdge.css';

function distanceToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

function insertWaypoint(points, clickPos) {
  let bestIdx = 0;
  let bestDist = Infinity;
  for (let i = 0; i < points.length - 1; i++) {
    const d = distanceToSegment(
      clickPos.x, clickPos.y,
      points[i].x, points[i].y,
      points[i + 1].x, points[i + 1].y
    );
    if (d < bestDist) {
      bestDist = d;
      bestIdx = i;
    }
  }
  return bestIdx;
}

function buildPolylinePath(sourceX, sourceY, targetX, targetY, waypoints) {
  const pts = [{ x: sourceX, y: sourceY }, ...waypoints, { x: targetX, y: targetY }];
  return pts.reduce((d, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${d} L ${p.x} ${p.y}`), '');
}

export function WorkflowEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
  markerEnd,
  style,
  interactionWidth,
}) {
  const { screenToFlowPosition, setEdges } = useReactFlow();
  const draggingRef = useRef(null);

  const waypoints = data?.waypoints || [];

  const [smoothPath] = getSmoothStepPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
  });

  const edgePath = waypoints.length > 0
    ? buildPolylinePath(sourceX, sourceY, targetX, targetY, waypoints)
    : smoothPath;

  const onWaypointMouseDown = useCallback((index, e) => {
    e.stopPropagation();
    e.preventDefault();
    draggingRef.current = index;
  }, []);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (draggingRef.current === null) return;
      const pos = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      setEdges((eds) =>
        eds.map((ed) => {
          if (ed.id !== id) return ed;
          const wps = [...(ed.data?.waypoints || [])];
          wps[draggingRef.current] = pos;
          return { ...ed, data: { ...ed.data, waypoints: wps } };
        })
      );
    };

    const onMouseUp = () => {
      draggingRef.current = null;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [id, screenToFlowPosition, setEdges]);

  const onEdgeDoubleClick = useCallback(
    (e) => {
      e.stopPropagation();
      const pos = screenToFlowPosition({ x: e.clientX, y: e.clientY });

      setEdges((eds) =>
        eds.map((ed) => {
          if (ed.id !== id) return ed;
          const wps = [...(ed.data?.waypoints || [])];
          const pts = [
            { x: sourceX, y: sourceY },
            ...wps,
            { x: targetX, y: targetY },
          ];
          const idx = insertWaypoint(pts, pos);
          wps.splice(idx, 0, pos);
          return { ...ed, data: { ...ed.data, waypoints: wps } };
        })
      );
    },
    [id, screenToFlowPosition, setEdges, sourceX, sourceY, targetX, targetY]
  );

  const onWaypointContextMenu = useCallback(
    (index, e) => {
      e.preventDefault();
      e.stopPropagation();
      setEdges((eds) =>
        eds.map((ed) => {
          if (ed.id !== id) return ed;
          const wps = [...(ed.data?.waypoints || [])];
          wps.splice(index, 1);
          return { ...ed, data: { ...ed.data, waypoints: wps } };
        })
      );
    },
    [id, setEdges]
  );

  const onReconnectStart = useCallback(
    (handleType, e) => {
      e.stopPropagation();
      e.preventDefault();
      draggingRef.current = handleType === 'source' ? 'reconnect-source' : 'reconnect-target';
    },
    []
  );

  return (
    <g className="workflow-edge-group">
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          transition: 'stroke 0.2s, stroke-width 0.2s',
        }}
        className={`workflow-edge-path ${selected ? 'workflow-edge-selected' : ''}`}
        interactionWidth={interactionWidth || 24}
      />

      {selected && waypoints.map((wp, i) => (
        <circle
          key={`wp-${i}`}
          cx={wp.x}
          cy={wp.y}
          r={5}
          className="waypoint-dot"
          onMouseDown={(e) => onWaypointMouseDown(i, e)}
          onContextMenu={(e) => onWaypointContextMenu(i, e)}
        />
      ))}

      {selected && (
        <>
          <circle
            cx={sourceX}
            cy={sourceY}
            r={6}
            className="reconnect-dot"
            onMouseDown={(e) => onReconnectStart('source', e)}
          />
          <circle
            cx={targetX}
            cy={targetY}
            r={6}
            className="reconnect-dot"
            onMouseDown={(e) => onReconnectStart('target', e)}
          />
        </>
      )}

      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        style={{ pointerEvents: 'all' }}
        onDoubleClick={onEdgeDoubleClick}
      />
    </g>
  );
}

WorkflowEdge.displayName = 'WorkflowEdge';
