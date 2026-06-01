import { expect } from '@playwright/test';

export async function gotoWorkflow(page) {
  await page.goto('/');
  await expect(page.getByText('Trình thiết kế luồng quy trình hệ thống')).toBeVisible();
  await expect(page.getByTestId('workflow-sidebar')).toBeVisible();
  await expect(page.getByTestId('workflow-canvas-shell')).toBeVisible();
}

export async function stubAlerts(page) {
  const alerts = [];

  page.on('dialog', async (dialog) => {
    alerts.push(dialog.message());
    await dialog.accept();
  });

  return alerts;
}

export async function stubParentPostMessage(page) {
  await page.addInitScript(() => {
    window.__workflowMessages = [];

    const sameWindowParent = {
      postMessage(message) {
        window.__workflowMessages.push(message);
      },
    };

    Object.defineProperty(window, 'parent', {
      configurable: true,
      get() {
        return sameWindowParent;
      },
    });
  });
}

export async function readPostedMessages(page) {
  return page.evaluate(() => window.__workflowMessages || []);
}

export async function openNodeEditor(page, label) {
  await page.getByText(label, { exact: true }).dblclick();
  await expect(page.getByTestId('edit-node-modal')).toBeVisible();
  await expect(page.getByTestId('edit-node-textarea')).toBeVisible();
}
