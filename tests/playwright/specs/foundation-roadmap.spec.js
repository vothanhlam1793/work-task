import { test, expect } from '@playwright/test';
import { gotoWorkflow } from '../fixtures/workflow-helpers';

test.describe('Phase 1 roadmap acceptance', () => {
  test('documents the already-shipped canvas expectations', async ({ page }) => {
    await gotoWorkflow(page);

    await expect(page.getByTestId('workflow-sidebar')).toBeVisible();
    await expect(page.getByTestId('workflow-canvas-shell')).toBeVisible();
    await expect(page.locator('.react-flow__controls')).toBeVisible();
    await expect(page.locator('.react-flow__minimap')).toBeVisible();
  });

  test.skip('creates a new edge by dragging from source handle to target handle', async ({ page }) => {
    await gotoWorkflow(page);

    await page.getByText('Kiểm tra hệ thống thông tin').hover();
    await page.getByText('Có thông tin kiểm tra sơ bộ').hover();

    const sourceHandle = page.locator('[data-handleid="bottom"][data-nodeid="n2"]').first();
    const targetHandle = page.locator('[data-handleid="top"][data-nodeid="n3"]').first();

    await sourceHandle.dragTo(targetHandle);

    await expect(page.locator('.react-flow__edge')).toHaveCount(6);
  });

  test.skip('shows edge reconnect controls and reconnects an endpoint', async ({ page }) => {
    await gotoWorkflow(page);

    await page.locator('[data-id="e2-3"]').hover();
    await expect(page.locator('[data-testid="edge-reconnect-source-e2-3"]')).toBeVisible();
    await expect(page.locator('[data-testid="edge-reconnect-target-e2-3"]')).toBeVisible();
  });

  test.skip('adds, drags, and removes edge waypoints', async ({ page }) => {
    await gotoWorkflow(page);

    const edge = page.locator('[data-id="e3-4"] path').first();
    await edge.dblclick();

    await expect(page.locator('[data-testid^="waypoint-dot-"]')).toHaveCount(1);
  });
});
