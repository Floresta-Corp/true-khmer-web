import { NavLink } from "react-router";
import { cn } from "~/lib/utils";

const tabs = [
  { label: "Khmer Voices", to: "/tk-admin/khmer-voices", end: true },
  { label: "Categories", to: "/tk-admin/khmer-voices/categories", end: false },
] as const;

export function BlogAdminHeader({ description }: { description: string }) {
  return (
    <header>
      <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
        Khmer Voices
      </h1>
      <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-500 sm:text-base dark:text-slate-400">
        {description}
      </p>

      <nav
        aria-label="Khmer Voices administration"
        className="mt-6 flex gap-6 border-b border-slate-200 dark:border-slate-800"
      >
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              cn(
                "relative px-1 pb-3 text-sm font-semibold transition-colors",
                isActive
                  ? "text-blue-600 after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-full after:bg-blue-600 dark:text-blue-400 dark:after:bg-blue-400"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white",
              )
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
