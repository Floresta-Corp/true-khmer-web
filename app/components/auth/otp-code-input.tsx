import { useMemo, useRef } from "react";
import { cn } from "~/lib/utils";

type OtpCodeInputProps = {
  value: string;
  onChange: (nextValue: string) => void;
  length?: number;
  name?: string;
  id?: string;
};

export function OtpCodeInput({
  value,
  onChange,
  length = 6,
  name = "otp",
  id = "otp",
}: OtpCodeInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const digits = useMemo(
    () => Array.from({ length }, (_, index) => value[index] ?? ""),
    [length, value],
  );
  const activeIndex = value.length < length ? value.length : -1;

  return (
    <>
      <label htmlFor={id} className="sr-only">
        OTP code
      </label>

      <input
        ref={inputRef}
        id={id}
        name={name}
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={length}
        value={value}
        onChange={(event) => {
          const sanitized = event.target.value.replace(/\D/g, "").slice(0, length);
          onChange(sanitized);
        }}
        className="sr-only"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.focus()}
        className="flex w-full items-center justify-between text-left"
      >
        {digits.map((digit, index) => {
          const isActive = activeIndex === index;

          return (
            <span
              key={`otp-${index}`}
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full border text-sm",
                isActive
                  ? "border-blue-500 text-blue-600"
                  : "border-blue-100 text-slate-700",
              )}
            >
              {digit ? (
                digit
              ) : isActive ? (
                <span className="inline-block h-5 w-px animate-pulse bg-blue-500" />
              ) : null}
            </span>
          );
        })}
      </button>
    </>
  );
}
