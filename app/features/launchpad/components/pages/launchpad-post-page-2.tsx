import { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "~/components/ui/separator";
import LaunchpadProjectMaterialCard from "../card/launchpad-project-material-card";
import LaunchpadContactDetailCard from "../card/launchpad-contact-detail-card";
import { Button } from "~/components/ui/button";
import { showUndoToast } from "~/components/notification-toast";
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
      setDraftErrors(null);
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
    setDraftErrors(null);
  };

  return (
    <div className="space-y-8">
      <RolesList
        roles={roles.map(toDraftRole)}
        originalRoles={originalRoles?.map(toDraftRole)}
        editingIndex={editingIndex}
        onResetRoles={onResetRoles ? handleResetRoles : undefined}
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
