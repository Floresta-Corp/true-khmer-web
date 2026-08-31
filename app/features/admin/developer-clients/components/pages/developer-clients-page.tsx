import { Suspense, useEffect, useState } from "react";
import {
  Await,
  useFetcher,
  useLoaderData,
  useLocation,
  useNavigation,
} from "react-router";
import { toast } from "sonner";

import { ConfirmationModal } from "~/features/admin/components/confirmation-modal";
import { CredentialRevealModal } from "../credential-reveal-modal";
import {
  DeveloperClientModal,
  type DeveloperClientFormValues,
} from "../developer-client-modal";
import { DeveloperClientsHeader } from "../developer-clients-header";
import {
  DeveloperClientsEmptyState,
  DeveloperClientsTable,
  DeveloperClientsTableSkeleton,
} from "../developer-clients-table";
import {
  DeveloperClientsPagination,
  DeveloperClientsPaginationSkeleton,
} from "../developer-clients-pagination";
import { DeveloperClientsToolbar } from "../developer-clients-toolbar";
import type { developerClientsLoader } from "../../services/developer-clients.loader";
import type {
  DeveloperClient,
  DeveloperClientActionData,
  DeveloperClientIntent,
} from "../../types";

const FAILURE_LABEL: Record<DeveloperClientIntent, string> = {
  create: "create the developer client",
  update: "update the developer client",
  regenerate: "regenerate the client ID",
  "regenerate-secret": "regenerate the client secret",
  delete: "delete the developer client",
};

