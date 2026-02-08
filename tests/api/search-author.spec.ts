import { test, expect } from '@playwright/test';
import { SearchApi } from '../../api/SearchApi';

const authorQueries = ['tolkien', 'christie', 'asimov'];

test.describe('Search API', () => {
  for (const query of authorQueries) {
    test(`returns results for author query: ${query}`, async ({ request }) => {
      const searchApi = new SearchApi(request);
      const response = await searchApi.searchByAuthor(query);

      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(Array.isArray(data.docs)).toBeTruthy();
      expect(data.docs.length).toBeGreaterThan(0);
    });
  }
});
