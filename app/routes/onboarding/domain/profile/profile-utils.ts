export function readValidationIssues(details: unknown): string[] {
  if (!details || typeof details !== "object") return [];
  const issues = (details as { issues?: unknown }).issues;
  if (!Array.isArray(issues)) return [];

  return issues
    .map((issue) => {
      if (typeof issue === "string") return issue;
      if (issue && typeof issue === "object") {
        const message = (issue as { message?: unknown }).message;
        if (typeof message === "string") return message;
      }
      return "";
    })
    .filter((issue): issue is string => issue.length > 0);
}

export function getInitials(value: string) {
  const normalized = value.trim().replace(/[@._-]+/g, " ");
  if (!normalized) return "";
  const parts = normalized.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}
