import { Skeleton } from "~/components/ui/skeleton";
import CreateEventAside from "./create-event-aside";
import CreateEventAutosaveStatus from "./create-event-autosave-status";
import CreateEventTopBar from "./create-event-top-bar";

export default function CreateEventPageSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading event creation"
      className="fixed inset-0 z-50 flex h-screen flex-col overflow-hidden bg-white supports-[height:100dvh]:h-dvh"
    >
      <CreateEventTopBar
        closeTo="/my-events"
        autosaveStatus="loading"
        autosaveLabel="Loading..."
      />
      <CreateEventAutosaveStatus
        status="loading"
        label="Loading..."
        className="shrink-0 justify-end border-b border-[#E1E7EF] bg-slate-50/70 px-5 py-2 sm:hidden"
      />

      <div className="flex min-h-0 flex-1">
        <CreateEventAside animateOnMount />

        <main className="min-h-0 flex-1 overflow-y-auto px-5 pt-9 pb-20 [scrollbar-gutter:stable] md:px-6">
          <div className="mx-auto w-full max-w-170">
            <div className="flex items-baseline justify-between gap-4">
              <h1 className="text-2xl font-extrabold text-[#1D283A]">
                Tell us about your event
              </h1>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#E1E7EF] bg-white px-3.5 py-1.5 text-xs font-bold text-slate-500">
                <span className="size-1.5 rounded-full bg-slate-400" />
                Draft
              </span>
            </div>
            <p className="mt-2 mb-6 text-sm leading-relaxed text-slate-500">
              Fill in just the basics here. For tickets, program scheduling and
              other full setup, you&apos;ll continue in Plumpi.
            </p>

            <div className="space-y-6">
              <section className="rounded-[10px] border border-[#E1E7EF] bg-white p-4">
                <Skeleton className="h-4 w-18" />
                <div className="mt-2.5 flex items-center gap-3.5">
                  <Skeleton className="size-10 shrink-0 rounded-full" />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <Skeleton className="h-3.75 w-36 max-w-full" />
                    <Skeleton className="h-3.25 w-64 max-w-full" />
                  </div>
                  <Skeleton className="size-4.5 shrink-0 rounded-full" />
                </div>
              </section>

              <section className="overflow-hidden rounded-xl border border-[#E1E7EF] bg-white">
                <div className="flex items-center gap-3.5 border-b border-[#E1E7EF] px-5 py-4.5">
                  <Skeleton className="size-9 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-3 w-64 max-w-full" />
                  </div>
                </div>

                <div className="space-y-6 px-5 pt-5 pb-6">
                  <div>
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="mt-2 h-11.5 w-full rounded-lg" />
                  </div>

                  <div>
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="mt-2 h-11.5 w-full rounded-lg" />
                  </div>

                  <div>
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="mt-2 h-24 w-full rounded-lg" />
                    <Skeleton className="mt-1 ml-auto h-3 w-10" />
                  </div>

                  <div className="h-px bg-[#E1E7EF]" />

                  <div>
                    <Skeleton className="h-3.5 w-14" />
                    <div className="mt-2.5 grid gap-3 sm:grid-cols-2">
                      <Skeleton className="h-17 w-full rounded-[10px]" />
                      <Skeleton className="h-17 w-full rounded-[10px]" />
                    </div>
                  </div>

                  <div className="h-px bg-[#E1E7EF]" />

                  <div>
                    <Skeleton className="h-3.5 w-20" />
                    <div className="mt-2.5 grid gap-3 sm:grid-cols-3">
                      {["Start date", "Start time", "End time"].map((label) => (
                        <div key={label}>
                          <Skeleton className="mb-1.5 h-3 w-16" />
                          <Skeleton className="h-11 w-full rounded-lg" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-[#E1E7EF]" />

                  <div>
                    <Skeleton className="h-3.5 w-20" />
                    <Skeleton className="mt-2.5 aspect-video w-full rounded-xl" />
                  </div>
                </div>
              </section>

              <section className="overflow-hidden rounded-xl border border-[#E1E7EF] bg-white">
                <div className="flex items-center gap-3.5 border-b border-[#E1E7EF] px-5 py-4.5">
                  <Skeleton className="size-9 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3.5 w-36" />
                    <Skeleton className="h-3 w-72 max-w-full" />
                  </div>
                </div>

                <div className="space-y-6 px-5 pt-5 pb-6">
                  {[2, 3, 3].map((count, groupIndex) => (
                    <div key={groupIndex}>
                      {groupIndex > 0 && (
                        <div className="mb-6 h-px bg-[#E1E7EF]" />
                      )}
                      <Skeleton className="h-3.5 w-48 max-w-full" />
                      <div
                        className={`mt-3 grid gap-3 sm:grid-cols-2 ${count === 3 ? "lg:grid-cols-3" : ""}`}
                      >
                        {Array.from({ length: count }).map((_, index) => (
                          <Skeleton
                            key={index}
                            className="h-18 w-full rounded-[10px]"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="mt-7 flex justify-end gap-3">
              <Skeleton className="h-11 w-32 rounded-lg" />
              <Skeleton className="h-11 w-24 rounded-lg" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
