export type DeveloperClientSortField = "name" | "createdAt";
export type DeveloperClientSortOrder = "asc" | "desc";

export type DeveloperClientIntent =
  | "create"
  | "update"
  | "regenerate"
  | "regenerate-secret"
  | "delete";

export type RevealedCredentialKind = "clientId" | "clientSecret";

export type DeveloperClientActionData = {
  ok: boolean;
  message: string | null;

  revealed?: {
    kind: RevealedCredentialKind;
    name: string;
    value: string;
    isNew: boolean;
  } | null;
};
