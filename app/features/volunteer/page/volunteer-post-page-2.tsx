import { useEffect, useRef, useState } from "react";
import { useNavigate, useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import RolesList from "./section/roles-list";
import OpenRolesForm from "./section/open-roles-form";
import ContactDetailsForm from "./section/contact-details-form";
import FormActions from "./section/form-actions";
import PublishOpportunitySuccessDialog from "../components/dialog/publish-opportunity-dialog";
import type { FormDataVolunteerInput } from "~/services/volunteer/types";

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

export type DraftRole = {
  title: string;
  capacity: number;
  responsibilities: string[];
  requirements: string[];
};

const emptyDraft: DraftRole = {
  title: "",
  capacity: 1,
  responsibilities: [""],
  requirements: [""],
};

const safeTrim = (value?: string | null) => (value ?? "").trim();

interface VolunteerPostPage2Props {
  formData: FormDataVolunteerInput;
  errors?: VolunteerPostPage2Errors;
  originalRoles?: DraftRole[];
  onUpdateField: <K extends keyof FormDataVolunteerInput>(
    field: K,
    value: FormDataVolunteerInput[K],
  ) => void;
  onBackToDetails: () => void;
  onSubmit: () => void | boolean | Promise<void> | Promise<boolean>;
  onResetRoles?: () => void;
  isSubmitting: boolean;
}

export default function VolunteerPostPage2({
  formData,
  errors,
  originalRoles,
  onUpdateField,
  onBackToDetails,
  onSubmit,
  onResetRoles,
  isSubmitting,
}: VolunteerPostPage2Props) {
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const [draftRole, setDraftRole] = useState<DraftRole>(emptyDraft);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const isBlankRole = (role: FormDataVolunteerInput["roles"][number]) =>
    !safeTrim(role.title) &&
    role.capacity === 1 &&
    role.responsibilities.length === 1 &&
    !safeTrim(role.responsibilities[0]) &&
    role.requirements.length === 1 &&
    !safeTrim(role.requirements[0]);

  useEffect(() => {
    if (fetcher.data?.success) {
      setIsPublishModalOpen(true);
    }
  }, [fetcher.data?.success]);

  useEffect(() => {
    if (editingIndex !== null && formRef.current) {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      formRef.current.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "center",
      });
    }
  }, [editingIndex]);

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

  const hasSavedRoles = formData.roles.some((role) => !isBlankRole(role));
  const currentRoleErrors = hasSavedRoles ? undefined : errors?.roleErrors?.[0];

  const updateContactField = (
    field: keyof FormDataVolunteerInput["contact"],
    value: string | null,
  ) => {
    onUpdateField("contact", { ...formData.contact, [field]: value } as any);
  };

  const handleDraftChange = <K extends keyof DraftRole>(
    field: K,
    value: DraftRole[K],
  ) => {
    setDraftRole((prev) => ({ ...prev, [field]: value }));
  };

  const handleRemovePoint = (
    field: "responsibilities" | "requirements",
    itemIndex: number,
  ) => {
    const nextValues = draftRole[field].filter(
      (_, index) => index !== itemIndex,
    );
    handleDraftChange(field, nextValues.length > 0 ? nextValues : [""]);
  };

  const handleAddRole = () => {
    if (editingIndex !== null) {
      const updatedRoles = formData.roles.map((role, i) => {
        if (i === editingIndex) {
          return {
            title: draftRole.title,

            capacity: draftRole.capacity,
            responsibilities: draftRole.responsibilities,
            requirements: draftRole.requirements,
          };
        }
        return role;
      });
      onUpdateField("roles", updatedRoles);
      setEditingIndex(null);
    } else {
      onUpdateField("roles", [...formData.roles, { ...draftRole }]);
    }
    setDraftRole(emptyDraft);
  };

  const handleEditRole = (index: number) => {
    const role = formData.roles[index];
    setDraftRole({
      title: role.title,

      capacity: role.capacity,
      responsibilities: role.responsibilities,
      requirements: role.requirements,
    });
    setEditingIndex(index);
  };

  const handleRemoveRole = (index: number) => {
    const nextRoles = formData.roles.filter((_, i) => i !== index);
    onUpdateField("roles", nextRoles);

    if (editingIndex === index) {
      setEditingIndex(null);
      setDraftRole(emptyDraft);
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setDraftRole(emptyDraft);
  };

  const [state, setState] = useState(true);
  const [input, setInput] = useState("");

  return (
    <div className="flex flex-col gap-8">
      <RolesList
        roles={formData.roles}
        editingIndex={editingIndex}
        onEditRole={handleEditRole}
        onRemoveRole={handleRemoveRole}
        originalRoles={originalRoles}
        onResetRoles={onResetRoles}
      />

      <div ref={formRef}>
        <OpenRolesForm
          draftRole={draftRole}
          editingIndex={editingIndex}
          errors={currentRoleErrors}
          hasSavedRoles={hasSavedRoles}
          onDraftChange={handleDraftChange}
          onAddRole={handleAddRole}
          onCancelEdit={handleCancelEdit}
          onRemovePoint={handleRemovePoint}
        />
      </div>

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
