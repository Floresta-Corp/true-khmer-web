import { useSearchParams, useFetcher, useLoaderData } from "react-router";
import { Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";
import { motion } from "motion/react";
import { useState } from "react";
import type { SourceType } from "~/services/manage-post/types";

type TabType = "ALL" | SourceType;

const TABS = [
  { label: "All", value: "ALL" },
  { label: "Volunteer", value: "VOLUNTEER" },
  { label: "Projects", value: "PROJECT" },
];

export default function ManagePostFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const fetcher = useFetcher();

  const activeTab = (searchParams.get("tab") as TabType) ?? "ALL";
  const status = searchParams.get("status") ?? "ALL";
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") ?? "",
  );

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams);
    if (!tab || tab === "ALL") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    setSearchParams(params, { replace: true });
    fetcher.load(`/manage-post?${params.toString()}`);
  };

  const handleStatusChange = (val: string) => {
    const params = new URLSearchParams(searchParams);
    if (!val || val === "ALL") {
      params.delete("status");
    } else {
      params.set("status", val);
    }
    setSearchParams(params, { replace: true });
    fetcher.load(`/manage-post?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    setSearchParams(params, { replace: true });
    fetcher.load(`/manage-post?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap w-full m-4">
      <div className="flex items-center gap-3">
        <div className="flex bg-gray-100 dark:bg-slate-900 p-1 rounded-xl shadow-inner sm:w-max">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className="relative px-5 py-1.5 text-[14px] font-bold transition-colors duration-300 cursor-pointer z-10"
            >
              <span
                className={cn(
                  "relative z-20",
                  activeTab === tab.value
                    ? "text-blue-600 dark:text-white"
                    : "text-gray-500",
                )}
              >
                {tab.label}
              </span>

              {activeTab === tab.value && (
                <motion.div
                  layoutId="activeTabBackground"
                  className="absolute inset-0 bg-white dark:bg-slate-800 rounded-lg shadow-sm z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>

        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-35 h-10 text-[14px] font-medium border-slate-200 bg-white rounded-xl focus:ring-blue-500/20">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200">
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="FILLED">Filled</SelectItem>
            <SelectItem value="ENDED">Ended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="relative flex-1 max-w-md min-w-70">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <Input
          className="h-10 pl-11 pr-4 text-[14px] border-slate-200 bg-white rounded-xl focus-visible:ring-blue-500/20 placeholder:text-slate-400 placeholder:font-medium transition-all"
          placeholder="Search postings name..."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            handleSearch(e.target.value);
          }}
        />
      </div>
    </div>
  );
}
