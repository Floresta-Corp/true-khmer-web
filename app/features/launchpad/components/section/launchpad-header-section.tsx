import { useLoaderData } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import HeaderSearch from "~/components/header-search";
import type { loader } from "~/features/launchpad/routes/launchpad";

export default function LaunchpadHeaderSection() {
  const { locations } = useLoaderData<typeof loader>();
  const prefersReducedMotion = useReducedMotion();

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: prefersReducedMotion ? 0 : 0.5,
      delay: prefersReducedMotion ? 0 : delay,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  });

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
      className="flex h-125 flex-col items-center justify-center px-6 md:px-12 lg:px-[131.5px] bg-linear-to-r from-sky-100 to-white"
    >
      <motion.div {...fadeUp(0.1)} className="mb-8 text-center">
        <h1 className="text-[#174FB4] text-[42px] font-semibold leading-12 tracking-[-1.05px]">
          Where Idea Take Off
        </h1>
        <motion.p
          {...fadeUp(0.2)}
          className="mx-auto mt-2 max-w-146.75 text-sm font-medium leading-6 text-[#65758b]"
        >
          Connect with founders, explore the next generation of Khmer impact,
          and find co-operation opportunities.
        </motion.p>
      </motion.div>

      <motion.div {...fadeUp(0.3)} className="flex w-full max-w-196 flex-col gap-5">
        <div className="flex w-full flex-col items-stretch gap-4 md:flex-row md:items-center md:gap-5.25">
          <HeaderSearch
            postButton="Post project"
            postUrl="/launchpad/create"
            inputPlaceholder="Search project by name..."
            locations={locations}
          />
        </div>
      </motion.div>
    </motion.section>
  );
}
