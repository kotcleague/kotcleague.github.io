import { load } from "cheerio";
import {
  writeFileSync,
  mkdirSync,
  existsSync,
  readFileSync,
  renameSync,
  unlinkSync,
} from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(
  __dirname,
  "..",
  "public",
  "data",
  "leaderboard.json"
);

// Published "King of the Court League" Google Sheet.
const PUBLISH_ID =
  "2PACX-1vS3d2RVZh7OT4-wHFWvaTe0CnT3eSH-1rwGxLNyBURh8IZLThRAMXx5pd56XF6AURpWm1cDSsuhsQDj";
const BASE = `https://docs.google.com/spreadsheets/d/e/${PUBLISH_ID}/pubhtml`;
const FETCH_ATTEMPTS = 3;
const FETCH_TIMEOUT_MS = 15_000;
const RETRY_BASE_DELAY_MS = 1_000;
const SNAPSHOT_ATTEMPTS = 3;
const SNAPSHOT_RETRY_DELAY_MS = 2_000;

// Ranking sheet tab name -> site view slug.
const VIEWS = {
  "Current Month": "current-month",
  "Past 30 Days": "past-30-days",
  "All Time": "all-time",
};

const EVENT_TABS = ["Past Events", "Upcoming Events", "Event Log"];
const PLAYER_DATA_TABS = ["Player Data", "Players"];
const SEEDING_TAB = "Seeding";
const SHEET_DATE_PATTERN = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/;

// ============================================================
// GOOGLE SHEET COLUMN NAMES
// ============================================================
// Keep all sheet-specific column names here.
//
// The scraper looks up columns by these names, NOT by position.
// If you rename a column in Google Sheets, update it here.
//
// Column order in the Google Sheet can change without breaking
// the scraper.
// ============================================================

const COLUMNS = {
  rankings: {
    rank: "Ranking",
    move: "●",
    player: "Player",
    points: "Points",
    events: "# of Events",
    gameMakerPoints: "GM Points",
    wins: "Wins",
    losses: "Losses",
    winRate: "Win %",
    pointsEarned: "PE",
    pointsAgainst: "PA",
    pointDifferential: "Pt Diff %",
  },

  eventLog: {
    date: "Date",
    player: "Player",
    gameMakerPoints: "GM Points",
    wins: "Wins",
    losses: "Losses",
    pointsEarned: "PE",
    pointsAgainst: "PA",
    place: "Place",
    points: "Points",
    courts: "Courts",
    winRate: "Win %",
    pointDifferential: "Point diff %",
  },

  playerData: {
    name: "Name",
    inGroup: "In Group",
    dupr: "DUPR",
    gameMakerProfileUrl: "Game Maker Profile URL",
    photoUrl: "Photo URL",
    points: "Points",
    duprRank: "DUPR Rank",
    leagueRank: "League Rank",
  },

  seeding: {
    seed: "Seed",
    player: "Player",
    past30Days: "Past 30 Days",
    allTime: "All Time",
    dupr: "DUPR",
  },

  upcomingEvents: {
    date: "Date",
    courtReserveUrl: "Court Reserve URL",
    gameMakerInviteUrl: "Game Maker Invite URL",
    gameMakerEventName: "Game Maker Event Name",
  },

  pastEvents: {
    date: "Past Events",
    playerCount: "Player Count",
    courts: "Courts",
    games: "Games",
    maxPointsEarnable: "Max Points Earnable",
    rounds: "Rounds",
    first: "1st Place",
    second: "2nd Place",
    third: "3rd Place",
  },
};

// Internal output field names -> human-readable sheet labels.
// This is only used for error messages and the performance parser.
const PERFORMANCE_FIELDS = [
  ["gameMakerPoints", "GM Points"],
  ["wins", "Wins"],
  ["losses", "Losses"],
  ["winRate", "Win %"],
  ["pointsEarned", "PE"],
  ["pointsAgainst", "PA"],
  ["pointDifferential", "Point diff %"],
];

class HttpError extends Error {
  constructor(response) {
    super(`HTTP ${response.status} ${response.statusText}`);
    this.status = response.status;
  }
}

function isRetryableFetchError(error) {
  return (
    error instanceof TypeError ||
    error?.name === "AbortError" ||
    (error instanceof HttpError &&
      (error.status === 408 || error.status === 429 || error.status >= 500))
  );
}

