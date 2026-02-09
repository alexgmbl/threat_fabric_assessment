import { Locator, Page } from '@playwright/test';

export class SearchPage {
  readonly page: Page;
  readonly advancedSearchLink: Locator;
  readonly searchInput: Locator;
  readonly searchSubmitButton: Locator;
  readonly searchBySelect: Locator;

  constructor(page: Page) {
    this.page = page;
    this.advancedSearchLink = page.getByRole('link', { name: /advanced search/i });
    this.searchInput = page.locator('input#searchBar, input[name="q"]').first();
    this.searchSubmitButton = page.getByRole('button', { name: /search submit|search/i }).first();
    this.searchBySelect = page.getByRole('combobox', { name: /search by/i });
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async gotoHome(): Promise<void> {
    await this.goto();
  }

  async searchByAuthor(authorName: string): Promise<void> {
    await this.goto();

    if (await this.searchBySelect.count()) {
      const authorOptionValue = await this.searchBySelect.evaluate((el) => {
        const options: any[] = Array.from((el as any).options ?? []);
        const authorOption: any = options.find((option: any) => /author/i.test(String(option.label)) || /author/i.test(String(option.value)));
        return authorOption?.value ?? null;
      });

      if (authorOptionValue) {
        await this.searchBySelect.selectOption(authorOptionValue);
      }
    }

    await this.searchInput.fill(authorName);
    await this.searchSubmitButton.click();
    await this.page.waitForURL(/\/search(\?|\/)/);
  }

  async openAdvancedSearch(): Promise<void> {
    await this.page.goto('/advancedsearch');
    await this.page.waitForURL(/\/advancedsearch/);
  }

  async advancedSearchByTitleAndAuthor(title: string, author: string): Promise<void> {
    await this.page.goto('/advancedsearch');

    const titleInput = this.page.locator('input[name="title"], input#title').first();
    const authorInput = this.page.locator('input[name="author"], input#author').first();

    await titleInput.fill(title);
    await authorInput.fill(author);

    const submitButton = this.page.getByRole('button', { name: /search/i }).first();
    await submitButton.click();
    await this.page.waitForURL(/\/search(\?|\/)/);
  }
}
