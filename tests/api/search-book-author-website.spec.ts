import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import path from 'path';
import { SearchApi } from '../../api/SearchApi';
import { AuthorApi } from '../../api/AuthorApi';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type BookAuthorCase = {
  title: string;
  author: string;
};

const testDataPath = path.resolve(__dirname, '../../test-data/book-search-authors.json');
const cases: BookAuthorCase[] = JSON.parse(readFileSync(testDataPath, 'utf-8'));

test.describe('Open Library search to author website validation', () => {
  for (const scenario of cases) {
    test(`searches by title and author, then validates author website URL: ${scenario.title} / ${scenario.author}`, async ({ request }) => {
      const searchApi = new SearchApi(request);
      const authorApi = new AuthorApi(request);

      const query = `${scenario.title} ${scenario.author}`;
      const searchResponse = await searchApi.searchBooks(query);
      expect(searchResponse.ok(), `Expected search request to succeed for query: ${query}`).toBeTruthy();

      const searchData = await searchResponse.json();
      expect(searchData.docs.length).toBeGreaterThan(0);

      const firstDoc = searchData.docs[0];
      const firstAuthorKey = firstDoc.author_key?.[0];
      expect(firstAuthorKey, 'Expected first search result to include author_key').toBeTruthy();

      const authorDetails = await authorApi.getAuthorDetails(firstAuthorKey as string);
      expect(authorDetails.ok(), `Expected author details request to succeed for key: ${firstAuthorKey as string}`).toBeTruthy();

      const authorData = await authorDetails.json();
      expect(authorData.links?.length, 'Expected author details to include at least one website link').toBeGreaterThan(0);

      /* const firstWebsiteUrl = authorData.links?.[0]?.url;
      expect(firstWebsiteUrl, 'Expected first author link URL to exist').toBeTruthy();
      expect(firstWebsiteUrl).toMatch(/^https?:\/\//i); 

      const parsedUrl = new URL(firstWebsiteUrl as string);
      expect(parsedUrl.hostname.length).toBeGreaterThan(0);*/
      const links = authorData.links ?? [];
      const websiteUrls = links.map(l => l.url?.toLowerCase()).filter(Boolean);
      expect(websiteUrls.some(url => url.includes('jkrowling.com')),).toBe(true);
    });
  }
});
