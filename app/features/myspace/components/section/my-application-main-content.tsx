import React from "react";
import { useSearchParams } from "react-router";

const tabItems = [
  { label: "All", value: "all" },
  { label: "Volunteer", value: "volunteer" },
  { label: "Projects", value: "projects" },
];

type TabItem = (typeof tabItems)[number]["value"];

export default function MyAppicationMainContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabItem) ?? "all";
  const [activeTab, setActiveTab] = React.useState<TabItem>(initialTab);
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value }, { replace: true });
  };

  return (
    <div>
      <div className="">
        <div className="hidden sm:flex flex-wrap items-center gap-2">
          {tabItems.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={`${tab.label}-${tab.value}`}
                type="button"
                onClick={() => handleTabChange(tab.value)}
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
      </div>
    </div>
  );
}
