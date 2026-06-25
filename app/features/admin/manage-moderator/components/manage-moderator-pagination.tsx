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
    <div className="px-8 py-4 border-slate-50 dark:border-slate-800 flex items-center justify-between">
      <button
        onClick={() => onCursorChange(null)}
        disabled={!hasCursor}
        className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronsLeft size={14} /> First
      </button>
      <button
        onClick={() => onCursorChange(pagination.nextCursor)}
        disabled={!pagination.hasMore}
        className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        Next <ChevronRight size={14} />
      </button>
    </div>
  );
}
