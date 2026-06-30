import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useLoaderData, useNavigate, useFetcher, Form } from "react-router";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
} from "lucide-react";
import { motion } from "motion/react";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import BackToButton from "~/components/back-to-button";
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
import { resolveImageURL } from "~/lib/utils";
import { editProfileLoader } from "../services/edit-profile.loader";
import { editProfileAction } from "../services/edit-profile.action";
import type { SearchSkillsResponse } from "~/types/api-client";

export const loader = editProfileLoader;
export const action = editProfileAction;

const editProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.string().min(1, "Gender is required"),
  dateOfBirth: z.string().optional(),
  occupation: z.string().optional(),
  phoneCountry: z.string().optional(),
  phoneNationalNumber: z.string().optional(),
  telegramUsername: z.string().optional(),
  bio: z.string().optional(),
  countryId: z.string().optional(),
  cityId: z.string().optional(),
  avatarKey: z.string().optional(),
  skills: z.array(z.string()),
  website: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  facebook: z.string().optional(),
  profileVisibility: z.string(),
  contactVisibility: z.string(),
  socialLinksVisibility: z.string(),
  contributionsVisibility: z.string(),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;
type SkillSearchFetcherData =
  | (SearchSkillsResponse & { search: string })
  | {
      ok: false;
      search: string;
      message: string;
      skills: [];
    };

const countryNameFormatter =
  typeof Intl !== "undefined" && "DisplayNames" in Intl
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

const phoneCountryOptions = getCountries()
  .map((country) => ({
    country,
    dialCode: `+${getCountryCallingCode(country)}`,
    label: `${countryNameFormatter?.of(country) ?? country} +${getCountryCallingCode(country)}`,
  }))
  .sort((first, second) => {
    if (first.country === "KH") return -1;
    if (second.country === "KH") return 1;
    return first.label.localeCompare(second.label);
  });

export function meta() {
  return [
    { title: "Edit Profile - True Khmer" },
    { name: "description", content: "Update your profile information" },
  ];
}

