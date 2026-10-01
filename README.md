# KOTC League

Static React site for KOTC League rankings, schedule, event results, player
statistics, and format. League data is scraped from the published spreadsheet
and served as static JSON.

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

## Contact form

The Contact page submits messages through Web3Forms so the recipient email is
not published in the site. To configure it:

1. Create a Web3Forms access key for the private recipient email.
2. Copy `.env.example` to `.env.local` and set the access key for local
   development.
3. Add a GitHub repository variable named `WEB3FORMS_ACCESS_KEY` for production
   Pages builds.
4. Restrict the form to the production domain in Web3Forms.

The access key is a public form identifier and is included in the static
JavaScript bundle; it does not reveal the recipient email address.

## Project structure

- `src/pages/` contains page-level composition and data loading.
- `src/components/` contains reusable presentation and layout components.
- `src/hooks/` contains browser and data lifecycle logic.
- `src/types/` contains domain models and runtime data validation.
- `src/config/` contains routes, navigation metadata, and external links.
- `scripts/scrape.mjs` fetches the published Google Sheet and writes
  `public/data/leaderboard.json`.

## Shared UI

Use `PageHeader` and `PageContent` for page layout, and `SectionHeading` for
section titles, descriptions, and trailing actions. Player profiles use the
same header with its optional `media` slot.

`Card`, `EditorialLinkCard`, and `TableShell` share the surface styles in
`src/lib/styles.ts`, alongside panel accents, inset surfaces, fields, and
controls. Use `EditorialTable` cells with `score` for highlighted league
points, `StatGrid` for metric groups, and `PlacementBadge` / `LeagueMedals`
for standings. `EventRegistrationActions` keeps registration links consistent
on the rankings and schedule pages.

Keep these shared components responsive and provide light and dark variants.
Court assignment grids respond to their container width so they also fit the
builder's narrower workspace.

## Default player avatars

Players without a profile photo get a deterministic generated avatar: a
stylised top-down pickleball court with the player's initials. Every visual
choice (palette, court rotation, shaded service boxes) is derived from a
32-bit FNV-1a hash of the player id in `src/lib/avatar.ts`, so a player always
renders the same avatar everywhere. `src/components/PlayerAvatarFallback.tsx`
draws it, and light/dark colours are swapped through the
`.player-avatar-fallback` CSS custom properties in `src/index.css`.

`public/avatar-preview.html` is a standalone gallery of the design options that
were considered, rendered in both light and dark mode. It ships with the site,
so it is reachable at `/avatar-preview.html` on the deployed site (and at
`http://localhost:5173/avatar-preview.html` in dev). It is not linked from the
app's navigation.

The scraper consumes the `Current Month`, `Past 30 Days`, `All Time`, `Past
Events`, `Upcoming Events`, and `Event Log` tabs. It joins event summaries to
nightly results by date and assigns stable URL IDs to players. Upcoming Court
Reserve links are also read to publish registration counts and matched player
IDs for the initial assignments tool. Fetches use bounded retries and
timeouts, and the generated file is replaced atomically only after every tab
and cross-sheet event count has been validated.

To link a past event to its YouTube livestream or recording, add a `YouTube
URL` column to the `Past Events` tab and enter the matching URL on the event's
row. The column and individual values are optional, and cells may contain
either a pasted URL or linked text.

The app uses a small hash-based route layer. Add routes and their document
titles to `src/config/site.ts`, then render the page from `src/App.tsx`.
Shareable detail routes use `#/schedule/YYYY-MM-DD` for events and
`#/players/player-id` for players. The league format lives at `#/format`, and
the contact form lives at `#/contact`.

Pushes to `main` build the site to Vite's ignored `dist/` directory and deploy
that output through the GitHub Pages artifact workflow.