export default function DeveloperClientsPage() {
  const { clients, query } = useLoaderData<typeof developerClientsLoader>();
  const location = useLocation();
  const navigation = useNavigation();
  const fetcher = useFetcher<DeveloperClientActionData>();

  const [formTarget, setFormTarget] = useState<DeveloperClient | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [regenerateTarget, setRegenerateTarget] =
    useState<DeveloperClient | null>(null);
  const [secretTarget, setSecretTarget] = useState<DeveloperClient | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<DeveloperClient | null>(
    null,
  );
  const [revealed, setRevealed] = useState<
    DeveloperClientActionData["revealed"] | null
  >(null);

  const [lastIntent, setLastIntent] = useState<DeveloperClientIntent | null>(
    null,
  );

  const isLoadingClients =
    navigation.state === "loading" &&
    navigation.location?.pathname === location.pathname;
  const isSubmitting = fetcher.state !== "idle";

  function openCreateForm() {
    setFormTarget(null);
    setFormError(null);
    setIsFormOpen(true);
  }

  function submit(
    intent: DeveloperClientIntent,
    fields: Record<string, string | File>,
  ) {
    setLastIntent(intent);
    const formData = new FormData();
    formData.append("intent", intent);
    let hasFile = false;
    for (const [key, value] of Object.entries(fields)) {
      if (value instanceof File) hasFile = true;
      formData.append(key, value);
    }
    // A urlencoded submit would stringify the File, so switch encodings.
    fetcher.submit(formData, {
      method: "post",
      ...(hasFile ? { encType: "multipart/form-data" as const } : {}),
    });
  }

  function handleFormSubmit(values: DeveloperClientFormValues) {
    setFormError(null);

    const allowedOrigins = JSON.stringify(values.allowedOrigins);
    const allowAllOrigins = values.allowAllOrigins ? "true" : "false";
    const logo: Record<string, string | File> = values.logoFile
      ? { logoFile: values.logoFile }
      : { logoKey: values.logoKey };

    if (formTarget) {
      submit("update", {
        id: formTarget.id,
        name: values.name,
        description: values.description,
        contactEmail: values.contactEmail,
        status: values.status,
        allowedOrigins,
        allowAllOrigins,
        ...logo,
      });
      return;
    }
    submit("create", {
      name: values.name,
      description: values.description,
      contactEmail: values.contactEmail,
      allowedOrigins,
      allowAllOrigins,
      ...logo,
    });
  }

  useEffect(() => {
    if (fetcher.state !== "idle" || lastIntent === null) return;

    const intent = lastIntent;
    setLastIntent(null);

    if (fetcher.data?.ok) {
      setFormError(null);
      if (intent === "create" || intent === "update") {
        setIsFormOpen(false);
        setFormTarget(null);
      }
      if (intent === "regenerate") setRegenerateTarget(null);
      if (intent === "regenerate-secret") setSecretTarget(null);
      if (intent === "delete") setDeleteTarget(null);

      if (fetcher.data.revealed) {
        setRevealed(fetcher.data.revealed);
      } else if (intent === "update") {
        toast.success("Developer client updated.");
      } else if (intent === "delete") {
        toast.success("Developer client deleted.");
      }
      return;
    }

    const message =
      fetcher.data?.message ??
      `Failed to ${FAILURE_LABEL[intent]}. Please try again.`;

    if (intent === "create" || intent === "update") {
      setFormError(message);
    } else {
      toast.error(message);
      if (intent === "regenerate") setRegenerateTarget(null);
      if (intent === "regenerate-secret") setSecretTarget(null);
      if (intent === "delete") setDeleteTarget(null);
    }
  }, [fetcher.data, fetcher.state, lastIntent]);

  return (
    <main className="min-h-full bg-[#f8fafc] px-4 py-6 sm:px-6 lg:px-10 lg:py-8 dark:bg-slate-950">
      <div className="max-w-full">
        <DeveloperClientsHeader onCreate={openCreateForm} />

        <section
          className="flex h-[clamp(32rem,calc(100dvh-14rem),48rem)] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
          aria-busy={isLoadingClients}
        >
          <DeveloperClientsToolbar />

          {isLoadingClients ? (
            <>
              <DeveloperClientsTableSkeleton rows={6} />
              <DeveloperClientsPaginationSkeleton />
            </>
          ) : (
            <Suspense
              fallback={
                <>
                  <DeveloperClientsTableSkeleton rows={6} />
                  <DeveloperClientsPaginationSkeleton />
                </>
              }
            >
              <Await
                resolve={clients}
                errorElement={
                  <div className="flex min-h-80 flex-1 items-center justify-center p-6 text-center text-sm text-rose-600 dark:text-rose-400">
                    Error loading developer clients
                  </div>
                }
              >
                {(resolved) =>
                  resolved.clients.length === 0 ? (
                    <DeveloperClientsEmptyState
                      query={query}
                      onCreate={openCreateForm}
                    />
                  ) : (
                    <>
                      <DeveloperClientsTable
                        clients={resolved.clients}
                        onEdit={(client) => {
                          setFormTarget(client);
                          setFormError(null);
                          setIsFormOpen(true);
                        }}
                        onRegenerate={setRegenerateTarget}
                        onRegenerateSecret={setSecretTarget}
                        onDelete={setDeleteTarget}
                      />
                      <DeveloperClientsPagination meta={resolved.meta} />
                    </>
                  )
                }
              </Await>
            </Suspense>
          )}
        </section>
      </div>

      <DeveloperClientModal
        isOpen={isFormOpen}
        client={formTarget}
        isLoading={
          isSubmitting && (lastIntent === "create" || lastIntent === "update")
        }
        serverError={formError}
        onClose={() => {
          setIsFormOpen(false);
          setFormTarget(null);
          setFormError(null);
        }}
        onSubmit={handleFormSubmit}
      />

      <ConfirmationModal
        isOpen={regenerateTarget !== null}
        onClose={() => setRegenerateTarget(null)}
        onConfirm={() => {
          if (regenerateTarget)
            submit("regenerate", { id: regenerateTarget.id });
        }}
        title="Regenerate client ID"
        message={`"${regenerateTarget?.name ?? ""}" will get a brand new client ID. The current one stops working immediately, so the partner's integration breaks until you send them the new value.`}
        confirmText="Regenerate"
        variant="warning"
        loading={isSubmitting && lastIntent === "regenerate"}
      />

      <ConfirmationModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) submit("delete", { id: deleteTarget.id });
        }}
        title="Delete developer client"
        message={`"${deleteTarget?.name ?? ""}" will lose access immediately and its client ID is retired permanently. To pause access temporarily instead, edit the client and set it to Disabled.`}
        confirmText="Delete"
        variant="error"
        loading={isSubmitting && lastIntent === "delete"}
      />

      <ConfirmationModal
        isOpen={secretTarget !== null}
        onClose={() => setSecretTarget(null)}
        onConfirm={() => {
          if (secretTarget)
            submit("regenerate-secret", { id: secretTarget.id });
        }}
        title="Regenerate client secret"
        message={`"${secretTarget?.name ?? ""}" will get a brand new client secret. The current one stops working immediately, so their backend cannot read users until you send them the new value. The new secret is shown only once.`}
        confirmText="Regenerate"
        variant="warning"
        loading={isSubmitting && lastIntent === "regenerate-secret"}
      />

      <CredentialRevealModal
        isOpen={revealed !== null}
        onClose={() => setRevealed(null)}
        kind={revealed?.kind ?? "clientSecret"}
        name={revealed?.name ?? ""}
        value={revealed?.value ?? ""}
        isNew={revealed?.isNew ?? true}
      />
    </main>
  );
}
