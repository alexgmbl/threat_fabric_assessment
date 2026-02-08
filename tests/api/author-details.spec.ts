import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { AuthorApi } from '../../api/AuthorApi.js'; 
import path from 'path';

type AuthorData = { name: string; key: string };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const authorsPath = resolve(__dirname, '../../test-data/authors.json');
const authors: AuthorData[] = JSON.parse(readFileSync(authorsPath, 'utf-8'));


test.describe('Author Details API', () => {
  for (const author of authors) {
    test(`returns details for ${author.name}`, async ({ request }) => {
      const authorApi = new AuthorApi(request);
      const response = await authorApi.getAuthorDetails(author.key);

      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.key).toContain(author.key);
      expect(data.name).toBeTruthy();
    });
  }
});
