import type { GetScrollRestorationKeyFunction } from "react-router";

export interface ScrollGroupHandle {
  scrollGroup?: boolean;
}

/**
 * Nested routes can opt into a shared scroll position by marking their layout
 * route with `handle.scrollGroup`. This keeps tab navigation at the user's
 * current position while unrelated page navigation retains normal behavior.
 */
export const getScrollRestorationKey: GetScrollRestorationKeyFunction = (
  location,
  matches,
) => {
  const groupMatch = [...matches]
    .reverse()
    .find(
      (match) =>
        (match.handle as ScrollGroupHandle | undefined)?.scrollGroup === true,
    );

  return groupMatch?.pathname ?? location.key;
};
