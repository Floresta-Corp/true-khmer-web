import { ChevronsLeft, ChevronRight } from "lucide-react";

import type { CursorPagination } from "~/types/api-client";

interface ManageModeratorPaginationProps {
  pagination: CursorPagination;
  hasCursor: boolean;
  onCursorChange: (cursor: string | null) => void;
}

export function ManageModeratorPagination({
  pagination,
  hasCursor,
  onCursorChange,
}: ManageModeratorPaginationProps) {
  if (!pagination.hasMore && !hasCursor) return null;

  return (
    <div className="flex items-center justify-between border-slate-50 px-8 py-4 dark:border-slate-800">
      <button
        onClick={() => onCursorChange(null)}
        disabled={!hasCursor}
        className="flex items-center gap-2 px-4 py-2 text-xs font-black tracking-widest text-slate-400 uppercase transition-all hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:text-slate-100"
      >
        <ChevronsLeft size={14} /> First
      </button>
      <button
        onClick={() => onCursorChange(pagination.nextCursor)}
        disabled={!pagination.hasMore}
        className="flex items-center gap-2 px-4 py-2 text-xs font-black tracking-widest text-slate-400 uppercase transition-all hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:text-slate-100"
      >
        Next <ChevronRight size={14} />
      </button>
    </div>
  );
}
