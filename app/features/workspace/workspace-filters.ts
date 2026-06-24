import { z } from "zod";

export const workspaceQuestionSortSchema = z.enum([
  "newest",
  "mostVoted",
  "mostAnswered",
  "byCategory",
]);
export type WorkspaceQuestionSort = z.infer<typeof workspaceQuestionSortSchema>;

export const DEFAULT_QUESTION_SORT: WorkspaceQuestionSort = "newest";

export const QUESTION_SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "mostVoted", label: "Most Voted" },
  { value: "mostAnswered", label: "Most Answered" },
  { value: "byCategory", label: "By Category" },
] as const satisfies ReadonlyArray<{
  value: WorkspaceQuestionSort;
  label: string;
}>;

/** Parse a raw search param into a valid sort, falling back to the default. */
export function parseQuestionSort(value: string | null): WorkspaceQuestionSort {
  const result = workspaceQuestionSortSchema.safeParse(value);
  return result.success ? result.data : DEFAULT_QUESTION_SORT;
}

/** Minimal shape the sort comparators read; works for any question type. */
type SortableQuestion = {
  score: number;
  answerCount: number;
  category: { name: string };
  createdAt: string;
};

/** Client-side sort for the user's own questions. Returns a new array. */
export function sortQuestions<T extends SortableQuestion>(
  questions: T[],
  sort: WorkspaceQuestionSort,
): T[] {
  const sorted = [...questions];

  switch (sort) {
    case "mostVoted":
      return sorted.sort((a, b) => b.score - a.score);
    case "mostAnswered":
      return sorted.sort((a, b) => b.answerCount - a.answerCount);
    case "byCategory":
      return sorted.sort((a, b) =>
        a.category.name.localeCompare(b.category.name),
      );
    case "newest":
    default:
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }
}
