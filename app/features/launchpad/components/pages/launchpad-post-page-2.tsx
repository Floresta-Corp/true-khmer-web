import { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "~/components/ui/separator";
import LaunchpadOpenRoleCard from "../card/launchpad-openrole-card";
import LaunchpadProjectMaterialCard from "../card/launchpad-project-material-card";
import LaunchpadContactDetailCard from "../card/launchpad-contact-detail-card";
import LaunchpadRolesList from "../launchpad-roles-list";
import { Button } from "~/components/ui/button";
import { showUndoToast } from "~/components/notification-toast";

type LaunchpadRoleInput = {
  // Set for roles already saved on an existing launchpad; the API matches on it.
  id?: string;
  name: string;
  capacity: number;
  description: string;
};

interface ExistingDocument {
  name: string;
  url?: string;
}

type RemovedRole = {
  role: LaunchpadRoleInput;
  // Index in the current list the role goes back to. Kept up to date as other
  // roles are removed or restored, so it does not go stale.
  gap: number;
  toastId?: string | number;
};

// Empties the list in place, so undo handlers already holding it see nothing
// left to restore, and closes the toasts that offered the undo.
const withdrawRemovals = (pending: RemovedRole[]) => {
  pending.splice(0).forEach(({ toastId }) => toast.dismiss(toastId));
};

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
              ...role,
              name: draftRole.name.trim(),
              capacity: Number.isFinite(draftRole.capacity)
                ? draftRole.capacity
                : 1,
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
          capacity: Number.isFinite(draftRole.capacity)
            ? draftRole.capacity
            : 1,
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

  // The undo toast outlives this render, so it reads the latest roles from a
  // ref instead of restoring a stale snapshot that would drop later edits.
  const rolesRef = useRef(roles);
  useEffect(() => {
    rolesRef.current = roles;
  }, [roles]);

  // Removals that can still be undone, in list order. Several can share a gap
  // (e.g. two neighbours removed in turn); their order here breaks the tie.
  const pendingRemovalsRef = useRef<RemovedRole[]>([]);

  // Undo writes back through this step's roles, so it ends when the step
  // unmounts (an undo then would restore an out-of-date list) ...
  useEffect(() => {
    const pending = pendingRemovalsRef.current;
    return () => withdrawRemovals(pending);
  }, []);

  // ... or when publishing starts: the request has already captured the roles,
  // so a role restored now would show in the form but not be saved.
  useEffect(() => {
    if (isSubmitting) {
      withdrawRemovals(pendingRemovalsRef.current);
    }
  }, [isSubmitting]);

  const handleUndoRemoveRole = (removed: RemovedRole) => {
    const pending = pendingRemovalsRef.current;
    const at = pending.indexOf(removed);
    // Withdrawn by Reset roles, a step change or publishing.
    if (at === -1) {
      return;
    }
    pending.splice(at, 1);
    // Everything queued after this role now sits after it in the list.
    pending.slice(at).forEach((other) => {
      other.gap += 1;
    });

    const current = rolesRef.current;
    const insertAt = Math.min(removed.gap, current.length);
    onRolesChange([
      ...current.slice(0, insertAt),
      removed.role,
      ...current.slice(insertAt),
    ]);
    setEditingIndex((prev) =>
      prev !== null && prev >= insertAt ? prev + 1 : prev,
    );
  };

  const handleRemoveRole = (index: number) => {
    const removedRole = roles[index];
    onRolesChange(roles.filter((_, itemIndex) => itemIndex !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setDraftRole(emptyDraft);
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }

    // Removals queued before this role keep their gap; those after it move
    // into this role's gap, behind it.
    const pending = pendingRemovalsRef.current;
    const at = pending.findIndex((other) => other.gap > index);
    const insertAt = at === -1 ? pending.length : at;
    pending.slice(insertAt).forEach((other) => {
      other.gap -= 1;
    });
    const removed: RemovedRole = { role: removedRole, gap: index };
    pending.splice(insertAt, 0, removed);

    removed.toastId = showUndoToast({
      icon: <Trash2 className="size-4.5" />,
      title: "Role removed",
      body: removedRole.name,
      onUndo: () => handleUndoRemoveRole(removed),
    });
  };

  const handleResetRoles = () => {
    // Reset has already brought the removed original roles back.
    withdrawRemovals(pendingRemovalsRef.current);
    onResetRoles?.();
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
        onResetRoles={onResetRoles ? handleResetRoles : undefined}
        onRemoveRole={handleRemoveRole}
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
