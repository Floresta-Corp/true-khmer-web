import { useState } from "react";
import {
  Upload,
  Trash2,
  MapPin,
  Calendar,
  Phone,
  Globe,
  Linkedin,
  Twitter,
  Facebook,
  MessageSquare,
} from "lucide-react";
import { motion } from "motion/react";
import BackToButton from "~/components/back-to-button";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

interface ProfileVisibilitySection {
  title: string;
  options: ("Public" | "Members" | "Private")[];
  currentVisibility: "Public" | "Members" | "Private";
}

export default function EditProfile() {
  const [profileImage, setProfileImage] = useState<string>(
    "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
  );
  const [formData, setFormData] = useState({
    firstName: "Moren",
    lastName: "Hadad",
    professionalTitle: "Senior Product Designer",
    location: "Phnom Penh, Cambodia",
    dateOfBirth: "October 14, 1985",
    gender: "Female",
    bio: "Passionate cloud specialist with over 5 years of experience in Azure architecture. I love helping the community grow through knowledge sharing and mentorship.",
  });

  const [skills, setSkills] = useState([
    "Leadership",
    "Project Management",
    "UI Design",
    "Azure DevOps",
    "Architecture",
  ]);
  const [newSkill, setNewSkill] = useState("");

  const [socialLinks, setSocialLinks] = useState({
    website: "https://truekhmer.org",
    linkedin: "LinkedIn Profile URL",
    twitter: "Twitter Profile URL",
    facebook: "Facebook Profile URL",
  });

  const [contactDetails, setContactDetails] = useState({
    telegram: "@khmer_user",
    phone: "+855 12 345 678",
  });

  const [visibilitySettings, setVisibilitySettings] = useState<
    Record<string, ProfileVisibilitySection>
  >({
    profile: {
      title: "Your Profile",
      options: ["Public", "Members", "Private"],
      currentVisibility: "Public",
    },
    contacts: {
      title: "Contact Details",
      options: ["Public", "Members", "Private"],
      currentVisibility: "Public",
    },
    social: {
      title: "Social Links",
      options: ["Public", "Members", "Private"],
      currentVisibility: "Public",
    },
    activities: {
      title: "Contribution Activities",
      options: ["Public", "Members", "Private"],
      currentVisibility: "Public",
    },
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialLinkChange = (
    field: keyof typeof socialLinks,
    value: string,
  ) => {
    setSocialLinks((prev) => ({ ...prev, [field]: value }));
  };

  const handleContactDetailChange = (
    field: keyof typeof contactDetails,
    value: string,
  ) => {
    setContactDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill)) {
      setSkills((prev) => [...prev, newSkill]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const toggleVisibility = (
    section: string,
    visibility: "Public" | "Members" | "Private",
  ) => {
    setVisibilitySettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        currentVisibility: visibility,
      },
    }));
  };

  const handleSaveChanges = () => {
    console.log("Saving changes:", {
      formData,
      skills,
      socialLinks,
      contactDetails,
      visibilitySettings,
    });
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
          <BackToButton text="Back to Profile" to="/profile" />
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
                        <AvatarImage src={profileImage} alt="Profile" />
                        <AvatarFallback>MH</AvatarFallback>
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
                            variant="outline"
                            size="sm"
                            className="gap-2 text-sm"
                          >
                            <Upload className="h-4 w-4" />
                            Upload new image
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 text-sm"
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
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        placeholder="First name"
                      />
                    </motion.div>
                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label htmlFor="lastName">Last name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        placeholder="Last name"
                      />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="grid grid-cols-2 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label htmlFor="professionalTitle">
                        Professional title
                      </Label>
                      <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
                        <span className="text-gray-400">🎯</span>
                        <input
                          id="professionalTitle"
                          type="text"
                          value={formData.professionalTitle}
                          onChange={(e) =>
                            handleInputChange(
                              "professionalTitle",
                              e.target.value,
                            )
                          }
                          placeholder="Job title"
                          className="flex-1 outline-none text-sm"
                        />
                      </div>
                    </motion.div>
                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label
                        htmlFor="location"
                        className="flex items-center gap-2"
                      >
                        <MapPin className="h-4 w-4" />
                        Location
                      </Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                        placeholder="City, Country"
                      />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="grid grid-cols-2 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label
                        htmlFor="dateOfBirth"
                        className="flex items-center gap-2"
                      >
                        <Calendar className="h-4 w-4" />
                        Date of birth
                      </Label>
                      <Input
                        id="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={(e) =>
                          handleInputChange("dateOfBirth", e.target.value)
                        }
                        placeholder="Date"
                      />
                    </motion.div>
                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label htmlFor="gender">Gender</Label>
                      <Input
                        id="gender"
                        value={formData.gender}
                        onChange={(e) =>
                          handleInputChange("gender", e.target.value)
                        }
                        placeholder="Gender"
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
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      placeholder="Tell us about yourself"
                      rows={4}
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
                    <Button
                      variant="link"
                      size="sm"
                      className="text-blue-600 p-0 h-auto"
                      onClick={handleAddSkill}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex gap-2 mb-4">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleAddSkill();
                        }
                      }}
                      placeholder="Add a skill (e.g. Graphic Design)"
                      className="text-sm"
                    />
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
                    {[
                      {
                        id: "website",
                        label: "Website or link",
                        icon: Globe,
                      },
                      {
                        id: "linkedin",
                        label: "LinkedIn",
                        icon: Linkedin,
                      },
                    ].map((field) => (
                      <motion.div
                        key={field.id}
                        className="space-y-2"
                        variants={itemVariants}
                      >
                        <Label
                          htmlFor={field.id}
                          className="flex items-center gap-2"
                        >
                          <field.icon className="h-4 w-4" />
                          {field.label}
                        </Label>
                        <Input
                          id={field.id}
                          value={
                            socialLinks[field.id as keyof typeof socialLinks]
                          }
                          onChange={(e) =>
                            handleSocialLinkChange(
                              field.id as keyof typeof socialLinks,
                              e.target.value,
                            )
                          }
                          placeholder={`${field.label} URL`}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                  <motion.div
                    className="grid grid-cols-2 gap-6 mt-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {[
                      {
                        id: "twitter",
                        label: "Twitter",
                        icon: Twitter,
                      },
                      {
                        id: "facebook",
                        label: "Facebook",
                        icon: Facebook,
                      },
                    ].map((field) => (
                      <motion.div
                        key={field.id}
                        className="space-y-2"
                        variants={itemVariants}
                      >
                        <Label
                          htmlFor={field.id}
                          className="flex items-center gap-2"
                        >
                          <field.icon className="h-4 w-4" />
                          {field.label}
                        </Label>
                        <Input
                          id={field.id}
                          value={
                            socialLinks[field.id as keyof typeof socialLinks]
                          }
                          onChange={(e) =>
                            handleSocialLinkChange(
                              field.id as keyof typeof socialLinks,
                              e.target.value,
                            )
                          }
                          placeholder={`${field.label} Profile URL`}
                        />
                      </motion.div>
                    ))}
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
                        htmlFor="telegram"
                        className="flex items-center gap-2"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Telegram username
                      </Label>
                      <Input
                        id="telegram"
                        value={contactDetails.telegram}
                        onChange={(e) =>
                          handleContactDetailChange("telegram", e.target.value)
                        }
                        placeholder="@username"
                      />
                    </motion.div>
                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label
                        htmlFor="phone"
                        className="flex items-center gap-2"
                      >
                        <Phone className="h-4 w-4" />
                        Phone number
                      </Label>
                      <Input
                        id="phone"
                        value={contactDetails.phone}
                        onChange={(e) =>
                          handleContactDetailChange("phone", e.target.value)
                        }
                        placeholder="+855 12 345 678"
                      />
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
                <Button variant="outline">Cancel</Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleSaveChanges}
                >
                  Save Changes
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
                    {Object.entries(visibilitySettings).map(
                      ([key, section], index) => (
                        <motion.div
                          key={key}
                          className="space-y-3"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.45 + index * 0.08,
                            duration: 0.4,
                          }}
                        >
                          <p className="text-sm font-medium text-gray-700">
                            {section.title}
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
                            {section.options.map((option) => (
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
                                  size="sm"
                                  variant={
                                    section.currentVisibility === option
                                      ? "default"
                                      : "outline"
                                  }
                                  className={`text-xs font-medium transition-all ${section.currentVisibility === option
                                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                                    : ""
                                    }`}
                                  onClick={() =>
                                    toggleVisibility(
                                      key,
                                      option as
                                      | "Public"
                                      | "Members"
                                      | "Private",
                                    )
                                  }
                                >
                                  {option}
                                </Button>
                              </motion.div>
                            ))}
                          </motion.div>
                          {section.currentVisibility === "Private" && (
                            <motion.p
                              className="text-xs text-gray-500"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2, duration: 0.3 }}
                            >
                              Visibility restricted: Only you can see this item
                            </motion.p>
                          )}
                        </motion.div>
                      ),
                    )}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
