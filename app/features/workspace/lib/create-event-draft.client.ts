import * as z from "zod";
import {
  CreateEventDateInputSchema,
  CreateEventFormatSchema,
  EventEntryModeSchema,
  EventRegistrationModeSchema,
  EventVisibilitySchema,
  initialCreateEventFormState,
  type CreateEventFormState,
} from "~/features/workspace/types/my-events";

const DATABASE_NAME = "true-khmer-local-drafts";
const DATABASE_VERSION = 1;
const STORE_NAME = "create-event";
const DRAFT_VERSION = 3;
const DATABASE_OPEN_TIMEOUT_MS = 5_000;

const PersistedCreateEventFormSchema = z.object({
  organizerId: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string(),
  format: z.union([CreateEventFormatSchema, z.literal("")]),
  eventDates: z.array(CreateEventDateInputSchema),
  venueName: z.string(),
  venueId: z.string(),
  address: z.string(),
  googleMapLink: z.string(),
  coverImageName: z.string(),
  visibility: EventVisibilitySchema,
  registrationMode: EventRegistrationModeSchema,
  entryMode: EventEntryModeSchema,
});

export type PersistedCreateEventForm = z.infer<
  typeof PersistedCreateEventFormSchema
>;

type StoredCreateEventDraft = {
  key: string;
  version: number;
  form: PersistedCreateEventForm;
  coverBlob: Blob | null;
  coverFileName: string | null;
  coverLastModified: number | null;
  updatedAt: number;
};

export type RestoredCreateEventDraft = {
  form: PersistedCreateEventForm;
  coverFile: File | null;
  updatedAt: number;
};

const VersionTwoPersistedCreateEventFormSchema =
  PersistedCreateEventFormSchema.omit({ venueName: true });

const LegacyPersistedCreateEventFormSchema =
  VersionTwoPersistedCreateEventFormSchema.omit({
    eventDates: true,
    venueId: true,
    address: true,
    googleMapLink: true,
  }).extend({
    startDate: z.string(),
    startTime: z.string(),
    endTime: z.string(),
  });

function openDraftDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("IndexedDB is not available in this browser."));
      return;
    }

    const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    let settled = false;
    const timeout = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      reject(new Error("Local draft storage took too long to open."));
    }, DATABASE_OPEN_TIMEOUT_MS);

    const rejectOpen = (error: Error) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      reject(error);
    };

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: "key" });
      }
    };
    request.onsuccess = () => {
      if (settled) {
        request.result.close();
        return;
      }
      settled = true;
      window.clearTimeout(timeout);
      resolve(request.result);
    };
    request.onerror = () =>
      rejectOpen(
        request.error ?? new Error("Could not open local draft storage."),
      );
    request.onblocked = () =>
      rejectOpen(new Error("Local draft storage is blocked by another tab."));
  });
}

function persistedFormFromState(
  form: CreateEventFormState,
): PersistedCreateEventForm {
  const { coverPreviewUrl: _coverPreviewUrl, ...persistedForm } = form;
  return persistedForm;
}

export function createEventDraftFingerprint(form: CreateEventFormState) {
  return JSON.stringify(persistedFormFromState(form));
}

export function hasMeaningfulCreateEventDraft(
  form: CreateEventFormState,
  coverFile: File | null,
) {
  return Boolean(
    coverFile ||
    form.name.trim() ||
    form.category ||
    form.description.trim() ||
    form.eventDates.some(
      (eventDate) => eventDate.date || eventDate.startTime || eventDate.endTime,
    ) ||
    form.venueId ||
    form.venueName.trim() ||
    form.address.trim() ||
    form.googleMapLink.trim() ||
    form.visibility !== initialCreateEventFormState.visibility ||
    form.registrationMode !== initialCreateEventFormState.registrationMode ||
    form.entryMode !== initialCreateEventFormState.entryMode,
  );
}

export async function loadCreateEventDraft(
  key: string,
): Promise<RestoredCreateEventDraft | null> {
  const database = await openDraftDatabase();

  try {
    const stored = await new Promise<StoredCreateEventDraft | undefined>(
      (resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, "readonly");
        const request = transaction.objectStore(STORE_NAME).get(key);
        request.onsuccess = () =>
          resolve(request.result as StoredCreateEventDraft | undefined);
        request.onerror = () =>
          reject(request.error ?? new Error("Could not read the local draft."));
      },
    );

    if (!stored) return null;

    let restoredForm: PersistedCreateEventForm;
    if (stored.version === DRAFT_VERSION) {
      const parsedForm = PersistedCreateEventFormSchema.safeParse(stored.form);
      if (!parsedForm.success) return null;
      restoredForm = parsedForm.data;
    } else if (stored.version === 2) {
      const versionTwoForm = VersionTwoPersistedCreateEventFormSchema.safeParse(
        stored.form,
      );
      if (!versionTwoForm.success) return null;
      restoredForm = { ...versionTwoForm.data, venueName: "" };
    } else if (stored.version === 1) {
      const legacyForm = LegacyPersistedCreateEventFormSchema.safeParse(
        stored.form,
      );
      if (!legacyForm.success) return null;

      const { startDate, startTime, endTime, ...unchangedFields } =
        legacyForm.data;
      restoredForm = {
        ...unchangedFields,
        format: "IN_PERSON",
        eventDates: [{ date: startDate, startTime, endTime }],
        venueName: "",
        venueId: "",
        address: "",
        googleMapLink: "",
      };
    } else {
      return null;
    }

    const coverFile =
      stored.coverBlob instanceof Blob && stored.coverFileName
        ? new File([stored.coverBlob], stored.coverFileName, {
            type: stored.coverBlob.type,
            lastModified: stored.coverLastModified ?? Date.now(),
          })
        : null;

    return {
      form: restoredForm,
      coverFile,
      updatedAt: Number.isFinite(stored.updatedAt)
        ? stored.updatedAt
        : Date.now(),
    };
  } finally {
    database.close();
  }
}

export async function saveCreateEventDraft(
  key: string,
  form: CreateEventFormState,
  coverFile: File | null,
) {
  const database = await openDraftDatabase();
  const draft: StoredCreateEventDraft = {
    key,
    version: DRAFT_VERSION,
    form: persistedFormFromState(form),
    coverBlob: coverFile,
    coverFileName: coverFile?.name ?? null,
    coverLastModified: coverFile?.lastModified ?? null,
    updatedAt: Date.now(),
  };

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      transaction.objectStore(STORE_NAME).put(draft);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () =>
        reject(
          transaction.error ?? new Error("Could not save the local draft."),
        );
      transaction.onabort = () =>
        reject(
          transaction.error ?? new Error("Saving the local draft was aborted."),
        );
    });
  } finally {
    database.close();
  }

  return draft.updatedAt;
}

export async function deleteCreateEventDraft(key: string) {
  const database = await openDraftDatabase();

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      transaction.objectStore(STORE_NAME).delete(key);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () =>
        reject(
          transaction.error ?? new Error("Could not remove the local draft."),
        );
      transaction.onabort = () =>
        reject(
          transaction.error ??
            new Error("Removing the local draft was aborted."),
        );
    });
  } finally {
    database.close();
  }
}
