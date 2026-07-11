import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import {
  useNavigate,
  useSearchParams,
  useFetcher,
  useLoaderData,
} from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import BackToButton from "~/components/back-to-button";
import { fadeUp } from "~/components/default-animation";
import LaunchpadPostPage1 from "./launchpad-post-page-1";
import LaunchpadPostPage2 from "./launchpad-post-page-2";
import type { loader } from "../../route/launchpad.edit.$id";
import type { LaunchpadDetail } from "~/features/launchpad/types";
import { resolveImageURL } from "~/lib/utils";
import {
  COVER_MAX_FILE_SIZE,
  getImageFileError,
} from "~/features/launchpad/lib/launchpad-image-validation";

enum State {
  DETAIL = "Detail",
  ROLE = "Role",
}

type DetailErrors = {
  name?: string;
  categoryId?: string;
  cityId?: string;
  deadline?: string;
  coverFile?: string;
};

type RoleErrors = {
  role?: string;
  materialDocuments?: string;
  email?: string;
  phoneNumber?: string;
  telegramUsername?: string;
};

type ApiFieldErrors = Record<string, string>;

function isValidEmail(value: string) {
  return /^\S+@\S+\.\S+$/.test(value.trim());
}

function mapProjectToFormFields(project: LaunchpadDetail) {
  return {
    name: project.name ?? "",
    description: project.description ?? "",
    categoryId: project.category?.id ?? "",
    cityId: project.city?.id ?? "",
    deadline: project.deadline ?? "",
    email: project.email ?? "",
    phoneNumber: project.phoneNumber ?? "",
    telegramUsername: project.telegramUsername ?? "",
    coverKey: project.coverKey ?? "",
    materialDocumentKey: project.documentKeys ?? [],
    materialDocumentName: project.documentNames ?? [],
    roles:
      project.roles?.map((r) => ({
        id: r.id ?? "",
        name: r.title ?? "",
        capacity: r.capacity ?? 1,
        description: r.description ?? "",
      })) ?? [],
  };
}

const launchpadEditSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string(),
  categoryId: z.string().min(1, "Category is required"),
  cityId: z.string().min(1, "City is required"),
  deadline: z.string().min(1, "Deadline is required"),
  email: z.string().email("Please enter a valid email").or(z.literal("")),
  phoneNumber: z.string().min(1, "Phone number is required"),
  telegramUsername: z.string(),
  coverKey: z.string(),
  materialDocumentKey: z.array(z.string()),
  materialDocumentName: z.array(z.string()),
  roles: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().min(1, "Role name is required"),
        capacity: z.number().int().gt(0, "Capacity must be at least 1"),
        description: z.string(),
      }),
    )
    .min(1, "At least one role is required"),
});

type FormFields = z.infer<typeof launchpadEditSchema>;

