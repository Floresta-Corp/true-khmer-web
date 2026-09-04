import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

const SUBJECT_MAX = 120;
const BODY_MAX = 2000;

/**
 * Sends one learner a message from the course creator.
 *
 * One-way by design: the platform has notifications, not conversations, so
 * this arrives in the learner's notifications and as a push. The copy says so,
 * rather than implying a reply will come back here.
 */
export function MessageStudentDialog({
  student,
  courseTitle,
  onClose,
}: {
  student: { userId: string; name: string } | null;
  courseTitle: string;
  onClose: () => void;
}) {
  const fetcher = useFetcher<{ ok: boolean }>();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const open = student !== null;
  const sending = fetcher.state !== "idle";

  /* A fresh draft per learner, so a message cannot be sent to the wrong
     person after reopening the dialog. */
  useEffect(() => {
    if (open) {
      setSubject(`About ${courseTitle}`);
      setBody("");
    }
  }, [open, student?.userId, courseTitle]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) onClose();
  }, [fetcher.state, fetcher.data]);

  const send = () => {
    if (!student || !subject.trim() || !body.trim()) return;
    fetcher.submit(
      {
        intent: "message-student",
        userId: student.userId,
        subject: subject.trim(),
        body: body.trim(),
      },
      { method: "post" },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-[17px] font-bold text-[#1A1A2E]">
            Message {student?.name}
          </DialogTitle>
          <DialogDescription className="text-[13px] text-[#9A9AB0]">
            This arrives in their notifications and as a push. They cannot reply
            here.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="message-subject" className="text-[13px]">
              Subject
            </Label>
            <Input
              id="message-subject"
              value={subject}
              maxLength={SUBJECT_MAX}
              onChange={(event) => setSubject(event.target.value)}
              className="h-10 rounded-lg text-[14px]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="message-body" className="text-[13px]">
              Message
            </Label>
            <Textarea
              id="message-body"
              value={body}
              rows={5}
              maxLength={BODY_MAX}
              onChange={(event) => setBody(event.target.value)}
              placeholder="What would you like them to know?"
              className="rounded-lg text-[14px]"
            />
            <p className="text-right text-[11.5px] text-[#9A9AB0]">
              {body.length}/{BODY_MAX}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={sending}
            className="rounded-lg font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={send}
            disabled={sending || !subject.trim() || !body.trim()}
            className="rounded-lg bg-[#1C5DD4] font-semibold text-white hover:bg-[#164FB5]"
          >
            {sending ? "Sending…" : "Send message"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
