import { expect, Locator, Page } from '@playwright/test';

export class AuthorPage {
  readonly page: Page;
  readonly authorNameHeading: Locator;
  readonly ratingSortSelect: Locator;

  constructor(page: Page) {
    this.page = page;
    // Using a more specific selector for the heading if possible
    this.authorNameHeading = page.locator('h1'); 
    this.ratingSortSelect = page.locator('select#sort, select[name="sort"]');
  }

  async goto(authorKey: string): Promise<void> {
    await this.page.goto(`/authors/${authorKey}`);
    // Wait for the heading to be visible to ensure page load
    await expect(this.authorNameHeading).toBeVisible();
  }

  async getAuthorName(): Promise<string> {
    return (await this.authorNameHeading.innerText()).trim();
  }

 async sortWorksByRating(): Promise<void> {
  // 1. Open the dropdown
  const dropdown = this.page.locator('summary').filter({ hasText: /Most Editions|Sort/i });
  await dropdown.click();

  // 2. Click the 'Top Rated' link
  const ratingLink = this.page.getByRole('link', { name: /top rated/i });
  
  // Ensure the link is visible before clicking (the dropdown animation might take a millisecond)
  await expect(ratingLink).toBeVisible();
  await ratingLink.click();

  // 3. Validation
  await expect(this.page).toHaveURL(/sort=rating/);
 }

  async getTopRatedWorkTitle(): Promise<string> {
    const topWorkTitle = this.page.locator('.booktitle .results').first();

    await expect(topWorkTitle).toBeVisible();
    return (await topWorkTitle.textContent())?.trim() ?? '';
  }
}
