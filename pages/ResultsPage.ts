import { Locator, Page } from '@playwright/test';

export class ResultsPage {
  readonly page: Page;
  readonly resultRows: Locator;
  readonly resultTitles: Locator;

  constructor(page: Page) {
    this.page = page;
    this.resultRows = page.locator(
      'main [data-ol-search-result], main li.searchResultItem, main li[class*="searchResult"], main li:has(a[href*="/works/"])'
    );
    this.resultTitles = page.locator(
      'main [data-ol-search-result] .booktitle, main li.searchResultItem .booktitle, main a[href*="/works/"]'
    );
  }

  authorResult(authorName: string): Locator {
    return this.page
      .locator('main a[href*="/authors/"]')
      .filter({ hasText: new RegExp(authorName, 'i') })
      .first();
  }

  async getResultsCount(): Promise<number> {
    await this.page.waitForURL(/\/search(\?|\/)/);
    await this.page.waitForLoadState('domcontentloaded');
    await this.resultRows.first().waitFor({ state: 'visible', timeout: 10_000 }).catch(() => undefined);

    const rowCount = await this.resultRows.count();
    const titleCount = await this.resultTitles.count();
    return Math.max(rowCount, titleCount);
  }

  async openAuthorProfile(authorName: string): Promise<void> {
    await this.openAuthor(authorName);
  }

  async openAuthor(authorName: string): Promise<void> {
    await this.authorResult(authorName).click();
  }
}
