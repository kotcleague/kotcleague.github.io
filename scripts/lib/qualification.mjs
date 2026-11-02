import {
  existsSync,
  readFileSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { load } from "cheerio";
import { fetchHtml } from "./http.mjs";
import {
  SHEET_BASE,
  parseTabGids,
  readRowCells,
  findHeaderRow,
  getColumn,
} from "./google-sheet.mjs";
import {
  CLUB_65_SOURCE,
  QUALIFICATION_MONTH,
  parseQualificationData,
  qualificationIsOpen,
  qualificationUsesLastMonth,
} from "../../src/lib/qualification.mjs";

const HEADERS = [
  "#",
  "Player",
  "Wk1Pts",
  "Wk2Pts",
  "Wk3Pts",
  "Wk4Pts",
  "Points",
  "W",
  "L",
  "+/-",
];

function numericCell(value, context) {
  if (typeof value !== "string" || !/^[+-]?\d+(?:\.\d+)?$/.test(value.trim())) {
    throw new Error(`Invalid ${context}: ${value}`);
  }
  return Number(value);
}

export function parseClub65Table({ grids, notes }) {
  if (
    !Array.isArray(grids) ||
    JSON.stringify(grids[0]) !== JSON.stringify(HEADERS) ||
    grids.length < 2 ||
    !Array.isArray(notes) ||
    !notes.some(
      (note) =>
        /best 3 weeks/i.test(note) ||
        /^Total Points add up every week each player has played\.$/i.test(note)
    ) ||
    !notes.some((note) => /T = still tied/i.test(note))
  ) {
    throw new Error(
      "Club 65 Overall standings headers or scoring notes changed"
    );
  }

  return {
    notes: notes.filter((note) => !/^Weeks /i.test(note)),
    rows: grids.slice(1).map((cells) => {
      if (cells.length !== HEADERS.length) {
        throw new Error("Club 65 standings row has unexpected columns");
      }
      const rawName = cells[1].trim();
      const incompleteWeeks = rawName.endsWith("*");
      return {
        rank: cells[0],
        name: rawName.replace(/\s*\*$/, "").trim(),
        incompleteWeeks,
        weeklyPoints: cells
          .slice(2, 6)
          .map((cell) =>
            cell === "\u2013" ? null : numericCell(cell, "weekly points")
          ),
        points: numericCell(cells[6], "points"),
        wins: numericCell(cells[7], "wins"),
        losses: numericCell(cells[8], "losses"),
        differential: numericCell(cells[9], "differential"),
      };
    }),
  };
}

export async function readClub65Overall(page) {
  await page
    .getByRole("heading", { name: "Club65 Wednesday KOTC League", exact: true })
    .waitFor({ timeout: 45_000 });
  const overall = page.getByRole("tab", { name: "Overall", exact: true });
  await overall.click();
  await page.waitForFunction(
    () =>
      [...document.querySelectorAll('[role="tab"]')].some(
        (tab) =>
          tab.textContent.trim() === "Overall" &&
          tab.getAttribute("aria-selected") === "true"
      ),
    undefined,
    { timeout: 15_000 }
  );
  const heading = page.getByRole("heading", {
    name: /^Overall \u00b7 Monthly winners$/i,
  });
  await heading.waitFor({ timeout: 15_000 });
  const table = await heading.evaluate((element) => {
    const section = element.parentElement.parentElement;
    return {
      grids: [
        ...section.querySelectorAll('[style*="grid-template-columns"]'),
      ].map((grid) =>
        [...grid.children].map((cell) => cell.textContent.trim())
      ),
      notes: [...section.querySelectorAll("p")].map((note) =>
        note.textContent.trim()
      ),
    };
  });
  if ((await overall.getAttribute("aria-selected")) !== "true") {
    throw new Error("Club 65 Overall tab lost selection during extraction");
  }
  return parseClub65Table(table);
}

export function createQualificationSnapshot(
  leaderboard,
  club65,
  now = new Date()
) {
  if (
    !qualificationIsOpen(now) ||
    !qualificationIsOpen(new Date(leaderboard.scrapedAt))
  ) {
    throw new Error(
      "Paddle Up source and capture must both belong to October 2026"
    );
  }
  const players = leaderboard.views?.["current-month"];
  if (!Array.isArray(players) || players.length === 0) {
    throw new Error("Paddle Up October standings are missing");
  }
  return parseQualificationData({
    month: QUALIFICATION_MONTH,
    clubs: {
      "paddle-up": {
        source: "https://kotcleague.github.io/#/",
        capturedAt: leaderboard.scrapedAt,
        notes: [
          "Paddle Up October league points. Each club uses its own scoring system.",
        ],
        rows: players.map((player) => ({
          rank: String(player.rank),
          name: player.name,
          points: player.points,
        })),
      },
      "club-65": {
        source: CLUB_65_SOURCE,
        capturedAt: now.toISOString(),
        ...club65,
      },
    },
  });
}

export function parsePaddleUpLastMonth(html) {
  const $ = load(html);
  const table = $("table").first();
  const context = '"Last Month"';
  const header = findHeaderRow(
    $,
    table,
    ["Ranking", "Player", "Points"],
    context
  );
  const rows = [];
  let afterHeader = false;
  table.find("tbody tr").each((_, row) => {
    if (row === header.row) {
      afterHeader = true;
      return;
    }
    if (!afterHeader) return;
    const cells = readRowCells($, row);
    const rank = getColumn(header.headerMap, cells, "Ranking", context);
    const name = getColumn(header.headerMap, cells, "Player", context);
    const points = getColumn(header.headerMap, cells, "Points", context);
    if (!rank && !name && !points) return;
    if (!/^[1-9]\d*$/.test(rank) || !name || !/^\d+(?:\.\d+)?$/.test(points)) {
      throw new Error(`Invalid Paddle Up Last Month row for "${name}"`);
    }
    rows.push({ rank, name, points: Number(points) });
  });
  if (rows.length === 0)
    throw new Error("Paddle Up Last Month standings are empty");
  return rows;
}

export async function readPaddleUpLastMonth(
  now = new Date(),
  fetchHtmlImpl = fetchHtml
) {
  if (!qualificationUsesLastMonth(now)) {
    throw new Error(
      "Last Month represents October 2026 only during November 2026"
    );
  }
  const menu = await fetchHtmlImpl(SHEET_BASE, "published sheet menu");
  const gid = parseTabGids(menu)["Last Month"];
  if (!gid) throw new Error('Published "Last Month" sheet tab is missing');
  const source = `${SHEET_BASE}/sheet?gid=${gid}`;
  const html = await fetchHtmlImpl(
    `${source}&cacheBust=${now.getTime()}`,
    '"Last Month" October standings'
  );
  return {
    source,
    sourceTab: "Last Month",
    standingsMonth: QUALIFICATION_MONTH,
    capturedAt: now.toISOString(),
    notes: [
      "Paddle Up October league points from the Last Month sheet, captured during November. Each club uses its own scoring system.",
    ],
    rows: parsePaddleUpLastMonth(html),
  };
}

export function createNovemberQualificationSnapshot(
  previous,
  paddleUp,
  now = new Date(),
  confirmedClub65
) {
  const saved = parseQualificationData(previous);
  if (
    !qualificationUsesLastMonth(now) ||
    paddleUp.sourceTab !== "Last Month" ||
    paddleUp.standingsMonth !== QUALIFICATION_MONTH
  ) {
    throw new Error("November capture requires October Last Month standings");
  }
  return parseQualificationData({
    month: QUALIFICATION_MONTH,
    clubs: {
      "paddle-up": paddleUp,
      "club-65": confirmedClub65
        ? {
            source: CLUB_65_SOURCE,
            capturedAt: now.toISOString(),
            standingsMonth: QUALIFICATION_MONTH,
            monthConfirmed: true,
            ...confirmedClub65,
          }
        : saved.clubs["club-65"],
    },
  });
}

function comparableClub(club) {
  return JSON.stringify(
    Object.fromEntries(
      Object.entries(club).filter(([key]) => key !== "capturedAt")
    )
  );
}

function comparable(data) {
  return JSON.stringify({
    month: data.month,
    clubs: Object.fromEntries(
      Object.entries(data.clubs).map(([id, club]) => [id, comparableClub(club)])
    ),
  });
}

export function writeQualificationSnapshot(path, snapshot) {
  const validated = parseQualificationData(snapshot);
  if (existsSync(path)) {
    const previous = parseQualificationData(
      JSON.parse(readFileSync(path, "utf8"))
    );
    if (comparable(previous) === comparable(validated)) return false;
    for (const id of ["paddle-up", "club-65"]) {
      if (
        comparableClub(previous.clubs[id]) ===
        comparableClub(validated.clubs[id])
      ) {
        validated.clubs[id].capturedAt = previous.clubs[id].capturedAt;
      }
    }
  }
  const temporaryPath = `${path}.tmp`;
  try {
    writeFileSync(temporaryPath, `${JSON.stringify(validated, null, 2)}\n`);
    renameSync(temporaryPath, path);
  } finally {
    if (existsSync(temporaryPath)) unlinkSync(temporaryPath);
  }
  return true;
}
