import { type ChangeEvent, useEffect, useRef, useState } from "react";
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router";
import { toast } from "sonner";
import { accountSettingsLoader } from "../services/account-settings.loader";
import { accountSettingsAction } from "../services/account-settings.action";
import { AccountSettingsProfileCard } from "../components/account-settings-profile-card";
import { AccountSettingsForms } from "../components/account-settings-forms";

export const loader = accountSettingsLoader;
export const action = accountSettingsAction;

export function meta() {
  return [{ title: "Account Settings | True Khmer Admin" }];
}

function getInitials(firstName: string | null, lastName: string | null) {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "A";
}

export default function AccountSettingsRoute() {
  const { admin } = useLoaderData<typeof accountSettingsLoader>();
  const actionData = useActionData<typeof accountSettingsAction>();
  const navigation = useNavigation();
  const navigate = useNavigate();

  const isSubmitting = navigation.state === "submitting";
  const submitIntent = navigation.formData?.get("intent");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarObjectUrlRef = useRef<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    undefined,
  );
  const [passwordChangeCount, setPasswordChangeCount] = useState(0);

  const handleChangeAvatar = () => fileInputRef.current?.click();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0] ?? null;
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    if (avatarObjectUrlRef.current) {
      URL.revokeObjectURL(avatarObjectUrlRef.current);
    }
    const objectUrl = URL.createObjectURL(file);
    avatarObjectUrlRef.current = objectUrl;
    setAvatarPreview(objectUrl);
  };

  useEffect(() => {
    return () => {
      if (avatarObjectUrlRef.current)
        URL.revokeObjectURL(avatarObjectUrlRef.current);
    };
  }, []);

  useEffect(() => {
    if (!actionData) return;
    if (actionData.ok) {
      toast.success(actionData.message);
      if (actionData.intent === "update-profile") {
        navigate("/tk-admin");
      } else if (actionData.intent === "change-password") {
        setPasswordChangeCount((n) => n + 1);
      }
    } else {
      toast.error(actionData.message);
    }
  }, [actionData, navigate]);

  const profileFieldErrors =
    actionData?.ok === false && actionData.intent === "update-profile"
      ? actionData.fieldErrors
      : undefined;
  const passwordFieldErrors =
    actionData?.ok === false && actionData.intent === "change-password"
      ? actionData.fieldErrors
      : undefined;

  const initials = getInitials(admin.firstName, admin.lastName);
  const fullName =
    `${admin.firstName ?? ""} ${admin.lastName ?? ""}`.trim() || "Admin";

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          Account Settings
        </h1>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
          Manage your profile and security settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AccountSettingsProfileCard
            admin={admin}
            role={admin.role ?? "-"}
            initials={initials}
            fullName={fullName}
            avatarPreview={avatarPreview}
            onChangeAvatar={handleChangeAvatar}
          />
        </div>
        <div className="lg:col-span-2">
          <AccountSettingsForms
            admin={admin}
            isSubmitting={isSubmitting}
            submitIntent={submitIntent}
            fileInputRef={fileInputRef}
            onFileChange={handleFileChange}
            hasAvatarChange={avatarPreview !== undefined}
            passwordResetSignal={passwordChangeCount}
            profileFieldErrors={profileFieldErrors}
            passwordFieldErrors={passwordFieldErrors}
          />
        </div>
      </div>
    </div>
  );
}
