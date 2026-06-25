import { SearchX } from "lucide-react";

interface EmptySearchStateProps {
  searchTerm: string;
  onClear?: () => void;
}

export function EmptySearchState({
  searchTerm,
  onClear,
}: EmptySearchStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800">
        <SearchX className="size-5" />
      </div>
      <h2 className="text-base font-semibold text-slate-900 dark:text-white">
        No results found
      </h2>
      <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
        We couldn&apos;t find any team members matching &ldquo;
        <span className="font-medium text-slate-700 dark:text-slate-300">
          {searchTerm}&rdquo;.
        </span>
        <br />
        Try checking your spelling or use different keywords.
      </p>
      {onClear && (
        <button
          onClick={onClear}
          className="mt-6 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 transition-colors"
        >
          Clear search
        </button>
      )}
    </div>
  );
}

interface EmptyTeamStateProps {
  message?: string;
}

export function EmptyTeamState({
  message = "No team members found.",
}: EmptyTeamStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800">
        <SearchX className="size-5" />
      </div>
      <h2 className="text-base font-semibold text-slate-900 dark:text-white">
        No team members
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {message}
      </p>
    </div>
  );
}
