import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useLoaderData, useNavigate, useFetcher, Form } from "react-router";
import { toast } from "sonner";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Image,
  Trash2,
  MapPin,
  Calendar,
  Phone,
  Globe,
  Linkedin,
  Twitter,
  Facebook,
  User,
  Briefcase,
  Send,
  X,
  Eye,
  Info,
  Link2,
  Wrench,
  RotateCcw,
} from "lucide-react";
import { motion } from "motion/react";
import BackToButton from "~/components/back-to-button";
import EditProfileCertificatesCard from "~/features/myspace/components/edit-profile-certificates-card";
import VisibilitySettingCard, {
  VISIBILITY_OPTIONS,
  type VisibilityOption,
} from "~/features/myspace/components/visibility-setting-card";
import {
  BIO_MAX_LENGTH,
  EDIT_PROFILE_FIELD_LABELS,
  editProfileSchema,
  getChangedFields,
  pickFields,
  SKILL_MAX_LENGTH,
  SKILLS_MAX_COUNT,
  type EditProfileField,
  type EditProfileFormData,
} from "~/features/myspace/lib/edit-profile-schema";
import { useEditProfileDraftStore } from "~/features/myspace/store/edit-profile-draft.store";
import { phoneCountryOptions } from "~/components/form/phone-country-options";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { SingleSelectDropdown } from "~/components/ui/single-select-dropdown";
import { Spinner } from "~/components/ui/spinner";
import { cn, resolveImageURL } from "~/lib/utils";
import { useImageDropPaste } from "~/hooks/use-image-drop-paste";
import { editProfileLoader } from "../services/edit-profile.loader";
import { editProfileAction } from "../services/edit-profile.action";
import type { SearchSkillsResponse } from "~/types/api-client";

export const loader = editProfileLoader;
export const action = editProfileAction;

// The page paints focused inputs blue, which would otherwise win over the red
// `aria-invalid` border while an invalid field has focus.
const INVALID_FOCUS_CLASS =
  "aria-invalid:focus-visible:border-destructive aria-invalid:focus-visible:ring-destructive/20";
const INVALID_GROUP_FOCUS_CLASS =
  "has-[[data-slot][aria-invalid=true]:focus-visible]:border-destructive has-[[data-slot][aria-invalid=true]:focus-visible]:ring-destructive/20";

// Page order, so a failed submit lands on the first problem a reader would
// meet. Controlled fields point at their trigger rather than a registered
// input, which react-hook-form cannot focus by itself.
const FIELD_FOCUS_TARGETS: [EditProfileField, string][] = [
  ["firstName", "firstName"],
  ["lastName", "lastName"],
  ["occupation", "occupation"],
  ["gender", "gender-trigger"],
  ["dateOfBirth", "dateOfBirth"],
  ["bio", "bio"],
  ["skills", "newSkill"],
  ["website", "website"],
  ["linkedin", "linkedin"],
  ["twitter", "twitter"],
  ["facebook", "facebook"],
  ["telegramUsername", "telegramUsername"],
  ["phoneNationalNumber", "phoneNationalNumber"],
];

const errorId = (field: EditProfileField) => `${field}-error`;

type VisibilityField =
  | "profileVisibility"
  | "contactVisibility"
  | "socialLinksVisibility"
  | "contributionsVisibility";

function toVisibility(value: string | null | undefined): VisibilityOption {
  return (VISIBILITY_OPTIONS as readonly string[]).includes(value ?? "")
    ? (value as VisibilityOption)
    : "public";
}

type SkillSearchFetcherData =
  | (SearchSkillsResponse & { search: string })
  | {
      ok: false;
      search: string;
      message: string;
      skills: [];
    };

export function meta() {
  return [
    { title: "Edit Profile - True Khmer" },
    { name: "description", content: "Update your profile information" },
  ];
}

