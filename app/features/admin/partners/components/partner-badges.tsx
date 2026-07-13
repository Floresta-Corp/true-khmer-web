import {
  getPackageBadgeClasses,
  getPublishBadgeClasses,
  getStatusBadgeClasses,
} from "./partner-utils";
import type { Partner } from "~/types/api-client";

type PartnerStatus = Partner["status"];

export function PackageBadge({ label }: { label: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getPackageBadgeClasses(
        label,
      )}`}
    >
      {label}
    </span>
  );
}

export function PartnerStatusBadge({ status }: { status: PartnerStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusBadgeClasses(
        status,
      )}`}
    >
      {status}
    </span>
  );
}

export function PublishBadge({ isPublished }: { isPublished: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getPublishBadgeClasses(
        isPublished,
      )}`}
    >
      {isPublished ? "Published" : "Draft"}
    </span>
  );
}
