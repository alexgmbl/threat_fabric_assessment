import { expect, test } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { SearchResultsPage } from '../../pages/SearchResultsPage';

test('basic search from homepage returns Harry Potter results', async ({ page }) => {
  // Arrange
  const homePage = new HomePage(page);
  const searchResultsPage = new SearchResultsPage(page);

  await homePage.goto();

  // Act
  await homePage.search('Harry Potter');

  // Assert
  await searchResultsPage.waitForResults();
  await expect(await searchResultsPage.isResultsPageDisplayed()).toBeTruthy();

  const resultCount = await searchResultsPage.getResultCount();
  expect(resultCount).toBeGreaterThan(0);

  const firstTitle = await searchResultsPage.getTitleOfResult(0);
  expect(firstTitle).not.toEqual('');

  const topFiveTitles = await Promise.all(
    Array.from({ length: Math.min(resultCount, 5) }, (_, index) => searchResultsPage.getTitleOfResult(index))
  );
  expect(topFiveTitles.some((title) => /harry\s+potter/i.test(title))).toBeTruthy();
});
