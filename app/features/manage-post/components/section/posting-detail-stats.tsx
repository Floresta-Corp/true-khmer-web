import {
  ClipboardList,
  UserRoundPlus,
  Flag,
  Users,
  ClipboardClock,
} from "lucide-react";
import { useFetchers, useLoaderData } from "react-router";
import type { loader } from "../../routes/manage-post.$sourceType.$id";
import { useEffect, useRef } from "react";

export default function ManagePostingDetailStats() {
  const { postDetail } = useLoaderData<typeof loader>();
  const fetchers = useFetchers();

  const recruited = postDetail?.stats?.recruited ?? 0;
  const capacity = postDetail?.posting?.capacity ?? 0;

  // Track a local "floor" so the count never drops below what we've approved
  const localApprovedRef = useRef(recruited);

  // In-flight approvals
  const pendingApprovals = fetchers.filter(
    (f) => f.state !== "idle" && f.formData?.get("statusAction") === "approve",
  ).length;

  // Once loader revalidates with a higher number, update our floor
  useEffect(() => {
    if (recruited > localApprovedRef.current) {
      localApprovedRef.current = recruited;
    }
  }, [recruited]);

  // Use whichever is higher: server value, our local floor, or optimistic
  const optimisticRecruited = Math.min(
    Math.max(recruited, localApprovedRef.current) + pendingApprovals,
    capacity,
  );

  const progress = Math.min(
    capacity > 0 ? Math.round((optimisticRecruited / capacity) * 100) : 0,
    100,
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {/* 1. Pending Card */}
      <div className="bg-white rounded-[24px] border border-gray-100 p-6 flex justify-between items-start relative overflow-hidden h-40 shadow-sm">
        <div className="relative z-20">
          <p className="text-md font-bold text-gray-400 uppercase tracking-[0.15em] mb-4">
            {postDetail?.posting?.status}
          </p>
          <p className="text-4xl font-bold text-gray-900 tracking-tight">
            {postDetail?.stats?.totalApplicants}
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-400 relative z-20">
          <ClipboardClock size={20} strokeWidth={2.5} />
        </div>
        <ClipboardClock
          size={120}
          className="absolute -bottom-4 -right-4 text-orange-500 opacity-[0.20] rotate-12 pointer-events-none"
        />
      </div>

      {/* 2. Total Applicants (The Blue Hero Card) */}
      <div className="bg-[#2563EB] rounded-[24px] p-6 flex justify-between items-start relative overflow-hidden h-40 shadow-lg shadow-blue-600/20">
        <div className="relative z-20">
          <p className="text-md font-bold text-blue-100/80 uppercase tracking-[0.15em] mb-4">
            Total Applicants
          </p>
          <p className="text-4xl font-bold text-white tracking-tight">
            {postDetail?.stats?.recruited}
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white relative z-20">
          <UserRoundPlus size={20} strokeWidth={2.5} />
        </div>

        {/* Overlapping Silhouettes Pattern */}
        <div className="absolute -bottom-4 -right-4 flex items-end justify-end pointer-events-none select-none z-10">
          <Users
            size={130}
            className="text-[#1E40AF] opacity-[0.6]"
            strokeWidth={2}
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-br from-blue-600/0 via-blue-600/0 to-black/5 z-10 pointer-events-none" />
      </div>

      {/* 3. Recruitment Goal Card */}
      <div className="bg-white rounded-[24px] border border-gray-100 p-6 flex justify-between items-start relative overflow-hidden h-40 shadow-sm">
        <div className="flex-1 relative z-20">
          <p className="text-md font-bold text-gray-400 uppercase tracking-[0.15em] mb-4">
            Recruitment Goal
          </p>
          <p className="text-4xl font-bold text-slate-800 mb-5 tracking-tighter">
            {optimisticRecruited}
            <span className="text-slate-300 font-light mx-0.5">/</span>
            <span className="text-slate-400">{capacity}</span>
          </p>
          <div className="w-full bg-slate-100 rounded-full h-2 relative overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full  duration-700 "
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 ml-4 relative z-20">
          <Flag size={20} strokeWidth={2.5} />
        </div>
        {/* Subtle background icon for the white card */}
        <Flag
          size={120}
          className="absolute -bottom-6 -right-2 text-blue-600 opacity-[0.20] -rotate-12 pointer-events-none"
        />
      </div>
    </div>
  );
}
