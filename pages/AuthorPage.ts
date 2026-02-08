import { Locator, Page } from '@playwright/test';

export class AuthorPage {
  readonly page: Page;
  readonly authorNameHeading: Locator;
  readonly worksSection: Locator;

  constructor(page: Page) {
    this.page = page;
    this.authorNameHeading = page.locator('h1');
    this.worksSection = page.locator('#author-works');
  }

  async goto(authorKey: string): Promise<void> {
    await this.page.goto(`/authors/${authorKey}`);
  }
}
