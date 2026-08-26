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
    <motion.div className="relative flex items-center gap-3.5 rounded-full p-1 transition-all">
      <motion.div
        className="absolute top-1 left-1 h-3 w-20 rounded-full bg-blue-500"
        initial={{ x: 0, y: 0 }}
        animate={{
          x: currentState === ProgressState.DETAIL ? 0 : 80 + 13,
        }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.3,
        }}
      />
      <div
        className="h-3 w-20 cursor-pointer rounded-full bg-gray-200"
        onClick={() => onStateChange(ProgressState.DETAIL)}
      />
      <div
        className="h-3 w-20 cursor-pointer rounded-full bg-gray-200"
        onClick={() => onStateChange(ProgressState.ROLE)}
      />
    </motion.div>
  );
}
