const LONG_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const EVENT_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  year: "numeric",
  month: "short",
  day: "numeric",
});

const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

const EVENT_MONTH_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
});

const EVENT_WEEKDAY_FORMATTER = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
});

const INTEGER_FORMATTER = new Intl.NumberFormat("en-US");
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

function parseCalendarDate(date: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) {
    throw new Error(`Invalid league date: ${date}`);
  }

  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

export function formatLeagueDate(date: string, short = false) {
  const value = parseCalendarDate(date);
  return (short ? SHORT_DATE_FORMATTER : LONG_DATE_FORMATTER).format(value);
}

export function formatEventDate(date: string) {
  return EVENT_DATE_FORMATTER.format(parseCalendarDate(date)).replace(
    /\bSep\b/,
    "Sept"
  );
}

export function formatEventDateParts(date: string) {
  const value = parseCalendarDate(date);
  return {
    day: value.getDate().toString(),
    month: EVENT_MONTH_FORMATTER.format(value),
    weekday: EVENT_WEEKDAY_FORMATTER.format(value),
  };
}

export function formatRelativeEventDate(date: string, today = new Date()) {
  const value = parseCalendarDate(date);
  const eventDay = Date.UTC(
    value.getFullYear(),
    value.getMonth(),
    value.getDate()
  );
  const currentDay = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const days = Math.round((eventDay - currentDay) / MILLISECONDS_PER_DAY);

  if (days === 0) {
    return "Today";
  }

  const dayLabel = `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"}`;
  return days > 0 ? `In ${dayLabel}` : `${dayLabel} ago`;
}

export function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

export function formatSignedPercent(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function formatInteger(value: number) {
  return INTEGER_FORMATTER.format(value);
}

export function formatRecord(wins: number, losses: number) {
  return `${wins}-${losses}`;
}

export function formatPointsForAgainst(
  pointsFor: number,
  pointsAgainst: number
) {
  return `${pointsFor} / ${pointsAgainst}`;
}
