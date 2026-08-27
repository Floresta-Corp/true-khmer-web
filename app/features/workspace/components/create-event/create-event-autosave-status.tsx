import { Cloud, CloudCheck, CloudOff, LoaderCircle } from "lucide-react";

export type CreateEventAutosaveStatusValue =
  | "loading"
  | "ready"
  | "saving"
  | "saved"
  | "error";

type Props = {
  status: CreateEventAutosaveStatusValue;
  label: string;
  className?: string;
};

export default function CreateEventAutosaveStatus({
  status,
  label,
  className = "",
}: Props) {
  const Icon =
    status === "loading" || status === "saving"
      ? LoaderCircle
      : status === "saved"
        ? CloudCheck
        : status === "error"
          ? CloudOff
          : Cloud;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex min-w-0 items-center gap-1.5 text-[13px] font-normal text-slate-500 ${className}`}
    >
      <Icon
        className={`size-4 shrink-0 ${
          status === "loading" || status === "saving" ? "animate-spin" : ""
        }`}
      />
      <span className="truncate">{label}</span>
    </div>
  );
}
