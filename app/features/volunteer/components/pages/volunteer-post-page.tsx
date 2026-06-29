import { useEffect, useRef, useState } from "react";
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
} from "../../lib/volunteer-validation";
import {
  initialFormDataVolunteerInput,
  type FormDataVolunteerInput,
} from "~/features/volunteer/types/volunteer-types";
import type { loader } from "../../route/volunteer.create";
import type { VolunteerPostPage1Errors } from "./volunteer-post-page-1";
import type { VolunteerPostPage2Errors } from "./volunteer-post-page-2";

export default function VolunteerPostPage() {
  const { locations, categories } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const fetcher = useFetcher<{
    ok?: boolean;
    error?: string;
    data?: { redirectTo?: string };
  }>();
  const state =
    searchParams.get("state")?.toLowerCase() === "role"
      ? ProgressState.ROLE
      : ProgressState.DETAIL;

  const [formData, setFormData] = useState<FormDataVolunteerInput>(
    initialFormDataVolunteerInput,
  );
  const coverImageFileRef = useRef<File | null>(null);
  const [detailErrors, setDetailErrors] = useState<VolunteerPostPage1Errors>(
    {},
  );
  const [roleErrors, setRoleErrors] = useState<VolunteerPostPage2Errors>({});
  const hasScrolledRef = useRef(false);
  const prevStateRef = useRef(state);
  const prevErrorsRef = useRef<Record<string, unknown>>({});

  // Scroll to first error when validation fails
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

    // Only scroll if we just switched to DETAIL with detail errors, or role errors exist
    if (!hasDetailErrors && !hasRoleErrors) {
      hasScrolledRef.current = false;
      return;
    }

    // Don't scroll if we've already scrolled for these specific errors
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

  // Reset scroll flag when state changes
  useEffect(() => {
    if (prevStateRef.current !== state) {
      hasScrolledRef.current = false;
      prevErrorsRef.current = { errorkey: "{}" };
    }
    prevStateRef.current = state;
  }, [state]);

  // Handle fetcher response
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.ok && fetcher.data.data?.redirectTo) {
        toast.success("Volunteer opportunity published successfully");
        navigate(fetcher.data.data.redirectTo);
      } else if (!fetcher.data.ok && fetcher.data.error) {
        toast.error(fetcher.data.error);
      }
    }
  }, [fetcher.state, fetcher.data, navigate]);

  const updateField = <K extends keyof FormDataVolunteerInput>(
    field: K,
    value: FormDataVolunteerInput[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
    submitFormData.append("actionType", "create-volunteer");

    const coverImageValue = formData.coverImageKey?.value ?? null;
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
            title="Post a Volunteer Opportunity"
            subtitle="Tell volunteers what you need and why it matters."
            backTo="/volunteer"
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
