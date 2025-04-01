import { test, expect, request } from '@playwright/test';
import tags from '../test-data/tags.json';

test.beforeEach(async ({ page }) => {
    await page.route('*/**/api/tags', async route => {
        await route.fulfill({
            body: JSON.stringify(tags),
        });
    });

    await page.goto('https://conduit.bondaracademy.com/');
    await page.getByText(' Sign in ').click();
    await page.getByRole('textbox', { name: 'Email' }).fill('vs_test@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('passworD1!2!3!');
    await page.getByRole('button', { name: ' Sign in ' }).click();
});

test('has title', async ({ page }) => {
    await page.route('*/**/api/articles*', async route => {
        const response = await route.fetch();
        const responseBody = await response.json();

        responseBody.articles[0].title = 'This is a MOCK test title';
        responseBody.articles[0].description = 'This is a MOCK test description';

        await route.fulfill({
            body: JSON.stringify(responseBody),
        });
    });

    await page.getByText('Global Feed').click();

    await expect(page.locator('.tag-list')).toContainText(tags.tags[0]);
    await expect(page.locator('.navbar-brand')).toHaveText('conduit');
    await expect(page.locator('app-article-list h1').first()).toContainText('This is a MOCK test title');
    await expect(page.locator('app-article-list p').first()).toContainText('This is a MOCK test description');
});

test('delete article', async ({ page, request }) => {
    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {
            user: {
                email: 'vs_test@gmail.com',
                password: 'passworD1!2!3!',
            },
        },
    });

    const responseBody = await response.json();
    const accessToken = responseBody.user.token;

    const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
        data: {
            article: {
                title: 'Test article title',
                description: 'test article description',
                body: 'test article body',
                tagList: [],
            },
        },
        headers: {
            authorization: `Token ${accessToken}`,
        },
    });

    expect(articleResponse.status()).toEqual(201);

    await page.getByText('Global Feed').click();
    await page.getByText('Test article title').click();
    await page.getByRole('button', { name: 'Delete Article' }).first().click();
    await page.getByText('Global Feed').click();

    await expect(page.locator('app-article-list h1').first()).not.toContainText('Test article title');
});
