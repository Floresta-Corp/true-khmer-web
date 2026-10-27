import { useEffect, useRef, useState } from "react";
import { Separator } from "~/components/ui/separator";
import LaunchpadProjectMaterialCard from "../card/launchpad-project-material-card";
import LaunchpadContactDetailCard from "../card/launchpad-contact-detail-card";
import { Button } from "~/components/ui/button";
import {
  OpenRolesForm,
  RolesList,
} from "~/features/volunteer/components/pages/section";
import type {
  DraftRole,
  VolunteerRoleErrors,
} from "~/features/volunteer/components/pages/volunteer-post-page-2";
import { validateDraftRole } from "~/features/volunteer/lib/volunteer-validation";
import type { LaunchpadRoleInput } from "~/stores/launchpad-create-store";

interface ExistingDocument {
  name: string;
  url?: string;
}

// The role form is shared with Volunteer, which names the role "title".
const emptyDraft: DraftRole = {
  title: "",
  capacity: 1,
  responsibilities: [""],
  requirements: [""],
};

const toDraftRole = (role: LaunchpadRoleInput): DraftRole => ({
  title: role.name,
  capacity: role.capacity,
  responsibilities: role.responsibilities.length ? role.responsibilities : [""],
  requirements: role.requirements.length ? role.requirements : [""],
});

const trimPoints = (points: string[]) =>
  points.map((point) => point.trim()).filter(Boolean);

interface LaunchpadPostPage2Props {
  roles: LaunchpadRoleInput[];
  roleError?: string;
  materialDocuments: File[];
  existingMaterialDocuments?: ExistingDocument[];
  materialDocumentError?: string;
  email: string;
  phoneNumber: string;
  telegramUsername: string;
  emailError?: string;
  phoneNumberError?: string;
  telegramUsernameError?: string;
  originalRoles?: LaunchpadRoleInput[];
  onRolesChange: (roles: LaunchpadRoleInput[]) => void;
  onResetRoles?: () => void;
  onMaterialDocumentsChange: (files: File[]) => void;
  onEmailChange: (value: string) => void;
  onPhoneNumberChange: (value: string) => void;
  onTelegramUsernameChange: (value: string) => void;
  onBackToDetailClicked: () => void;
  onPublishedClicked: () => void;
  isSubmitting?: boolean;
}

export default function LaunchpadPostPage2({
  roles,
  roleError,
  materialDocuments,
  existingMaterialDocuments,
  materialDocumentError,
  email,
  phoneNumber,
  telegramUsername,
  emailError,
  phoneNumberError,
  telegramUsernameError,
  originalRoles,
  onRolesChange,
  onResetRoles,
  onMaterialDocumentsChange,
  onEmailChange,
  onPhoneNumberChange,
  onTelegramUsernameChange,
  onBackToDetailClicked,
  onPublishedClicked,
  isSubmitting = false,
}: LaunchpadPostPage2Props) {
  const [draftRole, setDraftRole] = useState<DraftRole>(emptyDraft);
  const [draftErrors, setDraftErrors] = useState<VolunteerRoleErrors | null>(
    null,
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

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

  const handleDraftChange = <K extends keyof DraftRole>(
    field: K,
    value: DraftRole[K],
  ) => {
    const next = { ...draftRole, [field]: value };
    setDraftRole(next);
    if (draftErrors !== null) {
      setDraftErrors(validateDraftRole(next));
    }
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
    const validationErrors = validateDraftRole(draftRole);
    if (validationErrors) {
      setDraftErrors(validationErrors);
      return;
    }
    setDraftErrors(null);

    const savedRole = {
      name: draftRole.title.trim(),
      capacity: draftRole.capacity,
      responsibilities: trimPoints(draftRole.responsibilities),
      requirements: trimPoints(draftRole.requirements),
    };

    if (editingIndex !== null) {
      onRolesChange(
        roles.map((role, i) =>
          i === editingIndex ? { ...role, ...savedRole } : role,
        ),
      );
      setEditingIndex(null);
    } else {
      onRolesChange([...roles, savedRole]);
    }

    setDraftRole(emptyDraft);
  };

  const handleEditRole = (index: number) => {
    setDraftRole(toDraftRole(roles[index]));
    setEditingIndex(index);
    setDraftErrors(null);
  };

  const handleRemoveRole = (index: number) => {
    onRolesChange(roles.filter((_, itemIndex) => itemIndex !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setDraftRole(emptyDraft);
      setDraftErrors(null);
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setDraftRole(emptyDraft);
    setDraftErrors(null);
  };

  return (
    <div className="space-y-8">
      <RolesList
        roles={roles.map(toDraftRole)}
        originalRoles={originalRoles?.map(toDraftRole)}
        editingIndex={editingIndex}
        onResetRoles={onResetRoles}
        onRemoveRole={handleRemoveRole}
        onEditRole={handleEditRole}
      />
      <div ref={formRef}>
        <OpenRolesForm
          draftRole={draftRole}
          editingIndex={editingIndex}
          errors={draftErrors ?? undefined}
          hasSavedRoles={roles.length > 0}
          onDraftChange={handleDraftChange}
          onAddRole={handleAddRole}
          onCancelEdit={handleCancelEdit}
          onRemovePoint={handleRemovePoint}
        />
        {roleError ? (
          <p className="mt-2 text-xs text-red-500">{roleError}</p>
        ) : null}
      </div>
      <Separator />
      <LaunchpadProjectMaterialCard
        files={materialDocuments}
        existingDocuments={existingMaterialDocuments}
        error={materialDocumentError}
        onChange={onMaterialDocumentsChange}
      />
      <LaunchpadContactDetailCard
        email={email}
        phoneNumber={phoneNumber}
        telegramUsername={telegramUsername}
        emailError={emailError}
        phoneNumberError={phoneNumberError}
        telegramUsernameError={telegramUsernameError}
        onEmailChange={onEmailChange}
        onPhoneNumberChange={onPhoneNumberChange}
        onTelegramUsernameChange={onTelegramUsernameChange}
      />
      <Separator />
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          className="h-10 cursor-pointer px-6"
          onClick={onBackToDetailClicked}
        >
          Cancel
        </Button>
        <Button
          disabled={
            isSubmitting ||
            roles.length === 0 ||
            email.trim() === "" ||
            phoneNumber.trim() === ""
          }
          onClick={onPublishedClicked}
          className="h-10 cursor-pointer bg-blue-500 px-6 text-white hover:bg-blue-600"
        >
          {isSubmitting ? "Publishing..." : "Publish Project"}
        </Button>
      </div>
    </div>
  );
}
