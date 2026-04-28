import { useState } from "react";
import { motion } from "motion/react";
import { useSearchParams, useFetcher, useLoaderData } from "react-router";
import VolunteerPostPage1 from "./volunteer-post-page-1";
import VolunteerPostPage2 from "./volunteer-post-page-2";
import ProgressIndicator, { ProgressState } from "./section/progress-indicator";
import PageHeader from "./section/page-header";
import FormContainer from "./section/form-container";
import {
  validateDetailStep,
  validateRoleStep,
} from "../lib/volunteer-validation";
import type { VolunteerOpportunityInput } from "~/services/volunteer/volunteer-types";
import type { loader } from "../routes/volunteer.create";
import type { VolunteerPostPage1Errors } from "./volunteer-post-page-1";
import type { VolunteerPostPage2Errors } from "./volunteer-post-page-2";

const initialData: VolunteerOpportunityInput = {
  categoryId: "",
  locationId: "",
  title: "",
  overview: "",
  communityImpact: null,
  durationLabel: "",
  commitmentLabel: "",
  applicationDeadline: "",
  benefits: [""],
  contact: {
    email: "",
    telegramUsername: null,
    phone: null,
    websiteUrl: null,
  },
  roles: [
    {
      title: "",
      commitmentLabel: "",
      capacity: 1,
      responsibilities: [""],
      requirements: [""],
    },
  ],
  coverImageKey: "",
};

export default function VolunteerPostPage() {
  const { locations, categories, userId } = useLoaderData<typeof loader>();
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

  const [formData, setFormData] =
    useState<VolunteerOpportunityInput>(initialData);
  const [detailErrors, setDetailErrors] = useState<VolunteerPostPage1Errors>(
    {},
  );
  const [roleErrors, setRoleErrors] = useState<VolunteerPostPage2Errors>({});

  const updateField = <K extends keyof VolunteerOpportunityInput>(
    field: K,
    value: VolunteerOpportunityInput[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setDetailErrors((prev) => {
      const next = { ...prev };
      if (field === "benefits") delete next.benefitErrors;
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

  const handleSubmit = (): boolean => {
    // Validate page 1 data first
    const detailErrors = validateDetailStep(formData);
    if (Object.keys(detailErrors).length > 0) {
      setDetailErrors(detailErrors);
      setState(ProgressState.DETAIL); // Go back to page 1
      return false;
    }

    // Validate page 2 data
    const errors = validateRoleStep(formData);
    if (Object.keys(errors).length > 0) {
      setRoleErrors(errors);
      return false;
    }

    setRoleErrors({});
    fetcher.submit(
      { actionType: "create-volunteer", data: JSON.stringify(formData) },
      { method: "post" },
    );
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
              onContinueToRole={() => {
                const errors = validateDetailStep(formData);
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
