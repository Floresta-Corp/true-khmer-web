import { Link, useLoaderData } from "react-router";
import { ArrowLeft, ChevronRight } from "lucide-react";

import { ReviewForm } from "../review-form";
import type { registrationDetailLoader } from "../../services/registration-detail.loader";

export default function RegistrationDetailPage() {
  const { partner, contactPersons } =
    useLoaderData<typeof registrationDetailLoader>();

  const partnerName = partner.name || "Partner";

  return (
    <main className="min-h-full bg-[#f8fafc] px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
          <Link
            to="/tk-admin/registrations"
            className="hover:text-slate-900 dark:hover:text-white"
          >
            Registrations
          </Link>
          <ChevronRight className="size-4" />
          <span className="truncate text-slate-900 dark:text-white">
            {partnerName}
          </span>
        </nav>

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              Review Partner Registration
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Review and approve or reject this partner registration
            </p>
          </div>

          <Link
            to="/tk-admin/registrations"
            viewTransition
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="size-4" />
            Back to Registrations
          </Link>
        </div>

        {/* Review form */}
        <ReviewForm partner={partner} contactPersons={contactPersons} />
      </div>
    </main>
  );
}
