import * as React from "react";
import { useFetcher } from "react-router";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { CheckCircle2, Clock, Send } from "lucide-react";

import { FieldError } from "~/components/form/field-error";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Spinner } from "~/components/ui/spinner";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import type { ContactActionResult } from "../services/contact.action";
import {
  CONTACT_LIMITS,
  contactFieldErrors,
  contactFormSchema,
  type ContactCategory,
  type ContactFieldErrors,
  type ContactFormField,
} from "../lib/contact-schema";
import type { ContactTopic } from "../types";
import { ContactTopicPicker } from "./contact-topic-picker";

type ContactFormProps = {
  topics: ContactTopic[];
  prefill: { name: string; email: string; category: ContactCategory | null };
  /**
   * Set by a topic card's "Write to us about this". `nonce` changes on every
   * click, so picking the same topic again still re-selects it.
   */
  requestedCategory?: { category: ContactCategory; nonce: number } | null;
  /** Public Cloudflare Turnstile key; the API checks the resulting token. */
  turnstileSiteKey: string;
};

type Values = Record<ContactFormField, string>;

const inputClasses =
  "h-11 rounded-lg border-[#e2e8f0] bg-white px-4 text-[15px] shadow-none focus-visible:border-[#2f6fe4] focus-visible:ring-[#2f6fe4]/20 dark:border-slate-700 dark:bg-slate-900";

function Label({
  htmlFor,
  children,
  hint,
}: {
  htmlFor: string;
  children: React.ReactNode;
  hint?: React.ReactNode;
}) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-3">
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-[#0f172a] dark:text-slate-200"
      >
        {children}
        <span className="ml-0.5 text-rose-500" aria-hidden="true">
          *
        </span>
      </label>
      {hint ? <span className="text-xs text-[#6a7282]">{hint}</span> : null}
    </div>
  );
}

