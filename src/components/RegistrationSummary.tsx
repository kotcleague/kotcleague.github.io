import { Users } from "lucide-react";

interface RegistrationSummaryProps {
  available: boolean;
  count: number;
}

export default function RegistrationSummary({
  available,
  count,
}: RegistrationSummaryProps) {
  if (!available) return null;

  return (
    <span className="inline-flex max-w-full min-w-0 items-center gap-2.5 text-base font-semibold text-ink sm:text-lg dark:text-slate-100">
      <span className="grid h-9 w-9 shrink-0 place-items-center bg-blue/10 text-blue dark:bg-blue/15 dark:text-blue-300">
        <Users className="h-4 w-4" aria-hidden="true" />
      </span>
      <span
        className="min-w-0 flex-1 truncate whitespace-nowrap leading-tight"
        title={`${count} ${count === 1 ? "player" : "players"} registered`}
      >
        <span className="font-bold tabular-nums">{count}</span>{" "}
        {count === 1 ? "player" : "players"}
        <span className="font-medium text-slate-500 dark:text-slate-400">
          {" "}
          registered
        </span>
      </span>
    </span>
  );
}
