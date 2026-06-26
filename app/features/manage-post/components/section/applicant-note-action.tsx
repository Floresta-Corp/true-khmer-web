import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import type { PostSourceType } from "~/features/manage-post/types";

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
    <div className="mt-3 border-t border-gray-150/60 dark:border-slate-800/60 pt-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Private Note
        </span>
        <span className="text-[9px] font-bold text-gray-500 bg-gray-100 dark:text-slate-400 dark:bg-slate-800 px-2 py-0.5 rounded tracking-wide">
          Not visible to the candidate
        </span>
      </div>

      <fetcher.Form method="POST" className="w-full">
        {!editMode && savedNote ? (
          <div className="border border-gray-150 rounded-2xl p-4">
            <p className="text-sm text-gray-850 dark:text-gray-100 font-sans leading-relaxed whitespace-pre-wrap">
              {savedNote}
            </p>
            <div className="mt-3 flex justify-end">
              <Button
                onClick={() => setEditMode(true)}
                className="text-xs font-bold text-blue-500 bg-white hover:underline cursor-pointer flex items-center gap-1.5"
              >
                <Pencil size={8} />
                Edit Note
              </Button>
            </div>
          </div>
        ) : (
          <div className="border-gray-200 dark:border-slate-800 rounded-2xl ">
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
              className="w-full p-3.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-brand-blue dark:focus:border-brand-blue font-sans text-gray-850 dark:text-gray-100 placeholder-gray-400 dark:placeholder-slate-500 transition-all leading-relaxed shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
            />
            {hasChanges && (
              <div className="mt-3 flex items-center justify-end gap-2.5">
                {savedNote && (
                  <Button
                    onClick={() => {
                      setNoteText(savedNote);
                      setEditMode(false);
                    }}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200/80 transition-all"
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  // onClick={handleSave}
                  disabled={isSubmitting}
                  className="px-5 py-1.5 rounded-lg text-xs font-semibold tracking-wide cursor-pointer bg-brand-blue text-white bg-blue-500 transition-all shadow-sm disabled:opacity-50"
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
