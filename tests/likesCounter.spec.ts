import { test, expect } from '@playwright/test';

test('Like counter increased', async ({ page }) => {
    await page.goto('https://conduit.bondaracademy.com/');
    await page.getByText('Global Feed').click();

    const firstLikeButton = page.locator('app-article-preview').first().getByRole('button');
    await expect(firstLikeButton).toContainText('0');
    await firstLikeButton.click();
    await expect(firstLikeButton).toContainText('1');
});
