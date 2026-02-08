# Open Library Test Automation Framework

A professional Playwright-based automation framework for validating both **UI** and **API** behavior of [Open Library](https://openlibrary.org).

---

## 1) Purpose

This repository provides a clean, scalable baseline for:

- **UI end-to-end testing** using the **Page Object Model (POM)**
- **API testing** using dedicated, typed API clients
- **Data-driven test scenarios** through JSON-based parameterization
- **Actionable reporting** through Playwright HTML reports

The framework is intentionally structured to be easy to extend for additional domains, pages, and endpoint coverage.

---

## 2) Tech Stack

### Primary stack

- **Language:** TypeScript
- **Test Runner / Automation:** Playwright Test (`@playwright/test`)
- **Architecture patterns:**
  - POM for UI automation (`pages/`)
  - API client abstraction for endpoint interactions (`api/`)
  - Externalized test data (`test-data/`)
- **Reporting:** Playwright HTML Reporter

### Why this stack

- Single toolchain for UI + API in one framework
- Excellent parallelization and retry support
- Built-in tracing and debugging artifacts
- Strong TypeScript support for maintainable, typed tests

### Alternatives considered

- **Cypress**
  - ✅ Great DX for browser tests
  - ⚠️ API + multi-browser + architecture flexibility less unified than Playwright for this use case
- **Selenium + TestNG/JUnit (Java)**
  - ✅ Enterprise familiarity and broad ecosystem
  - ⚠️ Heavier setup, slower feedback cycle, and more boilerplate for modern web + API combined flows
- **WebdriverIO**
  - ✅ Mature ecosystem with flexible plugins
  - ⚠️ More configuration overhead compared to Playwright’s batteries-included test runner
- **Postman/Newman for API + separate UI stack**
  - ✅ Useful for API collections
  - ⚠️ Splits tooling and conventions across separate frameworks, increasing maintenance overhead

---

## 3) Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install dependencies

```bash
npm install
```

### Install Playwright browsers

```bash
npx playwright install
```

---

## 4) How to Run Tests

### Run all tests (UI + API)

```bash
npm test
```

### Run only UI tests

```bash
npm run test:ui
```

### Run only API tests

```bash
npm run test:api
```

### Run in headed mode (debugging)

```bash
npm run test:headed
```

### Run one test file

```bash
npx playwright test tests/ui/advanced-search-rowling-top-rated.spec.ts
```

---

## 5) Project Structure and Design

```text
.
├─ tests/
│  ├─ api/
│  │  ├─ search-author.spec.ts
│  │  ├─ author-details.spec.ts
│  │  └─ search-book-author-website.spec.ts
│  └─ ui/
│     ├─ advanced-search.spec.ts
│     ├─ author-page.spec.ts
│     └─ advanced-search-rowling-top-rated.spec.ts
├─ pages/
│  ├─ SearchPage.ts
│  ├─ ResultsPage.ts
│  └─ AuthorPage.ts
├─ api/
│  ├─ OpenLibraryApiClient.ts
│  ├─ SearchApi.ts
│  ├─ AuthorApi.ts
│  └─ types.ts
├─ test-data/
│  ├─ authors.json
│  └─ book-search-authors.json
├─ playwright.config.ts
├─ package.json
└─ README.md
```

### Folder responsibilities

- **`tests/ui/`**
  - UI scenario validations only
  - Assertions live here (not in page objects)
- **`tests/api/`**
  - Endpoint/flow validations
  - Parameterized test loops from JSON fixtures
- **`pages/`**
  - UI selectors + business actions encapsulated per page
  - No assertions; reusable interaction layer only
- **`api/`**
  - Typed API clients and response contracts
  - Centralized API error handling for consistent diagnostics
- **`test-data/`**
  - Test input fixtures for data-driven execution
- **`playwright.config.ts`**
  - Global execution config: baseURL, retries, tracing, reporters

---

## 6) API Client Conventions

`OpenLibraryApiClient` exposes reusable typed methods with centralized error handling:

- `search(query, page?)` -> `GET /search.json`
- `searchByAuthor(author, page?)` -> `GET /search.json`
- `searchByTitleAndAuthor(title, author, page?)` -> `GET /search.json`
- `getAuthorByKey(authorKey)` -> `GET /authors/{authorKey}.json`

Thin wrappers (`SearchApi`, `AuthorApi`) provide domain-level readability while reusing shared request logic.

---

## 7) Reporting Details

### Default reporters

Configured in `playwright.config.ts`:

- **`list`**: concise terminal output
- **`html`**: rich local report for run summaries and debugging

### Generate and open report

```bash
npm run report
```

By default, reports are generated under:

- `playwright-report/`

### Debug artifacts

- Tracing is configured as `on-first-retry` to capture useful retry diagnostics without high baseline overhead.

---

## 8) Recommended Next Enhancements

- Add CI workflow (GitHub Actions) with artifact publishing for HTML reports and traces
- Add environment configuration (`.env`) for base URLs and test toggles
- Add tagging strategy (`@smoke`, `@regression`, `@api`, `@ui`) and selective execution scripts
- Add schema validation for API response contracts
