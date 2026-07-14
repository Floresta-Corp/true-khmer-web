import type { ShouldRevalidateFunctionArgs } from "react-router";

// Dropping `contentId` from the URL (after the highlighted report has been
// consumed) shouldn't re-run the loader — that would clear
// `highlightedReportId` before the highlight animation gets a chance to run.
export function contentModeratorShouldRevalidate({
  currentUrl,
  nextUrl,
  formMethod,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  if (formMethod) return defaultShouldRevalidate;

  const droppedContentId =
    currentUrl.searchParams.has("contentId") &&
    !nextUrl.searchParams.has("contentId");

  if (!droppedContentId) return defaultShouldRevalidate;

  const currentRest = new URLSearchParams(currentUrl.search);
  const nextRest = new URLSearchParams(nextUrl.search);
  currentRest.delete("contentId");
  nextRest.delete("contentId");

  return currentRest.toString() !== nextRest.toString()
    ? defaultShouldRevalidate
    : false;
}
