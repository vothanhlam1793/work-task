import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

export const DiamondNode = memo(({ data, selected }) => {
  return (
    <div className="group w-32 h-32 relative flex items-center justify-center transition-all duration-200">
      <svg className="absolute inset-0 w-full h-full drop-shadow-md" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon
          points="50,2 98,50 50,98 2,50"
          fill="#fff7ed"
          stroke={selected ? '#f97316' : '#fdba74'}
          strokeWidth={selected ? '3' : '2'}
          className="transition-all duration-200"
        />
      </svg>

      <Handle type="target" position={Position.Top} id="top"
        className="opacity-0 group-hover:opacity-100 transition-opacity !w-2.5 !h-2.5 !bg-orange-500 hover:!bg-orange-400 !border !border-white cursor-crosshair" />
      <Handle type="target" position={Position.Left} id="left"
        className="opacity-0 group-hover:opacity-100 transition-opacity !w-2.5 !h-2.5 !bg-orange-500 hover:!bg-orange-400 !border !border-white cursor-crosshair" />
      <Handle type="source" position={Position.Right} id="right"
        className="opacity-0 group-hover:opacity-100 transition-opacity !w-2.5 !h-2.5 !bg-orange-600 hover:!bg-orange-500 !border !border-white cursor-crosshair" />
      <Handle type="source" position={Position.Bottom} id="bottom"
        className="opacity-0 group-hover:opacity-100 transition-opacity !w-2.5 !h-2.5 !bg-orange-600 hover:!bg-orange-500 !border !border-white cursor-crosshair" />

      <div className="relative z-10 text-center p-4 max-w-[85%]">
        <div className="text-[9px] font-bold uppercase tracking-wider text-orange-600 mb-0.5">Rẽ nhánh</div>
        <div className="text-xs font-semibold text-orange-950 leading-tight break-words max-h-16 overflow-hidden">
          {data.label || 'Điều kiện?'}
        </div>
      </div>
    </div>
  );
});

DiamondNode.displayName = 'DiamondNode';
