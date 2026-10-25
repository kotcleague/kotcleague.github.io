import { ArrowRight } from "lucide-react";
import EditorialLinkCard from "@/components/EditorialLinkCard";
import EventDateBadge from "@/components/EventDateBadge";
import { ROUTES } from "@/config/site";
import { CLUB_MATCH } from "@/config/specialEvent";
import { META_LABEL_ACCENT } from "@/lib/styles";

export default function SpecialEventCard({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <EditorialLinkCard
      href={ROUTES.clubMatch}
      className={compact ? "p-4 sm:p-5" : "flex gap-4 p-0 sm:gap-5"}
    >
      {!compact && <EventDateBadge date={CLUB_MATCH.date} />}
      <div className={compact ? "" : "min-w-0 py-4 pr-4 sm:py-5"}>
        <p className={META_LABEL_ACCENT}>Club match</p>
        <h3 className="mt-2 text-lg font-bold">Paddle Up vs Club 65</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          November 8, 2026 · {CLUB_MATCH.time} · Paddle Up Chesterfield
        </p>
        {compact && (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            October&apos;s top players face off in a six-game squads match.
          </p>
        )}
        <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue dark:text-blue-300">
          View event details
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </EditorialLinkCard>
  );
}