function wait(milliseconds) {
  return new Promise((resolvePromise) =>
    setTimeout(resolvePromise, milliseconds)
  );
}

async function fetchHtml(url, context) {
  let lastError;
  let attemptsMade = 0;

  for (let attempt = 1; attempt <= FETCH_ATTEMPTS; attempt += 1) {
    attemptsMade = attempt;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new HttpError(response);

      const html = await response.text();
      if (!html.trim()) throw new Error("Received an empty response");
      return html;
    } catch (error) {
      lastError = error;
      if (attempt === FETCH_ATTEMPTS || !isRetryableFetchError(error)) break;

      const delay = RETRY_BASE_DELAY_MS * 2 ** (attempt - 1);
      console.warn(
        `  Fetch attempt ${attempt}/${FETCH_ATTEMPTS} for ${context} failed (${error.message}); retrying in ${delay}ms...`
      );
      await wait(delay);
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new Error(
    `Failed to fetch ${context} after ${attemptsMade} attempt${
      attemptsMade === 1 ? "" : "s"
    }: ${lastError?.message ?? "unknown error"}`,
    { cause: lastError }
  );
}

// Read the published tab menu and map each tab name to its gid.
// Google builds the tab menu with JavaScript, so the mapping lives in a series
// of `items.push({name: "...", ..., gid: "..."})` calls rather than in the DOM.
function parseTabGids(html) {
  const gids = {};
  const re = /items\.push\(\{name:\s*"((?:[^"\\]|\\.)*)"[^}]*?gid:\s*"(\d+)"/g;
  let match;

  while ((match = re.exec(html)) !== null) {
    const name = JSON.parse(
      `"${match[1].replace(/\\x26/g, "&")}"`
    );
    gids[name] = match[2];
  }

  return gids;
}

// Turn a movement cell's text into a structured value.
// "●" / "" => none, "▲5" => up 5, "▼1" => down 1.
function parseMovement(text) {
  const trimmed = (text || "").trim();

  if (trimmed.startsWith("▲")) {
    return {
      dir: "up",
      places: parseInt(trimmed.slice(1), 10) || 0,
    };
  }

  if (trimmed.startsWith("▼")) {
    return {
      dir: "down",
      places: parseInt(trimmed.slice(1), 10) || 0,
    };
  }

  return {
    dir: "none",
    places: 0,
  };
}

function parseRequiredNumber(text, field, context) {
  const value = Number(text);

  if (!Number.isFinite(value)) {
    throw new Error(`Invalid ${field} "${text}" in ${context}`);
  }

  return value;
}

function parsePerformanceStats(cells, context) {
  return Object.fromEntries(
    PERFORMANCE_FIELDS.map(([key, label], index) => [
      key,
      parseRequiredNumber(cells[index], label, context),
    ])
  );
}

function normalizeHeader(value) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("en-US");
}

function readRowCells($, row) {
  return $(row)
    .find("td")
    .map((_, td) => $(td).text().trim())
    .get();
}

// Build a map such as:
// {
//   "player": 2,
//   "points": 3,
//   "wins": 5
// }
function buildHeaderMap(cells) {
  const map = new Map();

  cells.forEach((cell, index) => {
    const header = normalizeHeader(cell);

    if (header && !map.has(header)) {
      map.set(header, index);
    }
  });

  return map;
}

// Find the row containing the expected column headers.
// This allows the actual data columns to be in any order.
function findHeaderRow($, table, requiredColumns, context) {
  const required = requiredColumns.map(normalizeHeader);
  const rows = $(table).find("tbody tr");

  for (let i = 0; i < rows.length; i += 1) {
    const cells = readRowCells($, rows[i]);
    const headerMap = buildHeaderMap(cells);

    if (required.every((column) => headerMap.has(column))) {
      return {
        row: rows[i],
        headerMap,
      };
    }
  }

  throw new Error(
    `Could not find the header row for ${context}. Expected columns: ${requiredColumns.join(
      ", "
    )}`
  );
}

function getColumn(headerMap, cells, columnName, context) {
  const index = headerMap.get(normalizeHeader(columnName));

  if (index === undefined) {
    throw new Error(`Missing column "${columnName}" in ${context}`);
  }

  return cells[index] ?? "";
}

function assertSheetTable(html, tabName) {
  const $ = load(html);

  if ($("table tbody").length === 0) {
    throw new Error(
      `No data table found in "${tabName}" — Google may have returned an unexpected page`
    );
  }
}

