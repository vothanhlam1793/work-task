import React, { useState } from 'react';
import { X } from 'lucide-react';

export function NodeEditor({ node, onSave, onClose }) {
  const type = node?.type;
  const isCircle = type === 'workflowCircle';
  const isRect = type === 'workflowRect';
  const isDiamond = type === 'workflowDiamond';

  const [form, setForm] = useState(() => ({
    label: node?.data?.label || '',

    mode: node?.data?.mode || 'solo',
    status: node?.data?.status || 'pending',
    priority: node?.data?.priority || 'normal',
    assignee: node?.data?.assignee || '',
    progress: node?.data?.progress ?? 0,
    deadline: node?.data?.deadline || '',

    smart_specific: node?.data?.smart_specific || '',
    smart_measurable: node?.data?.smart_measurable || '',
    smart_achievable: node?.data?.smart_achievable || '',
    smart_relevant: node?.data?.smart_relevant || '',
    smart_timebound: node?.data?.smart_timebound || '',

    condition: node?.data?.condition || '',
  }));

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = () => {
    onSave({
      ...node.data,
      label: form.label,
      mode: isRect ? form.mode : undefined,
      status: isRect ? form.status : undefined,
      priority: isRect ? form.priority : undefined,
      assignee: isRect ? form.assignee || undefined : undefined,
      progress: isRect && form.mode === 'delegate' ? Number(form.progress) : undefined,
      deadline: (isCircle || isRect) && form.deadline ? form.deadline : undefined,
      smart_specific: isCircle ? form.smart_specific : undefined,
      smart_measurable: isCircle ? form.smart_measurable : undefined,
      smart_achievable: isCircle ? form.smart_achievable : undefined,
      smart_relevant: isCircle ? form.smart_relevant : undefined,
      smart_timebound: isCircle ? form.smart_timebound : undefined,
      condition: isDiamond ? form.condition : undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn" onClick={onClose}>
      <div
        className="bg-slate-900 border border-slate-800 w-full max-w-lg p-6 rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            {isCircle ? 'Mục tiêu SMART' : isRect ? 'Cấu hình hành động' : 'Điều kiện rẽ nhánh'}
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
              {isCircle ? 'Tên mục tiêu' : isRect ? 'Tên hành động' : 'Điều kiện'}
            </label>
            <input
              type="text"
              value={form.label}
              onChange={(e) => update('label', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              placeholder={isCircle ? 'Tên mục tiêu SMART...' : isRect ? 'Tên hành động...' : 'Điều kiện?'}
              autoFocus
            />
          </div>

          {isRect && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Chế độ</label>
                  <select
                    value={form.mode}
                    onChange={(e) => update('mode', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="solo">Tự làm (Solo)</option>
                    <option value="delegate">Giao việc (Delegate)</option>
                    <option value="scheduled">Chờ lịch (Scheduled)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Trạng thái</label>
                  <select
                    value={form.status}
                    onChange={(e) => update('status', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="pending">Chưa làm</option>
                    <option value="running">Đang làm</option>
                    <option value="waiting">Đợi phản hồi</option>
                    <option value="done">Hoàn thành</option>
                    <option value="failed">Thất bại</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Độ ưu tiên</label>
                <select
                  value={form.priority}
                  onChange={(e) => update('priority', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="low">Thấp</option>
                  <option value="normal">Bình thường</option>
                  <option value="high">Cao</option>
                  <option value="critical">Khẩn cấp</option>
                </select>
              </div>

              {form.mode === 'delegate' && (
                <>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Người được giao</label>
                    <input
                      type="text"
                      value={form.assignee}
                      onChange={(e) => update('assignee', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                      placeholder="Tên người nhận việc..."
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
                      Tiến độ ({form.progress}%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={form.progress}
                      onChange={(e) => update('progress', e.target.value)}
                      className="w-full accent-purple-500"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Hạn chót</label>
                <input
                  type="datetime-local"
                  value={form.deadline}
                  onChange={(e) => update('deadline', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </>
          )}

          {isCircle && (
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <label className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">Bắt buộc nhập SMART</label>
              <div>
                <label className="text-[9px] font-bold text-slate-400 mb-0.5 block">S - Cụ thể (Specific)</label>
                <textarea
                  value={form.smart_specific}
                  onChange={(e) => update('smart_specific', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-blue-500 resize-none"
                  rows={2}
                  placeholder="Mô tả cụ thể mục tiêu..."
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 mb-0.5 block">M - Đo lường được (Measurable)</label>
                <textarea
                  value={form.smart_measurable}
                  onChange={(e) => update('smart_measurable', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-blue-500 resize-none"
                  rows={2}
                  placeholder="Chỉ số đo lường thành công..."
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 mb-0.5 block">A - Khả thi (Achievable)</label>
                <textarea
                  value={form.smart_achievable}
                  onChange={(e) => update('smart_achievable', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-blue-500 resize-none"
                  rows={2}
                  placeholder="Nguồn lực cần có..."
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 mb-0.5 block">R - Liên quan (Relevant)</label>
                <textarea
                  value={form.smart_relevant}
                  onChange={(e) => update('smart_relevant', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-blue-500 resize-none"
                  rows={2}
                  placeholder="Liên quan đến mục tiêu lớn..."
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 mb-0.5 block">T - Thời hạn (Time-bound) <span className="text-red-400">*</span></label>
                <input
                  type="datetime-local"
                  value={form.deadline}
                  onChange={(e) => update('deadline', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                />
                {!form.deadline && (
                  <p className="text-[9px] text-red-400 mt-1">Bắt buộc có hạn chót cho mục tiêu</p>
                )}
              </div>
            </div>
          )}

          {isDiamond && (
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Điều kiện</label>
              <input
                type="text"
                value={form.condition}
                onChange={(e) => update('condition', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                placeholder="Ví dụ: Đã thanh toán?"
              />
              <p className="text-[9px] text-slate-500 mt-1">Diamond của bạn đang có 2 nhánh ra: Right (Yes) và Bottom (No)</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
          >
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
}
