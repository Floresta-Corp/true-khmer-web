import type { Variants } from "motion/react";

export const HERO_EASE: [number, number, number, number] = [
  0.25, 0.46, 0.45, 0.94,
];

export const staggerContainerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: HERO_EASE } },
};
