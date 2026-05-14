import { useSearchParams } from "react-router";
import { Search, Send, Mail, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import type {
  Applicant,
  ApplicantStatus,
  TimeFilter,
} from "../data/manage-post-detail-type";
import { motion } from "motion/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

const TIME_FILTERS: { label: string; value: TimeFilter }[] = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "this-week" },
  { label: "All Time", value: "all-time" },
];

const STATUS_STYLES: Record<ApplicantStatus, string> = {
  new: "bg-blue-50 text-blue-600 border-blue-100",
  "in-review": "bg-amber-50 text-amber-600 border-amber-100",
  passed: "bg-green-50 text-green-600 border-green-100",
  rejected: "bg-red-50 text-red-600 border-red-100",
};

const STATUS_LABELS: Record<ApplicantStatus, string> = {
  new: "New",
  "in-review": "In-Review",
  passed: "Passed",
  rejected: "Rejected",
};

type Props = {
  applicants: Applicant[];
};

export default function ManagePostingDetailTable({ applicants }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();

  const timeFilter = (searchParams.get("time") as TimeFilter) ?? "all-time";
  const search = searchParams.get("search") ?? "";

  const setParam = (key: string, value: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (!value || (key === "time" && value === "all-time")) {
          next.delete(key);
        } else {
          next.set(key, value);
        }
        return next;
      },
      { replace: true },
    );
  };

  const getTimeRangeFilter = (
    filter: TimeFilter,
  ): ((date: string) => boolean) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    return (dateStr: string) => {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return false; // Invalid date, exclude it

      switch (filter) {
        case "today":
          return date >= today && date < new Date(today.getTime() + 86400000);
        case "this-week":
          return date >= weekAgo;
        case "all-time":
          return true;
        default:
          return true;
      }
    };
  };

  const timeFilterFn = getTimeRangeFilter(timeFilter);

  const filtered = applicants.filter((a) => {
    const matchesSearch = search
      ? a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase())
      : true;

    const matchesTime = timeFilterFn(a.appliedOn);

    return matchesSearch && matchesTime;
  });

  return (
    <>
      <div className="flex items-center justify-between gap-4 flex-wrap p-8">
        {/* Left Side: Title and Tabs Group */}
        <div className="flex items-center gap-6">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            All Applicants
          </h2>

          <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl shadow-inner w-max relative">
            {TIME_FILTERS.map((f) => {
              const isActive = timeFilter === f.value;

              return (
                <button
                  key={f.value}
                  onClick={() => setParam("time", f.value)}
                  className={cn(
                    "relative px-4 py-1.5 rounded-lg text-[13px] font-bold transition-colors duration-300 cursor-pointer outline-none",
                    isActive
                      ? "text-blue-600 dark:text-white"
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300",
                  )}
                >
                  <span className="relative z-20">{f.label}</span>

                  {isActive && (
                    <motion.div
                      layoutId="activeTimeFilter"
                      className="absolute inset-0 bg-white dark:bg-slate-800 rounded-lg shadow-sm"
                      style={{ zIndex: 10 }}
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Search Bar */}
        <div className="relative flex-1 max-w-md min-w-70">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <Input
            className="h-10 pl-11 pr-4 text-[13px] border-slate-200 bg-white rounded-xl focus-visible:ring-blue-500/20 placeholder:text-slate-400 placeholder:font-medium transition-all shadow-sm"
            placeholder="Search postings name"
            value={search}
            onChange={(e) => setParam("search", e.target.value)}
          />
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-2.5 flex flex-col gap-4">
        {/* Table */}
        <div className="overflow-x-auto rounded-2xl ">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-900/50 border-b border-gray-100 text-[12px] font-bold uppercase tracking-widest">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-slate-600 dark:text-slate-400 h-12 p-4">
                  Candidate
                </TableHead>
                <TableHead className="text-slate-600 dark:text-slate-400 h-12 p-4">
                  Role Applied
                </TableHead>
                <TableHead className="text-slate-600 dark:text-slate-400 h-12 p-4">
                  Applied On
                </TableHead>
                <TableHead className="text-slate-600 dark:text-slate-400 h-12 p-4">
                  Status
                </TableHead>
                <TableHead className="text-center text-slate-600 dark:text-slate-400 h-12 p-4">
                  Contact
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-50">
              {filtered.map((applicant) => (
                <TableRow
                  key={applicant.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  {/* Candidate */}
                  <TableCell className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-gray-100">
                        <AvatarFallback className="text-xs font-semibold bg-gray-100 text-gray-600">
                          {applicant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-[15px] font-semibold text-gray-900">
                          {applicant.name}
                        </p>
                        <p className="text-sm text-gray-400">
                          {applicant.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  {/* Role */}
                  <TableCell>
                    <Badge className="text-sm font-medium bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-50">
                      {applicant.role}
                    </Badge>
                  </TableCell>
                  {/* Applied On */}
                  <TableCell className="text-sm text-gray-500">
                    {applicant.appliedOn}
                  </TableCell>
                  {/* Status */}
                  <TableCell>
                    <Badge
                      className={cn("text-sm", STATUS_STYLES[applicant.status])}
                    >
                      {STATUS_LABELS[applicant.status]}
                    </Badge>
                  </TableCell>
                  {/* Contact */}
                  <TableCell className="py-4">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-blue-100/60 text-blue-500 hover:text-gray-600"
                        aria-label="Send message"
                      >
                        <Send size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-gray-600"
                        aria-label="Compose email"
                      >
                        <Mail size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-gray-600"
                        aria-label="More actions"
                      >
                        <MoreVertical size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
