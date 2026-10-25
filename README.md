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

## Club match and October qualification standings

The November 8, 2026 Paddle Up vs Club 65 match is maintained in
`src/config/specialEvent.ts` and has a shareable details page at
`#/schedule/paddle-up-vs-club-65-2026`. Its Rankings teaser and Schedule entry
remain visible through the event date in America/Chicago; the details URL
remains available afterward. Below the club-vs-club header, the event has three
sections: At a glance, the six-row game lineup, and October
standings. Partner rotation is explained with the lineup; the invitation
process is explained with the standings instead of separate sections. The
event and Format page share `QuickFacts`; the event uses its compact variant with
the original small blue labels. Its fact boxes show players, date/time, venue,
and format, with scoring and the DreamBreaker explained in the Rules note.
The snapshot retains all players; source links lead to full leaderboards. Both clubs stay side by
side on narrow screens; points are hidden when an individual standings card
has less than 17rem of content width, keeping full player names readable.
This club match is separate from
scraped league registration, player profiles, and results.

The details page loads both clubs' October 2026 qualification snapshots from
`public/data/club-match-2026.json`. To refresh them:

```bash
npx playwright install chromium
npm run scrape
npm run scrape:qualification
npm run test:qualification
```

RekPlay is client-rendered. The scraper opens the public
[Club 65 session](https://www.rekplay.com/live/dtzk1o), explicitly selects
**Overall** (the page defaults to Week 2), verifies the selected tab and Monthly
Winners heading, then reads the published ranks, ties, weekly scores, totals,
records, and qualification notes. It preserves Club 65's own scoring and strips
trailing asterisks from player names, retaining their eligibility meaning
as separate metadata without adding the marker back to displayed names. It does
not combine it with Paddle Up's points. Paddle Up data comes from the validated
current-month league output. Standings are not confirmed rosters.

The hourly workflow installs Chromium and runs both scrapers, committing and
redeploying only when substantive data changes. Snapshots are validated and
replaced atomically. Qualification failures are reported as workflow failures
after allowing regular league updates to publish; previous qualification data
is retained. Capture timestamps remain in the snapshot data but are not displayed
on the event page.

Capture is restricted to October 2026 in America/Chicago. After October 31,
the last successful October snapshots are retained and labeled as saved
snapshots, not guaranteed final standings. A missing snapshot after rollover is
an error, never a reason to substitute November rankings. Verify final
invitations against each club's source.

On systems unsupported by Playwright's bundled Chromium, an installed compatible
Chromium browser can be used explicitly, for example:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH="/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" npm run scrape:qualification
```

The same environment variable applies to `npm run test:qualification`. Linux CI
uses Playwright's bundled Chromium (`npx playwright install --with-deps chromium`).

Pushes to `main` build the site to Vite's ignored `dist/` directory and deploy
that output through the GitHub Pages artifact workflow.
