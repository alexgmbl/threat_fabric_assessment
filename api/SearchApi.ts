import { APIRequestContext } from '@playwright/test';
import { OpenLibraryApiClient } from './OpenLibraryApiClient';
import { OpenLibrarySearchResponse } from './types';

export class SearchApi {
  private readonly client: OpenLibraryApiClient;

  constructor(request: APIRequestContext) {
    this.client = new OpenLibraryApiClient(request);
  }

  async search(query: string, page = 1): Promise<OpenLibrarySearchResponse> {
    return this.client.search(query, page);
  }
}
