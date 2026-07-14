import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PersistedFileSnapshot = {
  name: string;
  type: string;
  lastModified: number;
  size: number;
  dataUrl: string;
};

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }
      reject(new Error("Unable to read file as data URL"));
    };
    reader.onerror = () =>
      reject(reader.error ?? new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

async function toSnapshot(file: File): Promise<PersistedFileSnapshot> {
  return {
    name: file.name,
    type: file.type,
    lastModified: file.lastModified,
    size: file.size,
    dataUrl: await fileToDataUrl(file),
  };
}

async function fromSnapshot(
  snapshot: PersistedFileSnapshot | null,
): Promise<File | null> {
  if (!snapshot) return null;

  const response = await fetch(snapshot.dataUrl);
  const blob = await response.blob();
  return new File([blob], snapshot.name, {
    type: snapshot.type,
    lastModified: snapshot.lastModified,
  });
}

function isSameFile(a: File | null, b: File): boolean {
  if (!a) return false;
  return (
    a.name === b.name &&
    a.type === b.type &&
    a.size === b.size &&
    a.lastModified === b.lastModified
  );
}

export type LaunchpadRoleInput = {
  name: string;
  capacity: number;
  description: string;
};

export type LaunchpadFormState = {
  name: string;
  categoryId: string;
  cityId: string;
  deadline: string;
  description: string;
  email: string;
  phoneNumber: string;
  telegramUsername: string;
  coverFile: File | null;
  materialDocuments: File[];
  coverFileSnapshot: PersistedFileSnapshot | null;
  materialDocumentSnapshots: PersistedFileSnapshot[];
  roles: LaunchpadRoleInput[];
};

export type LaunchpadCreateStore = LaunchpadFormState & {
  setName: (value: string) => void;
  setCategoryId: (value: string) => void;
  setCityId: (value: string) => void;
  setDeadline: (value: string) => void;
  setDescription: (value: string) => void;
  setEmail: (value: string) => void;
  setPhoneNumber: (value: string) => void;
  setTelegramUsername: (value: string) => void;
  setCoverFile: (file: File | null) => void;
  setMaterialDocuments: (files: File[]) => void;
  setRoles: (roles: LaunchpadRoleInput[]) => void;
  rehydrateFiles: () => Promise<void>;
  reset: () => void;
  hydrate: (state: Partial<LaunchpadFormState>) => void;
};

const initialState: LaunchpadFormState = {
  name: "",
  categoryId: "",
  cityId: "",
  deadline: "",
  description: "",
  email: "",
  phoneNumber: "",
  telegramUsername: "",
  coverFile: null,
  materialDocuments: [],
  coverFileSnapshot: null,
  materialDocumentSnapshots: [],
  roles: [],
};

export const useLaunchpadCreateStore = create<LaunchpadCreateStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setName: (value: string) => set({ name: value }),
      setCategoryId: (value: string) => set({ categoryId: value }),
      setCityId: (value: string) => set({ cityId: value }),
      setDeadline: (value: string) => set({ deadline: value }),
      setDescription: (value: string) => set({ description: value }),
      setEmail: (value: string) => set({ email: value }),
      setPhoneNumber: (value: string) => set({ phoneNumber: value }),
      setTelegramUsername: (value: string) => set({ telegramUsername: value }),
      setCoverFile: (file: File | null) => {
        set({ coverFile: file, coverFileSnapshot: null });

        if (!file) return;

        void toSnapshot(file)
          .then((snapshot) => {
            set((state) =>
              isSameFile(state.coverFile, file)
                ? { coverFileSnapshot: snapshot }
                : {},
            );
          })
          .catch((error) => {
            console.error("Failed to persist cover file snapshot", error);
          });
      },
      setMaterialDocuments: (files: File[]) => {
        set({ materialDocuments: files, materialDocumentSnapshots: [] });

        if (files.length === 0) return;

        void Promise.all(files.map((file) => toSnapshot(file)))
          .then((snapshots) => {
            set((state) => {
              const sameLength =
                state.materialDocuments.length === files.length;
              if (!sameLength) return {};

              const isSame = state.materialDocuments.every((current, index) =>
                isSameFile(current, files[index]),
              );

              return isSame ? { materialDocumentSnapshots: snapshots } : {};
            });
          })
          .catch((error) => {
            console.error("Failed to persist material file snapshots", error);
          });
      },
      setRoles: (roles: LaunchpadRoleInput[]) => set({ roles }),

      rehydrateFiles: async () => {
        const {
          coverFile,
          materialDocuments,
          coverFileSnapshot,
          materialDocumentSnapshots,
        } = get();

        if (
          coverFile ||
          materialDocuments.length > 0 ||
          (!coverFileSnapshot && materialDocumentSnapshots.length === 0)
        ) {
          return;
        }

        try {
          const [restoredCover, restoredDocuments] = await Promise.all([
            fromSnapshot(coverFileSnapshot),
            Promise.all(
              materialDocumentSnapshots.map((snapshot) =>
                fromSnapshot(snapshot),
              ),
            ),
          ]);

          set({
            coverFile: restoredCover,
            materialDocuments: restoredDocuments.filter(
              (value): value is File => value instanceof File,
            ),
          });
        } catch (error) {
          console.error("Failed to rehydrate persisted launchpad files", error);
        }
      },

      reset: () => set(initialState),
      hydrate: (state: Partial<LaunchpadFormState>) => set(state),
    }),
    {
      name: "launchpad-create-store",
      version: 1,
      storage: {
        getItem: (name) => {
          if (typeof window === "undefined") return null;
          try {
            const item = localStorage.getItem(name);
            return item ? JSON.parse(item) : null;
          } catch (error) {
            console.error(
              `Failed to parse persisted state for "${name}"`,
              error,
            );
            return null;
          }
        },
        setItem: (name, value) => {
          if (typeof window === "undefined") return;
          try {
            localStorage.setItem(name, JSON.stringify(value));
          } catch (error) {
            console.error(`Failed to persist state for "${name}"`, error);
          }
        },
        removeItem: (name) => {
          if (typeof window === "undefined") return;
          try {
            localStorage.removeItem(name);
          } catch (error) {
            console.error(
              `Failed to remove persisted state for "${name}"`,
              error,
            );
          }
        },
      },
      partialize: (state) =>
        ({
          name: state.name,
          categoryId: state.categoryId,
          cityId: state.cityId,
          deadline: state.deadline,
          description: state.description,
          email: state.email,
          phoneNumber: state.phoneNumber,
          telegramUsername: state.telegramUsername,
          roles: state.roles,
          coverFile: null,
          materialDocuments: [],
          coverFileSnapshot: state.coverFileSnapshot,
          materialDocumentSnapshots: state.materialDocumentSnapshots,
        }) as any,
    },
  ),
);
