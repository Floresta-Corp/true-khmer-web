import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  useNavigate,
  useSearchParams,
  useFetcher,
  useLoaderData,
} from "react-router";
import VolunteerPostPage1 from "./volunteer-post-page-1";
import VolunteerPostPage2 from "./volunteer-post-page-2";
import ProgressIndicator, { ProgressState } from "./section/progress-indicator";
import PageHeader from "./section/page-header";
import FormContainer from "./section/form-container";
import {
  validateDetailStep,
  validateRoleStep,
} from "../lib/volunteer-validation";
import {
  initialFormDataVolunteerInput,
  type FormDataVolunteerInput,
} from "~/services/volunteer/volunteer-types";
import { resolveImageURL } from "~/lib/utils";
import type { loader } from "../routes/volunteer.edit.$id";
import type { VolunteerPostPage1Errors } from "./volunteer-post-page-1";
import type { VolunteerPostPage2Errors } from "./volunteer-post-page-2";

function mapOpportunityToFormData(
  volunteer: Record<string, unknown> | undefined,
): FormDataVolunteerInput {
  if (!volunteer) return initialFormDataVolunteerInput;

  const category = volunteer.category as { id?: string } | undefined;
  const location = volunteer.location as { id?: string } | undefined;
  const roles =
    (volunteer.roles as Array<Record<string, unknown>> | undefined) ?? [];
  const contact = volunteer.organizer
    ? ((volunteer.organizer as Record<string, unknown>).contact as
        | Record<string, unknown>
        | undefined)
    : undefined;
  const originalKey = (volunteer.coverImageKey as string) ?? "";

  return {
    categoryId: category?.id ?? "",
    locationId: location?.id ?? "",
    title: (volunteer.title as string) ?? "",
    overview: (volunteer.overview as string) ?? "",
    communityImpact: (volunteer.communityImpact as string) ?? "",
    startDate: (volunteer.startDate as string) ?? "",
    endDate: (volunteer.endDate as string) ?? "",
    commitmentLabel: (volunteer.commitmentLabel as string) ?? "",
    commitmentDescription: (volunteer.commitmentDescription as string) ?? "",
    applicationDeadline: (volunteer.applicationDeadline as string) ?? "",
    benefits: (volunteer.benefits as string[]) ?? [""],
    contact: {
      email: (contact?.email as string) ?? "",
      telegramUsername: (contact?.telegramUsername as string) ?? null,
      phone: (contact?.phone as string) ?? null,
      websiteUrl: (contact?.websiteUrl as string) ?? null,
    },
    roles: roles.map((r) => ({
      id: (r.id as string) ?? "",
      title: (r.title as string) ?? "",
      capacity: (r.capacity as number) ?? 1,
      responsibilities: (r.responsibilities as string[]) ?? [],
      requirements: (r.requirements as string[]) ?? [],
    })),
    coverImageKey: {
      file: null,
      value: originalKey ? resolveImageURL(originalKey) : "",
    },
  };
}

