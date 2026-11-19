import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import type { PrivateNoteEntry } from "~/features/workspace/manage-volunteer/types";

type ApplicantNoteActionProps = {
  postingId: string;
  candidateId: string;
  entries: PrivateNoteEntry[];
  isLoading?: boolean;
};

function formatStamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ApplicantNoteAction({
  postingId,
  candidateId,
  entries,
  isLoading = false,
}: ApplicantNoteActionProps) {
  const fetcher = useFetcher();
  const [noteText, setNoteText] = useState("");
  const handledData = useRef<unknown>(null);
  const isSubmitting = fetcher.state !== "idle";
  const canSubmit = noteText.trim().length > 0 && !isSubmitting;

  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;
    if (handledData.current === fetcher.data) return;
    handledData.current = fetcher.data;

    const data = fetcher.data as { success?: boolean; error?: string };
    if (data.success) {
      setNoteText("");
      toast.success("Note added.");
    } else {
      toast.error(data.error ?? "Couldn't add the note.");
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <div className="border-gray-150/60 mt-3 border-t pt-5 dark:border-slate-800/60">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
          Private Notes
        </span>
        <span className="rounded bg-gray-100 px-2 py-0.5 text-[9px] font-bold tracking-wide text-gray-500 dark:bg-slate-800 dark:text-slate-400">
          Not visible to the candidate
        </span>
      </div>

      <fetcher.Form method="POST" className="w-full">
        <input type="hidden" name="actionType" value="note" />
        <input type="hidden" name="candidateId" value={candidateId} />
        <input type="hidden" name="postingId" value={postingId} />
        <textarea
          rows={3}
          name="note"
          value={noteText}
          maxLength={5000}
          onChange={(event) => setNoteText(event.target.value)}
          placeholder="Add an evaluation note or review update..."
          aria-label="New private note"
          className="focus:border-brand-blue dark:focus:border-brand-blue text-gray-850 w-full rounded-xl border border-gray-200 bg-white p-3.5 font-sans text-sm leading-relaxed placeholder-gray-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] transition-all focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-gray-100 dark:placeholder-slate-500"
        />
        <div className="mt-2 flex justify-end">
          <Button
            type="submit"
            disabled={!canSubmit}
            className="cursor-pointer rounded-lg bg-blue-500 px-5 py-1.5 text-xs font-semibold tracking-wide text-white shadow-sm transition-all hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Adding..." : "Add Note"}
          </Button>
        </div>
      </fetcher.Form>

      <div className="mt-4">
        {isLoading && entries.length === 0 ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        ) : entries.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-200 px-4 py-3 text-center text-xs text-gray-400 dark:border-slate-800">
            No notes yet.
          </p>
        ) : (
          <ol className="space-y-4 border-l-2 border-gray-100 pl-4 dark:border-slate-800">
            {entries.map((entry) => (
              <li key={entry.id} className="relative">
                <span
                  aria-hidden
                  className="absolute top-1.5 -left-5.25 size-2 rounded-full bg-blue-400 ring-4 ring-white dark:ring-slate-900"
                />
                <p className="flex flex-wrap items-baseline gap-x-1.5 text-[11px] text-gray-400">
                  <span className="font-bold text-gray-600 dark:text-slate-300">
                    {entry.author.name}
                  </span>
                  <span aria-hidden>·</span>
                  <time dateTime={entry.createdAt}>
                    {formatStamp(entry.createdAt)}
                  </time>
                </p>
                <p className="text-gray-850 mt-1 text-sm leading-relaxed break-words whitespace-pre-wrap dark:text-gray-100">
                  {entry.note}
                </p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
