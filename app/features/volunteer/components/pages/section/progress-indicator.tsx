import { motion, useReducedMotion } from "motion/react";

export enum ProgressState {
  DETAIL = "Detail",
  ROLE = "Role",
}

interface ProgressIndicatorProps {
  currentState: ProgressState;
  onStateChange: (state: ProgressState) => void;
}

export default function ProgressIndicator({
  currentState,
  onStateChange,
}: ProgressIndicatorProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div className="relative flex gap-3.5 transition-all items-center p-1 rounded-full">
      <motion.div
        className="h-3 w-20 bg-blue-500 rounded-full absolute top-1 left-1"
        initial={{ x: 0, y: 0 }}
        animate={{
          x: currentState === ProgressState.DETAIL ? 0 : 80 + 13,
        }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.3,
        }}
      />
      <div
        className="cursor-pointer h-3 w-20 bg-gray-200 rounded-full"
        onClick={() => onStateChange(ProgressState.DETAIL)}
      />
      <div
        className="cursor-pointer h-3 w-20 bg-gray-200 rounded-full"
        onClick={() => onStateChange(ProgressState.ROLE)}
      />
    </motion.div>
  );
}
