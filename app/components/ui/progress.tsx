import * as React from "react";
import { Progress as ProgressPrimitive } from "radix-ui";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "~/lib/utils";

function Progress({
  className,
  value,
  animate = false,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  animate?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const transform = `translateX(-${100 - (value || 0)}%)`;
  return (
    <ProgressPrimitive.Root
      value={value}
      data-slot="progress"
      className={cn(
        "relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted",
        className,
      )}
      {...props}
    >
      {animate ? (
        <ProgressPrimitive.Indicator asChild data-slot="progress-indicator">
          <motion.div
            className="size-full flex-1 bg-primary"
            initial={
              prefersReducedMotion ? false : { transform: "translateX(-100%)" }
            }
            whileInView={{ transform }}
            viewport={{ once: true }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        </ProgressPrimitive.Indicator>
      ) : (
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className="size-full flex-1 bg-primary transition-all motion-reduce:transition-none"
          style={{ transform }}
        />
      )}
    </ProgressPrimitive.Root>
  );
}

export { Progress };
