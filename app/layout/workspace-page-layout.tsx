import type React from "react";
import type { PropsWithChildren } from "react";
import { motion, useReducedMotion } from "motion/react";

interface WorkSpacePageLayoutProps extends PropsWithChildren {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}

export default function WorkSpacePageLayout({
  title,
  subtitle,
  action,
  children,
}: WorkSpacePageLayoutProps) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <div className="max-w-7xl w-full mx-auto">
      <motion.div
        className="p-4 sm:p-8 md:p-10 overflow-y-auto"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.28 }}
      >
        {/* Header Container */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
              {title}
            </h1>
            <p className="text-base sm:text-lg text-gray-500 max-w-2xl">
              {subtitle}
            </p>
          </div>

          {/* Action Slot */}
          {action && <div className="mt-4">{action}</div>}
        </div>
      </motion.div>

      <motion.main
        className="flex-1 px-4 sm:px-6 md:px-6 lg:px-8 pb-12"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.32,
          delay: prefersReducedMotion ? 0 : 0.04,
        }}
      >
        {children}
      </motion.main>
    </div>
  );
}
