import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { parseQualificationData } from "../src/lib/qualification.mjs";

const snapshotUrl = new URL(
  "../public/data/club-match-2026.json",
  import.meta.url
);
const original = readFileSync(snapshotUrl, "utf8");

test("frozen event data is valid and retains the verified October standings", () => {
  const data = parseQualificationData(JSON.parse(original));
  assert.equal(data.clubs["paddle-up"].rows.length, 39);
  assert.deepEqual(data.clubs["paddle-up"].rows[0], {
    rank: "1",
    name: "Tobi Ola",
    points: 5500,
  });
  assert.equal(data.clubs["club-65"].rows.length, 32);
  assert.equal(data.clubs["club-65"].rows[0].name, "Farhad Saifuddin");
  assert.equal(data.clubs["club-65"].rows[0].points, 22.5);
});

test("qualification command never fetches or changes saved data and rejects old refresh flags", () => {
  const directory = mkdtempSync(join(tmpdir(), "kotc-frozen-"));
  try {
    for (const path of ["scripts", "src/lib", "public/data"]) {
      mkdirSync(join(directory, path), { recursive: true });
    }
    for (const path of [
      "scripts/scrape-qualification.mjs",
      "src/lib/qualification.mjs",
    ]) {
      copyFileSync(
        new URL(`../${path}`, import.meta.url),
        join(directory, path)
      );
    }
    const path = join(directory, "public/data/club-match-2026.json");
    const script = join(directory, "scripts/scrape-qualification.mjs");
    writeFileSync(path, original);
    const networkGuard =
      "data:text/javascript,globalThis.fetch=()=>{throw new Error('Network requests are forbidden')}";
    const run = (...args) =>
      spawnSync(process.execPath, ["--import", networkGuard, script, ...args], {
        encoding: "utf8",
        timeout: 10_000,
      });
    const first = run();
    assert.equal(first.status, 0, first.stderr);
    assert.match(first.stdout, /frozen/);
    assert.equal(readFileSync(path, "utf8"), original);
    const flagged = run("--confirm-club65-october");
    assert.equal(flagged.status, 1);
    assert.match(flagged.stderr, /no longer supported/);
    assert.equal(readFileSync(path, "utf8"), original);
    writeFileSync(path, '{"month":"2026-10",\n<<<<<<< HEAD\n');
    const invalid = run();
    assert.equal(invalid.status, 1);
    assert.match(invalid.stderr, /validation failed/);
    assert.equal(
      readFileSync(path, "utf8"),
      '{"month":"2026-10",\n<<<<<<< HEAD\n'
    );
    rmSync(path);
    const missing = run();
    assert.equal(missing.status, 1);
    assert.match(missing.stderr, /validation failed/);
  } finally {
    rmSync(directory, { recursive: true });
  }
});
