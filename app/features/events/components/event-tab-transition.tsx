import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

/** Entry transition for route-owned tab content; persistent sidebars stay outside. */
export function EventTabTransition({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.25,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}
