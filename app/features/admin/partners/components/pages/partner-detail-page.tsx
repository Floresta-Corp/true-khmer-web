import { useEffect, useState } from "react";
import {
  Link,
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
} from "react-router";
import {
  Building2,
  Calendar,
  ChevronRight,
  Edit,
  Facebook,
  Globe,
  Hash,
  IdCard,
  Image as ImageIcon,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { ConfirmationModal } from "~/features/admin/components/confirmation-modal";
import { getSafeExternalUrl } from "~/lib/utils";
import { PackageBadge, PartnerStatusBadge } from "../partner-badges";
import { formatPartnerAddress, formatPartnerDate } from "../partner-utils";
import { ImageLightbox, type LightboxImage } from "../image-lightbox";
import type { partnerDetailLoader } from "../../services/partner-detail.loader";
import type { partnerDetailAction } from "../../services/partner-detail.action";
import type { ContactPerson } from "~/types/api-client";

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Building2;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-1 size-5 shrink-0 text-blue-600" />
      <div>
        <h4 className="font-medium text-slate-900 dark:text-white">{label}</h4>
        <div className="text-sm text-slate-600 dark:text-slate-300">
          {children}
        </div>
      </div>
    </div>
  );
}

function ContactPersonSocialLinks({ person }: { person: ContactPerson }) {
  const links: React.ReactNode[] = [];

  if (person.facebook) {
    links.push(
      <a
        key="facebook"
        href={getSafeExternalUrl(person.facebook)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline"
      >
        <Facebook className="size-3.5" /> Facebook
      </a>,
    );
  }
  if (person.linkedin) {
    links.push(
      <a
        key="linkedin"
        href={getSafeExternalUrl(person.linkedin)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline"
      >
        <Linkedin className="size-3.5" /> LinkedIn
      </a>,
    );
  }
  if (person.telegram) {
    links.push(
      <a
        key="telegram"
        href={`https://t.me/${person.telegram.replace("@", "")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline"
      >
        <Send className="size-3.5" /> Telegram
      </a>,
    );
  }

  if (links.length === 0) {
    return (
      <p className="text-xs text-slate-400 italic dark:text-slate-500">
        No social media links
      </p>
    );
  }

  return <div className="flex flex-wrap gap-3">{links}</div>;
}

export default function PartnerDetailPage() {
  const { partner, contactPersons, photos } =
    useLoaderData<typeof partnerDetailLoader>();
  const actionData = useActionData<typeof partnerDetailAction>();
  const navigate = useNavigate();
  const submit = useSubmit();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (
      actionData &&
      "message" in actionData &&
      typeof actionData.message === "string"
    ) {
      if ("success" in actionData && actionData.success) {
        toast.success(actionData.message);
      } else {
        toast.error(actionData.message);
      }
    }
  }, [actionData]);

  const partnerName = partner.name || partner.nameKh || "Partner";

  const handleDeleteConfirm = () => {
    submit({ action: "delete" }, { method: "post" });
    setShowDeleteModal(false);
  };

  const handlePublishConfirm = () => {
    submit(
      { action: "togglePublish", currentStatus: String(partner.isPublished) },
      { method: "post" },
    );
    setShowPublishModal(false);
  };

  const handleStatusConfirm = () => {
    submit(
      { action: "toggleStatus", currentStatus: partner.status },
      { method: "post" },
    );
    setShowStatusModal(false);
  };

  const socialLinks: React.ReactNode[] = [];
  if (partner.facebook) {
    socialLinks.push(
      <InfoRow key="facebook" icon={Facebook} label="Facebook">
        <a
          href={getSafeExternalUrl(partner.facebook)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {partner.facebook}
        </a>
      </InfoRow>,
    );
  }
  if (partner.linkedin) {
    socialLinks.push(
      <InfoRow key="linkedin" icon={Linkedin} label="LinkedIn">
        <a
          href={getSafeExternalUrl(partner.linkedin)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {partner.linkedin}
        </a>
      </InfoRow>,
    );
  }
  if (partner.telegram) {
    socialLinks.push(
      <InfoRow key="telegram" icon={Send} label="Telegram">
        <a
          href={`https://t.me/${partner.telegram.replace("@", "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          @{partner.telegram.replace("@", "")}
        </a>
      </InfoRow>,
    );
  }
  if (partner.website) {
    socialLinks.push(
      <InfoRow key="website" icon={Globe} label="Website">
        <a
          href={getSafeExternalUrl(partner.website)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {partner.website}
        </a>
      </InfoRow>,
    );
  }

  const formattedAddress = formatPartnerAddress(partner.address);
  const formattedAddressKm = formatPartnerAddress(partner.addressKm);
  const lightboxImages: LightboxImage[] = [
    ...(partner.logo
      ? [{ src: partner.logo, alt: `${partnerName} logo` }]
      : []),
    ...photos.map((photo) => ({
      src: photo.url,
      alt: `${partnerName} gallery image`,
    })),
  ];

  const openLogoLightbox = () => {
    if (!partner.logo) return;
    setLightboxIndex(0);
    setLightboxOpen(true);
  };

  const openPhotoLightbox = (photoIndex: number) => {
    setLightboxIndex(photoIndex + (partner.logo ? 1 : 0));
    setLightboxOpen(true);
  };

  return (
    <main className="min-h-full bg-[#f8fafc] px-4 py-6 sm:px-6 lg:px-10 lg:py-8 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
          <Link
            to="/tk-admin/partners"
            className="hover:text-slate-900 dark:hover:text-white"
          >
            Partners
          </Link>
          <ChevronRight className="size-4" />
          <span className="truncate text-slate-900 dark:text-white">
            {partnerName}
          </span>
        </nav>

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
              Partner Details
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              View and manage partner information
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={() => navigate(`/tk-admin/partners/${partner.id}/edit`)}
              className="gap-2 bg-blue-600 text-white hover:bg-blue-700"
            >
              <Edit className="size-4" /> Edit
            </Button>
            <Button
              type="button"
              onClick={() => setShowStatusModal(true)}
              className={`gap-2 text-white ${
                partner.status === "ACTIVE"
                  ? "bg-amber-500 hover:bg-amber-600"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {partner.status === "ACTIVE" ? "Deactivate" : "Activate"}
            </Button>
            <Button
              type="button"
              onClick={() => setShowPublishModal(true)}
              className={`gap-2 text-white ${
                partner.isPublished
                  ? "bg-amber-500 hover:bg-amber-600"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {partner.isPublished ? "Unpublish" : "Publish"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteModal(true)}
              className="gap-2 border-rose-300 text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950/40"
            >
              <Trash2 className="size-4" /> Delete
            </Button>
          </div>
        </div>

        {/* Partner info card */}
        <div className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            {partner.logo ? (
              <button
                type="button"
                onClick={openLogoLightbox}
                title="Click to view logo in full size"
                className="group relative size-20 shrink-0 rounded-lg border border-slate-200 bg-slate-50 p-0 dark:border-slate-800 dark:bg-slate-950"
              >
                <img
                  src={partner.logo}
                  alt={`${partnerName} logo`}
                  className="size-full rounded-lg object-contain p-1 transition-transform group-hover:scale-105"
                />
              </button>
            ) : (
              <div className="flex size-20 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                <Building2 className="size-8 text-slate-300 dark:text-slate-600" />
              </div>
            )}

            <div className="flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {partnerName}
                </h2>
                <PartnerStatusBadge status={partner.status} />
              </div>
              {(partner.package || partner.packageKm) && (
                <PackageBadge
                  label={partner.package || partner.packageKm || ""}
                />
              )}
            </div>
          </div>

          {partner.bio && (
            <div>
              <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
                Bio
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                {partner.bio}
              </p>
            </div>
          )}
          {partner.bioKm && (
            <div>
              <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
                Bio (Khmer)
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                {partner.bioKm}
              </p>
            </div>
          )}
          {partner.description && (
            <div>
              <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
                Description
              </h3>
              <p className="whitespace-pre-line text-slate-600 dark:text-slate-300">
                {partner.description}
              </p>
            </div>
          )}
          {partner.descriptionKm && (
            <div>
              <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
                Description (Khmer)
              </h3>
              <p className="whitespace-pre-line text-slate-600 dark:text-slate-300">
                {partner.descriptionKm}
              </p>
            </div>
          )}
        </div>

        {/* Basic information */}
        <div className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            Basic Information
          </h3>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <InfoRow icon={Users} label="Partner Name">
                  {partner.name || "No English name available"}
                </InfoRow>
                {partner.nameKh && (
                  <InfoRow icon={Users} label="Partner Name (Khmer)">
                    {partner.nameKh}
                  </InfoRow>
                )}
                <InfoRow icon={Mail} label="Email">
                  {partner.email}
                </InfoRow>
                <InfoRow icon={Phone} label="Phone">
                  {partner.phoneNumber}
                </InfoRow>
                <InfoRow icon={Building2} label="Sector of Activity">
                  {partner.sectorActivity ||
                    "No English sector activity available"}
                </InfoRow>
                {partner.sectorActivityKm && (
                  <InfoRow icon={Building2} label="Sector of Activity (Khmer)">
                    {partner.sectorActivityKm}
                  </InfoRow>
                )}
              </div>

              <div className="space-y-4">
                {partner.registrationNumber && (
                  <InfoRow icon={Hash} label="Registration Number">
                    <span className="font-mono">
                      {partner.registrationNumber}
                    </span>
                  </InfoRow>
                )}
                <InfoRow icon={IdCard} label="Publish Status">
                  {partner.isPublished ? "Published" : "Unpublished"}
                </InfoRow>
                {formattedAddress && (
                  <InfoRow icon={MapPin} label="Address">
                    {formattedAddress}
                  </InfoRow>
                )}
                {formattedAddressKm && (
                  <InfoRow icon={MapPin} label="Address (Khmer)">
                    {formattedAddressKm}
                  </InfoRow>
                )}
                <InfoRow icon={Calendar} label="Member Since">
                  {formatPartnerDate(partner.createdAt)}
                </InfoRow>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            Social Media &amp; Links
          </h3>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            {socialLinks.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {socialLinks}
              </div>
            ) : (
              <div className="py-4 text-center">
                <Globe className="mx-auto mb-2 size-8 text-slate-300 dark:text-slate-600" />
                <p className="text-slate-500 dark:text-slate-400">
                  No social media links available
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact persons */}
        <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            Contact Person
          </h3>

          {contactPersons.length > 0 ? (
            <div className="space-y-4">
              {contactPersons.map((person) => (
                <div
                  key={person.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <InfoRow icon={Users} label="Full Name">
                        {person.firstName} {person.lastName}
                      </InfoRow>
                      <InfoRow icon={Mail} label="Email">
                        {person.email}
                      </InfoRow>
                    </div>
                    <div className="space-y-3">
                      <InfoRow icon={Building2} label="Position">
                        {person.position || "—"}
                      </InfoRow>
                      <InfoRow icon={Phone} label="Phone Number">
                        {person.phoneNumber}
                      </InfoRow>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-slate-200 pt-3 dark:border-slate-700">
                    <h5 className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white">
                      <Globe className="size-4 text-blue-600" /> Social Media
                    </h5>
                    <ContactPersonSocialLinks person={person} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <Users className="mx-auto mb-4 size-12 text-slate-300 dark:text-slate-600" />
              <p className="text-slate-500 dark:text-slate-400">
                No contact persons available
              </p>
              <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
                Contact persons can be managed in the edit partner section
              </p>
            </div>
          )}
        </div>

        {/* Photos */}
        <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            Partner Photos
          </h3>

          {photos.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => openPhotoLightbox(index)}
                  title="Click to view photo in full size"
                  className="group aspect-video overflow-hidden rounded-lg border border-slate-200 bg-slate-100 p-0 dark:border-slate-800 dark:bg-slate-800"
                >
                  <img
                    src={photo.thumbnail || photo.url}
                    alt={`${partnerName} gallery item`}
                    className="size-full object-cover transition-transform group-hover:scale-105"
                  />
                </button>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <ImageIcon className="mx-auto mb-4 size-12 text-slate-300 dark:text-slate-600" />
              <p className="text-slate-500 dark:text-slate-400">
                No photos uploaded yet
              </p>
              <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
                Photos can be managed in the edit partner section
              </p>
            </div>
          )}
        </div>
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
        onConfirm={handleDeleteConfirm}
        title="Delete Partner"
        message={`Are you sure you want to delete "${partnerName}"? This action cannot be undone and will permanently remove all partner data including contact persons.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="error"
      />

      <ConfirmationModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onConfirm={handleStatusConfirm}
        title={`${partner.status === "ACTIVE" ? "Deactivate" : "Activate"} Partner`}
        message={
          partner.status === "ACTIVE"
            ? `Are you sure you want to deactivate "${partnerName}"? This will also unpublish them if they are currently published.`
            : `Are you sure you want to activate "${partnerName}"?`
        }
        confirmText={partner.status === "ACTIVE" ? "Deactivate" : "Activate"}
        cancelText="Cancel"
        variant={partner.status === "ACTIVE" ? "warning" : "info"}
      />

      <ConfirmationModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onConfirm={handlePublishConfirm}
        title={`${partner.isPublished ? "Unpublish" : "Publish"} Partner`}
        message={
          partner.isPublished
            ? `Are you sure you want to unpublish "${partnerName}"? Their profile will no longer be visible to the public.`
            : `Are you sure you want to publish "${partnerName}"? Their profile will become visible to the public.`
        }
        confirmText={partner.isPublished ? "Unpublish" : "Publish"}
        cancelText="Cancel"
        variant="info"
      />
    </main>
  );
}
