import { ListOrdered } from "lucide-react";
import Card from "@/components/Card";
import { META_LABEL_MUTED } from "@/lib/styles";
import type { AssignmentPlan } from "@/lib/assignments";
import type { SeededPlayer } from "@/types/leaderboard";

function MatchTeam({
  number,
  players,
}: {
  number: 1 | 2;
  players: SeededPlayer[];
}) {
  return (
    <section className="px-4 py-2 print:px-2 print:py-1">
      <div className="mb-1 flex items-center">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
          Team {number}
        </span>
      </div>
      <div>
        {players.map((player) => (
          <div
            key={player.id}
            className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-2 py-1 text-sm print:py-0.5"
          >
            <span className="text-xs font-semibold tabular-nums text-slate-400">
              #{player.seed}
            </span>
            <span className="min-w-0 truncate font-semibold">
              {player.name}
            </span>
            <span className="flex flex-col items-end text-[10px] leading-tight tabular-nums text-slate-400">
              <span>{player.past30Days.toLocaleString()} pts</span>
              <span>DUPR {player.dupr.toFixed(3)}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function CourtAssignmentDisplay({
  plan,
}: {
  plan: AssignmentPlan;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 print:grid-cols-3 print:gap-2">
      {plan.courts.map((assignment) => (
        <Card
          key={assignment.court}
          className="break-inside-avoid overflow-hidden border-2 border-blue/60 dark:border-blue-400/60 print:border print:border-blue-700"
        >
          <div className="flex items-center justify-between px-4 py-2.5 print:px-2 print:py-1.5">
            <h3 className="text-lg font-bold">Court {assignment.court}</h3>
            <span className={META_LABEL_MUTED}>4 players</span>
          </div>
          <div className="print:text-xs">
            <MatchTeam number={1} players={assignment.slots.slice(0, 2)} />
            <div className="flex h-5 items-center justify-center print:h-3">
              <span className="text-sm font-bold uppercase tracking-[0.16em] text-blue dark:text-blue-300 print:text-xs">
                vs
              </span>
            </div>
            <MatchTeam number={2} players={assignment.slots.slice(2, 4)} />
          </div>
        </Card>
      ))}
      {plan.byeQueue.length > 0 && (
        <Card className="break-inside-avoid overflow-hidden border-amber-200 sm:col-span-2 dark:border-amber-900/70 print:col-span-3 print:border print:border-amber-700">
          <div className="flex items-center gap-3 border-b border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/70 dark:bg-amber-950/30 print:px-2 print:py-1.5">
            <ListOrdered
              className="h-5 w-5 text-amber-700 dark:text-amber-300"
              aria-hidden="true"
            />
            <div>
              <h3 className="text-lg font-bold">Bye</h3>
              <p className="text-xs text-amber-800/70 dark:text-amber-200/70">
                Waiting for the next available court
              </p>
            </div>
          </div>
          <ol className="divide-y divide-slate-100 dark:divide-slate-800">
            {plan.byeQueue.map((player, index) => (
              <li
                key={player.id}
                className="flex items-center gap-3 px-4 py-3 text-sm"
              >
                <span className="font-display flex h-6 w-6 items-center justify-center bg-amber-100 text-xs font-bold text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
                  {index + 1}
                </span>
                <span className="flex-1 font-semibold">{player.name}</span>
                <span className="text-xs tabular-nums text-slate-400">
                  #{player.seed}
                </span>
              </li>
            ))}
          </ol>
        </Card>
      )}
    </div>
  );
}
