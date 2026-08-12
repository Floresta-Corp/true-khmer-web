import { ShieldCheck } from "lucide-react";

interface AccessRestrictedProps {
  message?: string;
}

export function AccessRestricted({
  message = "You don't have permission to view this page.",
}: AccessRestrictedProps) {
  return (
    <main className="flex min-h-[calc(100vh-30rem)] items-center justify-center bg-[#f8fafc] px-4 dark:bg-slate-950">
      <div className="flex flex-col items-center text-center">
        <ShieldCheck className="size-10 text-slate-900 dark:text-white" />
        <h1 className="mt-4 text-3xl font-bold text-slate-950 dark:text-white">
          Access Restricted
        </h1>
        <span className="text-md mt-2 tracking-wide text-slate-500 dark:text-slate-400">
          {message}
        </span>
      </div>
    </main>
  );
}
