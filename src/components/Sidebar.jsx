import React from 'react';
import { PlayCircle, Square, Layers, Info } from 'lucide-react';

export const Sidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-80 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between text-white select-none" data-testid="workflow-sidebar">
      <div>
        <div className="mb-6">
          <h2 className="text-lg font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            Hộp Công Cụ Khối
          </h2>
          <p className="text-xs text-slate-400 mt-1">Kéo các khối dưới đây vào màn hình canvas bên phải để thiết kế luồng.</p>
        </div>

        <div className="space-y-4">
          <div
            data-testid="sidebar-node-workflowCircle"
            className="flex items-center gap-3 p-4 bg-slate-800/60 rounded-xl border border-slate-700/50 hover:border-emerald-500/50 cursor-grab active:cursor-grabbing transition-all hover:bg-slate-800 group"
            onDragStart={(event) => onDragStart(event, 'workflowCircle')}
            draggable
          >
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
              <PlayCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-200">Khối Kết Quả (Circle)</div>
              <div className="text-xs text-slate-400">Đại diện cho trạng thái hoặc kết quả đầu ra</div>
            </div>
          </div>

          <div
            data-testid="sidebar-node-workflowRect"
            className="flex items-center gap-3 p-4 bg-slate-800/60 rounded-xl border border-slate-700/50 hover:border-sky-500/50 cursor-grab active:cursor-grabbing transition-all hover:bg-slate-800 group"
            onDragStart={(event) => onDragStart(event, 'workflowRect')}
            draggable
          >
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 flex items-center justify-center border border-sky-500/20 group-hover:bg-sky-500/20 transition-colors">
              <Square className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-200">Khối Hành Động (Rect)</div>
              <div className="text-xs text-slate-400">Đại diện cho bước xử lý hoặc hành vi thực thi</div>
            </div>
          </div>

          <div
            data-testid="sidebar-node-workflowDiamond"
            className="flex items-center gap-3 p-4 bg-slate-800/60 rounded-xl border border-slate-700/50 hover:border-orange-500/50 cursor-grab active:cursor-grabbing transition-all hover:bg-slate-800 group"
            onDragStart={(event) => onDragStart(event, 'workflowDiamond')}
            draggable
          >
            <div className="w-10 h-10 bg-orange-500/10 rotate-45 flex items-center justify-center border border-orange-500/20 group-hover:bg-orange-500/20 transition-colors rounded">
              <Layers className="w-4 h-4 text-orange-400 -rotate-45" />
            </div>
            <div className="pl-0">
              <div className="text-sm font-semibold text-slate-200">Khối Rẽ Nhánh (Diamond)</div>
              <div className="text-xs text-slate-400">Kiểm tra điều kiện để phân tách các tuyến đường</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl flex gap-2.5 items-start">
        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-[11px] text-slate-400 leading-normal">
          <b className="text-slate-300">Tính năng nâng cao:</b> Kích đúp vào bất kỳ khối nào trên canvas để thay đổi nội dung hiển thị ngay lập tức. Nhấn phím Backspace/Delete để xóa khối được chọn.
        </div>
      </div>
    </aside>
  );
};
