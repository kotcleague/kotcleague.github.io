import assert from "node:assert/strict";
import test from "node:test";
import {
  courtReserveDetailsEndpoint,
  fetchCourtReserveRegistrants,
  parseCourtReserveRegistrants,
} from "./lib/courtreserve.mjs";

const origin = "https://mobileapp.courtreserve.com";
const reservationUrl = `${origin}/Online/Events/Details/10117?resId=60062582`;
const seriesUrl = `${origin}/Online/Events/Details/10117/8LJEBET10117112`;
const names = Array.from({ length: 9 }, (_, index) => `Player ${index + 1}`);
const details = (content = "") =>
  `<div data-testid="details-container"><h4 data-testid="event-name">League</h4>${content}</div>`;
const registrants = (players, count = players.length) =>
  details() +
    `<span data-testid="registrants-tab">REGISTRANTS (${count})</span>
     <table data-testid="registrants-table"><tbody>${players
       .map((name) => `<tr><th data-testid="name"> ${name} </th></tr>`)
       .join("")}</tbody></table>`;

test("constructs same-origin endpoints for reservation and event-code URLs", () => {
  assert.equal(
    courtReserveDetailsEndpoint(reservationUrl),
    `${origin}/Online/EventsApi/ApiDetails?id=10117&resId=60062582&ajaxCall=true`
  );
  assert.equal(
    courtReserveDetailsEndpoint(seriesUrl),
    `${origin}/Online/EventsApi/ApiDetails?id=10117&number=8LJEBET10117112&ajaxCall=true`
  );
  assert.equal(
    courtReserveDetailsEndpoint(`${reservationUrl}&tracking=example`),
    courtReserveDetailsEndpoint(reservationUrl)
  );
});

test("rejects unsupported hosts, paths and missing or ambiguous identifiers", () => {
  for (const url of [
    "not a URL",
    reservationUrl.replace("https:", "http:"),
    reservationUrl.replace("mobileapp.courtreserve.com", "example.com"),
    reservationUrl.replace("mobileapp.", "user@mobileapp."),
    `${origin}/Online/Events/Details/10117`,
    `${origin}/Online/Events/Details/10117?resId=`,
    `${origin}/Online/Events/Details/10117?resId=invalid`,
    `${reservationUrl}&resId=123`,
    `${seriesUrl}?resId=123`,
    `${origin}/Online/Portal/Index/10117?resId=123`,
  ]) {
    assert.throws(() => courtReserveDetailsEndpoint(url));
  }
});

test("parses all nine registrants and preserves duplicate abbreviated names", () => {
  assert.deepEqual(parseCourtReserveRegistrants(registrants(names)), names);
  assert.deepEqual(
    parseCourtReserveRegistrants(registrants(["Player A.", "Player A."])),
    ["Player A.", "Player A."]
  );
});

test("accepts validated empty event details with absent or zero-count registrants", () => {
  assert.deepEqual(parseCourtReserveRegistrants(details()), []);
  assert.deepEqual(parseCourtReserveRegistrants(registrants([])), []);
  assert.deepEqual(
    parseCourtReserveRegistrants(
      details('<span data-testid="registrants-tab">REGISTRANTS (0)</span>')
    ),
    []
  );
});

test("rejects portal shells, login pages, error HTML and malformed event details", () => {
  for (const html of [
    "",
    "<div id='root'></div><script src='bundle-portal.js'></script>",
    "<form>Log In</form>",
    "<h1>Access denied</h1>",
    '<div data-testid="details-container"></div>',
    details() + details(),
  ]) {
    assert.throws(() => parseCourtReserveRegistrants(html), /event details/);
  }
});

test("rejects missing tables, counts and malformed registrant rows", () => {
  for (const html of [
    registrants(names, 10),
    registrants([""]),
    details('<span data-testid="registrants-tab">REGISTRANTS (9)</span>'),
    registrants(names).replace("REGISTRANTS (9)", "REGISTRANTS"),
    registrants(names).replace('data-testid="registrants-tab"', ""),
    registrants(names).replace('data-testid="name"', ""),
    registrants(names).replace(
      "Player 1",
      'Player 1 <span data-testid="name">Extra</span>'
    ),
  ]) {
    assert.throws(() => parseCourtReserveRegistrants(html), /Court Reserve/);
  }
});

test("establishes a session and sends cookies, Referer and a shared abort signal", async () => {
  for (const url of [reservationUrl, seriesUrl]) {
    const calls = [];
    const result = await fetchCourtReserveRegistrants(url, "event-date", {
      fetchImpl: async (target, options) => {
        calls.push({ target, options });
        if (calls.length === 1) {
          return new Response("<div>Portal</div>", {
            headers: [
              ["set-cookie", "session=abc; HttpOnly; Path=/"],
              ["set-cookie", "club=10117; Path=/"],
            ],
          });
        }
        return new Response(registrants(names));
      },
    });
    assert.deepEqual(result, names);
    assert.equal(calls.length, 2);
    assert.equal(calls[0].target, url);
    assert.equal(calls[1].target, courtReserveDetailsEndpoint(url));
    assert.deepEqual(calls[1].options.headers, {
      cookie: "session=abc; club=10117",
      referer: url,
    });
    assert.equal(calls[0].options.signal, calls[1].options.signal);
  }
});

test("retries transient failures with bounded exponential delays", async () => {
  for (const failure of [429, 500, new TypeError("Network failed")]) {
    let calls = 0;
    const delays = [];
    await assert.rejects(
      fetchCourtReserveRegistrants(reservationUrl, "event-date", {
        fetchImpl: async () => {
          calls += 1;
          if (failure instanceof Error) throw failure;
          return new Response("Unavailable", { status: failure });
        },
        wait: async (delay) => delays.push(delay),
      }),
      /event-date/
    );
    assert.equal(calls, 3);
    assert.deepEqual(delays, [1000, 2000]);
  }
});

test("reestablishes the session when a details request fails transiently", async () => {
  let calls = 0;
  const result = await fetchCourtReserveRegistrants(reservationUrl, "event", {
    fetchImpl: async () => {
      calls += 1;
      if (calls % 2 === 1) return new Response("Portal");
      if (calls === 2) return new Response("Unavailable", { status: 503 });
      return new Response(details());
    },
    wait: async () => {},
  });
  assert.deepEqual(result, []);
  assert.equal(calls, 4);
});

test("does not retry HTTP 403 or invalid details, and never returns false empty data", async () => {
  for (const response of [
    () => new Response("Forbidden", { status: 403 }),
    () => new Response("<h1>Log In</h1>"),
  ]) {
    let calls = 0;
    await assert.rejects(
      fetchCourtReserveRegistrants(reservationUrl, "event-date", {
        fetchImpl: async () => {
          calls += 1;
          return calls === 1 ? new Response("Portal") : response();
        },
        wait: async () => assert.fail("Should not retry"),
      }),
      /event-date/
    );
    assert.equal(calls, 2);
  }
});

test("aborts stalled requests and stops after the configured attempt bound", async () => {
  let calls = 0;
  await assert.rejects(
    fetchCourtReserveRegistrants(reservationUrl, "event-date", {
      fetchImpl: async (_, { signal }) => {
        calls += 1;
        return new Promise((_, reject) => {
          signal.addEventListener(
            "abort",
            () => reject(signal.reason),
            { once: true }
          );
        });
      },
      timeoutMs: 5,
      wait: async () => {},
    }),
    /event-date/
  );
  assert.equal(calls, 3);
});
