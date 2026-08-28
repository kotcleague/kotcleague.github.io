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
      <p className="text-xl font-bold">{title}</p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        {message}
      </p>
      {actionHref && actionLabel && (
        <a
          href={actionHref}
          className="mt-6 inline-flex rounded-lg bg-blue px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
        >
          {actionLabel}
        </a>
      )}
    </div>
  );
}
