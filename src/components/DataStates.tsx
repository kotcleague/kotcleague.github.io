import ActionLink from "@/components/ActionLink";

interface LoadingStateProps {
  label: string;
}

export function LoadingState({ label }: LoadingStateProps) {
  return (
    <div
      className="flex items-center justify-center py-32"
      role="status"
      aria-label={label}
    >
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-ink/20 border-t-ink dark:border-white/20 dark:border-t-white" />
    </div>
  );
}

interface ErrorStateProps {
  actionHref?: string;
  actionLabel?: string;
  message: string;
  title: string;
}

export function ErrorState({
  actionHref,
  actionLabel,
  message,
  title,
}: ErrorStateProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-32 text-center sm:px-6">
      <p className="text-2xl font-bold tracking-tight">{title}</p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        {message}
      </p>
      {actionHref && actionLabel && (
        <ActionLink href={actionHref} className="mt-6">
          {actionLabel}
        </ActionLink>
      )}
    </div>
  );
}
