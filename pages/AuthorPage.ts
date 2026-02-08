import { Locator, Page } from '@playwright/test';

export class AuthorPage {
  private readonly page: Page;
  private readonly authorNameHeading: Locator;
  private readonly worksSection: Locator;

  constructor(page: Page) {
    this.page = page;
    this.authorNameHeading = page.locator('h1');
    this.worksSection = page.locator('#author-works');
  }

  async gotoAuthorPage(authorKey: string): Promise<void> {
    const normalizedKey = authorKey.replace(/^\/authors\//, '').replace(/^\//, '');
    await this.page.goto(`/authors/${normalizedKey}`);
  }

  async getAuthorName(): Promise<string> {
    return (await this.authorNameHeading.textContent())?.trim() ?? '';
  }

  async hasWorksSection(): Promise<boolean> {
    return this.worksSection.isVisible();
  }
}
