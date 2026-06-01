import { test, expect } from '@playwright/test';
import {
  gotoWorkflow,
  openNodeEditor,
  readPostedMessages,
  stubAlerts,
  stubParentPostMessage,
} from '../fixtures/workflow-helpers';

test.describe('Current workflow canvas behavior', () => {
  test.beforeEach(async ({ page }) => {
    await stubParentPostMessage(page);
  });

  test('renders the current dashboard shell and sample data', async ({ page }) => {
    await gotoWorkflow(page);

    await expect(page.getByText('Hộp Công Cụ Khối')).toBeVisible();
    await expect(page.getByText('Khối Kết Quả (Circle)')).toBeVisible();
    await expect(page.getByText('Khối Hành Động (Rect)')).toBeVisible();
    await expect(page.getByText('Khối Rẽ Nhánh (Diamond)')).toBeVisible();

    await expect(page.getByText('Yêu cầu hoàn long')).toBeVisible();
    await expect(page.getByText('Kiểm tra hệ thống thông tin')).toBeVisible();
    await expect(page.getByText('DONE - chuyển giao test')).toBeVisible();
  });

  test('opens the inline editor on double click and updates node label', async ({ page }) => {
    await gotoWorkflow(page);
    await openNodeEditor(page, 'Test hệ thống');

    await page.getByTestId('edit-node-textarea').fill('Test hệ thống giai đoạn smoke');
    await page.getByTestId('save-edit-node-button').click();

    await expect(page.getByTestId('edit-node-modal')).toBeHidden();
    await expect(page.getByText('Test hệ thống giai đoạn smoke')).toBeVisible();
  });

  test('can cancel inline edit without changing the node label', async ({ page }) => {
    await gotoWorkflow(page);
    await openNodeEditor(page, 'Xử lý hệ thống');

    await page.getByTestId('edit-node-textarea').fill('Nhãn không nên được lưu');
    await page.getByTestId('cancel-edit-node-button').click();

    await expect(page.getByTestId('edit-node-modal')).toBeHidden();
    await expect(page.getByText('Xử lý hệ thống')).toBeVisible();
    await expect(page.getByText('Nhãn không nên được lưu')).toHaveCount(0);
  });

  test('exports workflow data through alert, console log, and postMessage', async ({ page }) => {
    const alerts = await stubAlerts(page);
    const consoleLogs = [];

    page.on('console', (msg) => {
      consoleLogs.push(msg.text());
    });

    await gotoWorkflow(page);
    await page.getByTestId('save-flow-button').click();

    await expect.poll(() => alerts.length).toBe(1);
    expect(alerts[0]).toContain('Đã lưu cấu trúc luồng xuống bộ nhớ tạm');

    await expect.poll(() => consoleLogs.some((line) => line.includes('--- DỮ LIỆU WORKFLOW XUẤT RA ---'))).toBeTruthy();

    const messages = await readPostedMessages(page);
    expect(messages).toHaveLength(1);
    expect(messages[0].type).toBe('WORKFLOW_SAVE');
    expect(messages[0].payload.nodes.length).toBeGreaterThanOrEqual(6);
    expect(messages[0].payload.edges.length).toBeGreaterThanOrEqual(5);
  });

  test('restores the sample workflow after editing a node', async ({ page }) => {
    await gotoWorkflow(page);
    await openNodeEditor(page, 'Yêu cầu hoàn long');

    await page.getByTestId('edit-node-textarea').fill('Mẫu đã bị sửa');
    await page.getByTestId('save-edit-node-button').click();
    await expect(page.getByText('Mẫu đã bị sửa')).toBeVisible();

    await page.getByTestId('reset-flow-button').click();

    await expect(page.getByText('Yêu cầu hoàn long')).toBeVisible();
    await expect(page.getByText('Mẫu đã bị sửa')).toHaveCount(0);
  });
});
