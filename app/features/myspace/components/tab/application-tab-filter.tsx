type TabItem = {
  label: string;
  value: string;
};

type TabButtonGroupProps = {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (value: string) => void;
};

export default function ApplicationTabFilter({
  tabs,
  activeTab,
  onTabChange,
}: TabButtonGroupProps) {
  return (
    <div className="flex flex-wrap items-center gap-1 rounded-2xl border border-transparent bg-[#F1F3F4] p-1 dark:border-slate-800 dark:bg-slate-950">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;
        return (
          <button
            key={`${tab.label}-${tab.value}`}
            type="button"
            onClick={() => onTabChange(tab.value)}
            className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
              isActive
                ? "bg-white text-[#1A73E8] shadow-sm dark:bg-slate-900 dark:text-blue-400"
                : "text-[#5F6368] hover:bg-white/50 dark:text-slate-400 dark:hover:bg-slate-900/50"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
