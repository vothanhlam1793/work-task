import { test, expect } from '@playwright/test';
import { gotoWorkflow } from '../fixtures/workflow-helpers';

test.describe('Phase 3 persistence acceptance', () => {
  test.skip('autosaves the workflow after canvas changes', async ({ page }) => {
    await gotoWorkflow(page);

    await expect(page.getByTestId('autosave-indicator')).toHaveText('Đã lưu');
  });

  test.skip('loads a saved workflow from the workflow list', async ({ page }) => {
    await gotoWorkflow(page);

    await page.getByTestId('workflow-list-item-demo').click();
    await expect(page.getByText('Workflow demo đã tải')).toBeVisible();
  });
});
