import { ExternalLink, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { buildPlumpiHomeUrl } from "~/features/events/lib/plumpi-links";

type Props = {
  animateOnMount?: boolean;
};

/**
 * Left rail of the basics step: what the step is for, plus the Plumpi pitch.
 */
export default function CreateEventAside({ animateOnMount = false }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = animateOnMount && !prefersReducedMotion;
  const plumpiHomeUrl = buildPlumpiHomeUrl();

  return (
    <motion.aside
      initial={shouldAnimate ? { opacity: 0, x: -18 } : false}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: shouldAnimate ? 0.32 : 0, ease: "easeOut" }}
      className="hidden h-full w-75 shrink-0 flex-col overflow-y-auto border-r border-[#E1E7EF] bg-[#F9FAFC] p-8 pt-11 lg:flex"
    >
      <div className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className="h-7 w-0.75 rounded-full bg-blue-600"
        />
        <h2 className="text-lg font-extrabold text-[#1D283A]">Get started</h2>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-slate-500">
        Add a few details here to get started, and head to Plumpi for the full
        experience.
      </p>

      <div className="mt-auto border-t border-[#E1E7EF] px-3.5 pt-6 pb-3">
        <div className="flex items-center gap-2 text-sm font-bold text-[#1D283A]">
          <Sparkles className="size-4 text-blue-600" />
          Why Plumpi?
        </div>
        <p className="mt-3.5 text-sm leading-relaxed text-slate-500">
          Built for event organizers to save time, engage audiences and run
          successful events.
        </p>
        {plumpiHomeUrl && (
          <a
            href={plumpiHomeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 rounded-sm text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Learn more
            <ExternalLink className="size-3.5" aria-hidden="true" />
            <span className="sr-only">about Plumpi (opens in a new tab)</span>
          </a>
        )}
      </div>
    </motion.aside>
  );
}
