import { AnimatePresence, motion, useReducedMotion } from "motion/react";

interface FormContainerProps {
  currentState: string;
  stateKey: string;
  children: React.ReactNode;
  animationDelay?: number;
}

export default function FormContainer({
  currentState,
  stateKey,
  children,
  animationDelay = 0,
}: FormContainerProps) {
  const prefersReducedMotion = useReducedMotion();
  const isVisible = currentState === stateKey;

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key={stateKey}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.3,
            delay: prefersReducedMotion ? 0 : 0.15 + animationDelay,
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
