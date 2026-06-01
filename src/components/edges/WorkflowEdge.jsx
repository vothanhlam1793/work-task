import React, { useCallback, useEffect, useRef } from 'react';
import { BaseEdge, getSmoothStepPath, useReactFlow } from '@xyflow/react';
import './WorkflowEdge.css';

function distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

function insertWaypointIdx(points, pos) {
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < points.length - 1; i++) {
    const d = distToSegment(pos.x, pos.y, points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
    if (d < bestDist) { bestDist = d; best = i; }
  }
  return best;
}

function polylinePath(sx, sy, tx, ty, wps) {
  const pts = [{ x: sx, y: sy }, ...wps, { x: tx, y: ty }];
  return pts.reduce((d, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${d} L ${p.x} ${p.y}`), '');
}

export function WorkflowEdge({
  id, source, target,
  sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition,
  data, selected, markerEnd, style, interactionWidth,
}) {
  const { screenToFlowPosition, setEdges } = useReactFlow();
  const dragRef = useRef(null);
  const pathRef = useRef(null);
  const [smoothPath] = getSmoothStepPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
  });

  const waypoints = data?.waypoints || [];
  const edgePath = waypoints.length > 0
    ? polylinePath(sourceX, sourceY, targetX, targetY, waypoints)
    : smoothPath;

  const onWaypointDown = (index, e) => {
    e.stopPropagation();
    e.preventDefault();
    dragRef.current = { type: 'waypoint', index };
  };

  useEffect(() => {
    const move = (e) => {
      const d = dragRef.current;
      if (!d || d.type !== 'waypoint') return;
      const pos = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      setEdges(eds => eds.map(ed => {
        if (ed.id !== id) return ed;
        const wps = [...(ed.data?.waypoints || [])];
        wps[d.index] = pos;
        return { ...ed, data: { ...ed.data, waypoints: wps } };
      }));
    };
    const up = () => { dragRef.current = null; };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    window.addEventListener('mouseleave', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('mouseleave', up);
    };
  }, [id, screenToFlowPosition, setEdges]);

  const onEdgeDoubleClick = useCallback(e => {
    e.stopPropagation();
    e.preventDefault();
    const pos = screenToFlowPosition({ x: e.clientX, y: e.clientY });
    setEdges(eds => eds.map(ed => {
      if (ed.id !== id) return ed;
      const wps = [...(ed.data?.waypoints || [])];
      const pts = [
        { x: sourceX, y: sourceY }, ...wps,
        { x: targetX, y: targetY },
      ];
      wps.splice(insertWaypointIdx(pts, pos), 0, pos);
      return { ...ed, data: { ...ed.data, waypoints: wps } };
    }));
  }, [id, screenToFlowPosition, setEdges, sourceX, sourceY, targetX, targetY]);

  const onWpContextMenu = useCallback((index, e) => {
    e.preventDefault();
    e.stopPropagation();
    setEdges(eds => eds.map(ed => {
      if (ed.id !== id) return ed;
      const wps = [...(ed.data?.waypoints || [])];
      wps.splice(index, 1);
      return { ...ed, data: { ...ed.data, waypoints: wps.length ? wps : undefined } };
    }));
  }, [id, setEdges]);

  return (
    <g className="workflow-edge-group">
      {/* 1. Invisible hit area FIRST = BOTTOM layer, only for double-click */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        style={{ pointerEvents: 'stroke' }}
        onDoubleClick={onEdgeDoubleClick}
      />

      {/* 2. Visible BaseEdge MIDDLE = React Flow handles selection + interactionWidth */}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{ ...style, transition: 'stroke 0.2s, stroke-width 0.2s' }}
        className={`workflow-edge-path ${selected ? 'workflow-edge-selected' : ''}`}
        interactionWidth={interactionWidth || 24}
      />

      {/* 3. Waypoint dots TOP = draggable, always above path */}
      {selected && waypoints.map((wp, i) => (
        <circle
          key={`wp-${i}`}
          cx={wp.x} cy={wp.y}
          r={5}
          className="waypoint-dot"
          onMouseDown={e => onWaypointDown(i, e)}
          onContextMenu={e => onWpContextMenu(i, e)}
        />
      ))}

      {/* 4. Reconnect visual dots TOP = visible but React Flow handles actual reconnect */}
      {selected && (
        <>
          <circle cx={sourceX} cy={sourceY} r={6} className="reconnect-dot" />
          <circle cx={targetX} cy={targetY} r={6} className="reconnect-dot" />
        </>
      )}
    </g>
  );
}

WorkflowEdge.displayName = 'WorkflowEdge';
