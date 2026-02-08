import { APIRequestContext } from '@playwright/test';
import { OpenLibraryApiClient } from './OpenLibraryApiClient';
import { OpenLibraryAuthorResponse } from './types';

export class AuthorApi {
  private readonly client: OpenLibraryApiClient;

  constructor(request: APIRequestContext) {
    this.client = new OpenLibraryApiClient(request);
  }

  async getAuthorDetails(authorKey: string): Promise<OpenLibraryAuthorResponse> {
    return this.client.getAuthorByKey(authorKey);
  }
}
