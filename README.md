# Open Library Test Framework (Skeleton)

This is a starter Playwright framework for testing https://openlibrary.org with:

- UI testing using Page Object Model
- API testing via dedicated API client classes
- Parameterized API scenarios
- HTML reporting
- Clean and scalable folder structure

## Project Structure

```text
.
├─ tests/
│  ├─ api/
│  └─ ui/
├─ pages/
├─ api/
├─ test-data/
├─ playwright.config.ts
├─ package.json
└─ README.md
```

## Getting Started

```bash
npm install
npx playwright install
npm test
```

## Run Tests

```bash
npm run test:ui
npm run test:api
```

## Reporting

Playwright generates HTML reports in `playwright-report/`.

```bash
npm run report
```
