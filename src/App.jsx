import React, { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  MarkerType,
  ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Sidebar } from './components/Sidebar';
import { CircleNode } from './components/nodes/CircleNode';
import { RectNode } from './components/nodes/RectNode';
import { DiamondNode } from './components/nodes/DiamondNode';
import { WorkflowEdge } from './components/edges/WorkflowEdge';
import { NodeEditor } from './components/NodeEditor';
import { Save, RefreshCw } from 'lucide-react';

const nodeTypes = {
  workflowCircle: CircleNode,
  workflowRect: RectNode,
  workflowDiamond: DiamondNode,
};

const edgeTypes = {
  workflowEdge: WorkflowEdge,
};

const initialNodes = [
  { id: 'n1', type: 'workflowCircle', position: { x: 150, y: 100 }, data: { label: 'Yêu cầu hoàn long', deadline: '2026-06-15T18:00' } },
  { id: 'n2', type: 'workflowRect', position: { x: 120, y: 280 }, data: { label: 'Kiểm tra hệ thống', mode: 'solo', status: 'running', priority: 'high' } },
  { id: 'n3', type: 'workflowCircle', position: { x: 150, y: 420 }, data: { label: 'Có thông tin kiểm tra sơ bộ' } },
  { id: 'n4', type: 'workflowRect', position: { x: 120, y: 600 }, data: { label: 'Xử lý hệ thống', mode: 'delegate', status: 'pending', priority: 'normal', assignee: 'Huy', progress: 30 } },
  { id: 'n5', type: 'workflowCircle', position: { x: 150, y: 740 }, data: { label: 'DONE - chuyển giao test', deadline: '2026-06-20T18:00' } },
  { id: 'n6', type: 'workflowRect', position: { x: 120, y: 920 }, data: { label: 'Test hệ thống', mode: 'scheduled', status: 'pending', priority: 'normal' } },
];

const defaultEdgeOptions = {
  type: 'workflowEdge',
  style: { strokeWidth: 2, stroke: '#64748b' },
  interactionWidth: 24,
  selectable: true,
  focusable: true,
  reconnectable: true,
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: '#64748b',
  },
};

const initialEdges = [
  { id: 'e1-2', source: 'n1', target: 'n2', sourceHandle: 'bottom', targetHandle: 'top', ...defaultEdgeOptions },
  { id: 'e2-3', source: 'n2', target: 'n3', sourceHandle: 'bottom', targetHandle: 'top', ...defaultEdgeOptions },
  { id: 'e3-4', source: 'n3', target: 'n4', sourceHandle: 'bottom', targetHandle: 'top', ...defaultEdgeOptions },
  { id: 'e4-5', source: 'n4', target: 'n5', sourceHandle: 'bottom', targetHandle: 'top', ...defaultEdgeOptions },
  { id: 'e5-6', source: 'n5', target: 'n6', sourceHandle: 'bottom', targetHandle: 'top', ...defaultEdgeOptions },
];

let idCounter = 0;
const getUniqueId = () => `node_${Date.now()}_${idCounter++}`;

const WorkflowDashboard = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const [editingNode, setEditingNode] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({
      ...params,
      ...defaultEdgeOptions,
      style: { strokeWidth: 2, stroke: '#3b82f6' },
      markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: '#3b82f6' },
    }, eds)),
    [setEdges]
  );

  const onReconnect = useCallback(
    (oldEdge, newConnection) => {
      setEdges((eds) =>
        eds.map((ed) =>
          ed.id === oldEdge.id
            ? { ...ed, source: newConnection.source, target: newConnection.target, sourceHandle: newConnection.sourceHandle, targetHandle: newConnection.targetHandle }
            : ed
        )
      );
    },
    [setEdges]
  );

  const onReconnectStart = useCallback((event, edge, handleType) => {
    console.log('[Reconnect start]', edge.id, handleType);
  }, []);

  const onReconnectEnd = useCallback((event, edge, handleType, didDrop) => {
    console.log('[Reconnect end]', edge.id, handleType, 'dropped:', didDrop);
  }, []);

  const onEdgeClick = useCallback((event, edge) => {
    console.log('[Edge clicked]', edge.id, edge.selected);
  }, []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: getUniqueId(),
        type,
        position,
        data: { label: 'Khối mới' },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onNodeDoubleClick = useCallback((event, node) => {
    setEditingNode({ ...node });
  }, []);

  const handleNodeSave = useCallback(
    (newData) => {
      if (!editingNode) return;
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === editingNode.id) {
            return { ...n, data: { ...n.data, ...newData } };
          }
          return n;
        })
      );
      setEditingNode(null);
    },
    [editingNode, setNodes]
  );

  const exportFlowData = () => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      console.log('--- WORKFLOW EXPORT ---', JSON.stringify(flow, null, 2));
      alert('Đã lưu cấu trúc luồng. Kiểm tra console.');

      if (window.parent !== window) {
        window.parent.postMessage({ type: 'WORKFLOW_SAVE', payload: flow }, '*');
      }
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-950 font-sans antialiased overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full relative" ref={reactFlowWrapper}>
        <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between z-10">
          <div>
            <h1 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Trình thiết kế luồng quy trình hệ thống
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setNodes(initialNodes); setEdges(initialEdges); }}
              className="flex items-center gap-1.5 px-3 h-9 text-xs font-semibold text-slate-400 bg-slate-800 hover:bg-slate-700 hover:text-slate-200 rounded-lg transition-all border border-slate-700/50"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Khôi phục luồng mẫu
            </button>
            <button
              onClick={exportFlowData}
              className="flex items-center gap-1.5 px-4 h-9 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-lg shadow-blue-500/10 transition-all active:scale-95"
            >
              <Save className="w-3.5 h-3.5" /> Lưu quy trình
            </button>
          </div>
        </header>

        <div className="flex-1 w-full h-full bg-slate-900">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onReconnect={onReconnect}
            onReconnectStart={onReconnectStart}
            onReconnectEnd={onReconnectEnd}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeDoubleClick={onNodeDoubleClick}
            onEdgeClick={onEdgeClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            connectionMode={ConnectionMode.Loose}
            elevateEdgesOnSelect
            edgesReconnectable
            defaultEdgeOptions={defaultEdgeOptions}
            fitView
            minZoom={0.2}
            maxZoom={2}
          >
            <Controls className="!bg-slate-800 !border-slate-700 !fill-slate-300" />
            <MiniMap
              nodeColor={(n) => {
                if (n.type === 'workflowCircle') return '#10b981';
                if (n.type === 'workflowRect') return '#0284c7';
                if (n.type === 'workflowDiamond') return '#f97316';
                return '#cbd5e1';
              }}
              maskColor="rgba(15, 23, 42, 0.7)"
              className="!bg-slate-800 !border-slate-700 !rounded-lg"
            />
            <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#334155" />
          </ReactFlow>
        </div>
      </div>

      {editingNode && (
        <NodeEditor
          node={editingNode}
          onSave={handleNodeSave}
          onClose={() => setEditingNode(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <ReactFlowProvider>
      <WorkflowDashboard />
    </ReactFlowProvider>
  );
}
