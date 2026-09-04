import * as React from "react";
import { OTPInput, OTPInputContext, REGEXP_ONLY_DIGITS } from "input-otp";

import { cn } from "~/lib/utils";
import { MinusIcon } from "lucide-react";

const OTP_SUBMIT_ATTRIBUTE = "data-otp-submit";

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function findSubmitter(form: HTMLFormElement) {
  return (
    form.querySelector<HTMLButtonElement>(`button[${OTP_SUBMIT_ATTRIBUTE}]`) ??
    form.querySelector<HTMLButtonElement>('button[type="submit"]') ??
    form.querySelector<HTMLButtonElement>(
      'button:not([type="button"]):not([type="reset"])',
    )
  );
}

type InputOTPProps = React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
  /**
   * Submit the closest form as soon as every slot is filled.
   * Add `data-otp-submit` to a button when the form has several submit buttons.
   */
  autoSubmit?: boolean;
};

function InputOTP({
  className,
  containerClassName,
  autoSubmit = true,
  maxLength,
  value,
  onChange,
  onComplete,
  onPaste,
  pattern = REGEXP_ONLY_DIGITS,
  autoComplete = "one-time-code",
  inputMode = "numeric",
  disabled,
  ref,
  ...props
}: InputOTPProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const submittedValueRef = React.useRef<string | null>(null);
  const isControlled = typeof value === "string";

  const submitClosestForm = React.useCallback(() => {
    const form = inputRef.current?.form;

    if (!form || disabled) return false;

    const submitter = findSubmitter(form);

    if (submitter?.disabled) return false;

    if (submitter) {
      form.requestSubmit(submitter);
    } else {
      form.requestSubmit();
    }

    return true;
  }, [disabled]);

  // Auto-submit once the code is complete. Runs after commit so hidden inputs
  // mirroring the value and any `length !== maxLength` disabled states are up to date.
  React.useEffect(() => {
    if (!autoSubmit || !isControlled) return;

    if (value.length !== maxLength) {
      submittedValueRef.current = null;
      return;
    }

    if (submittedValueRef.current === value) return;
    if (submitClosestForm()) {
      submittedValueRef.current = value;
    }
  }, [autoSubmit, isControlled, maxLength, submitClosestForm, value]);

  // Pasting a full code should fill every slot rather than being inserted at the
  // caret, so intercept the paste before `input-otp`'s own handler sees it.
  const handlePasteCapture = (event: React.ClipboardEvent<HTMLDivElement>) => {
    if (!isControlled || disabled) return;

    const pasted = digitsOnly(event.clipboardData.getData("text")).slice(
      0,
      maxLength,
    );

    if (!pasted) return;

    event.preventDefault();
    event.stopPropagation();

    const input = inputRef.current;

    if (input) {
      input.value = pasted;
      input.setSelectionRange(
        Math.min(pasted.length, maxLength - 1),
        pasted.length,
      );
    }

    onChange?.(pasted);
  };

  return (
    // `display: contents` keeps the consumer's container layout untouched.
    <div style={{ display: "contents" }} onPasteCapture={handlePasteCapture}>
      <OTPInput
        ref={(node) => {
          inputRef.current = node;

          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        data-slot="input-otp"
        containerClassName={cn(
          "cn-input-otp flex items-center has-disabled:opacity-50",
          containerClassName,
        )}
        spellCheck={false}
        className={cn("disabled:cursor-not-allowed", className)}
        maxLength={maxLength}
        value={value}
        onChange={onChange}
        onComplete={(...args) => {
          onComplete?.(...args);

          // Controlled inputs auto-submit from the effect above.
          if (autoSubmit && !isControlled) {
            submitClosestForm();
          }
        }}
        onPaste={onPaste}
        pattern={pattern}
        autoComplete={autoComplete}
        inputMode={inputMode}
        disabled={disabled}
        pasteTransformer={digitsOnly}
        {...props}
      />
    </div>
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn(
        "flex items-center rounded-lg has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40",
        className,
      )}
      {...props}
    />
  );
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number;
}) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "relative flex size-8 items-center justify-center border-y border-r border-input text-sm transition-all outline-none first:rounded-l-lg first:border-l last:rounded-r-lg aria-invalid:border-destructive data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-3 data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:border-destructive data-[active=true]:aria-invalid:ring-destructive/20 dark:bg-input/30 dark:data-[active=true]:aria-invalid:ring-destructive/40",
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      className="flex items-center [&_svg:not([class*='size-'])]:size-4"
      role="separator"
      {...props}
    >
      <MinusIcon />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
