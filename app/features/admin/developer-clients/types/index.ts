/**
 * Response shapes for /v1/admin/developer-client.
 *
 * These mirror the API's zod schemas by hand rather than coming from
 * `~/types/api-client`, because that file is generated wholesale from the
 * staging OpenAPI document. Once `bun run api-local` (or `bun run api`) is next
 * run against an API that includes these endpoints, these can be replaced with
 * the generated `DeveloperClientResponse` / `ListDeveloperClientsResponse`.
 */

export type DeveloperClientStatus = "ACTIVE" | "DISABLED" | "DELETED";

/** Statuses an admin can set directly; DELETED is only reachable via delete. */
export type DeveloperClientStatusInput = "ACTIVE" | "DISABLED";

export type DeveloperClient = {
  id: string;
  clientId: string;
  name: string;
  description: string | null;
  contactEmail: string | null;
  status: DeveloperClientStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type DeveloperClientListMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type ListDeveloperClientsResponse = {
  ok: true;
  clients: DeveloperClient[];
  meta: DeveloperClientListMeta;
};

export type DeveloperClientDetailResponse = {
  ok: true;
  client: DeveloperClient;
};

export type CreateDeveloperClientRequest = {
  name: string;
  description?: string | null;
  contactEmail?: string | null;
};

export type UpdateDeveloperClientRequest = {
  name?: string;
  description?: string | null;
  contactEmail?: string | null;
  status?: DeveloperClientStatusInput;
};

export type DeveloperClientSortField = "name" | "createdAt";
export type DeveloperClientSortOrder = "asc" | "desc";

/** Intents accepted by the single route action. */
export type DeveloperClientIntent =
  | "create"
  | "update"
  | "regenerate"
  | "delete";

export type DeveloperClientActionData = {
  ok: boolean;
  message: string | null;
  /** Present after a successful create or regenerate, for the reveal modal. */
  revealed?: { name: string; clientId: string; isNew: boolean } | null;
};