function parseDateId(text, context) {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/.exec(
    text.trim()
  );

  if (!match) {
    throw new Error(`Invalid date "${text}" in ${context}`);
  }

  const month = Number(match[1]);
  const day = Number(match[2]);
  const yearValue = Number(match[3]);
  const year = yearValue < 100 ? 2000 + yearValue : yearValue;

  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error(`Invalid calendar date "${text}" in ${context}`);
  }

  return `${year.toString().padStart(4, "0")}-${month
    .toString()
    .padStart(2, "0")}-${day.toString()
    .padStart(2, "0")}`;
}

function parseOptionalUrl(text, field, context) {
  const value = text.trim();

  if (!value) return null;

  let url;

  try {
    url = new URL(value);
  } catch {
    throw new Error(`Invalid ${field} URL "${value}" in ${context}`);
  }

  if (
    (url.hostname === "google.com" || url.hostname === "www.google.com") &&
    url.pathname === "/url"
  ) {
    const target = url.searchParams.get("q");

    if (target) {
      try {
        url = new URL(target);
      } catch {
        throw new Error(
          `Invalid ${field} redirect URL "${target}" in ${context}`
        );
      }
    }
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(
      `Unsupported ${field} URL protocol in ${context}`
    );
  }

  return url.toString();
}

function createPlayerRegistry() {
  const idsByName = new Map();
  const namesById = new Map();

  return {
    get(name) {
      const normalizedName = name.trim().replace(/\s+/g, " ");

      if (!normalizedName) {
        throw new Error(
          "Cannot create a player ID from an empty name"
        );
      }

      const nameKey = normalizedName.toLocaleLowerCase("en-US");
      const existing = idsByName.get(nameKey);

      if (existing) return existing;

      const id = normalizedName
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("en-US")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      if (!id) {
        throw new Error(
          `Cannot create a player ID from "${normalizedName}"`
        );
      }

      const conflictingName = namesById.get(id);

      if (conflictingName && conflictingName !== nameKey) {
        throw new Error(
          `Player ID collision: "${normalizedName}" and "${conflictingName}" both map to "${id}"`
        );
      }

      idsByName.set(nameKey, id);
      namesById.set(id, nameKey);

      return id;
    },
  };
}

// Parse a single ranking tab's HTML table into player rows.
// Columns are located by header name, not position.
function parseRankingTable(html, tabName, players) {
  const $ = load(html);
  const rankings = [];
  const columns = COLUMNS.rankings;

  const tables = $("table").toArray();

  for (const table of tables) {
    let header;

    try {
      header = findHeaderRow(
        $,
        table,
        [
          columns.rank,
          columns.move,
          columns.player,
          columns.points,
          columns.events,
          columns.gameMakerPoints,
          columns.wins,
          columns.losses,
          columns.winRate,
          columns.pointsEarned,
          columns.pointsAgainst,
          columns.pointDifferential,
        ],
        `"${tabName}"`
      );
    } catch {
      continue;
    }

    $(table)
      .find("tbody tr")
      .each((_, row) => {
        if (row === header.row) return;

        const cells = readRowCells($, row);

        const rankText = getColumn(
          header.headerMap,
          cells,
          columns.rank,
          `"${tabName}"`
        );

        const name = getColumn(
          header.headerMap,
          cells,
          columns.player,
          `"${tabName}"`
        );

        // Skip empty/padding rows.
        if (!name || !/^\d+$/.test(rankText)) return;

        const context = `"${tabName}" row for ${name}`;

        rankings.push({
          id: players.get(name),

          rank: parseRequiredNumber(
            rankText,
            "rank",
            context
          ),

          name,

          points: parseRequiredNumber(
            getColumn(
              header.headerMap,
              cells,
              columns.points,
              context
            ),
            "points",
            context
          ),

          events: parseRequiredNumber(
            getColumn(
              header.headerMap,
              cells,
              columns.events,
              context
            ),
            "event count",
            context
          ),

          ...parsePerformanceStats(
            [
              getColumn(
                header.headerMap,
                cells,
                columns.gameMakerPoints,
                context
              ),
              getColumn(
                header.headerMap,
                cells,
                columns.wins,
                context
              ),
              getColumn(
                header.headerMap,
                cells,
                columns.losses,
                context
              ),
              getColumn(
                header.headerMap,
                cells,
                columns.winRate,
                context
              ),
              getColumn(
                header.headerMap,
                cells,
                columns.pointsEarned,
                context
              ),
              getColumn(
                header.headerMap,
                cells,
                columns.pointsAgainst,
                context
              ),
              getColumn(
                header.headerMap,
                cells,
                columns.pointDifferential,
                context
              ),
            ],
            context
          ),

          move: parseMovement(
            getColumn(
              header.headerMap,
              cells,
              columns.move,
              context
            )
          ),

          // These now come from Player Data.
          photoUrl: null,
          gameMakerProfileUrl: null,
        });
      });

    return rankings;
  }

  throw new Error(
    `Could not find the ranking table for "${tabName}"`
  );
}