export default function VolunteerEditPage() {
  const { volunteer, locations, categories } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const fetcher = useFetcher<{
    error?: string;
    success?: boolean;
    redirectTo?: string;
  }>();
  const state =
    searchParams.get("state")?.toLowerCase() === "role"
      ? ProgressState.ROLE
      : ProgressState.DETAIL;

  const originalCoverImageKey = useMemo(
    () => (volunteer?.coverImageKey as string) ?? "",
    [volunteer],
  );
  const initialFormData = useMemo(
    () => mapOpportunityToFormData(volunteer),
    [volunteer],
  );
  const [formData, setFormData] =
    useState<FormDataVolunteerInput>(initialFormData);
  const coverImageFileRef = useRef<File | null>(null);
  const [detailErrors, setDetailErrors] = useState<VolunteerPostPage1Errors>(
    {},
  );
  const [roleErrors, setRoleErrors] = useState<VolunteerPostPage2Errors>({});
  const hasScrolledRef = useRef(false);
  const prevStateRef = useRef(state);
  const prevErrorsRef = useRef<Record<string, unknown>>({});

  useEffect(() => {
    const hasDetailErrors = Object.keys(detailErrors).some(
      (key) =>
        key !== "benefitErrors" &&
        detailErrors[key as keyof typeof detailErrors],
    );
    const hasRoleErrors = Object.keys(roleErrors).some(
      (key) =>
        key !== "roleErrors" && roleErrors[key as keyof typeof roleErrors],
    );

    if (!hasDetailErrors && !hasRoleErrors) {
      hasScrolledRef.current = false;
      return;
    }

    const errorsKey = JSON.stringify({ detailErrors, roleErrors });
    if (prevErrorsRef.current.errorkey === errorsKey) return;
    prevErrorsRef.current = { errorkey: errorsKey };

    if (hasScrolledRef.current) return;
    hasScrolledRef.current = true;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const scrollToElement = () => {
      if (hasDetailErrors && state === ProgressState.DETAIL) {
        const firstError = Object.keys(detailErrors).find(
          (key) =>
            key !== "benefitErrors" &&
            detailErrors[key as keyof typeof detailErrors],
        );
        if (firstError === "title") {
          document.querySelector('[name="title"]')?.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "center",
          });
        } else if (firstError === "categoryId" || firstError === "locationId") {
          document.querySelector(`#${firstError}-trigger`)?.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "center",
          });
        } else if (firstError === "dateRange") {
          document
            .querySelector("#opportunity-date-range-trigger")
            ?.scrollIntoView({
              behavior: prefersReducedMotion ? "auto" : "smooth",
              block: "center",
            });
        } else if (firstError === "coverImageKey") {
          const el = document.querySelector(
            "#coverImageKey",
          ) as HTMLElement | null;
          if (el) {
            el.scrollIntoView({
              behavior: prefersReducedMotion ? "auto" : "smooth",
              block: "center",
            });
            try {
              el.focus();
            } catch {}
          }
        } else {
          document.querySelector('[aria-invalid="true"]')?.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "center",
          });
        }
      } else if (hasRoleErrors) {
        const contactError = document.querySelector(
          '[data-contact-error="true"]',
        );
        const roleError = document.querySelector('[data-role-error="true"]');
        const target = contactError || roleError;
        target?.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "center",
        });
      }
    };

    setTimeout(scrollToElement, 100);
  }, [detailErrors, roleErrors, state]);

  useEffect(() => {
    if (prevStateRef.current !== state) {
      hasScrolledRef.current = false;
      prevErrorsRef.current = { errorkey: "{}" };
    }
    prevStateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.success && fetcher.data.redirectTo) {
        toast.success("Volunteer opportunity updated successfully");
        navigate(fetcher.data.redirectTo);
      } else if (fetcher.data.error) {
        toast.error(fetcher.data.error);
      }
    }
  }, [fetcher.state, fetcher.data, navigate]);

  const updateField = <K extends keyof FormDataVolunteerInput>(
    field: K,
    value: FormDataVolunteerInput[K],
  ) => {
    setFormData((prev) => {
      if (field === "roles") {
        const newRoles = value as FormDataVolunteerInput["roles"];
        const mergedRoles = newRoles.map((role, i) => {
          const existingId = (role as Record<string, unknown>).id;
          if (existingId) return role;
          const prevRole = prev.roles[i] as Record<string, unknown> | undefined;
          return {
            ...role,
            id: prevRole?.id ?? "",
          } as FormDataVolunteerInput["roles"][number];
        });
        return { ...prev, roles: mergedRoles };
      }
      return { ...prev, [field]: value };
    });
    setDetailErrors((prev) => {
      const next = { ...prev };
      if (field === "benefits") delete next.benefitErrors;
      if (field === "startDate" || field === "endDate") delete next.dateRange;
      if (field in next) delete next[field as keyof VolunteerPostPage1Errors];
      return next;
    });
    setRoleErrors((prev) => {
      const next = { ...prev };
      if (field === "roles") delete next.roleErrors;
      if (field === "contact") delete next.contact;
      return next;
    });
  };

  const setState = (nextState: ProgressState) => {
    const nextParams = new URLSearchParams(searchParams);

    if (nextState === ProgressState.ROLE) {
      nextParams.set("state", "role");
    } else {
      nextParams.delete("state");
    }

    setSearchParams(nextParams, {
      replace: true,
      preventScrollReset: true,
    });
  };

  const handleSubmit = () => {
    const detailErrors = validateDetailStep(formData);
    if (Object.keys(detailErrors).length > 0) {
      setDetailErrors(detailErrors);
      setState(ProgressState.DETAIL);
      return false;
    }

    if (formData.roles.length === 0) {
      setRoleErrors({
        roleErrors: [{ title: "At least one role is required." }],
      });
      return false;
    }

    const errors = validateRoleStep(formData);
    if (Object.keys(errors).length > 0) {
      setRoleErrors(errors);
      return false;
    }

    setRoleErrors({});

    const submitFormData = new FormData();
    submitFormData.append("actionType", "update-volunteer");

    const coverImageValue = formData.coverImageKey?.file
      ? formData.coverImageKey.value
      : originalCoverImageKey;
    const dataToSubmit = {
      ...formData,
      coverImageKey: coverImageValue,
    };

    submitFormData.append("data", JSON.stringify(dataToSubmit));

    if (formData.coverImageKey?.file) {
      submitFormData.append("file", formData.coverImageKey.file);
    }

    fetcher.submit(submitFormData, {
      method: "post",
      encType: "multipart/form-data",
    });
    return true;
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 sm:py-10 lg:px-20">
        <section className="mx-auto w-full max-w-3xl">
          <PageHeader
            title="Edit Volunteer Opportunity"
            subtitle="Update your volunteer opportunity details."
            backTo={`/volunteer/detail/${volunteer?.id}`}
          />

          <motion.div className="my-10">
            <ProgressIndicator currentState={state} onStateChange={setState} />
          </motion.div>

          <FormContainer
            currentState={state}
            stateKey={ProgressState.ROLE}
            animationDelay={0}
          >
            <VolunteerPostPage2
              formData={formData}
              errors={roleErrors}
              onUpdateField={updateField}
              onBackToDetails={() => setState(ProgressState.DETAIL)}
              onSubmit={handleSubmit}
              isSubmitting={fetcher.state === "submitting"}
            />
          </FormContainer>

          <FormContainer
            currentState={state}
            stateKey={ProgressState.DETAIL}
            animationDelay={0.05}
          >
            <VolunteerPostPage1
              formData={formData}
              errors={detailErrors}
              setDetailErrors={setDetailErrors}
              onUpdateField={updateField}
              onCoverImageSelect={(file) => {
                coverImageFileRef.current = file;
              }}
              onCoverImageClear={() => {
                coverImageFileRef.current = null;
              }}
              onContinueToRole={() => {
                const errors = validateDetailStep(formData, "continue");
                if (Object.keys(errors).length > 0) {
                  setDetailErrors(errors);
                  return;
                }
                setDetailErrors({});
                setState(ProgressState.ROLE);
              }}
              locations={locations?.locations ?? []}
              categories={
                categories?.categories.map((v) => ({
                  id: v.id,
                  name: v.name || "",
                })) ?? []
              }
            />
          </FormContainer>
        </section>
      </main>
    </div>
  );
}
