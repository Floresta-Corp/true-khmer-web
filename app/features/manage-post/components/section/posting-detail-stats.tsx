import {
  Search,
  HeartHandshake,
  MessageSquare,
  CalendarDays,
  CheckCircle2,
  Eye,
  ScanSearch,
} from "lucide-react";
import { useLoaderData } from "react-router";
import type { loader } from "../../routes/manage-post.$sourceType.$id";

export default function ManagePostingDetailStats() {
  const { postDetail } = useLoaderData<typeof loader>();

  const totalApplicant = postDetail?.stats?.statuses?.CONFIRMED ?? 0;

  const capacity = postDetail?.posting?.capacity ?? 0;

  const remaining = capacity - totalApplicant;

  // Determine if the recruitment goal has been met
  const isGoalReached = totalApplicant >= capacity && capacity > 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
      {/* 1. Pending Card */}
      <div className="bg-[#4F5FE8] rounded-[24px] p-6 flex justify-between items-start relative overflow-hidden h-40 shadow-indigo-500/20">
        <div className="relative z-20">
          <p className="text-[14px] font-semibold text-white/70  tracking-wider mb-4">
            Pending
          </p>
          <p className="text-4xl font-bold text-white tracking-tight">
            {postDetail?.stats?.pending ?? 0}
          </p>
        </div>

        {/* Bottom text + watermark */}
        <div className="absolute bottom-4 left-6 z-20 pointer-events-none">
          <span className="text-white/75 text-xs font-medium">
            Requires immediate review
          </span>
        </div>

        <div className="absolute inset-0 bg-linear-to-br from-indigo-600/0 via-indigo-600/0 to-black/10 z-10 pointer-events-none" />
      </div>

      {/* 2. Total Applicants */}
      <div className="bg-white rounded-[24px] border border-gray-100 p-6 flex justify-between items-start relative overflow-hidden h-40 ">
        <div className="relative z-20">
          <p className="text-[14px] font-semibold text-gray-400 tracking-wider mb-4">
            Total Applicants
          </p>

          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-bold text-gray-900 tracking-tight">
              {postDetail?.stats?.totalApplicants ?? 0}
            </p>

            <span className="text-xs font-semibold text-emerald-500">
              +12% this week
            </span>
          </div>
        </div>

        <HeartHandshake
          size={120}
          className="absolute -bottom-4 -right-4 text-violet-400 opacity-[0.10] -rotate-12 pointer-events-none"
          strokeWidth={1.5}
        />
      </div>

      {/* 4. Recruitment Goal */}
      <div
        className={`rounded-[24px] border p-6 flex justify-between items-start relative overflow-hidden h-40 transition-all duration-300 ${
          isGoalReached
            ? "bg-emerald-50 border-emerald-200 shadow-md shadow-emerald-500/5"
            : "bg-white border-gray-100 "
        }`}
      >
        <div className="relative z-20">
          <p
            className={`text-[14px] font-semibold tracking-wider mb-4 ${
              isGoalReached ? "text-emerald-700/70" : "text-gray-400"
            }`}
          >
            Recruitment Goal
          </p>

          <div className="flex items-baseline gap-3">
            <p
              className={`text-4xl font-semibold tracking-tight ${
                isGoalReached ? "text-emerald-900" : "text-gray-900"
              }`}
            >
              {totalApplicant}{" "}
              <span
                className={`text-lg font-medium ${
                  isGoalReached ? "text-emerald-600" : "text-gray-400"
                }`}
              >
                / {capacity}
              </span>
            </p>

            {isGoalReached ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-pulse self-center">
                Goal Achieved!
              </span>
            ) : (
              <span className="text-xs font-semibold text-amber-500">
                {remaining > 0 ? remaining : 0} to go
              </span>
            )}
          </div>
        </div>

        {/* Conditional Large Watermark Icon */}
        {isGoalReached ? (
          <CheckCircle2
            size={120}
            className="absolute -bottom-6 -right-2 text-emerald-500 opacity-[0.08] -rotate-12 pointer-events-none"
            strokeWidth={1.5}
          />
        ) : (
          <CalendarDays
            size={120}
            className="absolute -bottom-6 -right-2 text-amber-400 opacity-[0.15] -rotate-12 pointer-events-none"
            strokeWidth={1.5}
          />
        )}
      </div>

      {/* 3. Total Views */}
      <div className="bg-white rounded-[24px] border border-gray-100 p-6 flex justify-between items-start relative overflow-hidden h-40 ">
        <div className="relative z-20">
          <p className="text-[14px] font-semibold text-gray-400 tracking-wider mb-4">
            Total Views
          </p>

          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-bold text-gray-900 tracking-tight">
              {postDetail?.posting?.views ?? 0}
            </p>

            <span className="text-xs font-semibold text-emerald-500">
              +450 today
            </span>
          </div>
        </div>

        <ScanSearch
          size={120}
          className="absolute -bottom-4 -right-4 text-green-500 opacity-[0.10] -rotate-12 pointer-events-none"
          strokeWidth={1.5}
        />
      </div>
    </div>
  );
}
