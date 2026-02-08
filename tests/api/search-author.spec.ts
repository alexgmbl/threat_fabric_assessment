import { test, expect } from '@playwright/test';
import { SearchApi } from '../../api/SearchApi';

const searchQueries = ['tolkien', 'christie', 'asimov'];

test.describe('Search API', () => {
  for (const query of searchQueries) {
    test(`returns results for query: ${query}`, async ({ request }) => {
      const searchApi = new SearchApi(request);
      const data = await searchApi.search(query);

      expect(Array.isArray(data.docs)).toBeTruthy();
      expect(data.docs.length).toBeGreaterThan(0);
      expect(data.numFound).toBeGreaterThan(0);
    });
  }
});
