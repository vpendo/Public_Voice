# Frontend tests (local)

Unit and component tests with **Vitest** and **React Testing Library**.

## Setup

From the `Frontend` folder:

```bash
pnpm install
```

## Run tests

```bash
pnpm test        # watch mode
pnpm test:run    # single run (e.g. for CI)
```

## What is tested

- **Footer.test.tsx**: Footer renders brand, quick links, and accessible social links.
- **Report.test.tsx**: Report page renders form with required fields and submit button (mocked contexts).

Tests use an in-memory DOM (jsdom); no backend or browser required.
