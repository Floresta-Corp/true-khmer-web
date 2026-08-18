import { Users } from "lucide-react";

import DetailPanel from "~/features/admin/components/detail-panel";
import type { AdminVolunteerPostDetailResponse } from "~/types/api-client";

type VolunteerRole = AdminVolunteerPostDetailResponse["roles"][number];

function BulletList({ heading, items }: { heading: string; items: string[] }) {
  if (items.length === 0) return null;

  return (
    <div className="mt-2.5">
      <p className="text-[11px] font-bold tracking-wide text-slate-400 uppercase dark:text-slate-500">
        {heading}
      </p>
      <ul className="mt-1 space-y-1">
        {items.map((item, index) => (
          <li
            key={`${heading}-${index}`}
            className="flex gap-1.5 text-xs leading-5 text-slate-500 dark:text-slate-400"
          >
            <span aria-hidden="true" className="text-slate-300">
              •
            </span>
            <span className="min-w-0">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ManageVolunteerRolesPanel({
  roles,
}: {
  roles: VolunteerRole[];
}) {
  return (
    <DetailPanel title={`Roles (${roles.length})`}>
      {roles.length === 0 ? (
        <p className="py-4 text-center text-xs text-slate-400 dark:text-slate-500">
          This opportunity lists no roles.
        </p>
      ) : (
        <ul className="space-y-2.5">
          {roles.map((role) => (
            <li
              key={role.id}
              className="rounded-xl border border-slate-200/70 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-900/50"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {role.title}
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-white px-2 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200 ring-inset dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700">
                  <Users size={12} />
                  {role.capacity} spot
                  {role.capacity === 1 ? "" : "s"}
                </span>
              </div>

              <BulletList
                heading="Responsibilities"
                items={role.responsibilities}
              />
              <BulletList heading="Requirements" items={role.requirements} />
            </li>
          ))}
        </ul>
      )}
    </DetailPanel>
  );
}
