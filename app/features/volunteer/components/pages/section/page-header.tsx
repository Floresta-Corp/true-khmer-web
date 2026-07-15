import { motion, useReducedMotion } from "motion/react";
import BackToButton from "~/components/back-to-button";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  backTo: string;
  animationDelay?: number;
}

export default function PageHeader({
  title,
  subtitle,
  backTo,
  animationDelay = 0,
}: PageHeaderProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
      >
        <BackToButton to={backTo} />
      </motion.div>

      <motion.div
        className="my-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.3,
          delay: prefersReducedMotion ? 0 : 0.05 + animationDelay,
        }}
      >
        <section className="flex flex-col gap-1.75">
          <h1 className="text-3xl leading-[38.4px] font-semibold tracking-[-0.8px] text-[#030213] md:text-4xl">
            {title}
          </h1>
          <p className="text-base leading-6 font-medium text-[#65758B]">
            {subtitle}
          </p>
        </section>
      </motion.div>
    </>
  );
}
