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
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { SingleSelectDropdown } from "~/components/ui/single-select-dropdown";
import { Spinner } from "~/components/ui/spinner";
import { resolveImageURL } from "~/lib/utils";
import { EditProfileLoader } from "~/routes/api/myspace/edit-profile-loader";
import { EditProfileAction } from "~/routes/api/myspace/edit-profile-action";

export const loader = EditProfileLoader;
export const action = EditProfileAction;

const editProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.string().min(1, "Gender is required"),
  dateOfBirth: z.string().optional(),
  occupation: z.string().optional(),
  phoneNumber: z.string().optional(),
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
    phoneNumber: me?.user.phoneNumber || "",
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
  const [newSkill, setNewSkill] = useState("");

  const initialAvatarUrl = resolveImageURL(me?.profile.avatarKey || undefined);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    initialAvatarUrl,
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
    setAvatarUrl(objectUrl);
    setAvatarFile(file);
  };

  const handleDeleteAvatar = () => {
    if (avatarObjectUrlRef.current) {
      URL.revokeObjectURL(avatarObjectUrlRef.current);
      avatarObjectUrlRef.current = null;
    }
    setAvatarUrl(undefined);
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
    };
  }, []);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill)) {
      setValue("skills", [...skills, newSkill], { shouldValidate: true });
      setNewSkill("");
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
    formData.append("phoneNumber", data.phoneNumber || "");
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
      className="min-h-screen bg-blue-gray-50 py-8 px-4 sm:px-6 lg:px-8"
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
                            src={avatarUrl || undefined}
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
                              disabled={!avatarUrl}
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
                      <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddSkill();
                          }
                        }}
                        placeholder="Add a skill (e.g. Graphic Design)"
                        className="text-sm h-10"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddSkill}
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
                        <Label
                          htmlFor="phoneNumber"
                          className="flex items-center gap-2"
                        >
                          <Phone className="h-4 w-4 text-blue-600" />
                          Phone number
                        </Label>
                        <InputGroup className="h-10">
                          <InputGroupAddon className="bg-blue-gray-50 border-r border-input px-3 text-sm font-medium text-gray-600">
                            +855
                          </InputGroupAddon>
                          <InputGroupInput
                            id="phoneNumber"
                            {...register("phoneNumber")}
                            placeholder="12 345 678"
                            className="text-sm"
                          />
                        </InputGroup>
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
                    <h3 className="font-semibold text-gray-900 mb-6">
                      Profile Visibility
                    </h3>
                    <motion.div
                      className="space-y-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        delay: 0.45,
                        staggerChildren: 0.08,
                        duration: 0.4,
                      }}
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
                          className="space-y-3"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.45,
                            duration: 0.4,
                          }}
                        >
                          <p className="text-sm font-medium text-gray-700">
                            {label}
                          </p>
                          <motion.div
                            className="flex gap-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{
                              staggerChildren: 0.05,
                              duration: 0.3,
                            }}
                          >
                            {["public", "members", "private"].map((option) => (
                              <motion.div
                                key={option}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 400,
                                  damping: 30,
                                }}
                              >
                                <Button
                                  type="button"
                                  size="sm"
                                  variant={
                                    watch(key as keyof EditProfileFormData) ===
                                    option
                                      ? "default"
                                      : "outline"
                                  }
                                  className={`text-xs font-medium transition-all ${
                                    watch(key as keyof EditProfileFormData) ===
                                    option
                                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                                      : ""
                                  }`}
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
                                >
                                  {option.charAt(0).toUpperCase() +
                                    option.slice(1)}
                                </Button>
                              </motion.div>
                            ))}
                          </motion.div>
                        </motion.div>
                      ))}
                    </motion.div>
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
