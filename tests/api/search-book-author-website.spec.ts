import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import path from 'path';
import { SearchApi } from '../../api/SearchApi';
import { AuthorApi } from '../../api/AuthorApi';
import { OpenLibrarySearchDoc } from '../../api/types';

type BookAuthorCase = {
  title: string;
  author: string;
};

const testDataPath = path.resolve(__dirname, '../../test-data/book-search-authors.json');
const cases: BookAuthorCase[] = JSON.parse(readFileSync(testDataPath, 'utf-8'));

const normalize = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]/g, '');

const matchesAuthor = (doc: OpenLibrarySearchDoc, expectedAuthor: string): boolean => {
  const normalizedExpected = normalize(expectedAuthor).replace(/s$/, '');
  const authors = doc.author_name ?? [];

  return authors.some((authorName) => {
    const normalizedActual = normalize(authorName).replace(/s$/, '');
    return normalizedActual.includes(normalizedExpected) || normalizedExpected.includes(normalizedActual);
  });
};

test.describe('Open Library search to author website validation', () => {
  for (const scenario of cases) {
    test(`searches by title and author, then validates author website URL: ${scenario.title} / ${scenario.author}`, async ({ request }) => {
      const searchApi = new SearchApi(request);
      const authorApi = new AuthorApi(request);

      const strictSearch = await searchApi.searchByTitleAndAuthor(scenario.title, scenario.author);
      const relaxedSearch = strictSearch.docs.length === 0 ? await searchApi.search(`${scenario.title} ${scenario.author}`) : strictSearch;
      const broadSearch = relaxedSearch.docs.length === 0 ? await searchApi.search(scenario.title) : relaxedSearch;

      expect(
        broadSearch.docs.length,
        `No search results were found for title="${scenario.title}" and author="${scenario.author}" using strict/relaxed search strategies`
      ).toBeGreaterThan(0);

      const bestDoc = broadSearch.docs.find((doc) => matchesAuthor(doc, scenario.author)) ?? broadSearch.docs[0];
      const firstAuthorKey = bestDoc.author_key?.[0];
      expect(firstAuthorKey, 'Expected search result to include author_key').toBeTruthy();

      const authorDetails = await authorApi.getAuthorDetails(firstAuthorKey as string);

      expect(authorDetails.links?.length, 'Expected author details to include at least one website link').toBeGreaterThan(0);

      const firstWebsiteUrl = authorDetails.links?.[0].url;
      expect(firstWebsiteUrl, 'Expected first author link URL to exist').toBeTruthy();
      expect(firstWebsiteUrl).toMatch(/^https?:\/\//i);

      const parsedUrl = new URL(firstWebsiteUrl as string);
      expect(parsedUrl.hostname.length).toBeGreaterThan(0);
    });
  }
});
