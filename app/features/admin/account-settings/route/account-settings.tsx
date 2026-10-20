import { type ChangeEvent, useEffect, useRef, useState } from "react";
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router";
import { toast } from "sonner";
import { useImageDropPaste } from "~/hooks/use-image-drop-paste";
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

  const [avatarUrl, setAvatarUrl] = useState("");

  const selectAvatarFile = (file: File, fromInput: boolean) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    // The file travels with the native form submission, so a dropped or
    // pasted file has to be placed into the file input.
    if (!fromInput && fileInputRef.current) {
      const transfer = new DataTransfer();
      transfer.items.add(file);
      fileInputRef.current.files = transfer.files;
    }
    if (avatarObjectUrlRef.current) {
      URL.revokeObjectURL(avatarObjectUrlRef.current);
    }
    const objectUrl = URL.createObjectURL(file);
    avatarObjectUrlRef.current = objectUrl;
    setAvatarPreview(objectUrl);
    setAvatarUrl("");
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0] ?? null;
    if (file) selectAvatarFile(file, true);
  };

  // A pasted/dropped link is already hosted: it is submitted as `avatarUrl`
  // and saved directly, without the presign upload.
  const selectAvatarUrl = (url: string) => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (avatarObjectUrlRef.current) {
      URL.revokeObjectURL(avatarObjectUrlRef.current);
      avatarObjectUrlRef.current = null;
    }
    setAvatarPreview(url);
    setAvatarUrl(url);
  };

  const avatarDrop = useImageDropPaste<HTMLButtonElement>({
    onFiles: ([file]) => selectAvatarFile(file, false),
    onUrl: selectAvatarUrl,
  });

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
    <div className="max-w-full p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          Account Settings
        </h1>
        <p className="mt-1 text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
          Manage your profile and security settings
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <AccountSettingsProfileCard
            admin={admin}
            role={admin.role ?? "-"}
            initials={initials}
            fullName={fullName}
            avatarPreview={avatarPreview}
            onChangeAvatar={handleChangeAvatar}
            avatarDrop={avatarDrop}
          />
        </div>
        <div className="lg:col-span-2">
          <AccountSettingsForms
            admin={admin}
            isSubmitting={isSubmitting}
            submitIntent={submitIntent}
            fileInputRef={fileInputRef}
            onFileChange={handleFileChange}
            avatarUrl={avatarUrl}
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
