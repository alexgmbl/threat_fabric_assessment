import { expect, Locator, Page } from '@playwright/test';

export class SearchResultsPage {
  readonly page: Page;
  readonly resultsHeading: Locator;
  readonly resultItems: Locator;
  readonly resultTitles: Locator;

  constructor(page: Page) {
    this.page = page;
    this.resultsHeading = page.getByRole('heading', { name: /search|results/i }).first();
    this.resultItems = page
      .locator('li.searchResultItem')
      .or(page.locator('[data-ol-search-result]'))
      .or(page.locator('main li:has(a[href*="/works/"])'));
    this.resultTitles = page.locator(
      'li.searchResultItem .booktitle, [data-ol-search-result] .booktitle, li.searchResultItem a[href*="/works/"], [data-ol-search-result] a[href*="/works/"]'
    );
  }

  async waitForResults(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await Promise.race([
      this.page.waitForURL(/\/search(\?|\/|$)/),
      expect(this.resultsHeading).toBeVisible({ timeout: 10_000 })
    ]);
    await expect(this.resultItems.first()).toBeVisible();
  }

  async isResultsPageDisplayed(): Promise<boolean> {
    const hasSearchUrl = /\/search(\?|\/|$)/.test(this.page.url());
    const hasHeading = await this.resultsHeading.isVisible().catch(() => false);
    return hasSearchUrl || hasHeading;
  }

  async getResultCount(): Promise<number> {
    await this.waitForResults();
    return this.resultItems.count();
  }

  async getTitleOfResult(index: number): Promise<string> {
    await this.waitForResults();
    const title = await this.resultTitles.nth(index).innerText();
    return title.trim();
  }
}
