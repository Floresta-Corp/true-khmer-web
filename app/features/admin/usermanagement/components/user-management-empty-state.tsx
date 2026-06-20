import { Users } from "lucide-react";

export function UserManagementEmptyState() {
  return (
    <div className="flex min-h-80 flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800">
        <Users className="size-5" />
      </div>
      <h2 className="text-base font-semibold text-slate-900 dark:text-white">
        No users found
      </h2>
      <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
        Try a different name or email address, or clear the current filters.
      </p>
    </div>
  );
}
