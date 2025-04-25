import { test as setup, expect } from '@playwright/test';

setup('delete new article', async ({ request }) => {
    const deteleArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${process.env.SLUGID}`, {});

    expect(deteleArticleResponse.status()).toEqual(204);
});
