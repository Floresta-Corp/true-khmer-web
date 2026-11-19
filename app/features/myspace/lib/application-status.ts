import {
  BellRing,
  CheckCircle2,
  Clock3,
  Send,
  Undo2,
  XCircle,
  Zap,
  type LucideIcon,
} from "lucide-react";

export interface ApplicationStatusStyle {
  label: string;
  icon: LucideIcon;
  className: string;
}

const BLUE =
  "border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-50 dark:border-blue-900/30 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-950/40";
const PURPLE =
  "border-purple-100 bg-purple-50 text-purple-600 hover:bg-purple-50 dark:border-purple-900/30 dark:bg-purple-950/40 dark:text-purple-400 dark:hover:bg-purple-950/40";
const AMBER =
  "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50 dark:border-amber-900/30 dark:bg-amber-950/40 dark:text-amber-400 dark:hover:bg-amber-950/40";
const GREEN =
  "border-green-100 bg-green-50 text-green-600 hover:bg-green-50 dark:border-green-900/30 dark:bg-green-950/40 dark:text-green-400 dark:hover:bg-green-950/40";
const SLATE =
  "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-400 dark:hover:bg-slate-800/40";
const RED =
  "border-red-100 bg-red-50 text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950/40";

export function getApplicationStatusStyle(
  status: string,
): ApplicationStatusStyle {
  switch (status.toUpperCase()) {
    case "SUBMITTED":
      return { label: "Submitted", icon: Send, className: PURPLE };
    case "UNDER_REVIEW":
      return { label: "Reviewing", icon: Clock3, className: PURPLE };
    case "APPROVED":
      return { label: "Action Required", icon: BellRing, className: AMBER };
    case "CONFIRMED":
      return { label: "Active", icon: Zap, className: BLUE };
    case "COMPLETED":
      return { label: "Completed", icon: CheckCircle2, className: GREEN };
    case "WITHDRAWN":
      return { label: "Withdrawn", icon: Undo2, className: SLATE };
    case "DECLINED":
      return { label: "Declined", icon: XCircle, className: RED };
    default:
      return {
        label: status.replaceAll("_", " "),
        icon: Clock3,
        className: BLUE,
      };
  }
}
