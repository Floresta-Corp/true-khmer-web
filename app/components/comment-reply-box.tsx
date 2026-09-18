import { useState } from "react";
import { useFetcher, useRevalidator, useRouteLoaderData } from "react-router";
import type { loader as appLayoutLoader } from "~/layout/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Spinner } from "~/components/ui/spinner";
import { cn } from "~/lib/utils";
import { useFetcherOutcome } from "~/hooks/use-fetcher-outcome";
import { useUserDisplay } from "~/hooks/use-user-display";

export interface CommentReplyBoxProps {
  /**
   * Hidden inputs the route action needs (action type, parent ids). Entries
   * with an undefined value are skipped.
   */
  fields: Record<string, string | undefined>;
  /**
   * Placeholder text for the textarea.
   */
  placeholder?: string;
  /**
   * If true, disables input and actions.
   */
  disabled?: boolean;
  /**
   * Optional className applied to the root container.
   */
  className?: string;
  /**
   * Maximum allowed characters.
   */
  maxLength?: number;
  /**
   * Label for the submit button.
   */
  submitLabel?: string;
}

export default function CommentReplyBox({
  fields,
  placeholder = "Write a reply...",
  disabled = false,
  className,
  maxLength,
  submitLabel = "Reply",
}: CommentReplyBoxProps) {
  const fetcher = useFetcher();
  const revalidator = useRevalidator();
  const appLayoutData =
    useRouteLoaderData<typeof appLayoutLoader>("layout/app-layout");
  const { displayName, initials, profileImage } = useUserDisplay(
    appLayoutData?.user,
  );
  const [body, setBody] = useState("");
  const isSubmitting = fetcher.state !== "idle";
  const isBodyEmpty = body.trim().length === 0;

  useFetcherOutcome(fetcher, {
    onSuccess: () => {
      setBody("");
      revalidator.revalidate();
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (isBodyEmpty) {
      event.preventDefault();
    }
  };

  return (
    <fetcher.Form
      method="post"
      className={cn("flex w-full items-start gap-3", className)}
      onSubmit={handleSubmit}
    >
      {Object.entries(fields).map(([name, value]) =>
        value === undefined ? null : (
          <input key={name} type="hidden" name={name} value={value} />
        ),
      )}

      <Avatar className="mt-1 size-9 shrink-0">
        <AvatarImage src={profileImage} alt={displayName} />
        <AvatarFallback className="bg-[#dfe3e6] text-xs font-semibold text-[#2c2f31]">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col items-end gap-3">
        <Textarea
          name="body"
          placeholder={placeholder}
          disabled={disabled || isSubmitting}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          className="min-h-32 w-full resize-y rounded-xl border-[#abadaf33] bg-white px-4 py-3 text-sm leading-5 text-[#2c2f31] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] placeholder:text-[#595c5e] focus-visible:border-[#0050d4] focus-visible:ring-[#0050d4]/15"
          maxLength={maxLength}
        />

        <Button
          type="submit"
          disabled={disabled || isSubmitting || isBodyEmpty}
          className="h-10 rounded-lg bg-[#0050d4] px-6 text-sm font-medium text-white hover:bg-[#0045b8] disabled:opacity-60"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <Spinner className="size-3.5" />
              Posting...
            </span>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </fetcher.Form>
  );
}
