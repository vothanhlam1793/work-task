import { test, expect } from '@playwright/test';
import { gotoWorkflow, openNodeEditor } from '../fixtures/workflow-helpers';

test.describe('Phase 2 domain model acceptance', () => {
  test.skip('renders Rect node mode, status, and priority variations', async ({ page }) => {
    await gotoWorkflow(page);

    const rectNode = page.getByText('Kiểm tra hệ thống thông tin').locator('..');
    await expect(rectNode).toHaveAttribute('data-mode', 'delegate');
    await expect(rectNode).toHaveAttribute('data-status', 'running');
    await expect(rectNode).toHaveAttribute('data-priority', 'high');
    await expect(page.getByTestId('rect-progress-n2')).toBeVisible();
  });

  test.skip('warns when a Circle node is missing deadline', async ({ page }) => {
    await gotoWorkflow(page);

    const circleNode = page.getByText('Yêu cầu hoàn long').locator('..');
    await expect(circleNode).toHaveAttribute('data-deadline-state', 'missing');
    await expect(page.getByText('Cần hạn chót')).toBeVisible();
  });

  test.skip('opens typed NodeEditor form instead of plain textarea', async ({ page }) => {
    await gotoWorkflow(page);
    await openNodeEditor(page, 'Kiểm tra hệ thống thông tin');

    await expect(page.getByTestId('node-editor-form-rect')).toBeVisible();
    await expect(page.getByLabel('Mode')).toBeVisible();
    await expect(page.getByLabel('Status')).toBeVisible();
    await expect(page.getByLabel('Priority')).toBeVisible();
  });
});
