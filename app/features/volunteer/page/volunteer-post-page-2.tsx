import React, { useEffect, useState } from "react";
import { useNavigate, useFetcher } from "react-router";
import RolesList from "./section/roles-list";
import OpenRolesForm from "./section/open-roles-form";
import ContactDetailsForm from "./section/contact-details-form";
import FormActions from "./section/form-actions";
import PublishOpportunitySuccessDialog from "../components/dialog/publish-opportunity-dialog";
import type { VolunteerOpportunityInput } from "~/services/volunteer/volunteer-types";

export type VolunteerRoleErrors = {
  title?: string;
  commitmentLabel?: string;
  capacity?: string;
  responsibilityErrors?: string[];
  requirementErrors?: string[];
};

export type VolunteerPostPage2Errors = {
  roleErrors?: VolunteerRoleErrors[];
  contact?: {
    phone?: string;
    email?: string;
    telegramUsername?: string;
  };
};

interface VolunteerPostPage2Props {
  formData: VolunteerOpportunityInput;
  errors?: VolunteerPostPage2Errors;
  onUpdateField: <K extends keyof VolunteerOpportunityInput>(
    field: K,
    value: VolunteerOpportunityInput[K],
  ) => void;
  onBackToDetails: () => void;
  onSubmit: () => boolean;
  isSubmitting: boolean;
}

export default function VolunteerPostPage2({
  formData,
  errors,
  onUpdateField,
  onBackToDetails,
  onSubmit,
  isSubmitting,
}: VolunteerPostPage2Props) {
  // Show modal when submission is successful (from fetcher response)
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.data?.success) {
      setIsPublishModalOpen(true);
    }
  }, [fetcher.data?.success]);

  const [activeRoleIndex, setActiveRoleIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, []);

  const currentRole = formData.roles[activeRoleIndex];
  const currentRoleErrors = errors?.roleErrors?.[activeRoleIndex];

  const updateContactField = (
    field: keyof VolunteerOpportunityInput["contact"],
    value: string | null,
  ) => {
    onUpdateField("contact", { ...formData.contact, [field]: value });
  };

  const handleRoleChange = <
    K extends keyof VolunteerOpportunityInput["roles"][number],
  >(
    index: number,
    field: K,
    value: VolunteerOpportunityInput["roles"][number][K],
  ) => {
    const newRoles = [...formData.roles];
    newRoles[index] = { ...newRoles[index], [field]: value };
    onUpdateField("roles", newRoles);
  };

  const handleAddRole = () => {
    const nextRoles = [
      ...formData.roles,
      {
        title: "",
        commitmentLabel: "",
        capacity: 1,
        responsibilities: [""],
        requirements: [""],
      },
    ];

    onUpdateField("roles", nextRoles);
    setActiveRoleIndex(nextRoles.length - 1);
  };

  const handleRemovePoint = (
    field: "responsibilities" | "requirements",
    itemIndex: number,
  ) => {
    if (!currentRole) return;

    const nextValues = currentRole[field].filter(
      (_, index) => index !== itemIndex,
    );
    handleRoleChange(
      activeRoleIndex,
      field,
      nextValues.length > 0 ? nextValues : [""],
    );
  };

  const handleRemoveRole = (index: number) => {
    if (formData.roles.length <= 1) return;

    const nextRoles = formData.roles.filter((_, i) => i !== index);
    onUpdateField("roles", nextRoles);

    if (activeRoleIndex >= nextRoles.length) {
      setActiveRoleIndex(nextRoles.length - 1);
    } else if (activeRoleIndex > index) {
      setActiveRoleIndex(activeRoleIndex - 1);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <RolesList
        roles={formData.roles}
        activeRoleIndex={activeRoleIndex}
        onSelectRole={setActiveRoleIndex}
        onRemoveRole={handleRemoveRole}
      />

      <OpenRolesForm
        currentRole={currentRole}
        activeRoleIndex={activeRoleIndex}
        errors={currentRoleErrors}
        onRoleChange={handleRoleChange}
        onAddRole={handleAddRole}
        onRemovePoint={handleRemovePoint}
      />

      <ContactDetailsForm
        contact={formData.contact}
        errors={errors?.contact}
        onUpdateField={updateContactField}
      />

      <FormActions
        onBack={onBackToDetails}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />

      <PublishOpportunitySuccessDialog
        open={isPublishModalOpen}
        onOpenChange={setIsPublishModalOpen}
        onViewPost={() => navigate("/myposts")}
      />
    </div>
  );
}
