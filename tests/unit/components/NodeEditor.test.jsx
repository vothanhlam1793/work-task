import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NodeEditor } from '../../../src/components/NodeEditor';

describe('NodeEditor', () => {
  it('renders and saves rect-specific fields including delegate progress', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(
      <NodeEditor
        node={{ id: 'n1', type: 'workflowRect', data: { label: 'Task' } }}
        onSave={onSave}
        onClose={vi.fn()}
      />
    );

    const textboxes = screen.getAllByRole('textbox');
    await user.clear(textboxes[0]);
    await user.type(textboxes[0], 'Delegate task');
    await user.selectOptions(screen.getByDisplayValue('Tự làm (Solo)'), 'delegate');
    await user.selectOptions(screen.getByDisplayValue('Chưa làm'), 'running');
    await user.selectOptions(screen.getByDisplayValue('Bình thường'), 'high');
    await user.type(screen.getByPlaceholderText('Tên người nhận việc...'), 'Huy');

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '65' } });

    const datetimeInputs = screen.getAllByDisplayValue('');
    fireEvent.change(datetimeInputs[0], { target: { value: '2026-06-18T09:30' } });

    await user.click(screen.getByRole('button', { name: 'Cập nhật' }));

    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({
      label: 'Delegate task',
      mode: 'delegate',
      status: 'running',
      priority: 'high',
      assignee: 'Huy',
      progress: 65,
      deadline: '2026-06-18T09:30',
    }));
  });

  it('saves circle SMART fields and preserves deadline requirement output', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(
      <NodeEditor
        node={{ id: 'c1', type: 'workflowCircle', data: { label: 'Goal' } }}
        onSave={onSave}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText('Bắt buộc có hạn chót cho mục tiêu')).toBeInTheDocument();

    const textareas = screen.getAllByRole('textbox');
    await user.clear(textareas[0]);
    await user.type(textareas[0], 'Goal upgraded');
    await user.type(textareas[1], 'Specific detail');
    await user.type(textareas[2], 'Measure detail');
    await user.type(textareas[3], 'Achievable detail');
    await user.type(textareas[4], 'Relevant detail');

    const deadlineInput = screen.getByDisplayValue('');
    fireEvent.change(deadlineInput, { target: { value: '2026-06-20T10:00' } });
    await user.click(screen.getByRole('button', { name: 'Cập nhật' }));

    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({
      label: 'Goal upgraded',
      smart_specific: 'Specific detail',
      smart_measurable: 'Measure detail',
      smart_achievable: 'Achievable detail',
      smart_relevant: 'Relevant detail',
      deadline: '2026-06-20T10:00',
    }));
  });

  it('saves only diamond condition-specific fields', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(
      <NodeEditor
        node={{ id: 'd1', type: 'workflowDiamond', data: { label: 'Old', condition: 'A?' } }}
        onSave={onSave}
        onClose={vi.fn()}
      />
    );

    const inputs = screen.getAllByRole('textbox');
    await user.clear(inputs[0]);
    await user.type(inputs[0], 'Duyệt?');
    await user.clear(inputs[1]);
    await user.type(inputs[1], 'Đã thanh toán?');
    await user.click(screen.getByRole('button', { name: 'Cập nhật' }));

    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({
      label: 'Duyệt?',
      condition: 'Đã thanh toán?',
      mode: undefined,
      status: undefined,
      priority: undefined,
    }));
  });

  it('closes on backdrop click', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <NodeEditor
        node={{ id: 'n1', type: 'workflowRect', data: { label: 'Task' } }}
        onSave={vi.fn()}
        onClose={onClose}
      />
    );

    await user.click(document.querySelector('.fixed.inset-0'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
