import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { chromium } from "playwright";
import {
  CLUB_65_SOURCE,
  leagueCalendarDate,
  parseQualificationData,
  qualificationIsOpen,
} from "../src/lib/qualification.mjs";
import {
  createQualificationSnapshot,
  parseClub65Table,
  readClub65Overall,
  writeQualificationSnapshot,
} from "./lib/qualification.mjs";

const headers = [
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
const notes = [
  "Total Points count each player's best 3 weeks. * = has not played 3 weeks yet.",
  "Ties are settled by points, then point differential, then head-to-head. T = still tied.",
];
const cells = [
  [
    "1",
    "Player One *",
    "-0.5",
    "8.5",
    "\u2013",
    "\u2013",
    "8",
    "11",
    "2",
    "+41",
  ],
  ["T2", "Player Two", "0", "1", "1", "\u2013", "2", "3", "4", "-3"],
  ["T2", "Player Three", "0", "1", "1", "\u2013", "2", "3", "4", "-3"],
];
const now = new Date("2026-10-19T22:00:00Z");
const leaderboard = {
  scrapedAt: now.toISOString(),
  views: {
    "current-month": [{ rank: 1, name: "Paddle Player", points: 2750 }],
  },
};
function snapshot() {
  return createQualificationSnapshot(
    leaderboard,
    parseClub65Table({ grids: [headers, ...cells], notes }),
    now
  );
}

test("Chicago calendar gates October capture and November retention at midnight", () => {
  assert.equal(
    leagueCalendarDate(new Date("2026-11-01T04:59:59Z")),
    "2026-10-31"
  );
  assert.equal(qualificationIsOpen(new Date("2026-11-01T04:59:59Z")), true);
  assert.equal(qualificationIsOpen(new Date("2026-11-01T05:00:00Z")), false);
  assert.equal(qualificationIsOpen(new Date("2026-10-01T04:59:59Z")), false);
  assert.throws(
    () =>
      createQualificationSnapshot(
        leaderboard,
        {},
        new Date("2026-11-02T12:00:00Z")
      ),
    /October/
  );
  assert.throws(
    () =>
      createQualificationSnapshot(
        { ...leaderboard, scrapedAt: "2026-09-30T20:00:00Z" },
        {},
        now
      ),
    /October/
  );
});

test("preserves published order, ties, eligibility flags, signed/fractional points and missing weeks", () => {
  const data = snapshot();
  assert.equal(data.clubs["club-65"].source, CLUB_65_SOURCE);
  assert.deepEqual(
    data.clubs["club-65"].rows.map((row) => row.rank),
    ["1", "T2", "T2"]
  );
  assert.deepEqual(data.clubs["club-65"].rows[0], {
    rank: "1",
    name: "Player One",
    incompleteWeeks: true,
    weeklyPoints: [-0.5, 8.5, null, null],
    points: 8,
    wins: 11,
    losses: 2,
    differential: 41,
  });
});

test("strips trailing asterisks and whitespace from Club 65 names without losing eligibility flags", () => {
  for (const name of [
    "Player One *",
    "Player One*",
    " Player One *  ",
    "Player One\u00a0*",
  ]) {
    const row = [...cells[0]];
    row[1] = name;
    const result = parseClub65Table({ grids: [headers, row], notes }).rows[0];
    assert.equal(result.name, "Player One");
    assert.equal(result.incompleteWeeks, true);
  }
  const unmarked = parseClub65Table({ grids: [headers, cells[1]], notes })
    .rows[0];
  assert.equal(unmarked.name, "Player Two");
  assert.equal(unmarked.incompleteWeeks, false);
});

test("rejects weekly headers, empty tables, malformed scores and duplicate players", () => {
  assert.throws(
    () =>
      parseClub65Table({
        grids: [["Rank", "Player", "Points"], ...cells],
        notes,
      }),
    /headers/
  );
  assert.throws(() => parseClub65Table({ grids: [headers], notes }), /headers/);
  assert.throws(
    () =>
      parseClub65Table({
        grids: [headers, ["1", "Bad", "", "1", "2", "3", "4", "1", "1", "1"]],
        notes,
      }),
    /weekly points/
  );
  const duplicate = snapshot();
  duplicate.clubs["club-65"].rows.push(duplicate.clubs["club-65"].rows[0]);
  assert.throws(() => parseQualificationData(duplicate), /duplicate/);
  const malformed = snapshot();
  malformed.clubs["club-65"].rows[0].points = NaN;
  assert.throws(() => parseQualificationData(malformed), /row/);
  const november = snapshot();
  november.clubs["paddle-up"].capturedAt = "2026-11-02T12:00:00Z";
  assert.throws(() => parseQualificationData(november), /snapshot/);
});

test("writes atomically, ignores timestamp-only changes and preserves valid snapshots on validation failure", () => {
  const directory = mkdtempSync(join(tmpdir(), "kotc-qualification-"));
  const path = join(directory, "snapshot.json");
  try {
    assert.equal(writeQualificationSnapshot(path, snapshot()), true);
    const before = readFileSync(path, "utf8");
    const timestampOnly = snapshot();
    timestampOnly.clubs["club-65"].capturedAt = "2026-10-20T22:00:00Z";
    assert.equal(writeQualificationSnapshot(path, timestampOnly), false);
    assert.equal(readFileSync(path, "utf8"), before);
    const invalid = snapshot();
    invalid.clubs["club-65"].rows = [];
    assert.throws(() => writeQualificationSnapshot(path, invalid), /snapshot/);
    assert.equal(readFileSync(path, "utf8"), before);
    const changed = snapshot();
    changed.clubs["club-65"].rows[0].points = 9;
    assert.equal(writeQualificationSnapshot(path, changed), true);
    assert.equal(
      JSON.parse(readFileSync(path, "utf8")).clubs["club-65"].rows[0].points,
      9
    );
  } finally {
    rmSync(directory, { recursive: true });
  }
});

test("browser extraction switches from default Week 2 to verified Overall standings", async () => {
  const browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  });
  try {
    const page = await browser.newPage();
    const grids = [headers, ...cells]
      .map(
        (row) =>
          `<div style="display:grid;grid-template-columns:repeat(10,1fr)">${row
            .map((cell) => `<span>${cell}</span>`)
            .join("")}</div>`
      )
      .join("");
    await page.setContent(`
      <h1>Club65 Wednesday KOTC League</h1>
      <button role="tab" aria-selected="false" id="overall">Overall</button>
      <button role="tab" aria-selected="true" id="week">Week 2</button>
      <div id="standings"><h2>Week 2 standings</h2><p>Wrong weekly data</p></div>
      <template id="monthly"><div><h2>Overall \u00b7 Monthly winners</h2></div>${grids}${notes
      .map((note) => `<p>${note}</p>`)
      .join("")}</template>
      <script>
        overall.onclick = () => {
          overall.setAttribute("aria-selected", "true");
          week.setAttribute("aria-selected", "false");
          standings.innerHTML = monthly.innerHTML;
        };
      </script>
    `);
    const result = await readClub65Overall(page);
    assert.deepEqual(
      result,
      parseClub65Table({ grids: [headers, ...cells], notes })
    );
    assert.equal(
      await page
        .getByRole("tab", { name: "Overall", exact: true })
        .getAttribute("aria-selected"),
      "true"
    );
  } finally {
    await browser.close();
  }
});
