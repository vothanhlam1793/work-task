import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Clock, AlertTriangle } from 'lucide-react';

export const CircleNode = memo(({ data, selected }) => {
  const hasDeadline = !!data.deadline;
  const isOverdue = hasDeadline && new Date(data.deadline) < new Date();

  return (
    <div
      className={`group w-32 h-32 rounded-full border-2 flex flex-col items-center justify-center p-3 text-center shadow-md transition-all duration-200 ${
        !hasDeadline || isOverdue
          ? 'bg-red-50 text-red-900 border-red-300'
          : 'bg-emerald-50 text-emerald-900 border-emerald-300'
      } ${
        selected
          ? (!hasDeadline || isOverdue ? 'border-red-500 ring-4 ring-red-100' : 'border-emerald-500 ring-4 ring-emerald-100') + ' scale-105'
          : ''
      }`}
    >
      <Handle type="target" position={Position.Top} id="top"
        className="opacity-0 group-hover:opacity-100 transition-opacity !w-3 !h-3 !bg-emerald-600 hover:!bg-emerald-400 !border-2 !border-white cursor-crosshair" />
      <Handle type="source" position={Position.Right} id="right"
        className="opacity-0 group-hover:opacity-100 transition-opacity !w-3 !h-3 !bg-emerald-600 hover:!bg-emerald-400 !border-2 !border-white cursor-crosshair" />
      <Handle type="source" position={Position.Bottom} id="bottom"
        className="opacity-0 group-hover:opacity-100 transition-opacity !w-3 !h-3 !bg-emerald-600 hover:!bg-emerald-400 !border-2 !border-white cursor-crosshair" />
      <Handle type="target" position={Position.Left} id="left"
        className="opacity-0 group-hover:opacity-100 transition-opacity !w-3 !h-3 !bg-emerald-600 hover:!bg-emerald-400 !border-2 !border-white cursor-crosshair" />

      <div className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-60">Mục tiêu</div>
      <div className="text-xs font-bold leading-tight break-words overflow-hidden max-h-12">
        {data.label || 'GOAL'}
      </div>

      <div className="flex items-center gap-1 mt-1 text-[10px]">
        {hasDeadline ? (
          <span className={`flex items-center gap-0.5 ${isOverdue ? 'text-red-700 animate-pulse' : 'opacity-60'}`}>
            <Clock className="w-2.5 h-2.5" />
            {new Date(data.deadline).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
          </span>
        ) : (
          <span className="text-red-600 flex items-center gap-0.5 font-bold animate-pulse">
            <AlertTriangle className="w-2.5 h-2.5" /> Cần hạn chót
          </span>
        )}
      </div>
    </div>
  );
});

CircleNode.displayName = 'CircleNode';
