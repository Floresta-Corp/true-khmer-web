export type DeveloperClientStatus = "ACTIVE" | "DISABLED" | "DELETED";

export type DeveloperClientStatusInput = "ACTIVE" | "DISABLED";

export type DeveloperClient = {
  id: string;

  clientId: string;
  name: string;

  description: string | null;
  contactEmail: string | null;

  allowedOrigins: string[];
  /** When true every origin is accepted and allowedOrigins is ignored. */
  allowAllOrigins: boolean;
  logoKey: string | null;
  logoUrl: string | null;

  clientSecretLast4: string | null;
  clientSecretSetAt: string | null;
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
  allowedOrigins?: string[];
  allowAllOrigins?: boolean;
  logoKey?: string | null;
};

export type UpdateDeveloperClientRequest = {
  name?: string;
  description?: string | null;
  contactEmail?: string | null;
  status?: DeveloperClientStatusInput;

  allowedOrigins?: string[];
  allowAllOrigins?: boolean;
  logoKey?: string | null;
};

export type IssuedClientSecretResponse = {
  ok: true;
  client: DeveloperClient;
  clientSecret: string;
};

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
