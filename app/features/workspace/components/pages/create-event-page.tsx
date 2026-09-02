import { useEffect, useRef, useState } from "react";
import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, LoaderCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import CreateEventAccessForm from "../create-event/create-event-access-form";
import CreateEventAside from "../create-event/create-event-aside";
import CreateEventAutosaveStatus, {
  type CreateEventAutosaveStatusValue,
} from "../create-event/create-event-autosave-status";
import CreateEventBasicsForm from "../create-event/create-event-basics-form";
import CreateEventConnecting from "../create-event/create-event-connecting";
import CreateEventDraftSuccessDialog from "../create-event/create-event-draft-success-dialog";
import CreateEventOrganizerSelect from "../create-event/create-event-organizer-select";
import CreateEventReview from "../create-event/create-event-review";
import CreateEventTopBar from "../create-event/create-event-top-bar";
import {
  getCreateEventDateRanges,
  isCreateEventFormComplete,
  isOpenEntryDisabled,
} from "~/features/workspace/lib/my-events-format";
import {
  createEventDraftFingerprint,
  deleteCreateEventDraft,
  hasMeaningfulCreateEventDraft,
  loadCreateEventDraft,
  saveCreateEventDraft,
} from "~/features/workspace/lib/create-event-draft.client";
import { validateCreateEventCover } from "~/features/workspace/lib/create-event-cover";
import { openPlumpiHandoffWindow } from "~/features/workspace/lib/plumpi-handoff.client";
import {
  CreateEventInputSchema,
  initialCreateEventFormState,
  type CreateEventActionData,
  type CreateEventFieldErrors,
  type CreateEventFormState,
  type CreateEventInput,
  type EventAccessPatch,
} from "~/features/workspace/types/my-events";
import type { loader } from "../../route/my-events.create";

const MY_EVENTS_PATH = "/my-events";
const AUTOSAVE_DELAY_MS = 800;

type Step = "basics" | "review";

