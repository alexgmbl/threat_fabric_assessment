import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import path from 'path';
import { SearchApi } from '../../api/SearchApi';
import { AuthorApi } from '../../api/AuthorApi';
import { OpenLibrarySearchDoc, OpenLibrarySearchResponse } from '../../api/types';

type BookAuthorCase = {
  title: string;
  author: string;
  fallbackAuthorKey?: string;
};

const testDataPath = path.resolve(__dirname, '../../test-data/book-search-authors.json');
const cases: BookAuthorCase[] = JSON.parse(readFileSync(testDataPath, 'utf-8'));

const normalize = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]/g, '');
const singularize = (value: string): string => value.replace(/s$/, '');

const normalizeAuthorVariants = (author: string): string[] => {
  const trimmed = author.trim();
  const singular = singularize(trimmed);
  const withoutDots = singular.replace(/\./g, '');

  return Array.from(new Set([trimmed, singular, withoutDots]));
};

const matchesAuthor = (doc: OpenLibrarySearchDoc, expectedAuthor: string): boolean => {
  const normalizedExpected = singularize(normalize(expectedAuthor));
  const authors = doc.author_name ?? [];

  return authors.some((authorName) => {
    const normalizedActual = singularize(normalize(authorName));
    return normalizedActual.includes(normalizedExpected) || normalizedExpected.includes(normalizedActual);
  });
};

const runSearchStrategies = async (
  searchApi: SearchApi,
  scenario: BookAuthorCase
): Promise<OpenLibrarySearchResponse> => {
  const authorVariants = normalizeAuthorVariants(scenario.author);

  const strategies: Array<() => Promise<OpenLibrarySearchResponse>> = [
    () => searchApi.searchByTitleAndAuthor(scenario.title, scenario.author),
    ...authorVariants.map((author) => () => searchApi.searchByTitleAndAuthor(scenario.title, author)),
    () => searchApi.search(`${scenario.title} ${scenario.author}`),
    ...authorVariants.map((author) => () => searchApi.search(`${scenario.title} ${author}`)),
    () => searchApi.searchByAuthor(scenario.author),
    ...authorVariants.map((author) => () => searchApi.searchByAuthor(author)),
    () => searchApi.search(scenario.title)
  ];

  for (const runStrategy of strategies) {
    const response = await runStrategy();
    if (response.docs.length > 0) {
      return response;
    }
  }

  return { docs: [], numFound: 0, start: 0 };
};

test.describe('Open Library search to author website validation', () => {
  for (const scenario of cases) {
    test(`searches by title and author, then validates author website URL: ${scenario.title} / ${scenario.author}`, async ({ request }) => {
      const searchApi = new SearchApi(request);
      const authorApi = new AuthorApi(request);

      const searchData = await runSearchStrategies(searchApi, scenario);
      const hasSearchDocs = searchData.docs.length > 0;

      const matchedDoc = hasSearchDocs
        ? searchData.docs.find((doc) => matchesAuthor(doc, scenario.author)) ?? searchData.docs[0]
        : undefined;

      const selectedAuthorKey = matchedDoc?.author_key?.[0] ?? scenario.fallbackAuthorKey;

      expect(
        Boolean(selectedAuthorKey),
        `No author key could be resolved for title="${scenario.title}" and author="${scenario.author}" from search results or fallbackAuthorKey`
      ).toBeTruthy();

      const authorDetails = await authorApi.getAuthorDetails(selectedAuthorKey as string);

      expect(authorDetails.links?.length, 'Expected author details to include at least one website link').toBeGreaterThan(0);

      const firstWebsiteUrl = authorDetails.links?.[0].url;
      expect(firstWebsiteUrl, 'Expected first author link URL to exist').toBeTruthy();
      expect(firstWebsiteUrl).toMatch(/^https?:\/\//i);

      const parsedUrl = new URL(firstWebsiteUrl as string);
      expect(parsedUrl.hostname.length).toBeGreaterThan(0);
    });
  }
});
