export const SHEET_BASE =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vS3d2RVZh7OT4-wHFWvaTe0CnT3eSH-1rwGxLNyBURh8IZLThRAMXx5pd56XF6AURpWm1cDSsuhsQDj/pubhtml";

// Published sheet tabs are embedded as JavaScript rather than menu elements.
export function parseTabGids(html) {
  const gids = {};
  const re = /items\.push\(\{name:\s*"((?:[^"\\]|\\.)*)"[^}]*?gid:\s*"(\d+)"/g;
  let match;
  while ((match = re.exec(html)) !== null) {
    const name = JSON.parse(`"${match[1].replace(/\\x26/g, "&")}"`);
    gids[name] = match[2];
  }
  return gids;
}

export function normalizeHeader(value) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("en-US");
}

export function readRowCells($, row) {
  return $(row)
    .find("td")
    .map((_, td) => $(td).text().trim())
    .get();
}

function buildHeaderMap(cells) {
  const map = new Map();
  cells.forEach((cell, index) => {
    const header = normalizeHeader(cell);
    if (header && !map.has(header)) map.set(header, index);
  });
  return map;
}

export function findHeaderRow($, table, requiredColumns, context) {
  const required = requiredColumns.map(normalizeHeader);
  const rows = $(table).find("tbody tr");
  for (let i = 0; i < rows.length; i += 1) {
    const headerMap = buildHeaderMap(readRowCells($, rows[i]));
    if (required.every((column) => headerMap.has(column))) {
      return { row: rows[i], headerMap };
    }
  }
  throw new Error(
    `Could not find the header row for ${context}. Expected columns: ${requiredColumns.join(
      ", "
    )}`
  );
}

export function getColumn(headerMap, cells, columnName, context) {
  const index = headerMap.get(normalizeHeader(columnName));
  if (index === undefined) {
    throw new Error(`Missing column "${columnName}" in ${context}`);
  }
  return cells[index] ?? "";
}
