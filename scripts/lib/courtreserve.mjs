import { load } from "cheerio";
import { HttpError, isRetryableFetchError } from "./http.mjs";

export function courtReserveDetailsEndpoint(value) {
  const url = new URL(value);
  const match =
    /^\/Online\/Events\/Details\/(\d+)(?:\/([a-z0-9]+))?\/?$/i.exec(
      url.pathname
    );
  const reservationIds = url.searchParams.getAll("resId");

  if (
    url.origin !== "https://mobileapp.courtreserve.com" ||
    url.username ||
    url.password ||
    !match ||
    (match[2]
      ? reservationIds.length !== 0
      : reservationIds.length !== 1 || !/^\d+$/.test(reservationIds[0]))
  ) {
    throw new Error(`Unsupported Court Reserve event URL: ${value}`);
  }

  const endpoint = new URL("/Online/EventsApi/ApiDetails", url.origin);
  endpoint.searchParams.set("id", match[1]);
  endpoint.searchParams.set(
    match[2] ? "number" : "resId",
    match[2] ?? reservationIds[0]
  );
  endpoint.searchParams.set("ajaxCall", "true");
  return endpoint.href;
}

export function parseCourtReserveRegistrants(html) {
  const $ = load(html);
  const details = $('[data-testid="details-container"]');
  if (
    details.length !== 1 ||
    details.find('[data-testid="event-name"]').length !== 1 ||
    !details.find('[data-testid="event-name"]').text().trim()
  ) {
    throw new Error("Court Reserve response is not a valid event details page");
  }

  const table = $('[data-testid="registrants-table"]');
  const tab = $('[data-testid="registrants-tab"]');

  // CourtReserve omits both the table and tab for events with no registrants.
  if (table.length === 0 && tab.length === 0) return [];

  const countMatch = /^REGISTRANTS\s*\((\d+)\)$/i.exec(tab.text().trim());
  if (table.length > 1 || tab.length !== 1 || !countMatch) {
    throw new Error("Invalid Court Reserve registrants markup");
  }

  const expectedCount = Number(countMatch[1]);
  if (table.length === 0) {
    if (expectedCount === 0) return [];
    throw new Error("Court Reserve registrants table is missing");
  }

  const rows = table.find("tbody tr");
  const names = rows
    .map((_, row) => {
      const cell = $(row).find('[data-testid="name"]');
      const name = cell.text().trim();
      if (cell.length !== 1 || !name) {
        throw new Error("Invalid Court Reserve registrant name");
      }
      return name;
    })
    .get();

  if (names.length !== expectedCount) {
    throw new Error(
      `Court Reserve registrant count mismatch: expected ${expectedCount}, found ${names.length}`
    );
  }
  return names;
}

export async function fetchCourtReserveRegistrants(
  url,
  context,
  {
    fetchImpl = fetch,
    wait = (milliseconds) =>
      new Promise((resolveWait) => setTimeout(resolveWait, milliseconds)),
    attempts = 3,
    timeoutMs = 15_000,
  } = {}
) {
  const endpoint = courtReserveDetailsEndpoint(url);
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const pageResponse = await fetchImpl(url, {
        signal: controller.signal,
      });
      if (!pageResponse.ok) throw new HttpError(pageResponse);
      await pageResponse.text();

      const cookies = pageResponse.headers
        .getSetCookie()
        .map((cookie) => cookie.split(";", 1)[0])
        .join("; ");
      const detailsResponse = await fetchImpl(endpoint, {
        headers: { cookie: cookies, referer: url },
        signal: controller.signal,
      });
      if (!detailsResponse.ok) throw new HttpError(detailsResponse);
      return parseCourtReserveRegistrants(await detailsResponse.text());
    } catch (error) {
      lastError = error;
      if (attempt === attempts || !isRetryableFetchError(error)) break;

      const delay = 1_000 * 2 ** (attempt - 1);
      console.warn(
        `  Court Reserve attempt ${attempt}/${attempts} for ${context} failed (${error.message}); retrying in ${delay}ms...`
      );
      await wait(delay);
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new Error(
    `Failed to fetch Court Reserve registrants for ${context}: ${
      lastError?.message ?? "unknown error"
    }`,
    { cause: lastError }
  );
}