// A "Photo URL"/"Game Maker Profile URL" cell may hold a bare URL,
// a hyperlink whose visible text differs from its href, or an
// embedded image.
function readLinkCell(cell) {
  return (
    cell.find("a").attr("href") ??
    cell.find("img").attr("src") ??
    cell.text().trim()
  );
}

// Parse the "Player Data" tab into per-player profile links keyed
// by player id.
function parsePlayerDataTable(html, players) {
  const $ = load(html);
  const profiles = new Map();
  const columns = COLUMNS.playerData;

  $("table").each((_, table) => {
    let header;

    try {
      header = findHeaderRow(
        $,
        table,
        [
          columns.name,
          columns.photoUrl,
          columns.gameMakerProfileUrl,
        ],
        `"Player Data"`
      );
    } catch {
      return;
    }

    $(table)
      .find("tbody tr")
      .each((_, playerRow) => {
        if (playerRow === header.row) return;

        const playerCells = readRowCells($, playerRow);

        const name = getColumn(
          header.headerMap,
          playerCells,
          columns.name,
          `"Player Data"`
        );

        if (!name) return;

        const tableCells = $(playerRow).find("td");

        const photoIndex = header.headerMap.get(
          normalizeHeader(columns.photoUrl)
        );

        const gameMakerIndex = header.headerMap.get(
          normalizeHeader(columns.gameMakerProfileUrl)
        );

        const photo =
          photoIndex === undefined
            ? ""
            : readLinkCell(tableCells.eq(photoIndex));

        const gameMakerProfile =
          gameMakerIndex === undefined
            ? ""
            : readLinkCell(tableCells.eq(gameMakerIndex));

        if (!photo && !gameMakerProfile) return;

        profiles.set(players.get(name), {
          photo,
          gameMakerProfile,
        });
      });
  });

  return profiles;
}

function parseSeedingTable(html, players) {
 const $ = load(html);
 const seeding = [];
 const columns = COLUMNS.seeding;

 $("table").each((_, table) => {
   let header;

   try {
     header = findHeaderRow(
       $,
       table,
       [
         columns.seed,
         columns.player,
         columns.past30Days,
         columns.allTime,
         columns.dupr,
       ],
       `"${SEEDING_TAB}"`
     );
   } catch {
     return;
   }

   $(table)
     .find("tbody tr")
     .each((_, row) => {
       if (row === header.row) return;

       const cells = readRowCells($, row);
       const seedText = getColumn(
         header.headerMap,
         cells,
         columns.seed,
         `"${SEEDING_TAB}"`
       );
       const name = getColumn(
         header.headerMap,
         cells,
         columns.player,
         `"${SEEDING_TAB}"`
       );

       if (!name || !/^\d+$/.test(seedText)) return;

       const context = `"${SEEDING_TAB}" row for ${name}`;
       seeding.push({
         id: players.get(name),
         name,
         seed: parseRequiredNumber(seedText, "seed", context),
         past30Days: parseRequiredNumber(
           getColumn(header.headerMap, cells, columns.past30Days, context),
           "Past 30 Days points",
           context
         ),
         allTime: parseRequiredNumber(
           getColumn(header.headerMap, cells, columns.allTime, context),
           "All Time points",
           context
         ),
         dupr: parseRequiredNumber(
           getColumn(header.headerMap, cells, columns.dupr, context),
           "DUPR",
           context
         ),
       });
     });
 });

 if (seeding.length === 0) {
   throw new Error(`Could not find the "${SEEDING_TAB}" table`);
 }

 return seeding.sort((a, b) => a.seed - b.seed);
}

