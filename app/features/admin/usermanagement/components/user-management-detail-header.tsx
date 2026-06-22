import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

import { Button } from "~/components/ui/button";

export function UserManagementDetailHeader() {
  return (
    <header className="mb-6 flex items-center gap-3">
      <Button variant="ghost" size="icon" asChild>
        <Link to="/tk-admin/users" aria-label="Back to user management">
          <ArrowLeft />
        </Link>
      </Button>
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">
          User Profile
        </h1>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          Account details, points, and recent activity.
        </p>
      </div>
    </header>
  );
}
