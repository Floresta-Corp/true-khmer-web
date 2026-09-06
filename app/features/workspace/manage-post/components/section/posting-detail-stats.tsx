import {
  HeartHandshake,
  CalendarDays,
  CheckCircle2,
  ScanSearch,
} from "lucide-react";
import { useLoaderData } from "react-router";
import type { loader } from "../../route/manage-post.$sourceType.$id";

export default function ManagePostingDetailStats() {
  const { postDetail } = useLoaderData<typeof loader>();

  const totalApplicant =
    (postDetail?.stats?.statuses?.CONFIRMED ?? 0) +
    (postDetail?.stats?.statuses?.COMPLETED ?? 0);

  const capacity = postDetail?.posting?.capacity ?? 0;

  const remaining = capacity - totalApplicant;

  // Determine if the recruitment goal has been met
  const isGoalReached = totalApplicant >= capacity && capacity > 0;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
      {/* 1. Pending Card */}
      <div className="relative flex h-40 items-start justify-between overflow-hidden rounded-[24px] bg-blue-500 p-6">
        <div className="relative z-20">
          <p className="mb-4 text-[14px] font-semibold tracking-wider text-white/70">
            Pending
          </p>
        </div>

        {/* Bottom text + watermark */}
        <div className="pointer-events-none absolute bottom-4 left-6 z-20">
          <p className="text-4xl font-bold tracking-tight text-white">
            {postDetail?.stats?.pending ?? 0}
          </p>
          <span className="text-xs font-medium text-white/75">
            Requires immediate review
          </span>
        </div>

        <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-br from-indigo-600/0 via-indigo-600/0 to-black/10" />
      </div>

      {/* 2. Total Applicants */}
      <div className="relative flex h-40 items-start justify-between overflow-hidden rounded-[24px] border border-gray-100 bg-white p-6">
        <div className="relative z-20">
          <p className="mb-4 text-[14px] font-semibold tracking-wider text-gray-400">
            Total Applicants
          </p>
        </div>
        <div className="pointer-events-none absolute bottom-4 left-6 z-20">
          <p className="text-4xl font-bold tracking-tight text-black">
            {postDetail?.stats?.totalApplicants ?? 0}
          </p>
          <span className="text-xs font-medium text-green-500">
            +12% this week
          </span>
        </div>
        <HeartHandshake
          size={120}
          className="pointer-events-none absolute -right-4 -bottom-4 -rotate-12 text-violet-400 opacity-[0.10]"
          strokeWidth={1.5}
        />
      </div>

      {/* 4. Recruitment Goal */}
      <div
        className={`relative flex h-40 items-start justify-between overflow-hidden rounded-[24px] border p-6 transition-all duration-300 ${
          isGoalReached
            ? "border-emerald-200 bg-emerald-50 shadow-md shadow-emerald-500/5"
            : "border-gray-100 bg-white"
        }`}
      >
        <div className="relative z-20">
          <p
            className={`mb-4 text-[14px] font-semibold tracking-wider ${
              isGoalReached ? "text-emerald-700/70" : "text-gray-400"
            }`}
          >
            Recruitment Goal
          </p>
        </div>

        <div className="absolute bottom-4 left-6 z-20 gap-3">
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
            <span className="flex animate-pulse items-center gap-1 self-center text-xs font-bold text-emerald-600">
              Goal Achieved!
            </span>
          ) : (
            <span className="text-xs font-semibold text-amber-500">
              {remaining > 0 ? remaining : 0} to go
            </span>
          )}
        </div>

        {/* Conditional Large Watermark Icon */}
        {isGoalReached ? (
          <CheckCircle2
            size={120}
            className="pointer-events-none absolute -right-2 -bottom-6 -rotate-12 text-emerald-500 opacity-[0.08]"
            strokeWidth={1.5}
          />
        ) : (
          <CalendarDays
            size={120}
            className="pointer-events-none absolute -right-2 -bottom-6 -rotate-12 text-amber-400 opacity-[0.15]"
            strokeWidth={1.5}
          />
        )}
      </div>

      {/* 3. Total Views */}
      <div className="relative flex h-40 items-start justify-between overflow-hidden rounded-[24px] border border-gray-100 bg-white p-6">
        <div className="relative z-20">
          <p className="mb-4 text-[14px] font-semibold tracking-wider text-gray-400">
            Total Views
          </p>
        </div>
        <div className="pointer-events-none absolute bottom-4 left-6 z-20">
          <p className="text-4xl font-bold tracking-tight text-black">
            {postDetail?.posting?.views ?? 0}
          </p>
          <span className="text-xs font-medium text-green-500">+450 today</span>
        </div>

        <ScanSearch
          size={120}
          className="pointer-events-none absolute -right-4 -bottom-4 -rotate-12 text-green-500 opacity-[0.10]"
          strokeWidth={1.5}
        />
      </div>
    </div>
  );
}
