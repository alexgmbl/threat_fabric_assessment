import { expect, Locator, Page } from '@playwright/test';

export class AuthorPage {
  readonly page: Page;
  readonly authorNameHeading: Locator;
  readonly ratingSortSelect: Locator;
  readonly workTiles: Locator;

  constructor(page: Page) {
    this.page = page;
    // Using a more specific selector for the heading if possible
    this.authorNameHeading = page.locator('h1'); 
    this.ratingSortSelect = page.locator('select#sort, select[name="sort"]');
    this.workTiles = page.locator('main li:has(a[href*="/works/"])');
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
    // After sorting by rating, Open Library can place non-book collection/pool entries first.
    // We filter to the first tile that has a preview CTA group, which indicates a book item.
    const workCount = await this.workTiles.count();

    for (let i = 0; i < workCount; i += 1) {
      const workTile = this.workTiles.nth(i);
      const previewCtaGroup = workTile.locator('div.cta-button-group').filter({
        has: workTile.locator('a.cta-btn--preview'),
      });

      if ((await previewCtaGroup.count()) > 0) {
        const topWorkTitle = workTile.locator('.booktitle .results, .booktitle a').first();
        await expect(topWorkTitle).toBeVisible();
        return (await topWorkTitle.textContent())?.trim() ?? '';
      }
    }

    throw new Error('No rated book entry with preview CTA was found in the works list.');
  }
}
