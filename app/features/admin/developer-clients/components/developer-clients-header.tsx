import { Plus } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";

export function DeveloperClientsHeader({ onCreate }: { onCreate: () => void }) {
  return (
    <header className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
          Developer Clients
        </h1>
        <p className="mt-1 max-w-2xl text-sm font-medium text-slate-500 dark:text-slate-400">
          Partner platforms authorised to look up True Khmer user profiles. Each
          client gets a public client ID and its own secret, shown once when
          issued.
        </p>
      </div>

      <Button
        type="button"
        size="lg"
        onClick={onCreate}
        className="h-10 w-full rounded-lg bg-blue-600 px-4 font-semibold text-white shadow-sm hover:bg-blue-700 sm:w-auto"
      >
        <Plus />
        New Client
      </Button>
    </header>
  );
}

export function DeveloperClientsHeaderSkeleton() {
  return (
    <header className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-56 rounded" />
        <Skeleton className="h-4 w-full max-w-lg rounded" />
        <Skeleton className="h-4 w-64 rounded" />
      </div>
      <Skeleton className="h-10 w-full rounded-lg sm:w-32" />
    </header>
  );
}
