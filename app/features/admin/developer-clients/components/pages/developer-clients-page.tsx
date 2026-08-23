import { Suspense, useEffect, useRef, useState } from "react";
import {
  Await,
  useFetcher,
  useLoaderData,
  useLocation,
  useNavigation,
} from "react-router";
import { toast } from "sonner";

import { ConfirmationModal } from "~/features/admin/components/confirmation-modal";
import { ClientIdModal } from "../client-id-modal";
import {
  DeveloperClientModal,
  type DeveloperClientFormValues,
} from "../developer-client-modal";
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
  const [deleteTarget, setDeleteTarget] = useState<DeveloperClient | null>(
    null,
  );
  const [revealed, setRevealed] = useState<
    DeveloperClientActionData["revealed"] | null
  >(null);

  const lastIntent = useRef<DeveloperClientIntent | null>(null);

  const isLoadingClients =
    navigation.state === "loading" &&
    navigation.location?.pathname === location.pathname;
  const isSubmitting = fetcher.state !== "idle";

  function submit(
    intent: DeveloperClientIntent,
    fields: Record<string, string>,
  ) {
    lastIntent.current = intent;
    const formData = new FormData();
    formData.append("intent", intent);
    for (const [key, value] of Object.entries(fields)) {
      formData.append(key, value);
    }
    fetcher.submit(formData, { method: "post" });
  }

  function handleFormSubmit(values: DeveloperClientFormValues) {
    setFormError(null);
    if (formTarget) {
      submit("update", {
        id: formTarget.id,
        name: values.name,
        description: values.description,
        contactEmail: values.contactEmail,
        status: values.status,
      });
      return;
    }
    submit("create", {
      name: values.name,
      description: values.description,
      contactEmail: values.contactEmail,
    });
  }

  useEffect(() => {
    if (fetcher.state !== "idle" || lastIntent.current === null) return;

    const intent = lastIntent.current;
    lastIntent.current = null;

    if (fetcher.data?.ok) {
      setFormError(null);
      if (intent === "create" || intent === "update") {
        setIsFormOpen(false);
        setFormTarget(null);
      }
      if (intent === "regenerate") setRegenerateTarget(null);
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

    // Form errors belong inside the form; the rest are transient toasts.
    if (intent === "create" || intent === "update") {
      setFormError(message);
    } else {
      toast.error(message);
      if (intent === "regenerate") setRegenerateTarget(null);
      if (intent === "delete") setDeleteTarget(null);
    }
  }, [fetcher.data, fetcher.state]);

  return (
    <main className="min-h-full bg-[#f8fafc] px-4 py-6 sm:px-6 lg:px-10 lg:py-8 dark:bg-slate-950">
      <div className="max-w-full space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Developer Clients
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Partner platforms authorised to look up True Khmer user profiles.
            Each client gets a client ID; the API key is shared and configured
            on the server.
          </p>
        </div>

        <section
          className="flex h-[clamp(32rem,calc(100dvh-14rem),48rem)] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
          aria-busy={isLoadingClients}
        >
          <DeveloperClientsToolbar
            onCreate={() => {
              setFormTarget(null);
              setFormError(null);
              setIsFormOpen(true);
            }}
          />

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
                  <div className="p-6 text-center text-sm text-rose-600 dark:text-rose-400">
                    Error loading developer clients
                  </div>
                }
              >
                {(resolved) =>
                  resolved.clients.length === 0 ? (
                    <DeveloperClientsEmptyState query={query} />
                  ) : (
                    <>
                      <div className="min-h-0 flex-1 overflow-auto">
                        <DeveloperClientsTable
                          clients={resolved.clients}
                          onEdit={(client) => {
                            setFormTarget(client);
                            setFormError(null);
                            setIsFormOpen(true);
                          }}
                          onRegenerate={setRegenerateTarget}
                          onDelete={setDeleteTarget}
                        />
                      </div>
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
          isSubmitting &&
          (lastIntent.current === "create" || lastIntent.current === "update")
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
        loading={isSubmitting && lastIntent.current === "regenerate"}
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
        loading={isSubmitting && lastIntent.current === "delete"}
      />

      <ClientIdModal
        isOpen={revealed !== null}
        onClose={() => setRevealed(null)}
        name={revealed?.name ?? ""}
        clientId={revealed?.clientId ?? ""}
        isNew={revealed?.isNew ?? true}
      />
    </main>
  );
}
