import { APIRequestContext, APIResponse } from '@playwright/test';

export class SearchApi {
  constructor(private readonly request: APIRequestContext) {}

  async searchByAuthor(authorName: string): Promise<APIResponse> {
    return this.request.get('/search/authors.json', {
      params: { q: authorName }
    });
  }

  async searchBooks(query: string): Promise<APIResponse> {
    return this.request.get('/search.json', {
      params: { q: query }
    });
  }
}