function parsePastEvents(html, players) {
  const $ = load(html);
  const events = [];
  const columns = COLUMNS.pastEvents;

  $("table").each((_, table) => {
    let header;

    try {
      header = findHeaderRow(
        $,
        table,
        [
          columns.date,
          columns.playerCount,
          columns.courts,
          columns.games,
          columns.maxPointsEarnable,
          columns.rounds,
          columns.first,
          columns.second,
          columns.third,
        ],
        `"Past Events"`
      );
    } catch {
      return;
    }

    $(table)
      .find("tbody tr")
      .each((_, row) => {
        if (row === header.row) return;

        const cells = readRowCells($, row);

        const dateText = getColumn(
          header.headerMap,
          cells,
          columns.date,
          `"Past Events"`
        );

        if (!SHEET_DATE_PATTERN.test(dateText)) return;

        const id = parseDateId(
          dateText,
          '"Past Events"'
        );

        const context = `"Past Events" row for ${id}`;

        const first = getColumn(
          header.headerMap,
          cells,
          columns.first,
          context
        );

        const second = getColumn(
          header.headerMap,
          cells,
          columns.second,
          context
        );

        const third = getColumn(
          header.headerMap,
          cells,
          columns.third,
          context
        );

        const podium = [first, second, third].flatMap(
          (name, index) =>
            name
              ? [
                  {
                    place: index + 1,
                    playerId: players.get(name),
                    name,
                  },
                ]
              : []
        );

        events.push({
          id,
          date: id,

          playerCount: parseRequiredNumber(
            getColumn(
              header.headerMap,
              cells,
              columns.playerCount,
              context
            ),
            "player count",
            context
          ),

          courts: parseRequiredNumber(
            getColumn(
              header.headerMap,
              cells,
              columns.courts,
              context
            ),
            "courts",
            context
          ),

          games: parseRequiredNumber(
            getColumn(
              header.headerMap,
              cells,
              columns.games,
              context
            ),
            "games",
            context
          ),

          maxPointsEarnable: parseRequiredNumber(
            getColumn(
              header.headerMap,
              cells,
              columns.maxPointsEarnable,
              context
            ),
            "maximum points earnable",
            context
          ),

          rounds: parseRequiredNumber(
            getColumn(
              header.headerMap,
              cells,
              columns.rounds,
              context
            ),
            "rounds",
            context
          ),

          podium,
          results: [],
        });
      });
  });

  return events;
}

function parseUpcomingEvents(html) {
  const $ = load(html);
  const events = [];
  const columns = COLUMNS.upcomingEvents;

  $("table").each((_, table) => {
    let header;

    try {
      header = findHeaderRow(
        $,
        table,
        [
          columns.date,
          columns.courtReserveUrl,
          columns.gameMakerInviteUrl,
        ],
        `"Upcoming Events"`
      );
    } catch {
      return;
    }

    $(table)
      .find("tbody tr")
      .each((_, row) => {
        if (row === header.row) return;

        const cells = readRowCells($, row);

        const dateText = getColumn(
          header.headerMap,
          cells,
          columns.date,
          `"Upcoming Events"`
        );

        if (!SHEET_DATE_PATTERN.test(dateText)) return;

        const id = parseDateId(
          dateText,
          '"Upcoming Events"'
        );

        const context = `"Upcoming Events" row for ${id}`;

        const tableCells = $(row).find("td");

        const courtReserveIndex = header.headerMap.get(
          normalizeHeader(columns.courtReserveUrl)
        );

        const gameMakerIndex = header.headerMap.get(
          normalizeHeader(columns.gameMakerInviteUrl)
        );

        const courtReserveText = getColumn(
          header.headerMap,
          cells,
          columns.courtReserveUrl,
          context
        );

        const gameMakerText = getColumn(
          header.headerMap,
          cells,
          columns.gameMakerInviteUrl,
          context
        );

        const courtReserveUrl =
          courtReserveIndex === undefined
            ? courtReserveText
            : tableCells.eq(courtReserveIndex).find("a").attr("href") ??
              courtReserveText;

        const gameMakerUrl =
          gameMakerIndex === undefined
            ? gameMakerText
            : tableCells.eq(gameMakerIndex).find("a").attr("href") ??
              gameMakerText;

        events.push({
          id,
          date: id,

          courtReserveUrl: parseOptionalUrl(
            courtReserveUrl,
            "Court Reserve",
            context
          ),

          gameMakerUrl: parseOptionalUrl(
            gameMakerUrl,
            "Game Maker",
            context
          ),
        });
      });
  });

  return events;
}

