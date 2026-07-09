import { useEffect, useId, useRef, useState } from "react";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useSubmit,
} from "react-router";
import {
  Building2,
  Image as ImageIcon,
  Loader2,
  Plus,
  Send,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { ConfirmationModal } from "~/features/admin/components/confirmation-modal";
import { ImageLightbox, type LightboxImage } from "../image-lightbox";
import {
  FormField,
  FormSectionHeading,
  PartnerSelectField,
  PartnerTextField,
} from "../partner-form-field";
import { PackageBadge } from "../partner-badges";
import { formatPartnerDateTime } from "../partner-utils";
import {
  packageKmOptions,
  packageOptions,
  partnerSectorOptions,
} from "../partner-options";
import type { partnerDetailLoader } from "../../services/partner-detail.loader";
import type { partnerEditAction } from "../../services/partner-edit.action";
import type { PartnerAddress, PartnerPhoto } from "../../types";

function addressField(
  address: PartnerAddress | null | undefined,
  field: keyof PartnerAddress,
) {
  const value = address?.[field];
  return typeof value === "string" ? value : "";
}

export default function PartnerEditPage() {
  const { partner, contactPersons, photos: initialPhotos } =
    useLoaderData<typeof partnerDetailLoader>();
  const actionData = useActionData<typeof partnerEditAction>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const submit = useSubmit();
  const isSubmitting = navigation.state === "submitting";

  const partnerName = partner.name || partner.nameKh || "Partner";

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRemoveLogoModal, setShowRemoveLogoModal] = useState(false);
  const [pendingPhotoDelete, setPendingPhotoDelete] = useState<string | null>(
    null,
  );

  const [logoUrl, setLogoUrl] = useState(partner.logo || "");
  const [logoUploading, setLogoUploading] = useState(false);
  const [photos, setPhotos] = useState<PartnerPhoto[]>(initialPhotos);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<"ACTIVE" | "INACTIVE">(
    partner.status === "PENDING" ? "ACTIVE" : partner.status,
  );
  const [isPublished, setIsPublished] = useState(partner.isPublished);
  const [bioLength, setBioLength] = useState((partner.bio || "").length);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const formRef = useRef<HTMLFormElement>(null);
  const logoInputId = useId();
  const photoInputId = useId();

  useEffect(() => {
    if (!actionData) return;
    if ("success" in actionData && actionData.success) {
      setErrors({});
      if (actionData.type === "photoAdd") {
        setPhotos(initialPhotos);
        toast.success("Photo added successfully");
      } else if (actionData.type === "photoDelete") {
        setPhotos(initialPhotos);
        toast.success("Photo deleted successfully");
      }
    } else if ("error" in actionData && actionData.error) {
      if (
        "validationErrors" in actionData &&
        actionData.validationErrors
      ) {
        setErrors(actionData.validationErrors as Record<string, string>);
      }
      setPhotos(initialPhotos);
      toast.error(actionData.error);
    }
  }, [actionData, initialPhotos]);

  const handleStatusChange = (value: string) => {
    const status = value as "ACTIVE" | "INACTIVE";
    setCurrentStatus(status);
    if (status === "INACTIVE") setIsPublished(false);
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLogoUploading(true);
    try {
      const presignRes = await fetch(
        `/api/admin/partners/${partner.id}/logo-presign`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contentType: file.type, fileSize: file.size }),
        },
      );
      const presignJson = await presignRes.json();
      if (!presignRes.ok || !presignJson.ok) {
        throw new Error(presignJson.message || "Failed to get upload URL");
      }

      const { uploadUrl, requiredHeaders, publicUrl } = presignJson.upload;
      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: requiredHeaders,
        body: file,
      });
      if (!putRes.ok) throw new Error("Upload failed");

      setLogoUrl(publicUrl);
      toast.success("Logo uploaded successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setLogoUploading(false);
      event.target.value = "";
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (photos.length >= 4) {
      toast.error("Maximum of 4 photos allowed");
      return;
    }

    setPhotoUploading(true);
    try {
      const presignRes = await fetch(
        `/api/admin/partners/${partner.id}/photo-presign`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contentType: file.type, fileSize: file.size }),
        },
      );
      const presignJson = await presignRes.json();
      if (!presignRes.ok || !presignJson.ok) {
        throw new Error(presignJson.message || "Failed to get upload URL");
      }

      const { uploadUrl, requiredHeaders, publicUrl } = presignJson.upload;
      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: requiredHeaders,
        body: file,
      });
      if (!putRes.ok) throw new Error("Upload failed");

      setPhotos((prev) => [
        ...prev,
        {
          id: `temp-${prev.length}`,
          partnerId: partner.id,
          url: publicUrl,
          thumbnail: null,
          createdAt: new Date().toISOString(),
          updatedAt: null,
        },
      ]);

      const formData = new FormData();
      formData.append("action", "addPhoto");
      formData.append("photoUrl", publicUrl);
      submit(formData, { method: "post" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setPhotoUploading(false);
      event.target.value = "";
    }
  };

  const handleDeletePhotoConfirm = () => {
    if (pendingPhotoDelete) {
      setPhotos((prev) => prev.filter((photo) => photo.id !== pendingPhotoDelete));
      const formData = new FormData();
      formData.append("action", "deletePhoto");
      formData.append("photoId", pendingPhotoDelete);
      submit(formData, { method: "post" });
    }
    setPendingPhotoDelete(null);
  };

  const handleSaveConfirm = () => {
    formRef.current?.requestSubmit();
    setShowSaveModal(false);
  };

  const lightboxImages: LightboxImage[] = [
    ...(logoUrl ? [{ src: logoUrl, alt: `${partnerName} logo` }] : []),
    ...photos.map((photo) => ({ src: photo.url, alt: `${partnerName} gallery image` })),
  ];

  const openLogoLightbox = () => {
    if (!logoUrl) return;
    setLightboxIndex(0);
    setLightboxOpen(true);
  };

  const openPhotoLightbox = (index: number) => {
    setLightboxIndex(index + (logoUrl ? 1 : 0));
    setLightboxOpen(true);
  };

  const nameId = useId();
  const nameKhId = useId();
  const emailId = useId();
  const phoneId = useId();
  const registrationNumberId = useId();
  const sectorActivityId = useId();
  const sectorActivityKmId = useId();
  const packageId = useId();
  const packageKmId = useId();
  const bioId = useId();
  const bioKmId = useId();
  const descriptionId = useId();
  const descriptionKmId = useId();
  const addressId = useId();
  const addressKmId = useId();
  const countryId = useId();
  const countryKmId = useId();
  const cityId = useId();
  const cityKmId = useId();
  const zipCodeId = useId();
  const zipCodeKmId = useId();
  const websiteId = useId();
  const facebookId = useId();
  const linkedinId = useId();
  const telegramId = useId();
  const statusId = useId();

  return (
    <main className="min-h-full bg-[#f8fafc] px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
          <Link to="/tk-admin/partners" className="hover:text-slate-900 dark:hover:text-white">
            Partners
          </Link>
          <span>/</span>
          <Link
            to={`/tk-admin/partners/${partner.id}`}
            className="hover:text-slate-900 dark:hover:text-white"
          >
            {partnerName}
          </Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white">Edit</span>
        </nav>

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              Edit Partner
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Edit partner information and settings
            </p>
          </div>
          <Button type="button" variant="outline" onClick={() => setShowCancelModal(true)}>
            Cancel
          </Button>
        </div>

        <Form method="post" ref={formRef} className="space-y-6" noValidate>
          <input type="hidden" name="action" value="save" />
          <input type="hidden" name="logo" value={logoUrl} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main content */}
            <div className="space-y-6 lg:col-span-2">
              {/* Basic information */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                  <Building2 className="size-5" /> Basic Information
                </h3>

                <div className="mb-6 flex items-center gap-4">
                  {logoUrl ? (
                    <button
                      type="button"
                      onClick={openLogoLightbox}
                      title="Click to view logo in full size"
                      className="group relative size-20 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-0 dark:border-slate-800 dark:bg-slate-950"
                    >
                      <img
                        src={logoUrl}
                        alt="Partner logo"
                        className="size-full object-contain p-2 transition-transform group-hover:scale-105"
                      />
                    </button>
                  ) : (
                    <div className="flex size-20 shrink-0 items-center justify-center rounded-lg border-2 border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                      <Building2 className="size-8 text-slate-300 dark:text-slate-600" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex gap-2">
                      <label
                        htmlFor={logoInputId}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        <Upload className="size-3.5" />
                        {logoUrl ? "Change Logo" : "Upload Logo"}
                      </label>
                      {logoUrl && (
                        <button
                          type="button"
                          onClick={() => setShowRemoveLogoModal(true)}
                          className="inline-flex items-center gap-2 rounded-lg border border-rose-300 px-3 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950/40"
                        >
                          <Trash2 className="size-3.5" /> Remove
                        </button>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      PNG, JPG, WEBP (MAX. 5MB)
                    </p>
                    {logoUploading && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Loader2 className="size-3.5 animate-spin" /> Uploading...
                      </div>
                    )}
                  </div>
                  <input
                    id={logoInputId}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                    disabled={logoUploading}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <PartnerTextField id={nameId} label="Partner Name" name="name" required error={errors.name} defaultValue={partner.name || ""} placeholder="Enter partner name" />
                  <PartnerTextField id={nameKhId} label="Partner Name (Khmer)" name="nameKh" error={errors.nameKh} defaultValue={partner.nameKh || ""} placeholder="Enter partner name in Khmer" />
                  <PartnerTextField id={emailId} label="Email" name="email" type="email" required error={errors.email} defaultValue={partner.email} placeholder="Enter email address" />
                  <PartnerTextField id={phoneId} label="Phone Number" name="phoneNumber" type="tel" required error={errors.phoneNumber} defaultValue={partner.phoneNumber} placeholder="Enter phone number" />
                  <PartnerTextField id={registrationNumberId} label="Registration Number" name="registrationNumber" error={errors.registrationNumber} defaultValue={partner.registrationNumber || ""} placeholder="Enter registration number" />
                  <PartnerSelectField id={sectorActivityId} label="Sector of Activity" name="sectorActivity" required error={errors.sectorActivity} defaultValue={partner.sectorActivity || ""} placeholder="Select business sector" options={partnerSectorOptions} />
                  <PartnerTextField id={sectorActivityKmId} label="Sector of Activity (Khmer)" name="sectorActivityKm" error={errors.sectorActivityKm} defaultValue={partner.sectorActivityKm || ""} placeholder="Enter business sector in Khmer" />
                  <PartnerSelectField id={packageId} label="Package" name="package" error={errors.package} defaultValue={partner.package || ""} placeholder="Select package" options={packageOptions} />
                  <PartnerSelectField id={packageKmId} label="Package (Khmer)" name="packageKm" error={errors.packageKm} defaultValue={partner.packageKm || ""} placeholder="Select package in Khmer" options={packageKmOptions} />
                </div>
              </div>

              {/* Bio & description */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                  Bio &amp; Description
                </h3>
                <div className="space-y-4">
                  <FormField id={bioId} label={`Short Bio (${bioLength}/125)`} error={errors.bio}>
                    <Textarea
                      id={bioId}
                      name="bio"
                      defaultValue={partner.bio || ""}
                      placeholder="Brief description about the partner (max 125 characters)"
                      maxLength={125}
                      rows={3}
                      aria-invalid={Boolean(errors.bio)}
                      onChange={(e) => setBioLength(e.target.value.length)}
                    />
                    <p className={`mt-1 text-xs ${bioLength > 105 ? "text-amber-600" : "text-slate-500 dark:text-slate-400"}`}>
                      {125 - bioLength} characters remaining
                    </p>
                  </FormField>
                  <FormField id={bioKmId} label="Short Bio (Khmer)" error={errors.bioKm}>
                    <Textarea
                      id={bioKmId}
                      name="bioKm"
                      defaultValue={partner.bioKm || ""}
                      placeholder="Brief description about the partner in Khmer"
                      maxLength={125}
                      rows={3}
                      aria-invalid={Boolean(errors.bioKm)}
                    />
                  </FormField>
                  <FormField id={descriptionId} label="Full Description" error={errors.description}>
                    <Textarea id={descriptionId} name="description" defaultValue={partner.description || ""} placeholder="Detailed description about the partner" rows={5} aria-invalid={Boolean(errors.description)} />
                  </FormField>
                  <FormField id={descriptionKmId} label="Full Description (Khmer)" error={errors.descriptionKm}>
                    <Textarea
                      id={descriptionKmId}
                      name="descriptionKm"
                      defaultValue={partner.descriptionKm || ""}
                      placeholder="Detailed description about the partner in Khmer"
                      rows={5}
                      aria-invalid={Boolean(errors.descriptionKm)}
                    />
                  </FormField>
                </div>
              </div>

              {/* Address */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                  Address Information
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <PartnerTextField id={addressId} label="Address" name="address" error={errors.address} defaultValue={addressField(partner.address, "street")} placeholder="Enter street address" />
                  <PartnerTextField id={addressKmId} label="Address (Khmer)" name="addressKm" error={errors.addressKm} defaultValue={addressField(partner.addressKm, "street")} placeholder="Enter street address in Khmer" />
                  <PartnerTextField id={countryId} label="Country" name="country" required error={errors.country} defaultValue={addressField(partner.address, "country")} placeholder="Enter country" />
                  <PartnerTextField id={countryKmId} label="Country (Khmer)" name="countryKm" error={errors.countryKm} defaultValue={addressField(partner.addressKm, "country")} placeholder="Enter country in Khmer" />
                  <PartnerTextField id={cityId} label="City" name="city" required error={errors.city} defaultValue={addressField(partner.address, "city")} placeholder="Enter city" />
                  <PartnerTextField id={cityKmId} label="City (Khmer)" name="cityKm" error={errors.cityKm} defaultValue={addressField(partner.addressKm, "city")} placeholder="Enter city in Khmer" />
                  <PartnerTextField id={zipCodeId} label="ZIP Code" name="zipCode" error={errors.zipCode} defaultValue={addressField(partner.address, "zipCode")} placeholder="Enter ZIP code" />
                  <PartnerTextField id={zipCodeKmId} label="ZIP Code (Khmer)" name="zipCodeKm" error={errors.zipCodeKm} defaultValue={addressField(partner.addressKm, "zipCode")} placeholder="Enter ZIP code in Khmer" />
                </div>
              </div>

              {/* Social media */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                  Social Media
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <PartnerTextField id={websiteId} label="Website" name="website" type="url" error={errors.website} defaultValue={partner.website || ""} placeholder="https://example.com" />
                  <PartnerTextField id={facebookId} label="Facebook" name="facebook" type="url" error={errors.facebook} defaultValue={partner.facebook || ""} placeholder="https://facebook.com/username" />
                  <PartnerTextField id={linkedinId} label="LinkedIn" name="linkedin" type="url" error={errors.linkedin} defaultValue={partner.linkedin || ""} placeholder="https://linkedin.com/company/name" />
                  <PartnerTextField id={telegramId} label="Telegram" name="telegram" error={errors.telegram} defaultValue={partner.telegram || ""} placeholder="username (without @)" />
                </div>
              </div>

              {/* Photo gallery */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                    <ImageIcon className="size-5" /> Photo Gallery ({photos.length}/4)
                  </h3>
                  {photos.length < 4 && (
                    <label
                      htmlFor={photoInputId}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      <Plus className="size-3.5" /> Add Photo
                    </label>
                  )}
                </div>

                {photos.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {photos.map((photo, index) => (
                      <div key={photo.id} className="group relative">
                        <button
                          type="button"
                          onClick={() => openPhotoLightbox(index)}
                          title="Click to view photo in full size"
                          className="aspect-video w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100 p-0 dark:border-slate-800 dark:bg-slate-800"
                        >
                          <img
                            src={photo.thumbnail || photo.url}
                            alt="Partner gallery"
                            className="size-full object-cover transition-transform group-hover:scale-105"
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingPhotoDelete(photo.id)}
                          title="Delete photo"
                          className="absolute right-2 top-2 z-10 rounded-full bg-rose-600 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <ImageIcon className="mx-auto mb-4 size-12 text-slate-300 dark:text-slate-600" />
                    <p className="text-slate-500 dark:text-slate-400">No photos uploaded yet</p>
                    <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
                      Add up to 4 photos to showcase your partner
                    </p>
                  </div>
                )}

                <input
                  id={photoInputId}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                  disabled={photoUploading || photos.length >= 4}
                />
                {photoUploading && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Loader2 className="size-4 animate-spin" /> Uploading photo...
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                  Partner Settings
                </h3>

                <div className="space-y-4">
                  <PartnerSelectField
                    id={statusId}
                    label="Status"
                    name="status"
                    value={currentStatus}
                    onValueChange={handleStatusChange}
                    options={[
                      { value: "ACTIVE", label: "Active" },
                      { value: "INACTIVE", label: "Inactive" },
                    ]}
                  />

                  <div>
                    <label className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        Published
                      </span>
                      <input
                        type="checkbox"
                        name="isPublished"
                        value="true"
                        checked={isPublished}
                        onChange={(e) => setIsPublished(e.target.checked)}
                        disabled={currentStatus === "INACTIVE"}
                        className="size-4 accent-blue-600"
                      />
                    </label>
                    <p className="mt-1 text-xs italic text-rose-500">
                      {currentStatus === "INACTIVE"
                        ? "Inactive partners cannot be published"
                        : "Make partner visible to the public"}
                    </p>
                  </div>

                  {(partner.package || partner.packageKm) && (
                    <div>
                      <p className="mb-2 text-sm font-medium text-slate-900 dark:text-white">
                        Current Package:
                      </p>
                      <PackageBadge label={partner.package || partner.packageKm || ""} />
                    </div>
                  )}

                  <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
                    <div className="space-y-2">
                      <Button
                        type="button"
                        onClick={() => setShowSaveModal(true)}
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
                        Save Changes
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowCancelModal(true)}
                        className="w-full"
                      >
                        Cancel
                      </Button>
                      <div className="border-t border-slate-100 pt-2 dark:border-slate-800" />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowDeleteModal(true)}
                        className="w-full border-rose-300 text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950/40"
                      >
                        <Trash2 className="size-4" /> Delete Partner
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {contactPersons.length > 0 && (
                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                    Contact Persons
                  </h3>
                  <div className="space-y-3">
                    {contactPersons.map((contact) => (
                      <div
                        key={contact.id}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {contact.firstName} {contact.lastName}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {contact.position}
                            </p>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                              {contact.email} &bull; {contact.phoneNumber}
                            </p>
                          </div>
                          {contact.telegram && (
                            <a
                              href={`https://t.me/${contact.telegram.replace("@", "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700"
                              title="Contact on Telegram"
                            >
                              <Send className="size-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                  Partner Info
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-600 dark:text-slate-300">Created:</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {formatPartnerDateTime(partner.createdAt)}
                    </span>
                  </div>
                  {partner.updatedAt && (
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-600 dark:text-slate-300">Last Updated:</span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {formatPartnerDateTime(partner.updatedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Form>
      </div>

      <ImageLightbox
        open={lightboxOpen}
        images={lightboxImages}
        index={lightboxIndex}
        onOpenChange={setLightboxOpen}
        onIndexChange={setLightboxIndex}
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => submit({ action: "delete" }, { method: "post" })}
        title="Delete Partner"
        message={`Are you sure you want to delete "${partnerName}"? This action cannot be undone and will permanently remove all partner data including contact persons and photos.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="error"
      />

      <ConfirmationModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onConfirm={handleSaveConfirm}
        title="Save Changes"
        message={`Are you sure you want to save the changes to "${partnerName}"?`}
        confirmText="Save"
        cancelText="Cancel"
        variant="info"
      />

      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={() => navigate(`/tk-admin/partners/${partner.id}`)}
        title="Discard Changes"
        message="Are you sure you want to cancel? Any unsaved changes will be lost."
        confirmText="Discard"
        cancelText="Continue Editing"
        variant="warning"
      />

      <ConfirmationModal
        isOpen={pendingPhotoDelete !== null}
        onClose={() => setPendingPhotoDelete(null)}
        onConfirm={handleDeletePhotoConfirm}
        title="Delete Photo"
        message="Are you sure you want to delete this photo? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="error"
      />

      <ConfirmationModal
        isOpen={showRemoveLogoModal}
        onClose={() => setShowRemoveLogoModal(false)}
        onConfirm={() => {
          setLogoUrl("");
          setShowRemoveLogoModal(false);
          toast.success("Logo removed successfully");
        }}
        title="Remove Logo"
        message="Are you sure you want to remove the logo? This action will remove the logo from the partner profile."
        confirmText="Remove"
        cancelText="Cancel"
        variant="error"
      />
    </main>
  );
}
