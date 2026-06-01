import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { User, Clock, Calendar, AlertTriangle } from 'lucide-react';

const MODE_COLORS = {
  solo: {
    bg: 'bg-sky-50', border: 'border-sky-300', selectedBorder: 'border-sky-500', ring: 'ring-sky-100',
    accent: 'text-sky-600', label: 'Tự làm', dot: 'bg-sky-400',
  },
  delegate: {
    bg: 'bg-purple-50', border: 'border-purple-300', selectedBorder: 'border-purple-500', ring: 'ring-purple-100',
    accent: 'text-purple-600', label: 'Giao việc', dot: 'bg-purple-400',
  },
  scheduled: {
    bg: 'bg-slate-100', border: 'border-slate-300', selectedBorder: 'border-slate-500', ring: 'ring-slate-100',
    accent: 'text-slate-500', label: 'Chờ lịch', dot: 'bg-slate-400',
  },
};

const STATUS_ANIMATION = {
  running: 'animate-border-flow',
  waiting: 'animate-pulse',
  failed: 'animate-shake',
};

const PRIORITY_BADGE = {
  high: 'bg-amber-500 text-white',
  critical: 'bg-red-500 text-white animate-pulse',
};

export const RectNode = memo(({ data, selected }) => {
  const mode = data.mode || 'solo';
  const status = data.status || 'pending';
  const priority = data.priority || 'normal';
  const colors = MODE_COLORS[mode] || MODE_COLORS.solo;
  const animClass = STATUS_ANIMATION[status] || '';
  const isDone = status === 'done';
  const isCancelled = status === 'cancelled';
  const isFrozen = mode === 'scheduled' && status === 'pending';

  return (
    <div
      className={`group w-52 min-h-[90px] ${colors.bg} text-sky-900 border-2 rounded-xl flex flex-col justify-between p-3.5 shadow-md transition-all duration-200 ${isFrozen ? 'opacity-50' : ''} ${isDone ? 'opacity-80' : ''} ${isCancelled ? 'opacity-50 line-through' : ''} ${
        selected ? `${colors.selectedBorder} ring-4 ring-offset-2 ${colors.ring} scale-105` : colors.border
      } ${animClass}`}
    >
      <Handle type="target" position={Position.Top} id="top"
        className="opacity-0 group-hover:opacity-100 transition-opacity !w-3 !h-3 !bg-sky-600 hover:!bg-sky-400 !border-2 !border-white cursor-crosshair" />
      <Handle type="source" position={Position.Right} id="right"
        className="opacity-0 group-hover:opacity-100 transition-opacity !w-3 !h-3 !bg-sky-600 hover:!bg-sky-400 !border-2 !border-white cursor-crosshair" />
      <Handle type="source" position={Position.Bottom} id="bottom"
        className="opacity-0 group-hover:opacity-100 transition-opacity !w-3 !h-3 !bg-sky-600 hover:!bg-sky-400 !border-2 !border-white cursor-crosshair" />
      <Handle type="target" position={Position.Left} id="left"
        className="opacity-0 group-hover:opacity-100 transition-opacity !w-3 !h-3 !bg-sky-600 hover:!bg-sky-400 !border-2 !border-white cursor-crosshair" />

      <div className="flex items-center justify-between border-b border-black/10 pb-1 mb-2">
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
          <span className="text-[9px] font-bold uppercase tracking-wider opacity-70">{colors.label}</span>
        </div>
        <div className="flex items-center gap-1">
          {priority !== 'normal' && (
            <span className={`text-[8px] font-bold px-1 py-0.5 rounded ${PRIORITY_BADGE[priority] || ''}`}>
              {priority === 'critical' ? '!' : '!'}
            </span>
          )}
          {mode === 'delegate' && <User className="w-3 h-3 text-purple-600" />}
          {mode === 'scheduled' && <Calendar className="w-3 h-3 text-slate-500" />}
          {status === 'waiting' && <AlertTriangle className="w-3 h-3 text-amber-600" />}
          {status === 'done' && (
            <svg className="w-3 h-3 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
      </div>

      <div className="text-xs font-semibold leading-normal break-words flex-1 mb-2">
        {data.label || 'Tên việc cần làm...'}
      </div>

      <div className="flex items-center justify-between text-[10px] opacity-70 mt-auto pt-1 border-t border-black/10">
        <span className="flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" /> {data.deadline || 'Không hạn'}
        </span>

        {data.assignee && (
          <span className="px-1.5 py-0.5 bg-black/10 rounded font-bold text-[9px] uppercase">
            {data.assignee}
          </span>
        )}
      </div>

      {mode === 'delegate' && data.progress !== undefined && (
        <div className="mt-1.5 w-full h-1.5 bg-purple-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, data.progress))}%` }}
          />
        </div>
      )}
    </div>
  );
});

RectNode.displayName = 'RectNode';
