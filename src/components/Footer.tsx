import { ROUTES } from "@/config/site";
import { FOCUS_RING, PAGE_CONTAINER } from "@/lib/styles";

interface FooterProps {
  scrapedAt?: string;
}

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export default function Footer({ scrapedAt }: FooterProps) {
  const formatted = scrapedAt
    ? DATE_FORMATTER.format(new Date(scrapedAt))
    : null;

  return (
    <footer className="border-t border-slate-200 bg-white dark:border-scoreboard dark:bg-ink print:hidden">
      <div
        className={`${PAGE_CONTAINER} flex flex-col gap-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:text-slate-400`}
      >
        <div className="space-y-1">
          <p className="font-display text-lg font-semibold uppercase tracking-wider text-ink dark:text-white">
            King of the Court
          </p>
          {formatted && <p>Data updated {formatted}</p>}
        </div>
        <div className="flex items-center gap-4 font-medium">
          <a
            href={ROUTES.contact}
            className={`text-blue underline-offset-4 hover:underline dark:text-blue-300 ${FOCUS_RING}`}
          >
            Contact
          </a>
          <a
            href={ROUTES.rankings}
            className={`text-blue underline-offset-4 hover:underline dark:text-blue-300 ${FOCUS_RING}`}
          >
            KOTC League
          </a>
        </div>
      </div>
    </footer>
  );
}
