import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import type { PostSourceType } from "~/features/workspace/manage-post/types";

type ApplicantNoteActionProps = {
  sourceType: PostSourceType;
  postingId: string;
  candidateId: string;
  existingNote?: string;
  onSaved?: (note: string) => void;
};

export default function ApplicantNoteAction({
  sourceType,
  postingId,
  candidateId,
  existingNote,
  onSaved,
}: ApplicantNoteActionProps) {
  const fetcher = useFetcher();
  const [savedNote, setSavedNote] = useState(existingNote ?? "");
  const [noteText, setNoteText] = useState(existingNote ?? "");
  const [editMode, setEditMode] = useState(false);
  const isSubmitting = fetcher.state !== "idle";
  const hasChanges = noteText !== savedNote;

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const data = fetcher.data as { success?: boolean; error?: string };
      if (data.success) {
        setSavedNote(noteText);
        toast.success("Confidential note saved successfully.");
        setEditMode(false);
      } else if (data.error) {
        toast.error(data.error);
      }
    }
  }, [fetcher.state, fetcher.data]);

  useEffect(() => {
    setSavedNote(existingNote ?? "");
    setNoteText(existingNote ?? "");
  }, [existingNote]);

  return (
    <div className="border-gray-150/60 mt-3 border-t pt-5 dark:border-slate-800/60">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
          Private Note
        </span>
        <span className="rounded bg-gray-100 px-2 py-0.5 text-[9px] font-bold tracking-wide text-gray-500 dark:bg-slate-800 dark:text-slate-400">
          Not visible to the candidate
        </span>
      </div>

      <fetcher.Form method="POST" className="w-full">
        {!editMode && savedNote ? (
          <div className="border-gray-150 rounded-2xl border p-4">
            <p className="text-gray-850 font-sans text-sm leading-relaxed whitespace-pre-wrap dark:text-gray-100">
              {savedNote}
            </p>
            <div className="mt-3 flex justify-end">
              <Button
                onClick={() => setEditMode(true)}
                className="flex cursor-pointer items-center gap-1.5 bg-white text-xs font-bold text-blue-500 hover:underline"
              >
                <Pencil size={8} />
                Edit Note
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border-gray-200 dark:border-slate-800">
            <input type="hidden" name="actionType" value="note" />
            <input type="hidden" name="candidateId" value={candidateId} />
            <input type="hidden" name="sourceType" value={sourceType} />
            <input type="hidden" name="postingId" value={postingId} />
            <textarea
              rows={4}
              name="note"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Type personal evaluation notes or review status here..."
              className="focus:border-brand-blue dark:focus:border-brand-blue text-gray-850 w-full rounded-xl border border-gray-200 bg-white p-3.5 font-sans text-sm leading-relaxed placeholder-gray-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] transition-all focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-gray-100 dark:placeholder-slate-500"
            />
            {hasChanges && (
              <div className="mt-3 flex items-center justify-end gap-2.5">
                {savedNote && (
                  <Button
                    onClick={() => {
                      setNoteText(savedNote);
                      setEditMode(false);
                    }}
                    className="cursor-pointer rounded-lg bg-gray-100 px-3.5 py-1.5 text-xs font-semibold text-gray-600 transition-all hover:bg-gray-200/80 dark:bg-slate-800 dark:text-slate-300"
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  // onClick={handleSave}
                  disabled={isSubmitting}
                  className="bg-brand-blue cursor-pointer rounded-lg bg-blue-500 px-5 py-1.5 text-xs font-semibold tracking-wide text-white shadow-sm transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Note"}
                </Button>
              </div>
            )}
          </div>
        )}
      </fetcher.Form>
    </div>
  );
}