function formatRetry(retryAt?: string) {
  if (!retryAt) return null;
  const date = new Date(retryAt);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString(undefined, {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * The Contact Us form. "Send another message" remounts the inner form, which
 * also gives it a fresh fetcher, so no stale result lingers.
 */
export function ContactForm(props: ContactFormProps) {
  const [round, setRound] = React.useState(0);
  return (
    <ContactFormInner
      key={round}
      {...props}
      onSendAnother={() => setRound((n) => n + 1)}
    />
  );
}

function ContactFormInner({
  topics,
  prefill,
  requestedCategory,
  turnstileSiteKey,
  onSendAnother,
}: ContactFormProps & { onSendAnother: () => void }) {
  const fetcher = useFetcher<ContactActionResult>();
  const turnstileRef = React.useRef<TurnstileInstance>(undefined);
  // Single use: the API spends it on every attempt that reaches it.
  const [turnstileToken, setTurnstileToken] = React.useState("");
  const [turnstileFailed, setTurnstileFailed] = React.useState(false);
  const initialValues = React.useMemo<Values>(
    () => ({
      category: prefill.category ?? "",
      name: prefill.name,
      email: prefill.email,
      subject: "",
      message: "",
    }),
    [prefill.category, prefill.name, prefill.email],
  );
  const [values, setValues] = React.useState<Values>(initialValues);
  const [clientErrors, setClientErrors] = React.useState<ContactFieldErrors>(
    {},
  );
  const [touched, setTouched] = React.useState(false);

  // `?topic=` changes (a topic card's link) preselect the category.
  React.useEffect(() => {
    if (prefill.category) {
      setValues((current) => ({ ...current, category: prefill.category! }));
    }
  }, [prefill.category]);

  React.useEffect(() => {
    if (requestedCategory) {
      setValues((current) => ({
        ...current,
        category: requestedCategory.category,
      }));
      setClientErrors((current) => {
        const next = { ...current };
        delete next.category;
        return next;
      });
    }
  }, [requestedCategory]);

  const result = fetcher.data;
  const isSubmitting = fetcher.state !== "idle";

  // A failed send has used up the token; get a fresh one for the retry.
  React.useEffect(() => {
    if (fetcher.state === "idle" && result && !result.ok) {
      setTurnstileToken("");
      turnstileRef.current?.reset();
    }
  }, [fetcher.state, result]);
  const serverErrors =
    result && !result.ok && fetcher.state === "idle"
      ? (result.fieldErrors ?? {})
      : {};
  const errors: ContactFieldErrors = { ...serverErrors, ...clientErrors };

  const validate = (next: Values) => {
    const parsed = contactFormSchema.safeParse(next);
    return parsed.success ? {} : contactFieldErrors(parsed.error);
  };

  const update = (field: ContactFormField, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    // Re-check as they type once they've tried to submit.
    if (touched) setClientErrors(validate(next));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setTouched(true);
    const found = validate(values);
    setClientErrors(found);
    if (!turnstileToken) {
      event.preventDefault();
      return;
    }
    if (Object.keys(found).length > 0) {
      event.preventDefault();
      const first = Object.keys(found)[0];
      document.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
    }
  };

  if (result?.ok && fetcher.state === "idle") {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-[#e2e8f0] bg-white px-6 py-12 text-center dark:border-slate-800 dark:bg-slate-900">
        <div className="flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="size-6" aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-[#243d95] dark:text-white">
          Message sent
        </h3>
        <p className="mt-2 max-w-md text-[15px] leading-7 text-[#475569] dark:text-slate-400">
          {result.message} A copy has been sent to{" "}
          <span className="font-medium text-[#0f172a] dark:text-slate-200">
            {values.email}
          </span>
          .
        </p>
        {result.remaining > 0 ? (
          <Button
            type="button"
            onClick={onSendAnother}
            className="mt-6 h-10 rounded-lg bg-[#2F6FE4] px-6 text-sm font-semibold text-white hover:bg-[#1F62DF]"
          >
            Send another message
          </Button>
        ) : (
          <p className="mt-6 text-sm text-[#6a7282]">
            You've reached today's message limit.
          </p>
        )}
      </div>
    );
  }

  const limitReached = result && !result.ok && result.retryAt;
  const retryLabel = limitReached ? formatRetry(result.retryAt) : null;
  const messageLength = values.message.trim().length;

  return (
    <fetcher.Form
      method="post"
      action="/support/contact-us"
      noValidate
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-[#e2e8f0] bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900"
    >
      <div>
        <Label htmlFor="contact-category">What is your message about?</Label>
        <ContactTopicPicker
          id="contact-category"
          name="category"
          topics={topics}
          value={values.category as ContactCategory | ""}
          onChange={(next) => update("category", next)}
          invalid={Boolean(errors.category)}
        />
        <FieldError message={errors.category} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="contact-name">Your name</Label>
          <Input
            id="contact-name"
            name="name"
            data-field="name"
            autoComplete="name"
            maxLength={CONTACT_LIMITS.name.max}
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            className={inputClasses}
          />
          <FieldError message={errors.name} />
        </div>
        <div>
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            data-field="email"
            autoComplete="email"
            maxLength={CONTACT_LIMITS.email.max}
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            className={inputClasses}
          />
          <FieldError message={errors.email} />
        </div>
      </div>

      <div>
        <Label htmlFor="contact-subject">Subject</Label>
        <Input
          id="contact-subject"
          name="subject"
          data-field="subject"
          maxLength={CONTACT_LIMITS.subject.max}
          placeholder="A short summary of your message"
          value={values.subject}
          onChange={(event) => update("subject", event.target.value)}
          aria-invalid={Boolean(errors.subject)}
          className={inputClasses}
        />
        <FieldError message={errors.subject} />
      </div>

      <div>
        <Label
          htmlFor="contact-message"
          hint={`${messageLength.toLocaleString()} / ${CONTACT_LIMITS.message.max.toLocaleString()}`}
        >
          Message
        </Label>
        <Textarea
          id="contact-message"
          name="message"
          data-field="message"
          rows={7}
          maxLength={CONTACT_LIMITS.message.max}
          placeholder="Tell us what happened, and include any links or details that help us look into it."
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          aria-invalid={Boolean(errors.message)}
          className="min-h-40 rounded-lg border-[#e2e8f0] bg-white px-4 py-3 text-[15px] shadow-none focus-visible:border-[#2f6fe4] focus-visible:ring-[#2f6fe4]/20 dark:border-slate-700 dark:bg-slate-900"
        />
        <FieldError message={errors.message} />
      </div>

      {/* Honeypot: off-screen and skipped by keyboard and screen readers. */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 overflow-hidden"
      >
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div>
        <input type="hidden" name="turnstileToken" value={turnstileToken} />
        <Turnstile
          ref={turnstileRef}
          siteKey={turnstileSiteKey}
          options={{
            action: "contact",
            theme: "auto",
            size: "flexible",
            responseField: false,
          }}
          onSuccess={(token) => {
            setTurnstileToken(token);
            setTurnstileFailed(false);
          }}
          onExpire={() => setTurnstileToken("")}
          onError={() => {
            setTurnstileToken("");
            setTurnstileFailed(true);
          }}
        />
        {turnstileFailed ? (
          <p role="alert" className="mt-2 text-sm text-rose-700">
            We couldn't confirm you're not a bot. Refresh the page and try
            again.
          </p>
        ) : null}
      </div>

      {result && !result.ok && fetcher.state === "idle" ? (
        <div
          role="alert"
          className={cn(
            "flex items-start gap-2 rounded-lg border px-4 py-3 text-sm",
            limitReached
              ? "border-amber-200 bg-amber-50 text-amber-800"
              : "border-rose-200 bg-rose-50 text-rose-700",
          )}
        >
          {limitReached ? (
            <Clock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          ) : null}
          <span>
            {result.error}
            {retryLabel ? ` You can send again after ${retryLabel}.` : null}
          </span>
        </div>
      ) : null}

      <div className="flex flex-col-reverse gap-4 border-t border-[#e2e8f0] pt-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
        <p className="text-xs leading-5 text-[#6a7282]">
          We reply by email, usually within two working days. You can send up to
          5 messages a day.
        </p>
        <Button
          type="submit"
          disabled={isSubmitting || !turnstileToken}
          className="h-11 shrink-0 rounded-lg bg-[#2F6FE4] px-6 text-sm font-semibold text-white hover:bg-[#1F62DF]"
        >
          {isSubmitting ? (
            <Spinner className="size-4" />
          ) : (
            <Send className="size-4" aria-hidden="true" />
          )}
          {isSubmitting ? "Sending…" : "Send message"}
        </Button>
      </div>
    </fetcher.Form>
  );
}
