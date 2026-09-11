import { useEffect } from "react";
import type { LessonGateState } from "~/features/education/types";

/**
 * Hands a player's gate up to the learner screen when it changes.
 *
 * Every field is a primitive, so the effect can depend on them one by one: a
 * dependency on the object itself would fire on every render, because each
 * render builds a fresh one.
 */
export function useReportLessonGate(
  gate: LessonGateState,
  onGateChange?: (gate: LessonGateState) => void,
) {
  useEffect(() => {
    onGateChange?.(gate);
  }, [
    onGateChange,
    gate.ratio,
    gate.isSatisfied,
    gate.watchedSeconds,
    gate.positionSeconds,
  ]);
}
