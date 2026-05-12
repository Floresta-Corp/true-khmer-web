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
    <div className="flex flex-wrap items-center gap-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;
        return (
          <button
            key={`${tab.label}-${tab.value}`}
            type="button"
            onClick={() => onTabChange(tab.value)}
            className={`rounded-full px-6 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-[#0050d4] text-[#f1f2ff]"
                : "bg-[#eef1f3] text-[#595c5e] hover:bg-[#e2e8f0]"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
