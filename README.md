# KOTC League

Static React site for Paddle Up Pickleball's King of the Court league rankings,
schedule, event results, player statistics, and format. League data is scraped
from the published spreadsheet and served as static JSON.

## Development

The project uses npm locally and in CI.

```bash
npm ci
npm run scrape
npm run dev
```

Other commands:

```bash
npm run build
npm run typecheck
npm run lint
npm run format
```

## Project structure

- `src/pages/` contains page-level composition and data loading.
- `src/components/` contains reusable presentation and layout components.
- `src/hooks/` contains browser and data lifecycle logic.
- `src/types/` contains domain models and runtime data validation.
- `src/config/` contains routes, navigation metadata, and external links.
- `scripts/scrape.mjs` fetches the published Google Sheet and writes
  `public/data/leaderboard.json`.

The scraper consumes the `Current Month`, `Past 30 Days`, `All Time`, `Past
Events`, `Upcoming Events`, and `Event Log` tabs. It joins event summaries to
nightly results by date and assigns stable URL IDs to players. Fetches use
bounded retries and timeouts, and the generated file is replaced atomically
only after every tab and cross-sheet event count has been validated.

The app uses a small hash-based route layer. Add routes and their document
titles to `src/config/site.ts`, then render the page from `src/App.tsx`.
Shareable detail routes use `#/schedule/YYYY-MM-DD` for events and
`#/players/player-id` for players. The league format lives at `#/format`.

Pushes to `main` build the site to Vite's ignored `dist/` directory and deploy
that output through the GitHub Pages artifact workflow. Generated site files
are not committed to the repository.
