import { useState } from "react";
import { useEffect } from "react";
import { Separator } from "~/components/ui/separator";
import LaunchpadOpenRoleCard from "../card/launchpad-openrole-card";
import LaunchpadProjectMaterialCard from "../card/launchpad-project-material-card";
import LaunchpadContactDetailCard from "../card/launchpad-contact-detail-card";
import LaunchpadRolesList from "../launchpad-roles-list";
import { Button } from "~/components/ui/button";

type LaunchpadRoleInput = {
  name: string;
  capacity: number;
  description: string;
};

interface ExistingDocument {
  name: string;
  url?: string;
}

const emptyDraft: LaunchpadRoleInput = {
  name: "",
  capacity: 1,
  description: "",
};

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
  const [draftRole, setDraftRole] = useState<LaunchpadRoleInput>(emptyDraft);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

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

  const handleAddRole = () => {
    if (!draftRole.name.trim()) {
      return;
    }

    if (editingIndex !== null) {
      const updatedRoles = roles.map((role, i) =>
        i === editingIndex
          ? {
              name: draftRole.name.trim(),
              capacity: Number.isFinite(draftRole.capacity) ? draftRole.capacity : 1,
              description: draftRole.description,
            }
          : role,
      );
      onRolesChange(updatedRoles);
      setEditingIndex(null);
    } else {
      onRolesChange([
        ...roles,
        {
          name: draftRole.name.trim(),
          capacity: Number.isFinite(draftRole.capacity) ? draftRole.capacity : 1,
          description: draftRole.description,
        },
      ]);
    }

    setDraftRole(emptyDraft);
  };

  const handleEditRole = (index: number) => {
    const role = roles[index];
    setDraftRole({
      name: role.name,
      capacity: role.capacity,
      description: role.description,
    });
    setEditingIndex(index);
  };

  const handleRemoveRole = (index: number) => {
    onRolesChange(roles.filter((_, itemIndex) => itemIndex !== index));
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

  return (
    <div className="space-y-8">
      <LaunchpadRolesList
        roles={roles}
        originalRoles={originalRoles}
        editingIndex={editingIndex}
        onResetRoles={onResetRoles}
        onRolesChange={onRolesChange}
        onEditRole={handleEditRole}
      />
      <LaunchpadOpenRoleCard
        name={draftRole.name}
        capacity={draftRole.capacity}
        description={draftRole.description}
        roleError={roleError}
        editingIndex={editingIndex}
        onNameChange={(value) =>
          setDraftRole((prev) => ({
            ...prev,
            name: value,
          }))
        }
        onCapacityChange={(value) =>
          setDraftRole((prev) => ({
            ...prev,
            capacity: Number.isFinite(value) && value > 0 ? value : 1,
          }))
        }
        onDescriptionChange={(value) =>
          setDraftRole((prev) => ({
            ...prev,
            description: value,
          }))
        }
        onAddRole={handleAddRole}
        onCancelEdit={handleCancelEdit}
      />
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
          className="h-10 px-6 cursor-pointer"
          onClick={onBackToDetailClicked}
        >
          Cancel
        </Button>
        <Button
          disabled={isSubmitting || roles.length === 0 || email.trim() === "" || phoneNumber.trim() === ""}
          onClick={onPublishedClicked}
          className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white h-10 px-6"
        >
          {isSubmitting ? "Publishing..." : "Publish Project"}
        </Button>
      </div>
    </div>
  );
}
