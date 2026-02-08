import { APIRequestContext, APIResponse } from '@playwright/test';
import { OpenLibraryAuthorResponse, OpenLibrarySearchResponse } from './types';

export class OpenLibraryApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly statusText: string,
    public readonly url: string,
    public readonly responseBody?: string
  ) {
    super(message);
    this.name = 'OpenLibraryApiError';
  }
}

export class OpenLibraryApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async search(query: string, page = 1): Promise<OpenLibrarySearchResponse> {
    const response = await this.request.get('/search.json', {
      params: { q: query, page }
    });

    return this.parseJsonOrThrow<OpenLibrarySearchResponse>(response, '/search.json');
  }

  async getAuthorByKey(authorKey: string): Promise<OpenLibraryAuthorResponse> {
    const normalizedKey = authorKey.replace(/^\//, '');
    const path = `/authors/${normalizedKey}.json`;
    const response = await this.request.get(path);

    return this.parseJsonOrThrow<OpenLibraryAuthorResponse>(response, path);
  }

  private async parseJsonOrThrow<T>(response: APIResponse, path: string): Promise<T> {
    if (!response.ok()) {
      const body = await response.text();
      throw new OpenLibraryApiError(
        `Open Library API request failed for ${path}`,
        response.status(),
        response.statusText(),
        response.url(),
        body
      );
    }

    return (await response.json()) as T;
  }
}
