import { test, expect } from '@playwright/test';
import { gotoWorkflow } from '../fixtures/workflow-helpers';

test.describe('Phase 4-5 advanced acceptance', () => {
  test.skip('assigns an avatar to a Rect node by drag and drop', async ({ page }) => {
    await gotoWorkflow(page);

    await page.getByTestId('team-member-u01').dragTo(page.getByTestId('node-n2'));
    await expect(page.getByTestId('node-n2')).toHaveAttribute('data-assignee-id', 'u01');
  });

  test.skip('inserts a CRITICAL node between existing nodes', async ({ page }) => {
    await gotoWorkflow(page);

    await page.getByRole('button', { name: 'Sự cố' }).click();
    await expect(page.getByText('CRITICAL')).toBeVisible();
  });
});