export default function LaunchpadEditPage() {
  const { project, categories, locations } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const fetcher = useFetcher<{
    error?: string;
    success?: boolean;
    redirectTo?: string;
    fieldErrors?: ApiFieldErrors;
  }>();
  const prefersReducedMotion = useReducedMotion();

  const state =
    searchParams.get("state")?.toLowerCase() === "role"
      ? State.ROLE
      : State.DETAIL;

  const defaultValues = useMemo(
    () => mapProjectToFormFields(project!),
    [project],
  );

  const { watch, setValue, trigger } = useForm<FormFields>({
    resolver: zodResolver(launchpadEditSchema),
    defaultValues,
  });

  const values = watch();

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [materialDocuments, setMaterialDocuments] = useState<File[]>([]);
  const [detailErrors, setDetailErrors] = useState<DetailErrors>({});
  const [roleErrors, setRoleErrors] = useState<RoleErrors>({});

  const existingCoverUrl = useMemo(
    () => resolveImageURL(project?.coverKey ?? undefined),
    [project],
  );
  const existingDocuments = useMemo(
    () =>
      (project?.documentKeys ?? []).map((key, i) => ({
        name: (project?.documentNames ?? [])[i] ?? key,
        url: resolveImageURL(key),
      })),
    [project],
  );

  const originalRoles = useMemo(
    () =>
      (project?.roles ?? []).map((r) => ({
        id: r.id ?? "",
        name: r.title ?? "",
        capacity: r.capacity ?? 1,
        description: r.description ?? "",
      })),
    [project],
  );

  const mapRoleFieldErrors = (fieldErrors?: ApiFieldErrors): RoleErrors => {
    if (!fieldErrors) return {};
    const mapped: RoleErrors = {};
    if (fieldErrors.role) mapped.role = fieldErrors.role;
    if (fieldErrors.materialDocuments)
      mapped.materialDocuments = fieldErrors.materialDocuments;
    if (fieldErrors.materialDocumentName)
      mapped.materialDocuments = fieldErrors.materialDocumentName;
    if (fieldErrors.email) mapped.email = fieldErrors.email;
    if (fieldErrors.phoneNumber) mapped.phoneNumber = fieldErrors.phoneNumber;
    if (fieldErrors.telegramUsername)
      mapped.telegramUsername = fieldErrors.telegramUsername;
    return mapped;
  };

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.success && fetcher.data.redirectTo) {
        toast.success("Launchpad project updated successfully");
        navigate(fetcher.data.redirectTo);
      } else {
        const mappedRoleErrors = mapRoleFieldErrors(fetcher.data.fieldErrors);

        if (Object.keys(mappedRoleErrors).length > 0) {
          setRoleErrors((previous) => ({
            ...previous,
            ...mappedRoleErrors,
          }));

          const firstFieldError = Object.values(mappedRoleErrors)[0];
          if (firstFieldError) {
            toast.error(firstFieldError);
            return;
          }
        }

        if (fetcher.data.error) {
          toast.error(fetcher.data.error);
        }
      }
    }
  }, [fetcher.state, fetcher.data, navigate]);

  const setState = (nextState: State) => {
    const nextParams = new URLSearchParams(searchParams);

    if (nextState === State.ROLE) {
      nextParams.set("state", "role");
    } else {
      nextParams.delete("state");
    }

    setSearchParams(nextParams, {
      replace: true,
      preventScrollReset: true,
    });
  };

  const onSaveClicked = () => {
    const errors: DetailErrors = {};

    if (!values.name.trim()) errors.name = "Project name is required.";
    if (!values.categoryId.trim()) errors.categoryId = "Category is required.";
    if (!values.cityId.trim()) errors.cityId = "City is required.";
    if (!values.deadline.trim()) errors.deadline = "Deadline is required.";

    // Only validate the cover if the user selected a new file
    if (coverFile) {
      const coverFileError = getImageFileError(
        coverFile,
        COVER_MAX_FILE_SIZE,
        "Project cover",
      );
      if (coverFileError) errors.coverFile = coverFileError;
    }

    setDetailErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setState(State.ROLE);
  };

  const onCancelClicked = () => {
    window.history.back();
  };

  const onBackToDetailClicked = () => {
    setState(State.DETAIL);
  };

  const onPublishedClicked = () => {
    // Re-validate detail fields
    const detailValidationErrors: DetailErrors = {};
    if (!values.name.trim())
      detailValidationErrors.name = "Project name is required.";
    if (!values.categoryId.trim())
      detailValidationErrors.categoryId = "Category is required.";
    if (!values.cityId.trim())
      detailValidationErrors.cityId = "City is required.";
    if (!values.deadline.trim())
      detailValidationErrors.deadline = "Deadline is required.";

    if (coverFile) {
      const coverFileError = getImageFileError(
        coverFile,
        COVER_MAX_FILE_SIZE,
        "Project cover",
      );
      if (coverFileError) detailValidationErrors.coverFile = coverFileError;
    }

    if (Object.keys(detailValidationErrors).length > 0) {
      setDetailErrors(detailValidationErrors);
      setState(State.DETAIL);
      return;
    }

    const errors: RoleErrors = {};

    if (values.roles.length === 0) {
      errors.role = "At least one role is required.";
    }

    if (
      values.materialDocumentKey.length === 0 &&
      materialDocuments.length === 0
    ) {
      errors.materialDocuments = "At least one material document is required.";
    }

    if (!values.email.trim()) {
      errors.email = "Email is required.";
    } else if (!isValidEmail(values.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!values.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required.";
    }

    setRoleErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    // Cover file check
    if (coverFile) {
      const coverFileError = getImageFileError(
        coverFile,
        COVER_MAX_FILE_SIZE,
        "Project cover",
      );
      if (coverFileError) {
        detailValidationErrors.coverFile = coverFileError;
        setDetailErrors(detailValidationErrors);
        setState(State.DETAIL);
        return;
      }
    }

    const submitData = {
      name: values.name.trim(),
      description: values.description.trim() || null,
      categoryId: values.categoryId,
      cityId: values.cityId,
      deadline: values.deadline,
      coverKey: coverFile ? "" : values.coverKey,
      role: values.roles.map((role) => ({
        id: role.id || undefined,
        name: role.name.trim(),
        capacity: role.capacity,
        description: role.description.trim() || null,
      })),
      materialDocumentKey: values.materialDocumentKey,
      materialDocumentName: values.materialDocumentName,
      phoneNumber: values.phoneNumber.trim(),
      email: values.email.trim(),
      telegramUsername: values.telegramUsername.trim() || null,
    };

    const multipart = new FormData();
    multipart.append("actionType", "update-launchpad");
    multipart.append("data", JSON.stringify(submitData));

    if (coverFile) {
      multipart.append("coverFile", coverFile);
    }

    for (const file of materialDocuments) {
      multipart.append("documentFiles", file);
    }

    fetcher.submit(multipart, {
      method: "post",
      encType: "multipart/form-data",
    });
  };

  if (!project) return null;

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 sm:py-10 lg:px-20">
        <section className="mx-auto w-full max-w-3xl">
          <motion.div
            className="mb-5 flex items-center justify-between"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <BackToButton to={`/launchpad/detail/${project.id}`} />
          </motion.div>

          <motion.div
            className="my-10"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{
              duration: prefersReducedMotion ? 0 : 0.3,
              delay: prefersReducedMotion ? 0 : 0.05,
            }}
          >
            <div className="relative flex items-center gap-3.5 rounded-full p-1 transition-all">
              <motion.div
                className="absolute top-1 left-1 h-3 w-20 rounded-full bg-blue-500"
                initial={{ x: 0, y: 0 }}
                animate={{ x: state === State.DETAIL ? 0 : 80 + 13 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.3,
                }}
              />
              <div
                className="h-3 w-20 cursor-pointer rounded-full bg-gray-200"
                onClick={() => setState(State.DETAIL)}
              />
              <div
                className="h-3 w-20 cursor-pointer rounded-full bg-gray-200"
                onClick={() => setState(State.ROLE)}
              />
            </div>
          </motion.div>

          <motion.div
            className="my-10"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{
              duration: prefersReducedMotion ? 0 : 0.3,
              delay: prefersReducedMotion ? 0 : 0.1,
            }}
          >
            <div className="text-4xl">Edit Project</div>
            <div className="text-[#65758B]">Update your project details.</div>
          </motion.div>

          <AnimatePresence mode="wait">
            {state === State.ROLE ? (
              <motion.div
                key={State.ROLE}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.3,
                  delay: prefersReducedMotion ? 0 : 0.15,
                }}
              >
                <LaunchpadPostPage2
                  roles={values.roles}
                  roleError={roleErrors.role}
                  materialDocuments={materialDocuments}
                  existingMaterialDocuments={existingDocuments}
                  materialDocumentError={roleErrors.materialDocuments}
                  email={values.email}
                  phoneNumber={values.phoneNumber}
                  telegramUsername={values.telegramUsername}
                  emailError={roleErrors.email}
                  phoneNumberError={roleErrors.phoneNumber}
                  telegramUsernameError={roleErrors.telegramUsername}
                  originalRoles={originalRoles}
                  onRolesChange={(roles) => {
                    const mergedRoles = roles.map((role, i) => {
                      const existingId = values.roles[i]?.id;
                      return {
                        ...role,
                        id: existingId || "",
                      };
                    });
                    setValue("roles", mergedRoles as any);
                  }}
                  onResetRoles={() => setValue("roles", originalRoles)}
                  onMaterialDocumentsChange={setMaterialDocuments}
                  onEmailChange={(value) => setValue("email", value)}
                  onPhoneNumberChange={(value) =>
                    setValue("phoneNumber", value)
                  }
                  onTelegramUsernameChange={(value) =>
                    setValue("telegramUsername", value)
                  }
                  onBackToDetailClicked={onBackToDetailClicked}
                  onPublishedClicked={onPublishedClicked}
                  isSubmitting={fetcher.state === "submitting"}
                />
              </motion.div>
            ) : (
              <motion.div
                key={State.DETAIL}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.3,
                  delay: prefersReducedMotion ? 0 : 0.15,
                }}
              >
                <LaunchpadPostPage1
                  name={values.name}
                  categoryId={values.categoryId}
                  cityId={values.cityId}
                  deadline={values.deadline}
                  coverFile={coverFile}
                  description={values.description}
                  categories={
                    categories?.map((item) => ({
                      id: item.id,
                      name: item.name,
                    })) ?? []
                  }
                  cities={
                    locations?.map((item) => ({
                      id: item.id,
                      name: item.name,
                    })) ?? []
                  }
                  existingCoverUrl={existingCoverUrl}
                  errors={detailErrors}
                  onNameChange={(value) => setValue("name", value)}
                  onCategoryChange={(value) => setValue("categoryId", value)}
                  onCityChange={(value) => setValue("cityId", value)}
                  onDeadlineChange={(value) => setValue("deadline", value)}
                  onCoverChange={(file) => setCoverFile(file)}
                  onDescriptionChange={(value) =>
                    setValue("description", value)
                  }
                  onSaveClicked={onSaveClicked}
                  onCancelClicked={onCancelClicked}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}
