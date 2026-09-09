import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import AutosaveStatus from "~/components/autosave-status";
import { Button } from "~/components/ui/button";
import { ConfirmationModal } from "~/components/confirmation-modal";
import { BLOG_STATUS_LABELS, BLOG_STATUS_STYLES } from "~/lib/blog-status";
import { MY_BLOG_ACTIONS } from "../../types";
import type { BlogFormState } from "./use-blog-form";
import { UnpublishMyBlogDialog } from "./unpublish-my-blog-dialog";

const OUTLINE_BUTTON_CLASS =
  "h-10 border-slate-200 bg-white px-5 text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white";

interface BlogFormTopBarProps {
  form: BlogFormState;
  slug?: string;
}

export function BlogFormTopBar({ form, slug }: BlogFormTopBarProps) {
  const navigate = useNavigate();
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState(false);
  const [isWithdrawConfirmOpen, setIsWithdrawConfirmOpen] = useState(false);
  const [isUnpublishOpen, setIsUnpublishOpen] = useState(false);
  const { autosaveLabel, autosaveStatus, isEditable, isSubmitting, status } =
    form;
  const statusStyle = BLOG_STATUS_STYLES[status];

  function handleGoBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/workspace/khmer-voices");
  }

  function handleSubmitClick() {
    if (!form.isSubmittable) {
      toast.error(
        "Title, cover image, and blog body content are required to publish.",
      );
      return;
    }
    setIsSubmitConfirmOpen(true);
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          onClick={handleGoBack}
          className="rounded-full border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </Button>

        <div
          className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-[10px] font-bold tracking-widest uppercase ${statusStyle.badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
          {BLOG_STATUS_LABELS[status]}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isEditable ? (
          <AutosaveStatus status={autosaveStatus} label={autosaveLabel} />
        ) : null}
        <Button
          type="button"
          variant="outline"
          onClick={form.openPreview}
          className={OUTLINE_BUTTON_CLASS}
        >
          Preview
        </Button>

        {status === "PUBLISHED" && slug ? (
          <Button asChild variant="outline" className={OUTLINE_BUTTON_CLASS}>
            <Link to={`/khmervoices/${slug}`} target="_blank" rel="noreferrer">
              View live post
            </Link>
          </Button>
        ) : null}

        <Button
          type="button"
          disabled={isSubmitting}
          onClick={
            isEditable
              ? handleSubmitClick
              : status === "PENDING_REVIEW"
                ? () => setIsWithdrawConfirmOpen(true)
                : () => setIsUnpublishOpen(true)
          }
          className="h-10 bg-blue-600 px-6 text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
        >
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {isEditable
            ? status === "DRAFT"
              ? "Submit for review"
              : "Submit again"
            : status === "PENDING_REVIEW"
              ? "Withdraw submission"
              : "Unpublish"}
        </Button>
      </div>

      <ConfirmationModal
        isOpen={isSubmitConfirmOpen}
        onClose={() => setIsSubmitConfirmOpen(false)}
        onConfirm={() => {
          setIsSubmitConfirmOpen(false);
          form.runIntent(MY_BLOG_ACTIONS.submit);
        }}
        title="Submit for review"
        message="Send this blog to the moderators? You cannot edit it while it is in review."
        confirmText="Submit"
        cancelText="Cancel"
        variant="info"
      />

      <ConfirmationModal
        isOpen={isWithdrawConfirmOpen}
        onClose={() => setIsWithdrawConfirmOpen(false)}
        onConfirm={() => {
          setIsWithdrawConfirmOpen(false);
          form.runIntent(MY_BLOG_ACTIONS.withdraw);
        }}
        title="Withdraw submission"
        message="Pull this blog back out of the review queue? It returns to a draft you can edit."
        confirmText="Withdraw"
        cancelText="Cancel"
        variant="warning"
      />

      <UnpublishMyBlogDialog
        isOpen={isUnpublishOpen}
        onClose={() => setIsUnpublishOpen(false)}
        onConfirm={(note) => {
          setIsUnpublishOpen(false);
          form.runIntent(MY_BLOG_ACTIONS.unpublish, { note });
        }}
      />
    </div>
  );
}