export default function CreateEventPage() {
  const { categories, organizers, venues, venueLoadError, userId } =
    useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const fetcher = useFetcher<CreateEventActionData>();
  const prefersReducedMotion = useReducedMotion();

  const step: Step =
    searchParams.get("step") === "review" ? "review" : "basics";

  const [form, setForm] = useState<CreateEventFormState>(() => ({
    ...initialCreateEventFormState,
    organizerId: organizers[0]?.id ?? "",
  }));
  const [errors, setErrors] = useState<CreateEventFieldErrors>({});
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [createdEventId, setCreatedEventId] = useState("");
  const [autosaveStatus, setAutosaveStatus] =
    useState<CreateEventAutosaveStatusValue>("loading");
  const [autosaveLabel, setAutosaveLabel] = useState("Restoring draft...");
  const objectUrlRef = useRef<string | null>(null);
  const plumpiWindowRef = useRef<Window | null>(null);
  const handledResultRef = useRef<CreateEventActionData | null>(null);
  const restoreCompletedRef = useRef(false);
  const autosaveReadyRef = useRef(false);
  const autosaveRevisionRef = useRef(0);
  const lastSavedFormRef = useRef("");
  const lastSavedCoverRef = useRef<File | null>(null);
  /** True while the submit in flight should hand the draft over to Plumpi. */
  const [isHandoff, setIsHandoff] = useState(false);

  const isComplete = isCreateEventFormComplete(form);
  const isSubmitting = fetcher.state !== "idle";
  const isCreatingDraft =
    isSubmitting && fetcher.formData?.get("intent") === "create-draft";
  const isHandingOff = isHandoff && isSubmitting;

  // Revoke the preview URL when it is replaced or the page unmounts.
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      plumpiWindowRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (restoreCompletedRef.current) return;

    if (!userId) {
      setAutosaveStatus("error");
      setAutosaveLabel("Autosave unavailable");
      return;
    }

    let cancelled = false;

    const restoreDraft = async () => {
      try {
        const draft = await loadCreateEventDraft(userId);
        if (cancelled) return;

        if (!draft) {
          setAutosaveStatus("ready");
          setAutosaveLabel("Autosave ready");
          return;
        }

        const restoredCover =
          draft.coverFile && !validateCreateEventCover(draft.coverFile)
            ? draft.coverFile
            : null;
        const restoredOrganizerId = organizers.some(
          (organizer) => organizer.id === draft.form.organizerId,
        )
          ? draft.form.organizerId
          : (organizers[0]?.id ?? "");
        const restoredCategory = categories.some(
          (category) => category.id === draft.form.category,
        )
          ? draft.form.category
          : "";
        const restoredVenue = venues.find(
          (venue) => venue.id === draft.form.venueId,
        );
        const coverPreviewUrl = restoredCover
          ? URL.createObjectURL(restoredCover)
          : "";
        const restoredForm: CreateEventFormState = {
          ...draft.form,
          organizerId: restoredOrganizerId,
          category: restoredCategory,
          format: "IN_PERSON",
          // Keep a linked venue id even if it is not in the current suggestion
          // response. It should not silently become a newly created venue.
          venueId: draft.form.venueId,
          venueName: draft.form.venueName || restoredVenue?.name || "",
          coverImageName: restoredCover?.name ?? "",
          coverPreviewUrl,
        };

        if (!hasMeaningfulCreateEventDraft(restoredForm, restoredCover)) {
          await deleteCreateEventDraft(userId);
          if (cancelled) return;
          setAutosaveStatus("ready");
          setAutosaveLabel("Autosave ready");
          return;
        }

        if (coverPreviewUrl) objectUrlRef.current = coverPreviewUrl;
        setCoverFile(restoredCover);
        setForm(restoredForm);
        lastSavedFormRef.current = createEventDraftFingerprint(restoredForm);
        lastSavedCoverRef.current = restoredCover;
        setAutosaveStatus("saved");
        setAutosaveLabel(
          `Restored · ${new Date(draft.updatedAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}`,
        );
      } catch (error) {
        if (cancelled) return;
        console.error("Could not restore the local event draft:", error);
        setAutosaveStatus("error");
        setAutosaveLabel("Autosave unavailable");
      } finally {
        if (!cancelled) {
          restoreCompletedRef.current = true;
          autosaveReadyRef.current = true;
        }
      }
    };

    void restoreDraft();
    return () => {
      cancelled = true;
    };
  }, [categories, organizers, userId, venues]);

  useEffect(() => {
    if (!autosaveReadyRef.current || !userId || createdEventId) return;

    const formFingerprint = createEventDraftFingerprint(form);
    if (
      formFingerprint === lastSavedFormRef.current &&
      coverFile === lastSavedCoverRef.current
    ) {
      return;
    }

    const revision = ++autosaveRevisionRef.current;
    const hasMeaningfulDraft = hasMeaningfulCreateEventDraft(form, coverFile);
    setAutosaveStatus("saving");
    setAutosaveLabel(
      hasMeaningfulDraft ? "Saving locally..." : "Clearing local draft...",
    );

    const timeout = window.setTimeout(async () => {
      try {
        const updatedAt = hasMeaningfulDraft
          ? await saveCreateEventDraft(userId, form, coverFile)
          : (await deleteCreateEventDraft(userId), Date.now());

        if (revision !== autosaveRevisionRef.current) return;

        lastSavedFormRef.current = formFingerprint;
        lastSavedCoverRef.current = coverFile;

        if (!hasMeaningfulDraft) {
          setAutosaveStatus("ready");
          setAutosaveLabel("Autosave ready");
          return;
        }

        setAutosaveStatus("saved");
        setAutosaveLabel(
          `Saved locally · ${new Date(updatedAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}`,
        );
      } catch (error) {
        if (revision !== autosaveRevisionRef.current) return;
        console.error("Could not autosave the local event draft:", error);
        setAutosaveStatus("error");
        setAutosaveLabel("Autosave failed");
      }
    }, AUTOSAVE_DELAY_MS);

    return () => window.clearTimeout(timeout);
  }, [coverFile, createdEventId, form, userId]);

  useEffect(() => {
    const result = fetcher.data;
    if (!result || isSubmitting || handledResultRef.current === result) {
      return;
    }
    handledResultRef.current = result;

    if (!result.ok) {
      if (isHandoff) {
        plumpiWindowRef.current?.close();
        plumpiWindowRef.current = null;
      }

      if (!isHandoff) {
        setErrors(result.errors ?? {});
        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev);
            next.delete("step");
            return next;
          },
          { replace: true },
        );
      }
      toast.error(result.error ?? "Please review the highlighted fields.");
      setIsHandoff(false);
      return;
    }

    if (result.warning) toast.warning(result.warning);

    if (result.redirectTo) {
      const plumpiWindow = plumpiWindowRef.current;
      plumpiWindowRef.current = null;
      setIsHandoff(false);

      if (!plumpiWindow || plumpiWindow.closed) {
        toast.error("The Plumpi tab was closed. Please try again.");
        return;
      }

      plumpiWindow.location.replace(result.redirectTo);
      return;
    }

    if (result.eventId) {
      autosaveReadyRef.current = false;
      autosaveRevisionRef.current += 1;
      setCreatedEventId(result.eventId);
      setIsHandoff(false);

      if (userId) {
        void deleteCreateEventDraft(userId)
          .then(() => {
            setAutosaveStatus("saved");
            setAutosaveLabel("Local draft cleared");
          })
          .catch((error: unknown) => {
            console.error("Could not clear the local event draft:", error);
            setAutosaveStatus("error");
            setAutosaveLabel("Local draft cleanup failed");
          });
      }
      return;
    }

    setIsHandoff(false);
    plumpiWindowRef.current?.close();
    plumpiWindowRef.current = null;
    toast.error("Plumpi could not be opened automatically.");
  }, [
    fetcher.data,
    isHandoff,
    isSubmitting,
    navigate,
    setSearchParams,
    userId,
  ]);

  const goToStep = (next: Step) => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        if (next === "basics") {
          params.delete("step");
        } else {
          params.set("step", next);
        }
        return params;
      },
      { replace: true },
    );
  };

  const handleFieldChange = <K extends keyof CreateEventFormState>(
    field: K,
    value: CreateEventFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleAccessChange = (patch: EventAccessPatch) => {
    setForm((prev) => {
      const next = { ...prev, ...patch };

      // A gated guest list rules out open access, so fall back to ticketed.
      if (isOpenEntryDisabled(next.registrationMode, next.entryMode)) {
        next.entryMode = "TICKETED";
      }

      return next;
    });
  };

  const handleCoverChange = (file: File | null) => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    const previewUrl = file ? URL.createObjectURL(file) : "";
    if (file) objectUrlRef.current = previewUrl;
    setCoverFile(file);

    setForm((prev) => ({
      ...prev,
      coverImageName: file?.name ?? "",
      coverPreviewUrl: previewUrl,
    }));
    setErrors((prev) => ({ ...prev, coverImageName: undefined }));
  };

  const validate = (): boolean => {
    const parsed = CreateEventInputSchema.safeParse(form);
    const dateRanges = getCreateEventDateRanges(form);
    if (parsed.success && dateRanges) {
      setErrors({});
      return true;
    }

    const nextErrors: CreateEventFieldErrors = {};
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof CreateEventInput | undefined;
        if (!field || nextErrors[field]) continue;

        nextErrors[field] =
          field === "eventDates" && typeof issue.path[1] === "number"
            ? `Day ${issue.path[1] + 1}: ${issue.message}`
            : issue.message;
      }
    }

    if (!dateRanges && !nextErrors.eventDates) {
      nextErrors.eventDates =
        "Check that every end time is after its start time";
    }
    setErrors(nextErrors);
    return false;
  };

  const submitDraft = () => {
    const dateRanges = getCreateEventDateRanges(form);
    if (!coverFile || !dateRanges) return;

    setIsHandoff(false);
    const submission = new FormData();
    submission.set("intent", "create-draft");
    submission.set("organizerId", form.organizerId);
    submission.set("name", form.name);
    submission.set("category", form.category);
    submission.set("description", form.description);
    submission.set("format", form.format);
    submission.set("eventDates", JSON.stringify(form.eventDates));
    submission.set("eventDateRanges", JSON.stringify(dateRanges));
    submission.set("venueId", form.venueId);
    submission.set("venueName", form.venueName);
    submission.set("address", form.address);
    submission.set("googleMapLink", form.googleMapLink);
    submission.set("visibility", form.visibility);
    submission.set("registrationMode", form.registrationMode);
    submission.set("entryMode", form.entryMode);
    submission.set("cover", coverFile, coverFile.name);

    fetcher.submit(submission, {
      method: "post",
      encType: "multipart/form-data",
    });
  };

  const handleReview = () => {
    if (!validate()) {
      toast.error("Please complete the required fields.");
      return;
    }
    goToStep("review");
  };

  const handleSaveDraft = () => {
    if (!validate()) {
      toast.error("Please complete the required fields before saving.");
      return;
    }
    submitDraft();
  };

  const continueToPlumpi = () => {
    if (!createdEventId || isSubmitting) return;

    const plumpiWindow = openPlumpiHandoffWindow();
    if (!plumpiWindow) {
      toast.error("Allow pop-ups to continue editing in Plumpi.");
      return;
    }
    plumpiWindowRef.current = plumpiWindow;

    setIsHandoff(true);
    const submission = new FormData();
    submission.set("intent", "continue-to-plumpi");
    submission.set("eventId", createdEventId);
    submission.set("organizationId", form.organizerId);
    fetcher.submit(submission, { method: "post" });
  };

  const transition = { duration: prefersReducedMotion ? 0 : 0.28 };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white supports-[height:100dvh]:h-dvh">
      <CreateEventTopBar
        closeTo={MY_EVENTS_PATH}
        autosaveStatus={autosaveStatus}
        autosaveLabel={autosaveLabel}
      />
      <CreateEventAutosaveStatus
        status={autosaveStatus}
        label={autosaveLabel}
        className="shrink-0 justify-end border-b border-[#E1E7EF] bg-slate-50/70 px-5 py-2 sm:hidden"
      />

      <AnimatePresence mode="wait" initial={false}>
        {step === "basics" ? (
          <motion.div
            key="basics"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={transition}
            className="flex min-h-0 flex-1"
          >
            <CreateEventAside />

            <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-9 pb-20 [scrollbar-gutter:stable] md:px-6">
              <div className="mx-auto w-full max-w-170">
                <div className="flex items-baseline justify-between gap-4">
                  <h1 className="text-2xl font-extrabold text-[#1D283A]">
                    Tell us about your event
                  </h1>
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#E1E7EF] bg-white px-3.5 py-1.5 text-xs font-bold text-slate-500">
                    <span className="size-1.5 rounded-full bg-slate-400" />
                    Draft
                  </span>
                </div>
                <p className="mt-2 mb-6 text-sm leading-relaxed text-slate-500">
                  Fill in just the basics here. For tickets, program scheduling
                  and other full setup, you&apos;ll continue in Plumpi.
                </p>

                <div className="space-y-6">
                  <CreateEventOrganizerSelect
                    organizers={organizers}
                    selectedOrganizerId={form.organizerId}
                    error={errors.organizerId}
                    onSelect={(organizerId) =>
                      handleFieldChange("organizerId", organizerId)
                    }
                  />

                  <CreateEventBasicsForm
                    form={form}
                    categories={categories}
                    venues={venues}
                    venueLoadError={venueLoadError}
                    errors={errors}
                    onFieldChange={handleFieldChange}
                    onCoverChange={handleCoverChange}
                  />

                  <CreateEventAccessForm
                    visibility={form.visibility}
                    registrationMode={form.registrationMode}
                    entryMode={form.entryMode}
                    onChange={handleAccessChange}
                  />
                </div>

                <div className="mt-7 flex flex-wrap justify-end gap-3">
                  <Button
                    type="button"
                    disabled={!isComplete || isSubmitting}
                    onClick={handleReview}
                    className="h-11 rounded-lg bg-blue-600 px-6.5 text-sm font-bold text-white hover:bg-blue-700"
                  >
                    Review
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={transition}
            className="min-h-0 flex-1 overflow-y-auto bg-white px-5 pt-11 pb-20 [scrollbar-gutter:stable] md:px-6"
          >
            <div className="mx-auto max-w-220">
              <CreateEventReview
                form={form}
                category={
                  categories.find((category) => category.id === form.category)
                    ?.name ?? ""
                }
                organizer={
                  organizers.find(
                    (organizer) => organizer.id === form.organizerId,
                  ) ?? null
                }
                venue={
                  venues.find((venue) => venue.id === form.venueId) ?? null
                }
              />

              <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => goToStep("basics")}
                  className="h-11 gap-1.5 rounded-lg border-[#E1E7EF] px-5.5 text-sm font-bold text-[#344256]"
                >
                  <ArrowLeft className="size-4" strokeWidth={2.4} />
                  Back to edit
                </Button>

                <div className="ml-auto text-right">
                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleSaveDraft}
                      className="relative h-11 rounded-lg bg-blue-600 px-6.5 text-sm font-bold text-white hover:bg-blue-700"
                    >
                      <span
                        className={isCreatingDraft ? "invisible" : undefined}
                      >
                        Create as Draft
                      </span>
                      {isCreatingDraft && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <LoaderCircle className="size-4 animate-spin" />
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CreateEventDraftSuccessDialog
        open={Boolean(createdEventId)}
        eventName={form.name}
        isContinuing={isHandingOff}
        onContinue={continueToPlumpi}
        onGoBack={() => navigate(MY_EVENTS_PATH)}
      />

      {isHandingOff && <CreateEventConnecting />}
    </div>
  );
}
