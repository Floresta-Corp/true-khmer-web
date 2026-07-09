import { Calendar, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router";

import { Skeleton } from "~/components/ui/skeleton";
import { PackageBadge, PartnerStatusBadge, PublishBadge } from "./partner-badges";
import { formatPartnerDate } from "./partner-utils";
import type { ManagedPartner } from "../types";

export function PartnersTable({ partners }: { partners: ManagedPartner[] }) {
  const navigate = useNavigate();

  const goToDetail = (partnerId: string) => {
    navigate(`/tk-admin/partners/${partnerId}`, { viewTransition: true });
  };

  return (
    <>
      {/* Desktop table view */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-[#1e3a8a] text-white">
              <th className="px-4 py-3 font-semibold">Full Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Phone</th>
              <th className="px-4 py-3 font-semibold">Sector of Activity</th>
              <th className="px-4 py-3 font-semibold">Package</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Publish</th>
              <th className="px-4 py-3 font-semibold">Registration Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {partners.map((partner) => {
              const name = partner.name || partner.nameKh || "—";
              const sector = partner.sectorActivity || partner.sectorActivityKm || "—";
              const pkg = partner.package || partner.packageKm;
              return (
                <tr
                  key={partner.id}
                  onClick={() => goToDetail(partner.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      goToDetail(partner.id);
                    }
                  }}
                  tabIndex={0}
                  className="cursor-pointer text-slate-700 transition-colors hover:bg-slate-50 focus:bg-slate-50 focus:outline-none dark:text-slate-300 dark:hover:bg-slate-800/60 dark:focus:bg-slate-800/60"
                >
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                    {name}
                  </td>
                  <td className="px-4 py-3">{partner.email}</td>
                  <td className="px-4 py-3">{partner.phoneNumber}</td>
                  <td className="px-4 py-3">
                    {sector}
                  </td>
                  <td className="px-4 py-3">
                    {pkg ? <PackageBadge label={pkg} /> : "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    <PartnerStatusBadge status={partner.status} />
                  </td>
                  <td className="px-4 py-3">
                    <PublishBadge isPublished={partner.isPublished} />
                  </td>
                  <td className="px-4 py-3">
                    {formatPartnerDate(partner.createdAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile / tablet card view */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800 lg:hidden">
        {partners.map((partner) => {
          const name = partner.name || partner.nameKh || "—";
          const sector = partner.sectorActivity || partner.sectorActivityKm || "—";
          const pkg = partner.package || partner.packageKm;
          return (
            <button
              key={partner.id}
              type="button"
              onClick={() => goToDetail(partner.id)}
              className="w-full select-none p-4 text-left transition-colors hover:bg-slate-50 focus:bg-slate-50 focus:outline-none active:bg-slate-100 dark:hover:bg-slate-800/60 dark:focus:bg-slate-800/60"
            >
              <div className="space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold leading-tight text-slate-900 dark:text-white">
                      {name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {sector}
                    </p>
                  </div>
                  <div className="shrink-0">
                    {pkg ? <PackageBadge label={pkg} /> : "N/A"}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 shrink-0 text-blue-600" />
                    <span className="truncate text-slate-600 dark:text-slate-300">
                      {partner.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 shrink-0 text-blue-600" />
                    <span className="text-slate-600 dark:text-slate-300">
                      {partner.phoneNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 shrink-0 text-blue-600" />
                    <span className="text-slate-600 dark:text-slate-300">
                      {formatPartnerDate(partner.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PartnerStatusBadge status={partner.status} />
                    <PublishBadge isPublished={partner.isPublished} />
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}

export function PartnersTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      <div className="hidden bg-gradient-to-r from-blue-600 to-[#1e3a8a] px-4 py-3 lg:block">
        <Skeleton className="h-4 w-40 bg-white/30" />
      </div>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between gap-4 px-4 py-4"
        >
          <Skeleton className="h-4 w-40" />
          <Skeleton className="hidden h-4 w-48 sm:block" />
          <Skeleton className="hidden h-4 w-28 md:block" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="hidden h-4 w-24 lg:block" />
        </div>
      ))}
    </div>
  );
}