export default function EditProfile() {
  const { me, countries, cities } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const skillSearchFetcher = useFetcher<SkillSearchFetcherData>();
  const wasSubmitting = useRef(false);

  useEffect(() => {
    if (fetcher.state === "submitting") {
      wasSubmitting.current = true;
    }

    if (wasSubmitting.current && fetcher.state === "idle" && fetcher.data) {
      wasSubmitting.current = false;
      const result = fetcher.data;

      if (result?.ok) {
        toast.success("Profile updated successfully!");
        navigate("/myspace");
      } else {
        toast.error(result?.message ?? "Failed to update profile.");
      }
    }
  }, [fetcher.state, fetcher.data]);

  const defaultValues: EditProfileFormData = {
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
    profileVisibility: me?.profile.visibility?.profile || "public",
    contactVisibility: me?.profile.visibility?.contact || "public",
    socialLinksVisibility: me?.profile.visibility?.socialLinks || "public",
    contributionsVisibility: me?.profile.visibility?.contributions || "public",
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues,
  });

  const skills = watch("skills");
  const countryId = watch("countryId");
  const cityId = watch("cityId");
  const gender = watch("gender");
  const phoneCountry = watch("phoneCountry");
  const selectedPhoneCountry =
    phoneCountryOptions.find((option) => option.country === phoneCountry) ??
    ({
      country: "KH",
      dialCode: "+855",
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

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0] ?? null;
    if (!file) return;
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

  const handleDeleteAvatar = () => {
    if (avatarObjectUrlRef.current) {
      URL.revokeObjectURL(avatarObjectUrlRef.current);
      avatarObjectUrlRef.current = null;
    }
    setAvatarPreview(undefined);
    setAvatarFile(null);
    setValue("avatarKey", "");

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
    if (
      nextSkill &&
      !skills.some((skill) => skill.toLowerCase() === nextSkill.toLowerCase())
    ) {
      setValue("skills", [...skills, nextSkill], { shouldValidate: true });
      setNewSkill("");
      setIsSkillSuggestionsOpen(false);
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setValue(
      "skills",
      skills.filter((s) => s !== skill),
      { shouldValidate: true },
    );
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

    formData.append("telegramUsername", data.telegramUsername || "");
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
    field:
      | "profileVisibility"
      | "contactVisibility"
      | "socialLinksVisibility"
      | "contributionsVisibility",
    value: string,
  ) => {
    setValue(field, value, { shouldValidate: true });
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
      className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-5xl mx-auto space-y-8">
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
            <h1 className="text-4xl font-bold text-gray-900">Edit Profile</h1>
            <p className="text-base text-gray-600 mt-2">
              Update your personal information, photo, and privacy settings.
            </p>
          </motion.div>
        </motion.div>

        <Form method="PATCH" onSubmit={handleSubmit(onSubmit)}>
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {/* Left Column - Main Form */}
            <motion.div
              className="lg:col-span-2 space-y-6"
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
                  <CardContent className="p-6 space-y-6">
                    <div className="flex gap-6">
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
                        <h3 className="font-semibold text-gray-900">
                          Profile Picture
                        </h3>
                        <div className="flex gap-3">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              asChild
                              variant="outline"
                              className="gap-2 text-sm h-8.5 rounded-xl cursor-pointer"
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
                              className="gap-2 text-sm h-8.5 rounded-xl cursor-pointer"
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
                      className="grid grid-cols-2 gap-6"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.div className="space-y-2" variants={itemVariants}>
                        <Label htmlFor="firstName">First name</Label>
                        <InputGroup className="h-10">
                          <InputGroupAddon className="bg-transparent border-none">
                            <User className="size-3.5 text-gray-400" />
                          </InputGroupAddon>
                          <InputGroupInput
                            id="firstName"
                            {...register("firstName")}
                            placeholder="First name"
                            className="text-sm"
                          />
                        </InputGroup>
                        {errors.firstName && (
                          <p className="text-xs text-red-500">
                            {errors.firstName.message}
                          </p>
                        )}
                      </motion.div>
                      <motion.div className="space-y-2" variants={itemVariants}>
                        <Label htmlFor="lastName">Last name</Label>
                        <InputGroup className="h-10">
                          <InputGroupAddon className="bg-transparent border-none">
                            <User className="size-3.5 text-gray-400" />
                          </InputGroupAddon>
                          <InputGroupInput
                            id="lastName"
                            {...register("lastName")}
                            placeholder="Last name"
                            className="text-sm"
                          />
                        </InputGroup>
                        {errors.lastName && (
                          <p className="text-xs text-red-500">
                            {errors.lastName.message}
                          </p>
                        )}
                      </motion.div>
                    </motion.div>

                    <motion.div
                      className="grid grid-cols-2 gap-6"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.div className="space-y-2" variants={itemVariants}>
                        <Label htmlFor="occupation">Occupation</Label>
                        <InputGroup className="h-10">
                          <InputGroupAddon className="bg-transparent border-none">
                            <Briefcase className="size-3.5 text-gray-400" />
                          </InputGroupAddon>
                          <InputGroupInput
                            id="occupation"
                            {...register("occupation")}
                            placeholder="Job title"
                            className="text-sm"
                          />
                        </InputGroup>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <SingleSelectDropdown
                          id="gender"
                          label="Gender"
                          value={gender ?? ""}
                          onValueChange={(val) =>
                            setValue("gender", val, { shouldValidate: true })
                          }
                          options={[
                            { value: "male", label: "Male" },
                            { value: "female", label: "Female" },
                            { value: "other", label: "Other" },
                          ]}
                          placeholder="Select gender"
                          icon={<User className="size-3.5 text-gray-400" />}
                        />
                        {errors.gender && (
                          <p className="text-xs text-red-500 mt-2">
                            {errors.gender.message}
                          </p>
                        )}
                      </motion.div>
                    </motion.div>

                    <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2 gap-6"
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
                            });
                            setValue("cityId", "", { shouldValidate: true });
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
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <SingleSelectDropdown
                          id="cityId"
                          label="City"
                          value={cityId ?? ""}
                          onValueChange={(val) =>
                            setValue("cityId", val, { shouldValidate: true })
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
                        className="space-y-2 col-span-2"
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
                          placeholder="Date"
                          className="h-10"
                        />
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
                        placeholder="Tell us about yourself"
                        rows={6}
                      />
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
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Skills</h3>
                    </div>
                    <div className="flex gap-2 mb-4">
                      <div className="relative flex-1">
                        <Input
                          value={newSkill}
                          onChange={(e) => {
                            setNewSkill(e.target.value);
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
                          placeholder="Add a skill (e.g. Graphic Design)"
                          className="text-sm h-10"
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
                              className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg"
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
                          whileTap={{ scale: 0.95 }}
                        >
                          <Badge
                            variant="outline"
                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleRemoveSkill(skill)}
                          >
                            {skill}
                            <span className="ml-1">×</span>
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
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Social Links
                    </h3>
                    <motion.div
                      className="grid grid-cols-2 gap-6"
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
                          className="h-10"
                          placeholder="https://truekhmer.org"
                        />
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
                          placeholder="LinkedIn Profile URL"
                          className="h-10"
                        />
                      </motion.div>
                    </motion.div>
                    <motion.div
                      className="grid grid-cols-2 gap-6 mt-6"
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
                          placeholder="Twitter Profile URL"
                          className="h-10"
                        />
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
                          placeholder="Facebook Profile URL"
                          className="h-10"
                        />
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
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Contact Details
                    </h3>
                    <motion.div
                      className="grid grid-cols-2 gap-6"
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
                        <InputGroup className="h-10">
                          <InputGroupAddon className="bg-blue-gray-50 border-r border-input px-3 text-sm font-medium text-gray-600">
                            @
                          </InputGroupAddon>
                          <InputGroupInput
                            id="telegramUsername"
                            {...register("telegramUsername")}
                            placeholder="username"
                            className="text-sm"
                          />
                        </InputGroup>
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
                              })
                            }
                          >
                            <SelectTrigger
                              aria-label="Country calling code"
                              className="h-full w-24 rounded-l-lg rounded-r-none border-[#C3C6D6] border-r-0 bg-slate-50 px-3 text-sm font-medium leading-5 text-[#434654] shadow-none focus:ring-[#2F6FE4]/20 focus:ring-offset-0"
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
                            placeholder="12 345 678"
                            inputMode="tel"
                            autoComplete="tel-national"
                            className="h-full rounded-l-none rounded-r-lg border-[#C3C6D6] px-4 text-sm text-[#111827] shadow-none placeholder:text-gray-500 focus-visible:border-[#2F6FE4] focus-visible:ring-[#2F6FE4]/20"
                          />
                        </div>
                      </motion.div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                className="flex justify-end gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.4 }}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer h-10"
                    onClick={() => navigate("/myspace")}
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
                    className="cursor-pointer H-10 bg-blue-600 hover:bg-blue-700 text-white h-10"
                    disabled={fetcher.state !== "idle"}
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
              </motion.div>
            </motion.div>

            {/* Right Column - Profile Visibility */}
            <motion.div
              className="space-y-4"
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
                    <h3 className="text-lg font-bold text-gray-900">
                      Profile Visibility
                    </h3>
                    <p className="mt-1 mb-6 text-sm text-gray-400">
                      Manage your identity visibility
                    </p>
                    <motion.div
                      className="space-y-5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.45, duration: 0.4 }}
                    >
                      {[
                        { key: "profileVisibility", label: "Your Profile" },
                        { key: "contactVisibility", label: "Contact Details" },
                        { key: "socialLinksVisibility", label: "Social Links" },
                        {
                          key: "contributionsVisibility",
                          label: "Contribution Activities",
                        },
                      ].map(({ key, label }) => (
                        <motion.div
                          key={key}
                          className="space-y-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.45, duration: 0.4 }}
                        >
                          <p className="text-sm font-semibold text-gray-800">
                            {label}
                          </p>
                          <div className="flex gap-3">
                            {["public", "members", "private"].map((option) => {
                              const isActive =
                                watch(key as keyof EditProfileFormData) ===
                                option;
                              return (
                                <motion.div
                                  key={option}
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.97 }}
                                >
                                  <Button
                                    type="button"
                                    size="sm"
                                    aria-pressed={isActive}
                                    onClick={() =>
                                      toggleVisibility(
                                        key as
                                          | "profileVisibility"
                                          | "contactVisibility"
                                          | "socialLinksVisibility"
                                          | "contributionsVisibility",
                                        option,
                                      )
                                    }
                                    className={`h-9 rounded-lg px-4 gap-5 text-sm font-medium transition-all border-0 shadow-none ${
                                      isActive
                                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                                        : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                                    }`}
                                  >
                                    {option.charAt(0).toUpperCase() +
                                      option.slice(1)}
                                  </Button>
                                </motion.div>
                              );
                            })}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                    <p className="mt-6 text-xs italic text-gray-400">
                      Visibility settings affect how your data appears in search
                      results and to other community members.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </motion.div>
        </Form>
      </div>
    </motion.div>
  );
}
