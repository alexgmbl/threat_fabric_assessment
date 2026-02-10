import { expect, test } from '@playwright/test';

interface SearchDoc {
  author_key?: string[];
}

interface SearchResponse {
  docs?: SearchDoc[];
}

interface AuthorLink {
  url?: string;
}

interface AuthorResponse {
  key?: string;
  name?: string;
  links?: AuthorLink[];
}

test.describe('Author details schema', () => {
  test('validates /authors/{authorKey}.json response schema', async ({ request }) => {
    const searchResponse = await request.get('/search.json?title=Harry%20Potter&author=Rowling');
    expect(searchResponse.ok(), 'Expected search endpoint to return a successful response').toBeTruthy();

    const searchBody = (await searchResponse.json()) as SearchResponse;
    expect(Array.isArray(searchBody.docs), 'Expected search response to include a docs array').toBeTruthy();
    expect((searchBody.docs?.length ?? 0) > 0, 'Expected search response to include at least one document').toBeTruthy();

    const authorKey =
      searchBody.docs?.find((doc) => Array.isArray(doc.author_key) && doc.author_key.length > 0)?.author_key?.[0] ?? '';

    expect(authorKey, 'Expected at least one search result with a non-empty author_key array').not.toEqual('');

    const authorResponse = await request.get(`/authors/${authorKey}.json`);
    expect(
      authorResponse.ok(),
      `Expected author endpoint to return a successful response for authorKey: ${authorKey}`
    ).toBeTruthy();

    const author = (await authorResponse.json()) as AuthorResponse;

    expect(typeof author.key, 'Expected author.key to exist and be a string').toBe('string');
    expect(author.key, `Expected author.key to contain the requested authorKey: ${authorKey}`).toContain(authorKey);

    expect(typeof author.name, 'Expected author.name to exist and be a string').toBe('string');
    expect(author.name?.trim(), 'Expected author.name to be a non-empty string').not.toEqual('');

    if (author.links !== undefined) {
      expect(Array.isArray(author.links), 'Expected author.links to be an array when present').toBeTruthy();

      for (const [index, link] of author.links.entries()) {
        const url = link.url ?? '';
        expect(typeof link.url, `Expected author.links[${index}].url to exist and be a string`).toBe('string');
        expect(url.trim(), `Expected author.links[${index}].url to be non-empty`).not.toEqual('');

        let parsedUrl: URL;
        expect(() => {
          parsedUrl = new URL(url);
        }, `Expected author.links[${index}].url to be a valid URL: ${url}`).not.toThrow();

        expect(
          ['http:', 'https:'].includes((parsedUrl as URL).protocol),
          `Expected author.links[${index}].url protocol to be http: or https:, got: ${(parsedUrl as URL).protocol}`
        ).toBeTruthy();
      }
    }
  });
});