function parseEventLog(html, players) {
  const $ = load(html);
  const resultsByEvent = new Map();
  const columns = COLUMNS.eventLog;

  $("table").each((_, table) => {
    let header;

    try {
      header = findHeaderRow(
        $,
        table,
        [
          columns.date,
          columns.player,
          columns.gameMakerPoints,
          columns.wins,
          columns.losses,
          columns.pointsEarned,
          columns.pointsAgainst,
          columns.place,
          columns.points,
          columns.courts,
          columns.winRate,
          columns.pointDifferential,
        ],
        `"Event Log"`
      );
    } catch {
      return;
    }

    $(table)
      .find("tbody tr")
      .each((_, row) => {
        if (row === header.row) return;

        const cells = readRowCells($, row);

        const dateText = getColumn(
          header.headerMap,
          cells,
          columns.date,
          `"Event Log"`
        );

        if (!SHEET_DATE_PATTERN.test(dateText)) return;

        const eventId = parseDateId(
          dateText,
          '"Event Log"'
        );

        const name = getColumn(
          header.headerMap,
          cells,
          columns.player,
          `"Event Log"`
        );

        if (!name) {
          throw new Error(
            `Missing player name in "Event Log" row for ${eventId}`
          );
        }

        const context =
          `"Event Log" row for ${name} on ${eventId}`;

        const result = {
          playerId: players.get(name),
          name,

          points: parseRequiredNumber(
            getColumn(
              header.headerMap,
              cells,
              columns.points,
              context
            ),
            "points",
            context
          ),

          place: parseRequiredNumber(
            getColumn(
              header.headerMap,
              cells,
              columns.place,
              context
            ),
            "place",
            context
          ),

          courts: parseRequiredNumber(
            getColumn(
              header.headerMap,
              cells,
              columns.courts,
              context
            ),
            "courts",
            context
          ),

          ...parsePerformanceStats(
            [
              getColumn(
                header.headerMap,
                cells,
                columns.gameMakerPoints,
                context
              ),
              getColumn(
                header.headerMap,
                cells,
                columns.wins,
                context
              ),
              getColumn(
                header.headerMap,
                cells,
                columns.losses,
                context
              ),
              getColumn(
                header.headerMap,
                cells,
                columns.winRate,
                context
              ),
              getColumn(
                header.headerMap,
                cells,
                columns.pointsEarned,
                context
              ),
              getColumn(
                header.headerMap,
                cells,
                columns.pointsAgainst,
                context
              ),
              getColumn(
                header.headerMap,
                cells,
                columns.pointDifferential,
                context
              ),
            ],
            context
          ),
        };

        const eventResults =
          resultsByEvent.get(eventId) ?? [];

        eventResults.push(result);
        resultsByEvent.set(eventId, eventResults);
      });
  });

  return resultsByEvent;
}

function assertUniqueIds(items, context) {
  const seen = new Set();

  for (const item of items) {
    if (seen.has(item.id)) {
      throw new Error(
        `Duplicate ${context} ID: ${item.id}`
      );
    }

    seen.add(item.id);
  }
}

function validatePastEvents(events) {
  for (const event of events) {
    const context = `"Past Events" row for ${event.id}`;

    if (
      !Number.isInteger(event.playerCount) ||
      event.playerCount < 1
    ) {
      throw new Error(
        `Invalid player count "${event.playerCount}" in ${context}`
      );
    }

    const expectedPodiumSize = Math.min(
      3,
      event.playerCount
    );

    if (event.podium.length !== expectedPodiumSize) {
      throw new Error(
        `Expected ${expectedPodiumSize} podium player${
          expectedPodiumSize === 1 ? "" : "s"
        } in ${context}, found ${event.podium.length}`
      );
    }

    if (event.results.length !== event.playerCount) {
      throw new Error(
        `Expected ${event.playerCount} result${
          event.playerCount === 1 ? "" : "s"
        } for event ${event.id}, found ${
          event.results.length
        }. The sheet may still be updating`
      );
    }

    const playerIds = new Set(
      event.results.map((result) => result.playerId)
    );

    const places = new Set(
      event.results.map((result) => result.place)
    );

    if (
      playerIds.size !== event.results.length ||
      places.size !== event.results.length
    ) {
      throw new Error(
        `Duplicate player or place in results for event ${event.id}`
      );
    }
  }
}

