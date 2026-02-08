import { test, expect } from '@playwright/test';
import { SearchPage } from '../../pages/SearchPage';
import { ResultsPage } from '../../pages/ResultsPage';
import { AuthorPage } from '../../pages/AuthorPage';

test('user can search and open an author page', async ({ page }) => {
  const searchPage = new SearchPage(page);
  const resultsPage = new ResultsPage(page);
  const authorPage = new AuthorPage(page);

  await searchPage.gotoHome();
  await searchPage.searchByAuthor('J. R. R. Tolkien');

  const resultsCount = await resultsPage.getResultsCount();
  expect(resultsCount).toBeGreaterThan(0);

  await resultsPage.openAuthorProfile('Tolkien');

  const authorName = await authorPage.getAuthorName();
  expect(authorName.length).toBeGreaterThan(0);
});
