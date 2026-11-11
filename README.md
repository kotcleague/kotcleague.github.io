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

The ranking tabs show `Past 60 Days` (the default), the current month's name,
and `Last Month`, using the corresponding published sheet tabs. `All Time`
rankings are still scraped for internal use and validation but are not shown
as a ranking tab. Player profiles use `Past 60 Days` rankings. Court assignments
preserve the `Seeding` sheet's seed order and read its `Past 60 Days` points
column; that sheet's points and seed calculations must use the 60-day period.

The scraper consumes the `Current Month`, `Past 60 Days`, `Last Month`, `All
Time`, `Past Events`, `Upcoming Events`, and `Event Log` tabs. It joins event summaries to
nightly results by date and assigns stable URL IDs to players. Upcoming Court
Reserve links are also read to publish registration counts and matched player
IDs for the initial assignments tool. Fetches use bounded retries and
timeouts, and the generated file is replaced atomically only after every tab
and cross-sheet event count has been validated.

CourtReserve scraping supports event links using either
`/Online/Events/Details/<club-id>?resId=<reservation-id>` or
`/Online/Events/Details/<club-id>/<event-code>`. It establishes an anonymous
session with the event page, then requests CourtReserve's public details
endpoint with session cookies and a Referer. No login or browser installation
is needed for regular league scraping. Responses must contain valid event
details, and registrant rows must agree with the published registrant count.
An event with no registrants tab or table is treated as empty only after the
event details have been validated; portal shells, login pages, and malformed
responses fail the scrape rather than publishing a false zero count.

Run the focused HTTP and parsing regression tests with:

```bash
npm run test:courtreserve
```

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
`public/data/club-match-2026.json`. These event-specific values are permanently
frozen at the verified October standings: 39 Paddle Up players and 32 Club 65
players, captured on November 2, 2026 UTC. They are saved standings, not
confirmed invitations.

To validate the frozen data:

```bash
npm run scrape:qualification
npm run test:qualification:frozen
```

Despite its historical name, `scrape:qualification` is now validation-only.
It never fetches sources, launches a browser, or writes data, regardless of
the current date. Old refresh flags are rejected. The hourly workflow updates
and commits only regular league data; it does not stage or modify this event's
snapshot. Both scraping and deployment workflows reject invalid or missing
frozen data, including unresolved merge-conflict markers, before publishing.

Paddle Up's values came from the published **Last Month** sheet while it
represented October. Club 65's values came from the verified **Overall**
monthly table in the [Club 65 session](https://www.rekplay.com/live/dtzk1o),
with the session's October period confirmed manually. Each club's published
scoring is retained separately. Source links are historical provenance:
those live sources may change, but this event's saved values will not.
Capture timestamps are retained in the data but are not displayed.

Pushes to `main` build the site to Vite's ignored `dist/` directory and deploy
that output through the GitHub Pages artifact workflow.
