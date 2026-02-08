import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import path from 'path';
import { AuthorApi } from '../../api/AuthorApi';

type AuthorData = { name: string; key: string };

const authorsPath = path.resolve(__dirname, '../../test-data/authors.json');
const authors: AuthorData[] = JSON.parse(readFileSync(authorsPath, 'utf-8'));

test.describe('Author Details API', () => {
  for (const author of authors) {
    test(`returns details for ${author.name}`, async ({ request }) => {
      const authorApi = new AuthorApi(request);
      const data = await authorApi.getAuthorDetails(author.key);

      expect(data.key).toContain(author.key);
      expect(data.name).toBeTruthy();
    });
  }
});
