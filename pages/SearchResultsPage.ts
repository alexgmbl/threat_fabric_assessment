  import { expect, Locator, Page } from '@playwright/test';

  export class SearchResultsPage {
  readonly page: Page;
  readonly resultItems: Locator;

  constructor(page: Page) {
    this.page = page;
    // stable structure from your HTML
    this.resultItems = page.locator('li.searchResultItem:has(h3.booktitle a.results)');
  }

  async waitForResults(): Promise<void> {
    await expect(this.resultItems.first()).toBeVisible({ timeout: 10_000 });
    await expect(this.resultItems.first().locator('h3.booktitle a.results')).not.toHaveText('');
  }

  async getResultCount(): Promise<number> {
    return this.resultItems.count();
  }

  async getTitleOfResult(index: number): Promise<string> {
    return (await this.resultItems.nth(index).locator('h3.booktitle a.results').innerText()).trim();
  }
}

