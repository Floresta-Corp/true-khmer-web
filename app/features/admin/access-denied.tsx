import { Link } from "react-router";
import { ShieldAlert } from "lucide-react";

export function meta() {
  return [{ title: "Access Denied | True Khmer Admin" }];
}

export default function AdminAccessDeniedPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
        <ShieldAlert className="h-8 w-8" />
      </div>

      <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
        Access Restricted
      </h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
        This admin module is not available for the selected role. Switch back to
        Super Admin or choose another accessible section.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/tk-admin"
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700"
        >
          Back to Dashboard
        </Link>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800/70"
          onClick={() => window.history.back()}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