function validateAllTimeEventCounts(
  allTimeRankings,
  pastEvents
) {
  const resultCounts = new Map();

  for (const event of pastEvents) {
    for (const result of event.results) {
      resultCounts.set(
        result.playerId,
        (resultCounts.get(result.playerId) ?? 0) + 1
      );
    }
  }

  const rankingsById = new Map(
    allTimeRankings.map((player) => [player.id, player])
  );

  for (const playerId of resultCounts.keys()) {
    if (!rankingsById.has(playerId)) {
      throw new Error(
        `Event Log player "${playerId}" is missing from "All Time" rankings`
      );
    }
  }

  for (const player of allTimeRankings) {
    const resultCount =
      resultCounts.get(player.id) ?? 0;

    if (player.events !== resultCount) {
      throw new Error(
        `"All Time" lists ${player.events} event${
          player.events === 1 ? "" : "s"
        } for ${player.name}, but Event Log contains ${
          resultCount
        }. The sheet tabs may still be updating`
      );
    }
  }
}

function validateSnapshotProgress(snapshot, previous) {
  if (!previous?.events?.past) return;

  const eventsById = new Map(
    snapshot.events.past.map((event) => [event.id, event])
  );

  for (const previousEvent of previous.events.past) {
    const event = eventsById.get(previousEvent.id);

    if (!event) {
      throw new Error(
        `Past event ${previousEvent.id} is missing from the new snapshot, which appears stale`
      );
    }

    if (event.playerCount < previousEvent.playerCount) {
      throw new Error(
        `Past event ${event.id} regressed from ${previousEvent.playerCount} to ${event.playerCount} players`
      );
    }
  }
}

async function scrapeSnapshot(gids, requiredTabs) {
  const cacheBust = Date.now();

  const htmlByTab = Object.fromEntries(
    await Promise.all(
      requiredTabs.map(async (tabName) => {
        console.log(
          `Fetching "${tabName}" (gid=${gids[tabName]})...`
        );

        const html = await fetchHtml(
          `${BASE}/sheet?gid=${gids[tabName]}&cacheBust=${cacheBust}`,
          `"${tabName}"`
        );

        assertSheetTable(html, tabName);

        return [tabName, html];
      })
    )
  );

  const playerRegistry = createPlayerRegistry();
  const views = {};

  for (const [tabName, slug] of Object.entries(VIEWS)) {
    const rankings = parseRankingTable(
      htmlByTab[tabName],
      tabName,
      playerRegistry
    );

    views[slug] = rankings;

    if (rankings.length === 0) {
      console.log(
        `  0 players in "${tabName}" (empty ranking view)`
      );
    } else {
      console.log(
        `  ${rankings.length} players in "${tabName}"`
      );
    }
  }

  const playerDataTab = PLAYER_DATA_TABS.find(
    (tabName) => htmlByTab[tabName]
  );

  const seeding = parseSeedingTable(htmlByTab[SEEDING_TAB], playerRegistry);

  if (playerDataTab) {
    const profiles = parsePlayerDataTable(
      htmlByTab[playerDataTab],
      playerRegistry
    );

    for (const ranking of Object.values(views)) {
      for (const player of ranking) {
        const profile = profiles.get(player.id);

        if (!profile) continue;

        if (profile.photo) {
          player.photoUrl = parseOptionalUrl(
            profile.photo,
            "Photo",
            player.name
          );
        }

        if (profile.gameMakerProfile) {
          player.gameMakerProfileUrl = parseOptionalUrl(
            profile.gameMakerProfile,
            "Game Maker Profile",
            player.name
          );
        }
      }
    }
  }

  const past = parsePastEvents(
    htmlByTab["Past Events"],
    playerRegistry
  );

  const upcoming = parseUpcomingEvents(
    htmlByTab["Upcoming Events"]
  );

  const resultsByEvent = parseEventLog(
    htmlByTab["Event Log"],
    playerRegistry
  );

  assertUniqueIds(past, "past event");
  assertUniqueIds(upcoming, "upcoming event");

  const pastEventIds = new Set(
    past.map((event) => event.id)
  );

  const unmatchedResultDates = [
    ...resultsByEvent.keys(),
  ].filter((eventId) => !pastEventIds.has(eventId));

  if (unmatchedResultDates.length > 0) {
    throw new Error(
      `Results exist without matching Past Events rows: ${unmatchedResultDates.join(
        ", "
      )}`
    );
  }

  for (const event of past) {
    event.results = (
      resultsByEvent.get(event.id) ?? []
    ).sort((a, b) => a.place - b.place);
  }

  validatePastEvents(past);
  validateAllTimeEventCounts(
    views["all-time"],
    past
  );

  past.sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  upcoming.sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  const events = {
    upcoming,
    past,
  };

  console.log(
    `  ${upcoming.length} upcoming events`
  );

  console.log(
    `  ${past.length} past events`
  );

  return {
    views,
    seeding,
    events,
  };
}

