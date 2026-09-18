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
    <span className="inline-flex items-center gap-2 rounded-full border border-blue/20 bg-blue/5 px-3 py-1.5 text-xs font-semibold text-blue dark:border-blue-300/20 dark:bg-blue-300/10 dark:text-blue-200">
      <Users className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="tabular-nums">{count}</span>
      <span>{count === 1 ? "player registered" : "players registered"}</span>
    </span>
  );
}
