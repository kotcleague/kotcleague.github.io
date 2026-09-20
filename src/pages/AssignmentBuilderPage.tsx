import {
  Check,
  Clipboard,
  Eye,
  EyeOff,
  Printer,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";
import Card from "@/components/Card";
import CourtAssignmentDisplay from "@/components/CourtAssignmentDisplay";
import LeaderboardPageShell from "@/components/LeaderboardPageShell";
import PageContent from "@/components/PageContent";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/SectionHeading";
import {
  assignmentAttendanceHiddenFromHash,
  assignmentCourtLabelsFromHash,
  assignmentPlayerIdsFromHash,
  assignmentRoute,
} from "@/config/site";
import { assignmentText, buildAssignments } from "@/lib/assignments";
import { actionClass, META_LABEL } from "@/lib/styles";
import type { SeededPlayer } from "@/types/leaderboard";

function PlayerPicker({
  players,
  selected,
  onToggle,
}: {
  players: SeededPlayer[];
  selected: Set<string>;
  onToggle: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const filtered = players.filter((player) =>
    player.name.toLocaleLowerCase().includes(query.toLocaleLowerCase())
  );

  return (
    <div>
      <label className="sr-only" htmlFor="player-search">
        Search players
      </label>
      <input
        id="player-search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search players"
        className="mb-3 w-full border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue dark:border-slate-700"
      />
      <div className="max-h-80 overflow-y-auto border-y border-slate-200 dark:border-slate-800">
        {filtered.map((player) => (
          <label
            key={player.id}
            className="flex cursor-pointer items-center gap-3 border-b border-slate-100 px-2 py-2.5 text-sm last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
          >
            <input
              type="checkbox"
              checked={selected.has(player.id)}
              onChange={() => onToggle(player.id)}
              className="h-4 w-4 accent-blue"
            />
            <span className="flex-1 font-semibold">{player.name}</span>
            <span className="text-xs tabular-nums text-slate-400">
              #{player.seed}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function AssignmentBuilderPage() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () =>
      new Set(
        typeof window === "undefined"
          ? []
          : assignmentPlayerIdsFromHash(window.location.hash)
      )
  );
  const [courtNumbers, setCourtNumbers] = useState(() =>
    typeof window === "undefined"
      ? ""
      : assignmentCourtLabelsFromHash(window.location.hash).join(", ")
  );
  const [showAttendance, setShowAttendance] = useState(
    () =>
      typeof window === "undefined" ||
      !assignmentAttendanceHiddenFromHash(window.location.hash)
  );
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  return (
    <LeaderboardPageShell
      errorTitle="Failed to load assignment data"
      header={
        <PageHeader
          eyebrow="Admin tool"
          className="print:hidden"
          description="Seeding is first determined by past 30 day rankings then by DUPR"
        >
          Court Assignments
        </PageHeader>
      }
      loadingLabel="Loading seeded players"
    >
      {(data) => {
        const players = [...data.seeding].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        const selectedPlayers = data.seeding.filter((player) =>
          selectedIds.has(player.id)
        );
        const courtLabels = courtNumbers
          .split(",")
          .map((label) => label.trim())
          .filter(Boolean);
        const assignmentPlan = buildAssignments(selectedPlayers, courtLabels);

        function persistUrl(
          ids: Set<string>,
          labels: string[],
          attendanceHidden = !showAttendance
        ) {
          const validIds = new Set(data.seeding.map((player) => player.id));
          const nextHash = assignmentRoute(
            [...ids].filter((id) => validIds.has(id)).sort(),
            labels,
            attendanceHidden
          );

          if (window.location.hash !== nextHash) {
            window.history.replaceState(
              null,
              "",
              `${window.location.pathname}${window.location.search}${nextHash}`
            );
          }
        }

        function persistSelection(ids: Set<string>) {
          persistUrl(ids, courtLabels);
        }

        function togglePlayer(id: string) {
          const next = new Set(selectedIds);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          setSelectedIds(next);
          persistSelection(next);
          setCopied(false);
          setCopyError(null);
        }

        function selectAll() {
          const next = new Set(players.map((player) => player.id));
          setSelectedIds(next);
          persistSelection(next);
          setCopied(false);
          setCopyError(null);
        }

        function clearAll() {
          const next = new Set<string>();
          setSelectedIds(next);
          persistSelection(next);
          setCopied(false);
          setCopyError(null);
        }

        async function copyAssignments() {
          try {
            await navigator.clipboard.writeText(assignmentText(assignmentPlan));
            setCopied(true);
            setCopyError(null);
          } catch (error) {
            setCopied(false);
            setCopyError(
              error instanceof Error
                ? error.message
                : "Clipboard access was unavailable."
            );
          }
        }

        return (
          <PageContent className="print:pt-0 print:pb-0">
            <div
              className={
                showAttendance
                  ? "grid gap-8 lg:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1.2fr)]"
                  : "block"
              }
            >
              {showAttendance && (
                <Card className="p-4 sm:p-5 print:hidden">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <SectionHeading>Attendance</SectionHeading>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {selectedPlayers.length} of {players.length} selected
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={selectAll}
                        className={actionClass({
                          size: "sm",
                          variant: "quiet",
                        })}
                      >
                        All
                      </button>
                      <button
                        type="button"
                        onClick={clearAll}
                        className={actionClass({
                          size: "sm",
                          variant: "quiet",
                        })}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  <div className="mt-5">
                    <label
                      className={`${META_LABEL} mb-2 block text-slate-500 dark:text-slate-400`}
                      htmlFor="court-numbers"
                    >
                      Court numbers
                    </label>
                    <input
                      id="court-numbers"
                      value={courtNumbers}
                      onChange={(event) => {
                        const value = event.target.value;
                        const labels = value
                          .split(",")
                          .map((label) => label.trim())
                          .filter(Boolean);
                        setCourtNumbers(value);
                        persistUrl(selectedIds, labels);
                      }}
                      placeholder="e.g. 1, 2, 3"
                      className="mb-4 w-full border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue dark:border-slate-700"
                    />
                    <PlayerPicker
                      players={players}
                      selected={selectedIds}
                      onToggle={togglePlayer}
                    />
                  </div>
                </Card>
              )}

              <section
                aria-labelledby="assignments-heading"
                className="print:w-full"
              >
                <div className="mb-4 flex flex-wrap items-end justify-between gap-3 print:mb-2">
                  <div>
                    <SectionHeading id="assignments-heading">
                      Initial assignments
                    </SectionHeading>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {selectedPlayers.length
                        ? `${assignmentPlan.courts.length} ${
                            assignmentPlan.courts.length === 1
                              ? "court"
                              : "courts"
                          }`
                        : "No courts yet"}{" "}
                      ·{" "}
                      {selectedPlayers.length
                        ? assignmentPlan.byeQueue.length
                          ? `${assignmentPlan.byeQueue.length} in bye queue`
                          : `${selectedPlayers.length} players selected`
                        : "Select players to begin"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 print:hidden">
                    <button
                      type="button"
                      onClick={() => {
                        const nextVisible = !showAttendance;
                        setShowAttendance(nextVisible);
                        persistUrl(selectedIds, courtLabels, !nextVisible);
                      }}
                      className={actionClass({
                        size: "sm",
                        variant: "secondary",
                      })}
                    >
                      {showAttendance ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      )}
                      {showAttendance ? "Hide attendance" : "Show attendance"}
                    </button>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className={actionClass({
                        size: "sm",
                        variant: "secondary",
                      })}
                    >
                      <Printer className="h-4 w-4" aria-hidden="true" /> Print
                    </button>
                    <button
                      type="button"
                      disabled={!selectedPlayers.length}
                      onClick={() => void copyAssignments()}
                      className={actionClass({ size: "sm" })}
                    >
                      {copied ? (
                        <Check className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Clipboard className="h-4 w-4" aria-hidden="true" />
                      )}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
                {copyError && (
                  <p className="mb-3 text-sm text-red-700 dark:text-red-300">
                    Could not copy assignments: {copyError}
                  </p>
                )}
                {selectedPlayers.length > 0 ? (
                  <CourtAssignmentDisplay plan={assignmentPlan} />
                ) : (
                  <Card className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
                    <RotateCcw
                      className="mx-auto mb-3 h-5 w-5"
                      aria-hidden="true"
                    />
                    Select attending players to generate the first round.
                  </Card>
                )}
              </section>
            </div>
          </PageContent>
        );
      }}
    </LeaderboardPageShell>
  );
}
