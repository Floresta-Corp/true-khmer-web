import { motion } from "motion/react";
import type { PropsWithChildren } from "react";

interface SlideToLeftHoverAnimationProps extends PropsWithChildren {
  isHovered: boolean;
}

export default function SlideToLeftHoverAnimation({
  isHovered,
  children,
}: SlideToLeftHoverAnimationProps) {
  return (
    <motion.div
      className="flex items-center gap-1.5"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
