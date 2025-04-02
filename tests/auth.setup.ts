import { test as setup } from '@playwright/test';

const authFile = '.auth/user.json';

setup('authenticatiob', async ({ page }) => {
    await page.goto('https://conduit.bondaracademy.com/');
    await page.getByText(' Sign in ').click();
    await page.getByRole('textbox', { name: 'Email' }).fill('vs_test@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('passworD1!2!3!');
    await page.getByRole('button', { name: ' Sign in ' }).click();
    await page.waitForResponse('https://conduit-api.bondaracademy.com/api/tags');

    await page.context().storageState({ path: authFile });
});
