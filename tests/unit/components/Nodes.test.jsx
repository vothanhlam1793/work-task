import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ReactFlowProvider } from '@xyflow/react';
import { CircleNode } from '../../../src/components/nodes/CircleNode';
import { RectNode } from '../../../src/components/nodes/RectNode';

function renderNode(ui) {
  return render(<ReactFlowProvider>{ui}</ReactFlowProvider>);
}

describe('CircleNode', () => {
  it('renders deadline warning when deadline is missing', () => {
    renderNode(<CircleNode data={{ label: 'Missing deadline' }} selected={false} />);

    expect(screen.getByText('Missing deadline')).toBeInTheDocument();
    expect(screen.getByText('Cần hạn chót')).toBeInTheDocument();
  });

  it('renders formatted deadline when deadline exists', () => {
    renderNode(<CircleNode data={{ label: 'Has deadline', deadline: '2026-06-15T18:00' }} selected={false} />);

    expect(screen.getByText('Has deadline')).toBeInTheDocument();
    expect(screen.getByText('15-06')).toBeInTheDocument();
  });
});

describe('RectNode', () => {
  it('renders delegate assignee and clamps progress width to 100%', () => {
    const { container } = render(
      <ReactFlowProvider>
        <RectNode
          data={{
            label: 'Delegate task',
            mode: 'delegate',
            status: 'running',
            priority: 'high',
            assignee: 'Huy',
            progress: 140,
          }}
          selected={false}
        />
      </ReactFlowProvider>
    );

    expect(screen.getByText('Delegate task')).toBeInTheDocument();
    expect(screen.getByText('Huy')).toBeInTheDocument();
    expect(screen.getByText('!')).toBeInTheDocument();

    const progressBar = container.querySelector('[style="width: 100%;"]');
    expect(progressBar).toBeTruthy();
  });

  it('renders scheduled pending node with fallback deadline text', () => {
    renderNode(
      <RectNode
        data={{
          label: 'Scheduled task',
          mode: 'scheduled',
          status: 'pending',
        }}
        selected={false}
      />
    );

    expect(screen.getByText('Scheduled task')).toBeInTheDocument();
    expect(screen.getByText(/Không hạn/)).toBeInTheDocument();
    expect(screen.getByText('Chờ lịch')).toBeInTheDocument();
  });
});
