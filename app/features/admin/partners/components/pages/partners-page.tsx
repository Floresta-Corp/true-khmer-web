import { Suspense } from "react";
import { Await, useLoaderData, useLocation, useNavigation } from "react-router";
import { Building2 } from "lucide-react";

import {
  PartnersPagination,
  PartnersPaginationSkeleton,
} from "../partners-pagination";
import { PartnersTable, PartnersTableSkeleton } from "../partners-table";
import { PartnersToolbar } from "../partners-toolbar";
import type { partnersLoader } from "../../services/partners.loader";

export default function PartnersPage() {
  const { partners, query } = useLoaderData<typeof partnersLoader>();
  const location = useLocation();
  const navigation = useNavigation();

  const isLoadingPartners =
    navigation.state === "loading" &&
    navigation.location?.pathname === location.pathname;

  return (
    <main className="min-h-full bg-[#f8fafc] px-4 py-6 sm:px-6 lg:px-10 lg:py-8 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-[1400px] space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Partners
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Manage your active and inactive partners, view details, and perform
            actions
          </p>
        </div>

        <section
          className="flex h-[clamp(32rem,calc(100dvh-14rem),48rem)] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
          aria-busy={isLoadingPartners}
        >
          <PartnersToolbar />

          {isLoadingPartners ? (
            <>
              <PartnersTableSkeleton rows={6} />
              <PartnersPaginationSkeleton />
            </>
          ) : (
            <Suspense
              fallback={
                <>
                  <PartnersTableSkeleton rows={6} />
                  <PartnersPaginationSkeleton />
                </>
              }
            >
              <Await
                resolve={partners}
                errorElement={
                  <div className="p-6 text-center text-sm text-rose-600 dark:text-rose-400">
                    Error loading partners
                  </div>
                }
              >
                {(resolved) => (
                  <>
                    {resolved.data.length === 0 ? (
                      <div className="p-10 text-center">
                        <div className="flex flex-col items-center space-y-3">
                          <Building2 className="size-12 text-slate-300 dark:text-slate-600" />
                          <p className="text-slate-500 dark:text-slate-400">
                            {query
                              ? `No partners match your search "${query}"`
                              : "No partners have been registered yet"}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="min-h-0 flex-1 overflow-auto">
                          <PartnersTable partners={resolved.data} />
                        </div>
                        <PartnersPagination meta={resolved.meta} />
                      </>
                    )}
                  </>
                )}
              </Await>
            </Suspense>
          )}
        </section>
      </div>
    </main>
  );
}
