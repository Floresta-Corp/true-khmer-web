import {
  Search,
  HeartHandshake,
  MessageSquare,
  CalendarDays,
} from "lucide-react";
import { useLoaderData } from "react-router";
import type { loader } from "../../routes/manage-post.$sourceType.$id";

export default function ManagePostingDetailStats() {
  const { postDetail } = useLoaderData<typeof loader>();

  const totalApplicant = postDetail?.stats?.statuses.APPROVED ?? 0;

  const capacity = postDetail?.posting?.capacity ?? 0;

  const remaining = capacity - totalApplicant;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
      {/* 1. Pending Card */}
      <div className="bg-[#4F5FE8] rounded-[24px] p-6 flex justify-between items-start relative overflow-hidden h-40 shadow-lg shadow-indigo-500/20">
        <div className="relative z-20">
          <p className="text-md font-bold text-white/70 uppercase tracking-[0.15em] mb-4">
            Pending
            {/* {postDetail?.stats?.pending ?? ""} */}
          </p>
          <p className="text-4xl font-bold text-white tracking-tight">
            {postDetail?.posting?.applicantCount}
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white relative z-20">
          <MessageSquare size={20} strokeWidth={2.5} />
        </div>

        {/* Bottom text + watermark */}
        <div className="absolute bottom-4 left-6 z-20 pointer-events-none">
          <span className="text-white/75 text-xs font-medium">
            Requires immediate review
          </span>
        </div>
        <MessageSquare
          size={130}
          className="absolute -bottom-4 -right-4 text-white opacity-[0.08] pointer-events-none"
          strokeWidth={1.5}
        />
        <div className="absolute inset-0 bg-linear-to-br from-indigo-600/0 via-indigo-600/0 to-black/10 z-10 pointer-events-none" />
      </div>

      {/* 2. Total Applicants */}
      <div className="bg-white rounded-[24px] border border-gray-100 p-6 flex justify-between items-start relative overflow-hidden h-40 shadow-sm">
        <div className="relative z-20">
          <p className="text-md font-bold text-gray-400 uppercase tracking-[0.15em] mb-4">
            Total Applicants
          </p>
          <p className="text-4xl font-bold text-gray-900 tracking-tight">
            {postDetail?.stats?.totalApplicants ?? 0}
          </p>
          <p className="text-xs font-semibold text-emerald-500 mt-2">
            +12% this week
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-400 relative z-20">
          <HeartHandshake size={20} strokeWidth={2.5} />
        </div>
        <HeartHandshake
          size={120}
          className="absolute -bottom-4 -right-4 text-violet-400 opacity-[0.10] rotate-12 pointer-events-none"
          strokeWidth={1.5}
        />
      </div>

      {/* 3. Total Views */}
      <div className="bg-white rounded-[24px] border border-gray-100 p-6 flex justify-between items-start relative overflow-hidden h-40 shadow-sm">
        <div className="relative z-20">
          <p className="text-md font-bold text-gray-400 uppercase tracking-[0.15em] mb-4">
            Total Views
          </p>
          <p className="text-4xl font-bold text-gray-900 tracking-tight">
            {postDetail?.posting?.views}
          </p>
          <p className="text-xs font-semibold text-emerald-500 mt-2">
            +450 today
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-500 relative z-20">
          <Search size={20} strokeWidth={2.5} />
        </div>
        <Search
          size={120}
          className="absolute -bottom-4 -right-4 text-green-500 opacity-[0.10] rotate-12 pointer-events-none"
          strokeWidth={1.5}
        />
      </div>

      {/* 4. Recruitment Goal */}
      <div className="bg-white rounded-[24px] border border-gray-100 p-6 flex justify-between items-start relative overflow-hidden h-40 shadow-sm">
        <div className="relative z-20">
          <p className="text-md font-bold text-gray-400 uppercase tracking-[0.15em] mb-4">
            Recruitment Goal
          </p>
          <p className="text-4xl font-bold text-gray-900 tracking-tight">
            {postDetail?.stats?.statuses?.APPROVED}
          </p>
          <p className="text-xs font-semibold text-amber-500 mt-2">
            {remaining} to go
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 relative z-20">
          <CalendarDays size={20} strokeWidth={2.5} />
        </div>
        <CalendarDays
          size={120}
          className="absolute -bottom-6 -right-2 text-amber-400 opacity-[0.15] -rotate-12 pointer-events-none"
          strokeWidth={1.5}
        />
      </div>
    </div>
  );
}
