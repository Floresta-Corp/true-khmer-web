import type {
  ContentModeratorReport,
  CursorPagination,
} from "~/types/api-client";

export type CategoryOption = { id: string | null; name: string };

export type ContentModeratorData = {
  content: ContentModeratorReport[];
  types: Array<{ id: string; name: string }>;
  pagination: CursorPagination | null;
  userId: string | null;
  highlightedReportId: string | null;
};
