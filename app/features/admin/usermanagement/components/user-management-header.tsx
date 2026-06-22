import { Plus } from "lucide-react";

import { Button } from "~/components/ui/button";

export function UserManagementHeader() {
  return (
    <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
          User Management
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
          Manage platform users, roles, and access permissions.
        </p>
      </div>

      <Button
        type="button"
        disabled
        size="lg"
        title="User creation will be integrated in a later step."
        className="h-10 w-full rounded-lg bg-blue-600 px-4 font-semibold shadow-sm hover:bg-blue-700 sm:w-auto"
      >
        <Plus />
        Add New User
      </Button>
    </header>
  );
}
