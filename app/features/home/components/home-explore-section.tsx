import { Link } from "react-router";
import { motion, MotionConfig } from "motion/react";
import { slideUpVariants, staggerContainerVariants } from "./home-motion";

const EXPLORE_LINKS = [
  {
    title: "Forum",
    icon: "/home-explore-forum.png",
    to: "/forum",
  },
  {
    title: "Volunteer",
    icon: "/home-explore-volunteer.png",
    to: "/volunteer",
  },
  {
    title: "Launchpad",
    icon: "/home-explore-launchpad.png",
    to: "/launchpad",
  },
  {
    title: "Events",
    icon: "/home-explore-event.png",
    to: "/events",
  },
  {
    title: "Education",
    icon: "/home-explore-blog.svg",
    to: "/education",
  },
  {
    title: "Blog",
    icon: "/home-explore-blog.png",
    to: "/blog",
  },
] as const;

export function HomeExploreSection() {
  return (
    <MotionConfig reducedMotion="user">
      <motion.section
        className="pt-8 pb-4"
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="site-container">
          {/* <motion.h2
            variants={slideUpVariants}
            className="text-2xl font-semibold tracking-[-0.04em] text-[#333333] sm:text-[36px] sm:leading-11"
          >
            What Would You Like To Explore?
          </motion.h2> */}
          <div className="flex gap-3 overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-4 sm:px-0 lg:grid lg:grid-cols-6 lg:gap-4 lg:overflow-visible [&::-webkit-scrollbar]:hidden">
            {EXPLORE_LINKS.map((link) => (
              <motion.div
                key={link.title}
                variants={slideUpVariants}
                className="flex w-[40%] shrink-0 sm:w-auto lg:shrink"
              >
                <Link
                  to={link.to}
                  className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border border-[#e1e7ef] bg-white px-3 py-5 text-center shadow-[0px_2px_4px_0px_rgba(27,28,29,0.04)] transition-colors hover:border-[#2f6fe4] focus-visible:border-[#2f6fe4] focus-visible:outline-none sm:px-4"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center">
                    <img
                      src={link.icon}
                      alt=""
                      className="size-10 object-contain"
                    />
                  </span>
                  <p className="text-sm font-semibold text-[#171717]">
                    {link.title}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </MotionConfig>
  );
}