export default function EditProfile() {
  const { me, userId, countries, cities, certificates, certificateOptions } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const skillSearchFetcher = useFetcher<SkillSearchFetcherData>();
  const wasSubmitting = useRef(false);
  const saveDraft = useEditProfileDraftStore((state) => state.saveDraft);
  const clearDraft = useEditProfileDraftStore((state) => state.clearDraft);

  useEffect(() => {
    if (fetcher.state === "submitting") {
      wasSubmitting.current = true;
    }

    if (wasSubmitting.current && fetcher.state === "idle" && fetcher.data) {
      wasSubmitting.current = false;
      const result = fetcher.data;

      if (result?.ok) {
        clearDraft();
        toast.success("Profile updated successfully!");
        navigate("/myspace");
      } else {
        toast.error(result?.message ?? "Failed to update profile.");
      }
    }
  }, [fetcher.state, fetcher.data]);

  // The saved profile, which every change is measured against. Changing the
  // country revalidates the loader, so this is memoised on `me` rather than
  // rebuilt on every render.
  const defaultValues = useMemo<EditProfileFormData>(
    () => ({
      firstName: me?.user.firstName || "",
      lastName: me?.user.lastName || "",
      gender: me?.user.gender || "",
      dateOfBirth: me?.user.dateOfBirth || "",
      occupation: me?.user.occupation || "",
      phoneCountry: me?.user.phone?.country || "KH",
      phoneNationalNumber: me?.user.phone?.nationalNumber || "",
      telegramUsername: me?.user.telegramUsername || "",
      bio: me?.profile.bio || "",
      countryId: me?.profile.country?.id || "",
      cityId: me?.profile.city?.id || "",
      avatarKey: me?.profile.avatarKey || "",
      skills: me?.skills.map((s) => s.name) || [],
      website: me?.socialLinks.website || "",
      linkedin: me?.socialLinks.linkedin || "",
      twitter: me?.socialLinks.twitter || "",
      facebook: me?.socialLinks.facebook || "",
      profileVisibility: toVisibility(me?.profile.visibility?.profile),
      contactVisibility: toVisibility(me?.profile.visibility?.contact),
      socialLinksVisibility: toVisibility(me?.profile.visibility?.socialLinks),
      contributionsVisibility: toVisibility(
        me?.profile.visibility?.contributions,
      ),
    }),
    [me],
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    mode: "onTouched",
    defaultValues,
    // Handled in onInvalid so controlled fields get focus too.
    shouldFocusError: false,
  });

  // Ties an input to its message: the red state comes from `aria-invalid`
  // styling in the UI primitives, and screen readers read the linked message.
  const invalidProps = (field: EditProfileField) => ({
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? errorId(field) : undefined,
  });

  const [changedFields, setChangedFields] = useState<EditProfileField[]>([]);
  const defaultValuesRef = useRef(defaultValues);
  defaultValuesRef.current = defaultValues;

  // Restore the persisted draft after mount rather than during render: the
  // server renders the saved profile, so reading sessionStorage any earlier
  // would mismatch on hydration.
  const hasRestoredDraft = useRef(false);
  useEffect(() => {
    if (hasRestoredDraft.current) return;
    hasRestoredDraft.current = true;

    const { draft } = useEditProfileDraftStore.getState();
    if (!draft) return;

    // Another account on the same tab must never see this one's edits.
    if (!userId || draft.userId !== userId) {
      clearDraft();
      return;
    }

    const restored = { ...defaultValues, ...draft.changes };
    const changed = getChangedFields(restored, defaultValues);
    if (changed.length === 0) {
      clearDraft();
      return;
    }

    // keepDefaultValues leaves the saved profile as the dirty baseline, so the
    // restored edits still count as unsaved.
    reset(restored, { keepDefaultValues: true });
    setChangedFields(changed);

    if (restored.avatarKey !== defaultValues.avatarKey) {
      setAvatarPreview(resolveImageURL(restored.avatarKey || undefined));
    }

    // Cities are loaded per country, so a restored country needs its list.
    if (restored.countryId && restored.countryId !== defaultValues.countryId) {
      navigate(`?countryId=${restored.countryId}`, {
        replace: true,
        preventScrollReset: true,
      });
    }

    toast.info("Restored your unsaved profile changes.");
  }, [defaultValues, userId, reset, clearDraft, navigate]);

  // Mirror only the changed fields into the store, and drop the draft once the
  // form is back to the saved profile.
  useEffect(() => {
    const subscription = watch((values) => {
      const baseline = defaultValuesRef.current;
      const changed = getChangedFields(
        values as Partial<EditProfileFormData>,
        baseline,
      );
      setChangedFields(changed);

      if (!userId || changed.length === 0) {
        clearDraft();
        return;
      }

      saveDraft({
        userId,
        changes: pickFields(values as Partial<EditProfileFormData>, changed),
      });
    });

    return () => subscription.unsubscribe();
  }, [watch, userId, saveDraft, clearDraft]);

  const skills = watch("skills");
  const bio = watch("bio");
  const countryId = watch("countryId");
  const cityId = watch("cityId");
  const gender = watch("gender");
  const phoneCountry = watch("phoneCountry");
  const selectedPhoneCountry =
    phoneCountryOptions.find((option) => option.country === phoneCountry) ??
    ({
      country: "KH",
      dialCode: "+855",
      countryName: "Cambodia",
      label: "Cambodia +855",
    } satisfies (typeof phoneCountryOptions)[number]);
  const [newSkill, setNewSkill] = useState("");
  const [isSkillSuggestionsOpen, setIsSkillSuggestionsOpen] = useState(false);
  const [activeSkillSuggestionIndex, setActiveSkillSuggestionIndex] =
    useState(-1);
  const skillBlurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const skillSearchQuery = newSkill.trim();
  const skillSuggestions =
    skillSearchFetcher.data?.ok &&
    skillSearchFetcher.data.search === skillSearchQuery
      ? skillSearchFetcher.data.skills.filter(
          (skill) =>
            !skills.some(
              (selectedSkill) =>
                selectedSkill.toLowerCase() === skill.name.toLowerCase(),
            ),
        )
      : [];
  const isSearchingSkills =
    skillSearchFetcher.state === "loading" && skillSearchQuery.length >= 2;

  const initialAvatarPreview = resolveImageURL(
    me?.profile.avatarKey || undefined,
  );
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    initialAvatarPreview,
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const avatarObjectUrlRef = useRef<string | null>(null);

  const selectAvatarFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    // Revoke previous object URL
    if (avatarObjectUrlRef.current) {
      URL.revokeObjectURL(avatarObjectUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(file);
    avatarObjectUrlRef.current = objectUrl;
    setAvatarPreview(objectUrl);
    setAvatarFile(file);
  };

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0] ?? null;
    if (file) selectAvatarFile(file);
  };

  // A pasted/dropped link is already hosted: save it as the avatar key
  // directly and skip the presign upload on submit.
  const selectAvatarUrl = (url: string) => {
    if (avatarObjectUrlRef.current) {
      URL.revokeObjectURL(avatarObjectUrlRef.current);
      avatarObjectUrlRef.current = null;
    }
    setAvatarPreview(url);
    setAvatarFile(null);
    setValue("avatarKey", url);
  };

  const avatarDrop = useImageDropPaste<HTMLDivElement>({
    onFiles: ([file]) => selectAvatarFile(file),
    onUrl: selectAvatarUrl,
  });

  const handleDeleteAvatar = () => {
    if (avatarObjectUrlRef.current) {
      URL.revokeObjectURL(avatarObjectUrlRef.current);
      avatarObjectUrlRef.current = null;
    }
    setAvatarPreview(undefined);
    setAvatarFile(null);
    setValue("avatarKey", "", { shouldDirty: true });

    const input = document.getElementById(
      "avatarUploadInput",
    ) as HTMLInputElement;
    if (input) {
      input.value = "";
    }
  };

  useEffect(() => {
    return () => {
      if (avatarObjectUrlRef.current) {
        URL.revokeObjectURL(avatarObjectUrlRef.current);
      }
      if (skillBlurTimeoutRef.current) {
        clearTimeout(skillBlurTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (skillSearchQuery.length < 2) {
      setIsSkillSuggestionsOpen(false);
      return;
    }

    const timeout = setTimeout(() => {
      const params = new URLSearchParams({
        search: skillSearchQuery,
        limit: "8",
      });

      skillSearchFetcher.load(`/api/myspace/skills/search?${params}`);
      setIsSkillSuggestionsOpen(true);
    }, 180);

    return () => clearTimeout(timeout);
  }, [skillSearchQuery, skillSearchFetcher.load]);

  useEffect(() => {
    setActiveSkillSuggestionIndex(skillSuggestions.length > 0 ? 0 : -1);
  }, [skillSuggestions.length]);

  const handleAddSkill = (skillName = newSkill) => {
    const nextSkill = skillName.trim();
    if (!nextSkill) return;

    // Reject up front instead of adding a chip that is already invalid.
    if (nextSkill.length > SKILL_MAX_LENGTH) {
      setError("skills", {
        type: "manual",
        message: `Each skill must be ${SKILL_MAX_LENGTH} characters or fewer`,
      });
      return;
    }

    if (
      skills.some((skill) => skill.toLowerCase() === nextSkill.toLowerCase())
    ) {
      setError("skills", {
        type: "manual",
        message: `"${nextSkill}" is already in your skills`,
      });
      return;
    }

    if (skills.length >= SKILLS_MAX_COUNT) {
      setError("skills", {
        type: "manual",
        message: `You can add up to ${SKILLS_MAX_COUNT} skills`,
      });
      return;
    }

    setValue("skills", [...skills, nextSkill], {
      shouldValidate: true,
      shouldDirty: true,
    });
    setNewSkill("");
    setIsSkillSuggestionsOpen(false);
  };

  const handleRemoveSkill = (skill: string) => {
    setValue(
      "skills",
      skills.filter((s) => s !== skill),
      { shouldValidate: true, shouldDirty: true },
    );
  };

  const changedLabels = Array.from(
    new Set([
      ...(avatarFile ? [EDIT_PROFILE_FIELD_LABELS.avatarKey] : []),
      ...changedFields.map((field) => EDIT_PROFILE_FIELD_LABELS[field]),
    ]),
  );
  const hasChanges = changedLabels.length > 0;
  // The array itself (too many skills) or any one item (too long) can fail.
  const skillsError =
    errors.skills?.message ??
    (Array.isArray(errors.skills)
      ? errors.skills.find((error) => error?.message)?.message
      : undefined);

  const handleDiscardChanges = useCallback(() => {
    if (avatarObjectUrlRef.current) {
      URL.revokeObjectURL(avatarObjectUrlRef.current);
      avatarObjectUrlRef.current = null;
    }
    const input = document.getElementById(
      "avatarUploadInput",
    ) as HTMLInputElement | null;
    if (input) input.value = "";

    const discardedCountry = watch("countryId");
    reset(defaultValues);
    setAvatarFile(null);
    setAvatarPreview(initialAvatarPreview);
    setChangedFields([]);
    clearDraft();

    // Reload the saved country's cities if a different country was picked.
    if (discardedCountry !== defaultValues.countryId) {
      navigate(".", { replace: true, preventScrollReset: true });
    }
  }, [watch, reset, defaultValues, initialAvatarPreview, clearDraft, navigate]);

  const onInvalid = (formErrors: FieldErrors<EditProfileFormData>) => {
    const target = FIELD_FOCUS_TARGETS.find(([field]) => formErrors[field]);
    if (target) {
      const element = document.getElementById(target[1]);
      element?.focus({ preventScroll: true });
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const onSubmit = (data: EditProfileFormData) => {
    const formData = new FormData();
    formData.append("actionType", "edit-profile");
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("gender", data.gender);
    formData.append("dateOfBirth", data.dateOfBirth || "");
    formData.append("occupation", data.occupation || "");
    const initialPhoneCountry = me?.user.phone?.country || "KH";
    const initialPhoneNationalNumber = me?.user.phone?.nationalNumber || "";
    const nextPhoneCountry = data.phoneCountry || "KH";
    const nextPhoneNationalNumber = data.phoneNationalNumber?.trim() || "";
    const phoneChanged =
      nextPhoneCountry !== initialPhoneCountry ||
      nextPhoneNationalNumber !== initialPhoneNationalNumber;

    if (phoneChanged) {
      formData.append("phone.country", nextPhoneCountry);
      formData.append("phone.nationalNumber", nextPhoneNationalNumber);
    }

    formData.append(
      "telegramUsername",
      data.telegramUsername.trim().replace(/^@/, ""),
    );
    formData.append("bio", data.bio || "");
    formData.append("countryId", data.countryId || "");
    formData.append("cityId", data.cityId || "");
    formData.append("avatarKey", data.avatarKey || "");
    formData.append("skills", data.skills.join(","));
    formData.append("website", data.website || "");
    formData.append("linkedin", data.linkedin || "");
    formData.append("twitter", data.twitter || "");
    formData.append("facebook", data.facebook || "");
    formData.append("profileVisibility", data.profileVisibility);
    formData.append("contactVisibility", data.contactVisibility);
    formData.append("socialLinksVisibility", data.socialLinksVisibility);
    formData.append("contributionsVisibility", data.contributionsVisibility);

    if (avatarFile) {
      formData.append("avatarFile", avatarFile);
    }

    fetcher.submit(formData, {
      method: "PATCH",
      encType: "multipart/form-data",
    });
  };

  const toggleVisibility = (
    field: VisibilityField,
    value: VisibilityOption,
  ) => {
    setValue(field, value, { shouldValidate: true, shouldDirty: true });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <motion.div
      className="min-h-full shrink-0 px-2 py-8 pb-28 sm:px-3 md:pb-16 lg:px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header Section */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BackToButton text="Back to My Space" to="/myspace" />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-bold text-gray-900">Edit Profile</h1>
              {hasChanges && (
                <Badge
                  variant="outline"
                  className="border-amber-300 bg-amber-50 text-amber-700"
                >
                  Unsaved changes
                </Badge>
              )}
            </div>
            <p className="mt-2 text-base text-gray-600">
              Update your personal information, photo, and privacy settings.
            </p>
          </motion.div>
        </motion.div>

        <Form
          method="PATCH"
          noValidate
          onSubmit={handleSubmit(onSubmit, onInvalid)}
        >
          <motion.div
            className="grid grid-cols-1 gap-8 lg:grid-cols-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {/* Left Column - Main Form */}
            <motion.div
              className="space-y-6 lg:col-span-3 lg:row-start-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {/* Profile Picture Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
              >
                <Card className="border border-gray-200">
                  <CardContent className="space-y-6 p-6">
                    <div
                      ref={avatarDrop.ref}
                      {...avatarDrop.dropZoneProps}
                      className={cn(
                        "-m-2 flex gap-6 rounded-xl border border-dashed border-transparent p-2 transition-colors",
                        avatarDrop.isDragging && "border-blue-500 bg-blue-50",
                      )}
                    >
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                          delay: 0.4,
                        }}
                      >
                        <Avatar className="h-24 w-24 shrink-0">
                          <AvatarImage
                            src={avatarPreview || undefined}
                            alt="Profile"
                          />
                          <AvatarFallback>
                            {me?.user.firstName?.[0]}
                            {me?.user.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                      </motion.div>
                      <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                      >
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Profile Picture
                          </h3>
                          <p className="text-xs text-gray-500">
                            {avatarDrop.isResolvingUrl
                              ? "Checking image link…"
                              : "Drag and drop, or paste an image or image link"}
                          </p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              asChild
                              variant="outline"
                              className="h-8.5 w-full cursor-pointer gap-2 rounded-xl text-sm sm:w-auto"
                            >
                              <label>
                                <Image className="h-4 w-4" />
                                <span>Upload new image</span>
                                <input
                                  id="avatarUploadInput"
                                  type="file"
                                  accept="image/*"
                                  className="sr-only"
                                  onChange={handleUpload}
                                />
                              </label>
                            </Button>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              type="button"
                              variant="outline"
                              className="h-8.5 w-full cursor-pointer gap-2 rounded-xl text-sm sm:w-auto"
                              onClick={handleDeleteAvatar}
                              disabled={!avatarPreview}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete current image
                            </Button>
                          </motion.div>
                        </div>
                      </motion.div>
                    </div>

                    <Separator />

                    {/* Basic Information */}
                    <motion.div
                      className="grid grid-cols-1 gap-6 md:grid-cols-2"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.div className="space-y-2" variants={itemVariants}>
                        <Label htmlFor="firstName">First name</Label>
                        <InputGroup
                          className={`mt-1.5 h-12 has-[[data-slot=input-group-control]:focus-visible]:border-blue-500 has-[[data-slot=input-group-control]:focus-visible]:ring-blue-500/20 ${INVALID_GROUP_FOCUS_CLASS} md:h-10`}
                        >
                          <InputGroupAddon className="border-none bg-transparent">
                            <User className="size-3.5 text-gray-400" />
                          </InputGroupAddon>
                          <InputGroupInput
                            id="firstName"
                            {...register("firstName")}
                            {...invalidProps("firstName")}
                            placeholder="First name"
                            className="text-sm"
                          />
                        </InputGroup>
                        {errors.firstName && (
                          <p
                            id={errorId("firstName")}
                            role="alert"
                            className="text-xs text-red-500"
                          >
                            {errors.firstName.message}
                          </p>
                        )}
                      </motion.div>
                      <motion.div className="space-y-2" variants={itemVariants}>
                        <Label htmlFor="lastName">Last name</Label>
                        <InputGroup
                          className={`mt-1.5 h-12 has-[[data-slot=input-group-control]:focus-visible]:border-blue-500 has-[[data-slot=input-group-control]:focus-visible]:ring-blue-500/20 ${INVALID_GROUP_FOCUS_CLASS} md:h-10`}
                        >
                          <InputGroupAddon className="border-none bg-transparent">
                            <User className="size-3.5 text-gray-400" />
                          </InputGroupAddon>
                          <InputGroupInput
                            id="lastName"
                            {...register("lastName")}
                            {...invalidProps("lastName")}
                            placeholder="Last name"
                            className="text-sm"
                          />
                        </InputGroup>
                        {errors.lastName && (
                          <p
                            id={errorId("lastName")}
                            role="alert"
                            className="text-xs text-red-500"
                          >
                            {errors.lastName.message}
                          </p>
                        )}
                      </motion.div>
                    </motion.div>

                    <motion.div
                      className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.div className="space-y-2" variants={itemVariants}>
                        <Label htmlFor="occupation">Occupation</Label>
                        <InputGroup
                          className={`mt-1.5 h-12 has-[[data-slot=input-group-control]:focus-visible]:border-blue-500 has-[[data-slot=input-group-control]:focus-visible]:ring-blue-500/20 ${INVALID_GROUP_FOCUS_CLASS} md:h-10`}
                        >
                          <InputGroupAddon className="border-none bg-transparent">
                            <Briefcase className="size-3.5 text-gray-400" />
                          </InputGroupAddon>
                          <InputGroupInput
                            id="occupation"
                            {...register("occupation")}
                            {...invalidProps("occupation")}
                            placeholder="Job title"
                            className="text-sm"
                          />
                        </InputGroup>
                        {errors.occupation && (
                          <p
                            id={errorId("occupation")}
                            role="alert"
                            className="text-xs text-red-500"
                          >
                            {errors.occupation.message}
                          </p>
                        )}
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <SingleSelectDropdown
                          id="gender"
                          label="Gender"
                          value={gender ?? ""}
                          onValueChange={(val) =>
                            setValue("gender", val, {
                              shouldValidate: true,
                              shouldDirty: true,
                            })
                          }
                          options={[
                            { value: "male", label: "Male" },
                            { value: "female", label: "Female" },
                            { value: "other", label: "Other" },
                          ]}
                          placeholder="Select gender"
                          ariaInvalid={Boolean(errors.gender)}
                          ariaDescribedBy={
                            errors.gender ? errorId("gender") : undefined
                          }
                          icon={<User className="size-3.5 text-gray-400" />}
                          className="ring-blue-500 focus:ring-blue-500 focus-visible:border-blue-500 focus-visible:ring-blue-500"
                        />
                        {errors.gender && (
                          <p
                            id={errorId("gender")}
                            role="alert"
                            className="mt-2 text-xs text-red-500"
                          >
                            {errors.gender.message}
                          </p>
                        )}
                      </motion.div>
                    </motion.div>

                    <motion.div
                      className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.div variants={itemVariants}>
                        <SingleSelectDropdown
                          id="countryId"
                          label="Country"
                          value={countryId ?? ""}
                          onValueChange={(val) => {
                            setValue("countryId", val, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                            setValue("cityId", "", {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                            navigate(`?countryId=${val}`, {
                              preventScrollReset: true,
                            });
                          }}
                          options={countries.map((c) => ({
                            value: c.id,
                            label: c.name,
                          }))}
                          placeholder="Select country"
                          searchable={true}
                          searchPlaceholder="Search country..."
                          icon={<MapPin className="size-3.5 text-gray-400" />}
                          className="ring-blue-500 focus:ring-blue-500 focus-visible:border-blue-500 focus-visible:ring-blue-500"
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <SingleSelectDropdown
                          id="cityId"
                          label="City"
                          value={cityId ?? ""}
                          onValueChange={(val) =>
                            setValue("cityId", val, {
                              shouldValidate: true,
                              shouldDirty: true,
                            })
                          }
                          options={cities.map((c) => ({
                            value: c.id,
                            label: c.name,
                          }))}
                          placeholder="Select city"
                          disabled={!countryId}
                          searchable={true}
                          searchPlaceholder="Search city..."
                          icon={<MapPin className="size-3.5 text-gray-400" />}
                          className="ring-blue-500 focus:ring-blue-500 focus-visible:border-blue-500 focus-visible:ring-blue-500"
                        />
                      </motion.div>
                    </motion.div>

                    <motion.div
                      className="grid grid-cols-2 gap-6"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.div
                        className="col-span-2 space-y-2"
                        variants={itemVariants}
                      >
                        <Label
                          htmlFor="dateOfBirth"
                          className="flex items-center gap-2"
                        >
                          <Calendar className="h-4 w-4" />
                          Date of birth
                        </Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          {...register("dateOfBirth")}
                          {...invalidProps("dateOfBirth")}
                          placeholder="Date"
                          max={new Date().toISOString().slice(0, 10)}
                          className={`h-10 focus-visible:border-blue-500 focus-visible:ring-blue-500/20 ${INVALID_FOCUS_CLASS}`}
                        />
                        {errors.dateOfBirth && (
                          <p
                            id={errorId("dateOfBirth")}
                            role="alert"
                            className="text-xs text-red-500"
                          >
                            {errors.dateOfBirth.message}
                          </p>
                        )}
                      </motion.div>
                    </motion.div>

                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.55, duration: 0.4 }}
                    >
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        {...register("bio")}
                        {...invalidProps("bio")}
                        placeholder="Tell us about yourself"
                        rows={6}
                        className={`focus-visible:border-blue-500 focus-visible:ring-blue-500/20 ${INVALID_FOCUS_CLASS}`}
                      />
                      <div className="flex items-start justify-between gap-3">
                        <p
                          id={errorId("bio")}
                          role="alert"
                          className="text-xs text-red-500"
                        >
                          {errors.bio?.message}
                        </p>
                        <p
                          className={`shrink-0 text-xs ${
                            (bio?.length ?? 0) > BIO_MAX_LENGTH
                              ? "text-red-500"
                              : "text-gray-400"
                          }`}
                        >
                          {bio?.length ?? 0}/{BIO_MAX_LENGTH}
                        </p>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Skills Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <Card className="border border-gray-200">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Skills</h3>
                    </div>
                    <div className="mb-4 flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          value={newSkill}
                          onChange={(e) => {
                            setNewSkill(e.target.value);
                            // An "add" rejection is about the typed text, so
                            // it goes stale as soon as that text changes.
                            if (errors.skills?.type === "manual") {
                              clearErrors("skills");
                            }
                            setIsSkillSuggestionsOpen(true);
                          }}
                          onFocus={() => {
                            if (skillSuggestions.length > 0) {
                              setIsSkillSuggestionsOpen(true);
                            }
                          }}
                          onBlur={() => {
                            skillBlurTimeoutRef.current = setTimeout(() => {
                              setIsSkillSuggestionsOpen(false);
                            }, 120);
                          }}
                          onKeyDown={(e) => {
                            if (
                              e.key === "ArrowDown" &&
                              skillSuggestions.length > 0
                            ) {
                              e.preventDefault();
                              setIsSkillSuggestionsOpen(true);
                              setActiveSkillSuggestionIndex((current) =>
                                current + 1 >= skillSuggestions.length
                                  ? 0
                                  : current + 1,
                              );
                              return;
                            }

                            if (
                              e.key === "ArrowUp" &&
                              skillSuggestions.length > 0
                            ) {
                              e.preventDefault();
                              setIsSkillSuggestionsOpen(true);
                              setActiveSkillSuggestionIndex((current) =>
                                current <= 0
                                  ? skillSuggestions.length - 1
                                  : current - 1,
                              );
                              return;
                            }

                            if (e.key === "Escape") {
                              setIsSkillSuggestionsOpen(false);
                              return;
                            }

                            if (e.key === "Enter") {
                              e.preventDefault();
                              const activeSuggestion =
                                skillSuggestions[activeSkillSuggestionIndex];

                              if (isSkillSuggestionsOpen && activeSuggestion) {
                                handleAddSkill(activeSuggestion.name);
                                return;
                              }

                              handleAddSkill();
                            }
                          }}
                          id="newSkill"
                          aria-label="Add a skill"
                          aria-invalid={skillsError ? true : undefined}
                          aria-describedby={
                            skillsError ? errorId("skills") : undefined
                          }
                          placeholder="Add a skill (e.g. Graphic Design)"
                          className={`h-10 text-sm focus-visible:border-blue-500 focus-visible:ring-blue-500/20 ${INVALID_FOCUS_CLASS}`}
                          autoComplete="off"
                          aria-autocomplete="list"
                          aria-expanded={isSkillSuggestionsOpen}
                          aria-controls="skill-suggestions"
                        />
                        {isSkillSuggestionsOpen &&
                          skillSearchQuery.length >= 2 &&
                          (skillSuggestions.length > 0 ||
                            isSearchingSkills) && (
                            <div
                              id="skill-suggestions"
                              role="listbox"
                              className="absolute top-full right-0 left-0 z-20 mt-2 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg"
                            >
                              {isSearchingSkills &&
                                skillSuggestions.length === 0 && (
                                  <div className="px-3 py-2 text-sm text-gray-500">
                                    Searching...
                                  </div>
                                )}
                              {skillSuggestions.map((skill, index) => (
                                <button
                                  key={skill.id}
                                  type="button"
                                  role="option"
                                  aria-selected={
                                    index === activeSkillSuggestionIndex
                                  }
                                  onMouseDown={(event) => {
                                    event.preventDefault();
                                    handleAddSkill(skill.name);
                                  }}
                                  onMouseEnter={() =>
                                    setActiveSkillSuggestionIndex(index)
                                  }
                                  className={`block w-full px-3 py-2 text-left text-sm transition-colors ${
                                    index === activeSkillSuggestionIndex
                                      ? "bg-gray-100 text-gray-950"
                                      : "text-gray-700 hover:bg-gray-50"
                                  }`}
                                >
                                  {skill.name}
                                </button>
                              ))}
                            </div>
                          )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleAddSkill()}
                        className="h-10 cursor-pointer"
                      >
                        Add
                      </Button>
                    </div>
                    {skillsError && (
                      <p
                        id={errorId("skills")}
                        role="alert"
                        className="mb-4 text-xs text-red-500"
                      >
                        {skillsError}
                      </p>
                    )}
                    <motion.div
                      className="flex flex-wrap gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.45, staggerChildren: 0.05 }}
                    >
                      {skills.map((skill, index) => (
                        <motion.div
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                            delay: index * 0.05,
                          }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <Badge
                            variant="outline"
                            className="flex h-10 items-center gap-2 text-[13px]"
                          >
                            {skill}
                            <button
                              type="button"
                              aria-label={`Remove ${skill}`}
                              className="ml-1 cursor-pointer rounded-full p-0.5 hover:bg-gray-200"
                              onClick={() => handleRemoveSkill(skill)}
                            >
                              <X size={12} />
                            </button>
                          </Badge>
                        </motion.div>
                      ))}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Social Links Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.4 }}
              >
                <Card className="border border-gray-200">
                  <CardContent className="p-6">
                    <h3 className="mb-4 font-semibold text-gray-900">
                      Social Links
                    </h3>
                    <motion.div
                      className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.div className="space-y-2" variants={itemVariants}>
                        <Label
                          htmlFor="website"
                          className="flex items-center gap-2"
                        >
                          <Globe className="h-4 w-4 text-blue-600" />
                          Website
                        </Label>
                        <Input
                          id="website"
                          {...register("website")}
                          {...invalidProps("website")}
                          className={`h-10 focus-visible:border-blue-500 focus-visible:ring-blue-500/20 ${INVALID_FOCUS_CLASS}`}
                          placeholder="https://truekhmer.org"
                        />
                        {errors.website && (
                          <p
                            id={errorId("website")}
                            role="alert"
                            className="text-xs text-red-500"
                          >
                            {errors.website.message}
                          </p>
                        )}
                      </motion.div>
                      <motion.div className="space-y-2" variants={itemVariants}>
                        <Label
                          htmlFor="linkedin"
                          className="flex items-center gap-2"
                        >
                          <Linkedin className="h-4 w-4 text-blue-600" />
                          LinkedIn
                        </Label>
                        <Input
                          id="linkedin"
                          {...register("linkedin")}
                          {...invalidProps("linkedin")}
                          placeholder="LinkedIn Profile URL"
                          className={`h-10 focus-visible:border-blue-500 focus-visible:ring-blue-500/20 ${INVALID_FOCUS_CLASS}`}
                        />
                        {errors.linkedin && (
                          <p
                            id={errorId("linkedin")}
                            role="alert"
                            className="text-xs text-red-500"
                          >
                            {errors.linkedin.message}
                          </p>
                        )}
                      </motion.div>
                    </motion.div>
                    <motion.div
                      className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.div className="space-y-2" variants={itemVariants}>
                        <Label
                          htmlFor="twitter"
                          className="flex items-center gap-2"
                        >
                          <Twitter className="h-4 w-4 text-blue-600" />
                          Twitter
                        </Label>
                        <Input
                          id="twitter"
                          {...register("twitter")}
                          {...invalidProps("twitter")}
                          placeholder="Twitter Profile URL"
                          className={`h-10 focus-visible:border-blue-500 focus-visible:ring-blue-500/20 ${INVALID_FOCUS_CLASS}`}
                        />
                        {errors.twitter && (
                          <p
                            id={errorId("twitter")}
                            role="alert"
                            className="text-xs text-red-500"
                          >
                            {errors.twitter.message}
                          </p>
                        )}
                      </motion.div>
                      <motion.div className="space-y-2" variants={itemVariants}>
                        <Label
                          htmlFor="facebook"
                          className="flex items-center gap-2"
                        >
                          <Facebook className="h-4 w-4 text-blue-600" />
                          Facebook
                        </Label>
                        <Input
                          id="facebook"
                          {...register("facebook")}
                          {...invalidProps("facebook")}
                          placeholder="Facebook Profile URL"
                          className={`h-10 focus-visible:border-blue-500 focus-visible:ring-blue-500/20 ${INVALID_FOCUS_CLASS}`}
                        />
                        {errors.facebook && (
                          <p
                            id={errorId("facebook")}
                            role="alert"
                            className="text-xs text-red-500"
                          >
                            {errors.facebook.message}
                          </p>
                        )}
                      </motion.div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contact Details Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <Card className="border border-gray-200">
                  <CardContent className="p-6">
                    <h3 className="mb-4 font-semibold text-gray-900">
                      Contact Details
                    </h3>
                    <motion.div
                      className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.div className="space-y-2" variants={itemVariants}>
                        <Label
                          htmlFor="telegramUsername"
                          className="flex items-center gap-2"
                        >
                          <Send className="h-4 w-4 text-blue-600" />
                          Telegram username
                        </Label>
                        <InputGroup
                          className={`h-10 has-[[data-slot=input-group-control]:focus-visible]:border-blue-500 has-[[data-slot=input-group-control]:focus-visible]:ring-blue-500/20 ${INVALID_GROUP_FOCUS_CLASS}`}
                        >
                          <InputGroupAddon className="bg-blue-gray-50 border-r border-input px-3 text-sm font-medium text-gray-600">
                            @
                          </InputGroupAddon>
                          <InputGroupInput
                            id="telegramUsername"
                            {...register("telegramUsername")}
                            {...invalidProps("telegramUsername")}
                            placeholder="username"
                            className="text-sm"
                          />
                        </InputGroup>
                        {errors.telegramUsername && (
                          <p
                            id={errorId("telegramUsername")}
                            role="alert"
                            className="text-xs text-red-500"
                          >
                            {errors.telegramUsername.message}
                          </p>
                        )}
                      </motion.div>
                      <motion.div className="space-y-2" variants={itemVariants}>
                        <Label className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-blue-600" />
                          Contact number<span className="text-red-500">*</span>
                        </Label>
                        <div className="flex h-10 overflow-hidden rounded-lg bg-white">
                          <Select
                            value={phoneCountry || "KH"}
                            onValueChange={(value) =>
                              setValue("phoneCountry", value, {
                                shouldValidate: true,
                                shouldDirty: true,
                              })
                            }
                          >
                            <SelectTrigger
                              aria-label="Country calling code"
                              className="h-full w-24 rounded-l-lg rounded-r-none border-r-0 border-[#C3C6D6] bg-slate-50 px-3 text-sm leading-5 font-medium text-[#434654] shadow-none focus:ring-[#2F6FE4]/20 focus:ring-offset-0"
                            >
                              <span className="truncate">
                                {selectedPhoneCountry.dialCode}
                              </span>
                            </SelectTrigger>
                            <SelectContent className="max-h-72">
                              <SelectGroup>
                                {phoneCountryOptions.map((option) => (
                                  <SelectItem
                                    key={option.country}
                                    value={option.country}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <Input
                            id="phoneNationalNumber"
                            {...register("phoneNationalNumber")}
                            {...invalidProps("phoneNationalNumber")}
                            placeholder="12 345 678"
                            inputMode="tel"
                            autoComplete="tel-national"
                            className={`h-full rounded-l-none rounded-r-lg border-[#C3C6D6] px-4 text-sm text-[#111827] shadow-none placeholder:text-gray-500 focus-visible:border-[#2F6FE4] focus-visible:ring-[#2F6FE4]/20 ${INVALID_FOCUS_CLASS}`}
                          />
                        </div>
                        {errors.phoneNationalNumber && (
                          <p
                            id={errorId("phoneNationalNumber")}
                            role="alert"
                            className="text-xs text-red-500"
                          >
                            {errors.phoneNationalNumber.message}
                          </p>
                        )}
                      </motion.div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Certificates Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <EditProfileCertificatesCard
                  certificates={certificates}
                  certificateOptions={certificateOptions}
                />
              </motion.div>
            </motion.div>

            {/* Right Column - Profile Visibility */}
            <motion.div
              className="space-y-4 lg:sticky lg:top-8 lg:col-span-2 lg:col-start-4 lg:row-start-1 lg:self-start"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <Card className="border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Eye className="size-5" />
                      </span>
                      <h3 className="text-lg font-bold text-gray-900">
                        Profile Visibility
                      </h3>
                    </div>
                    <p className="mt-2 mb-6 text-sm text-gray-400">
                      Manage your identity visibility
                    </p>
                    <motion.div
                      className="space-y-5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.45, duration: 0.4 }}
                    >
                      {[
                        {
                          key: "profileVisibility",
                          label: "Your Profile",
                          description: "Your name, photo, and title",
                          icon: User,
                        },
                        {
                          key: "contactVisibility",
                          label: "Contact Details",
                          description: "Email, phone, and Telegram",
                          icon: Phone,
                        },
                        {
                          key: "socialLinksVisibility",
                          label: "Social Links",
                          description: "Website, LinkedIn, and other links",
                          icon: Link2,
                        },
                        {
                          key: "contributionsVisibility",
                          label: "Contribution Activities",
                          description: "Posts, volunteering, and projects",
                          icon: Wrench,
                        },
                      ].map(
                        ({ key: visibilityKey, label, description, icon }) => {
                          const key = visibilityKey as VisibilityField;
                          return (
                            <motion.div
                              key={key}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.45, duration: 0.4 }}
                            >
                              <VisibilitySettingCard
                                icon={icon}
                                label={label}
                                description={description}
                                value={watch(key)}
                                onChange={(option) =>
                                  toggleVisibility(key, option)
                                }
                              />
                            </motion.div>
                          );
                        },
                      )}
                    </motion.div>
                    <div className="mt-6 flex gap-2 text-xs text-gray-400">
                      <Info className="mt-0.5 size-4 shrink-0" />
                      <p>
                        Visibility settings affect how your data appears in
                        search results and to other community members.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.4 }}
          >
            <div
              className="min-w-0 flex-1 text-sm"
              role="status"
              aria-live="polite"
            >
              {hasChanges ? (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-medium text-amber-700">
                    {changedLabels.length} unsaved{" "}
                    {changedLabels.length === 1 ? "change" : "changes"}:
                  </span>
                  <span className="truncate text-gray-600">
                    {changedLabels.join(", ")}
                  </span>
                  <button
                    type="button"
                    onClick={handleDiscardChanges}
                    className="inline-flex cursor-pointer items-center gap-1 text-blue-600 hover:underline"
                  >
                    <RotateCcw className="size-3.5" />
                    Discard changes
                  </button>
                </div>
              ) : (
                <span className="text-gray-400">No unsaved changes</span>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 min-w-28 cursor-pointer"
                  onClick={() => {
                    // Cancel means "throw these edits away", unlike the back
                    // link, which keeps the draft for later.
                    clearDraft();
                    navigate("/myspace");
                  }}
                >
                  Cancel
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="h-10 min-w-28 cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
                  disabled={fetcher.state !== "idle" || !hasChanges}
                >
                  {fetcher.state !== "idle" ? (
                    <span className="inline-flex items-center gap-2">
                      <Spinner className="size-4" />
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </Form>
      </div>
    </motion.div>
  );
}
