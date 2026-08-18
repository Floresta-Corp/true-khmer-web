import { Link } from "react-router";
import { motion, MotionConfig } from "motion/react";
import { slideUpVariants, staggerContainerVariants } from "./home-motion";

const EXPLORE_LINKS = [
  {
    title: "Forum",
    description: "Join discussions",
    icon: "/home-explore-forum.png",
    to: "/forum",
  },
  {
    title: "Launchpad",
    description: "Build ideas",
    icon: "/home-explore-launchpad.png",
    to: "/launchpad",
  },
  {
    title: "Volunteers",
    description: "Give back",
    icon: "/home-explore-volunteer.png",
    to: "/volunteer",
  },
  {
    title: "Khmer Voice",
    description: "Articles & insights",
    icon: "/home-explore-blog.svg",
    to: "/blog",
  },
] as const;

export function HomeExploreSection() {
  return (
    <MotionConfig reducedMotion="user">
      <motion.section
        className="pt-15 pb-8 md:pt-0"
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="site-container">
          <motion.h2
            variants={slideUpVariants}
            className="text-2xl font-semibold tracking-[-0.04em] text-[#333333] sm:text-[36px] sm:leading-11"
          >
            What Would You Like To Explore?
          </motion.h2>
          <div className="mt-8 flex gap-3 overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 sm:px-0 lg:grid lg:grid-cols-4 lg:gap-8 lg:overflow-visible [&::-webkit-scrollbar]:hidden">
            {EXPLORE_LINKS.map((link) => (
              <motion.div
                key={link.title}
                variants={slideUpVariants}
                className="flex w-[65%] shrink-0 sm:w-auto lg:shrink"
              >
                <Link
                  to={link.to}
                  className="flex w-full items-center gap-3 rounded-2xl border border-[#e1e7ef] bg-white px-3 py-4 text-left shadow-[0px_2px_4px_0px_rgba(27,28,29,0.04)] transition-colors hover:border-[#2f6fe4] sm:gap-5 sm:px-4 sm:py-5"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center">
                    <img src={link.icon} alt="" className="size-12" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#171717] sm:text-lg sm:font-semibold">
                      {link.title}
                    </p>
                    <p className="text-xs text-[#606060] sm:text-sm">
                      {link.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </MotionConfig>
  );
}
