import type {
  ContentModeratorReport,
  ContentModeratorReportsSummary,
  CursorPagination,
} from "~/types/api-client";

export type CategoryOption = { id: string | null; name: string };

export type ContentModeratorStats = ContentModeratorReportsSummary;

export type ContentModeratorData = {
  content: ContentModeratorReport[];
  types: Array<{ id: string; name: string }>;
  pagination: CursorPagination | null;
  stats: ContentModeratorStats;
  userId: string | null;
  highlightedReportId: string | null;
};
