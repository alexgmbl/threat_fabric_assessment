import { Locator, Page } from '@playwright/test';

export class ResultsPage {
  private readonly page: Page;
  private readonly resultRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.resultRows = page.locator('.searchResults li.searchResultItem');
  }

  private authorResultLink(authorName: string): Locator {
    return this.page.getByRole('link', { name: new RegExp(authorName, 'i') }).first();
  }

  async getResultsCount(): Promise<number> {
    return this.resultRows.count();
  }

  async openAuthorProfile(authorName: string): Promise<void> {
    await this.authorResultLink(authorName).click();
  }
}
