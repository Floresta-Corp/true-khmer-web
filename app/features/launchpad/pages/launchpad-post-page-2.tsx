import { useState } from "react";
import { Separator } from "~/components/ui/separator";
import LaunchpadOpenRoleCard from "../components/card/launchpad-openrole-card";
import LaunchpadProjectMaterialCard from "../components/card/launchpad-project-material-card";
import LaunchpadContactDetailCard from "../components/card/launchpad-contact-detail-card";
import { Button } from "~/components/ui/button";
import { useEffect } from "react";

type LaunchpadRoleInput = {
  name: string;
  capacity: number;
  description: string;
};

interface LaunchpadPostPage2Props {
  roles: LaunchpadRoleInput[];
  roleError?: string;
  materialDocuments: File[];
  materialDocumentError?: string;
  email: string;
  phoneNumber: string;
  telegramUsername: string;
  emailError?: string;
  phoneNumberError?: string;
  onRolesChange: (roles: LaunchpadRoleInput[]) => void;
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
  materialDocumentError,
  email,
  phoneNumber,
  telegramUsername,
  emailError,
  phoneNumberError,
  onRolesChange,
  onMaterialDocumentsChange,
  onEmailChange,
  onPhoneNumberChange,
  onTelegramUsernameChange,
  onBackToDetailClicked,
  onPublishedClicked,
  isSubmitting = false,
}: LaunchpadPostPage2Props) {
  const [draftRole, setDraftRole] = useState<LaunchpadRoleInput>({
    name: "",
    capacity: 1,
    description: "",
  });

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

    onRolesChange([
      ...roles,
      {
        name: draftRole.name.trim(),
        capacity: Number.isFinite(draftRole.capacity) ? draftRole.capacity : 1,
        description: draftRole.description,
      },
    ]);

    setDraftRole({
      name: "",
      capacity: 1,
      description: "",
    });
  };

  const handleRemoveRole = (index: number) => {
    onRolesChange(roles.filter((_, itemIndex) => itemIndex !== index));
  };

  const count = roles.length;

  return (
    <div className="space-y-8">
      <LaunchpadOpenRoleCard
        name={draftRole.name}
        capacity={draftRole.capacity}
        description={draftRole.description}
        roleError={roleError}
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
      />
      <div className="gap-2">
        <div className="pb-1">Roles added ({count})</div>
        {count === 0 ? (
          <div className="w-full p-6 bg-[#F8FAFC] rounded-xl">
            No roles added yet. Add at least one so collaborators know how to
            contribute.
          </div>
        ) : (
          <div className="space-y-2">
            {roles.map((role, index) => (
              <div
                key={`${role.name}-${index}`}
                className="w-full rounded-xl border border-[#E1E7EF] p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium">{role.name}</div>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => handleRemoveRole(index)}
                  >
                    Remove
                  </Button>
                </div>
                <div className="text-sm text-[#65758B]">
                  Capacity: {role.capacity}
                </div>
                {role.description ? (
                  <div className="text-sm text-[#65758B]">
                    {role.description}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
      <Separator />
      <LaunchpadProjectMaterialCard
        files={materialDocuments}
        error={materialDocumentError}
        onChange={onMaterialDocumentsChange}
      />
      <LaunchpadContactDetailCard
        email={email}
        phoneNumber={phoneNumber}
        telegramUsername={telegramUsername}
        emailError={emailError}
        phoneNumberError={phoneNumberError}
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
          disabled={isSubmitting}
          onClick={onPublishedClicked}
          className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white h-10 px-6"
        >
          {isSubmitting ? "Publishing..." : "Publish Project"}
        </Button>
      </div>
    </div>
  );
}