async function scrape() {
  console.log("Discovering sheet tabs...");

  const menuHtml = await fetchHtml(
    BASE,
    "published sheet menu"
  );

  const gids = parseTabGids(menuHtml);

  const playerDataTab = PLAYER_DATA_TABS.find(
    (tabName) => gids[tabName]
  );

  const requiredTabs = [
    ...Object.keys(VIEWS),
    ...EVENT_TABS,
    SEEDING_TAB,
    ...(playerDataTab ? [playerDataTab] : []),
  ];

  const missingTabs = requiredTabs.filter(
    (tabName) => !gids[tabName]
  );

  if (missingTabs.length > 0) {
    throw new Error(
      `Missing published tabs: ${missingTabs.join(
        ", "
      )}. Available tabs: ${
        Object.keys(gids).join(", ") || "(none)"
      }`
    );
  }

  let previous = null;

  if (existsSync(OUTPUT_PATH)) {
    try {
      previous = JSON.parse(
        readFileSync(OUTPUT_PATH, "utf8")
      );
    } catch (error) {
      console.warn(
        `Could not read existing ${OUTPUT_PATH}; it will be replaced after a valid scrape: ${error.message}`
      );
    }
  }

  let snapshot;
  let snapshotError;

  for (
    let attempt = 1;
    attempt <= SNAPSHOT_ATTEMPTS;
    attempt += 1
  ) {
    try {
      snapshot = await scrapeSnapshot(
        gids,
        requiredTabs
      );

      validateSnapshotProgress(
        snapshot,
        previous
      );

      break;
    } catch (error) {
      snapshotError = error;

      if (attempt === SNAPSHOT_ATTEMPTS) break;

      console.warn(
        `Snapshot attempt ${attempt}/${SNAPSHOT_ATTEMPTS} failed (${error.message}); retrying all tabs in ${SNAPSHOT_RETRY_DELAY_MS}ms...`
      );

      await wait(
        SNAPSHOT_RETRY_DELAY_MS
      );
    }
  }

  if (!snapshot) {
    throw new Error(
      `Could not produce a consistent sheet snapshot after ${SNAPSHOT_ATTEMPTS} attempts: ${
        snapshotError?.message ?? "unknown error"
      }`,
      { cause: snapshotError }
    );
  }

  const { views, seeding, events } = snapshot;

  const data = {
    scrapedAt: new Date().toISOString(),
    source: BASE,
    views,
    seeding,
    events,
  };

  // No-op if the rankings are unchanged, so the hourly workflow only
  // commits and redeploys when the data actually differs.
  // The scrapedAt timestamp is ignored in this comparison since it
  // changes every run.
  if (
    previous &&
    JSON.stringify({
      views: previous.views,
      seeding: previous.seeding,
      events: previous.events,
    }) ===
      JSON.stringify({
        views,
        seeding,
        events,
      })
  ) {
    console.log(
      "No change in league data — leaving leaderboard.json untouched"
    );

    return;
  }

  mkdirSync(dirname(OUTPUT_PATH), {
    recursive: true,
  });

  const temporaryPath = `${OUTPUT_PATH}.tmp`;

  try {
    writeFileSync(
      temporaryPath,
      JSON.stringify(data, null, 2)
    );

    renameSync(
      temporaryPath,
      OUTPUT_PATH
    );
  } finally {
    if (existsSync(temporaryPath)) {
      unlinkSync(temporaryPath);
    }
  }

  console.log(
    `Wrote ${OUTPUT_PATH}`
  );
}

scrape().catch((err) => {
  console.error("Scrape failed:", err);
  process.exit(1);
});