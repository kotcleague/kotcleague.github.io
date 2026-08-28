import { SITE_LINKS } from "@/config/site";

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
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:text-slate-500">
        <div className="space-y-1">
          {formatted && <p>Data updated {formatted}</p>}
          <p>
            Data from{" "}
            <a
              href={SITE_LINKS.standings}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue hover:underline dark:text-blue-300"
            >
              KOTC League Standings
            </a>
          </p>
        </div>
        <a
          href={SITE_LINKS.club}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue hover:underline dark:text-blue-300"
        >
          paddleuppickleballclub.com
        </a>
      </div>
    </footer>
  );
}
