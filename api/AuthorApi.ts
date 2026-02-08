import { APIRequestContext, APIResponse } from '@playwright/test';

export class AuthorApi {
  constructor(private readonly request: APIRequestContext) {}

  async getAuthorDetails(authorKey: string): Promise<APIResponse> {
    return this.request.get(`/authors/${authorKey}.json`);
  }
}
