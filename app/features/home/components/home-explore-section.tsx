import { Link } from "react-router";

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
] as const;

export function HomeExploreSection() {
  return (
    <section className="pt-15 pb-8 md:pt-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#333333] sm:text-[36px] sm:leading-11">
          What Would You Like To Explore?
        </h2>
        <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-8">
          {EXPLORE_LINKS.map((link) => (
            <Link
              key={link.title}
              to={link.to}
              className="flex flex-col items-center gap-2 text-center sm:flex-row sm:items-center sm:gap-5 sm:rounded-2xl sm:border sm:border-[#e1e7ef] sm:bg-white sm:px-4 sm:py-5 sm:text-left sm:shadow-[0px_2px_4px_0px_rgba(27,28,29,0.04)] sm:transition-colors sm:hover:border-[#2f6fe4]"
            >
              <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[#eef2ff] sm:size-12 sm:rounded-none sm:bg-transparent">
                <img src={link.icon} alt="" className="size-9 sm:size-12" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-[#171717] sm:text-lg sm:font-semibold">
                  {link.title}
                </p>
                <p className="hidden text-sm text-[#606060] sm:block">
                  {link.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
