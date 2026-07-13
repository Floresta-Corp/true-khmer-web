import type { ComponentProps } from "react";

import { cn } from "~/lib/utils";

type Align = "left" | "center" | "right";

function alignClass(align: Align) {
  if (align === "right") return "text-right";
  if (align === "center") return "text-center";
  return "text-left";
}

export function AdminTable({ className, ...props }: ComponentProps<"table">) {
  return (
    <table
      className={cn("w-full border-collapse text-left text-sm", className)}
      {...props}
    />
  );
}

export function AdminTableHead({
  className,
  ...props
}: ComponentProps<"thead">) {
  return (
    <thead
      className={cn(
        "sticky top-0 z-10 bg-slate-50 dark:bg-slate-900",
        className,
      )}
      {...props}
    />
  );
}

export function AdminTableHeaderRow({
  className,
  ...props
}: ComponentProps<"tr">) {
  return (
    <tr
      className={cn(
        "border-b border-slate-100 dark:border-slate-800",
        className,
      )}
      {...props}
    />
  );
}

export function AdminHeaderCell({
  label,
  align = "left",
  className,
  ...props
}: ComponentProps<"th"> & {
  label: string;
  align?: Align;
}) {
  return (
    <th
      className={cn(
        "px-5 py-4 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400",
        alignClass(align),
        className,
      )}
      {...props}
    >
      {label}
    </th>
  );
}

export function AdminTableBody({
  className,
  ...props
}: ComponentProps<"tbody">) {
  return (
    <tbody
      className={cn(
        "divide-y divide-slate-100 dark:divide-slate-800",
        className,
      )}
      {...props}
    />
  );
}

export function AdminTableRow({
  interactive = false,
  className,
  ...props
}: ComponentProps<"tr"> & {
  interactive?: boolean;
}) {
  return (
    <tr
      className={cn(
        interactive &&
          "cursor-pointer text-slate-700 transition-colors hover:bg-slate-50 focus:bg-slate-50 focus:outline-none dark:text-slate-300 dark:hover:bg-slate-800/60 dark:focus:bg-slate-800/60",
        !interactive &&
          "transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/30",
        className,
      )}
      {...props}
    />
  );
}

export function AdminTableCell({
  align = "left",
  className,
  ...props
}: ComponentProps<"td"> & {
  align?: Align;
}) {
  return (
    <td className={cn("px-5 py-4", alignClass(align), className)} {...props} />
  );
}
