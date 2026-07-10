import { Suspense } from "react";
import {
  Await,
  useLoaderData,
  useNavigate,
} from "react-router";
import { Building2, Calendar, Mail, Phone } from "lucide-react";

import {
  AdminHeaderCell,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeaderRow,
  AdminTableRow,
} from "~/features/admin/components/admin-table";
import { PackageBadge } from "~/features/admin/partners/components/partner-badges";
import type { PartnerRegistration } from "../../types";
import { formatRegistrationDate } from "../partner-utils";
import { RegistrationsTableSkeleton } from "../registrations-page-skeleton";
import type { registrationsLoader } from "../../services/registrations.loader";

function PartnerTable({ partners }: { partners: PartnerRegistration[] }) {
  const navigate = useNavigate();

  const goToDetail = (partnerId: string) => {
    if (!partnerId) return;
    navigate(`/tk-admin/registrations/partner/${partnerId}`, {
      viewTransition: true,
    });
  };

  if (partners.length === 0) {
    return (
      <div className="p-10 text-center">
        <div className="flex flex-col items-center space-y-3">
          <Building2 className="size-12 text-slate-300 dark:text-slate-600" />
          <p className="text-slate-500 dark:text-slate-400">
            No pending partner found
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table view */}
      <div className="hidden overflow-x-auto lg:block">
        <AdminTable>
          <AdminTableHead>
            <AdminTableHeaderRow>
              <AdminHeaderCell label="Company Name" />
              <AdminHeaderCell label="Email" />
              <AdminHeaderCell label="Phone" />
              <AdminHeaderCell label="Sector" />
              <AdminHeaderCell label="Package" />
              <AdminHeaderCell label="Registration Date" />
            </AdminTableHeaderRow>
          </AdminTableHead>
          <AdminTableBody>
            {partners.map((partner) => {
              const pkg = partner.package;
              return (
                <AdminTableRow
                  key={partner.id}
                  interactive
                  onClick={() => goToDetail(partner.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      goToDetail(partner.id);
                    }
                  }}
                  tabIndex={0}
                >
                  <AdminTableCell className="font-medium text-slate-900 dark:text-white">
                    {partner.name || "—"}
                  </AdminTableCell>
                  <AdminTableCell>{partner.email}</AdminTableCell>
                  <AdminTableCell>{partner.phoneNumber}</AdminTableCell>
                  <AdminTableCell>
                    {partner.sectorActivity || "—"}
                  </AdminTableCell>
                  <AdminTableCell>
                    {pkg ? <PackageBadge label={pkg} /> : "N/A"}
                  </AdminTableCell>
                  <AdminTableCell>
                    {formatRegistrationDate(partner.createdAt)}
                  </AdminTableCell>
                </AdminTableRow>
              );
            })}
          </AdminTableBody>
        </AdminTable>
      </div>

      {/* Mobile / tablet card view */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800 lg:hidden">
        {partners.map((partner) => {
          const pkg = partner.package;
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
                      {partner.name || "—"}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {partner.sectorActivity || "—"}
                    </p>
                  </div>
                  <div className="shrink-0">
                    {pkg ? (
                      <PackageBadge label={pkg} />
                    ) : (
                      <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                        N/A
                      </span>
                    )}
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
                      {formatRegistrationDate(partner.createdAt)}
                    </span>
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

export default function RegistrationsPage() {
  const { partners } = useLoaderData<typeof registrationsLoader>();

  return (
    <main className="min-h-full bg-[#f8fafc] px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto w-full max-w-350">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Reviews
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Manage your pending partner registrations
          </p>
        </div>

        {/* Tab bar (Companies) */}
        <div className="relative mb-8 mt-6">
          <div className="rounded-xl border border-slate-200 bg-gradient-to-r from-white to-slate-100 p-1 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-800">
            <div className="relative flex">
              <div className="absolute bottom-0 left-0 top-0 w-full rounded-lg bg-gradient-to-r from-blue-600 to-[#1e3a8a] shadow-md" />
              <button
                type="button"
                className="relative z-10 flex-1 rounded-lg px-6 py-3 text-sm font-semibold text-white"
              >
                <span className="flex items-center justify-center gap-2">
                  <Building2 className="size-5" />
                  <span>Companies</span>
                  <span className="ml-2 rounded-full bg-white/20 px-2 py-1 text-xs font-medium text-white">
                    <Suspense fallback={0}>
                      <Await resolve={partners} errorElement={<>0</>}>
                        {(resolved) => resolved.length}
                      </Await>
                    </Suspense>
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Table card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Suspense fallback={<RegistrationsTableSkeleton />}>
            <Await
              resolve={partners}
              errorElement={
                <div className="p-6 text-center text-sm text-rose-600 dark:text-rose-400">
                  Error loading pending partners
                </div>
              }
            >
              {(resolved) => <PartnerTable partners={resolved} />}
            </Await>
          </Suspense>
        </div>
      </div>
    </main>
  );
}
