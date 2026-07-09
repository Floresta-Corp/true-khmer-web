import { useState, type ReactNode } from "react";
import { useNavigation, useSubmit } from "react-router";
import {
  Briefcase,
  Building2,
  Calendar,
  Check,
  Facebook,
  Globe,
  Hash,
  IdCard,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
  Users,
  VenusAndMars,
  X,
} from "lucide-react";

import { ConfirmationModal } from "~/features/admin/components/confirmation-modal";
import {
  formatRegistrationDate,
  getPackageBadgeClasses,
} from "./partner-utils";
import type {
  ContactPerson,
  PartnerAddress,
  PartnerRegistration,
} from "../types";

interface ReviewFormProps {
  partner: PartnerRegistration;
  contactPersons: ContactPerson[];
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Building2;
  label: string;
  children: ReactNode;
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

function AddressBlock({ address }: { address: PartnerAddress }) {
  const street = typeof address.street === "string" ? address.street : "";
  const city = typeof address.city === "string" ? address.city : "";
  const zipCode = typeof address.zipCode === "string" ? address.zipCode : "";
  const country = typeof address.country === "string" ? address.country : "";

  return (
    <div>
      {street && <p>{street}</p>}
      {city && (
        <p>
          {city}
          {zipCode ? `, ${zipCode}` : ""}
        </p>
      )}
      {country && <p>{country}</p>}
    </div>
  );
}

export function ReviewForm({ partner, contactPersons }: ReviewFormProps) {
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<"ACTIVE" | "DELETE" | null>(
    null,
  );

  const handleActionClick = (action: "ACTIVE" | "DELETE") => {
    setPendingAction(action);
    setShowConfirmModal(true);
  };

  const handleConfirmAction = () => {
    if (pendingAction) {
      submit({ action: pendingAction }, { method: "post" });
    }
    setShowConfirmModal(false);
  };

  const handleCancelAction = () => {
    if (isSubmitting) return;
    setShowConfirmModal(false);
    setPendingAction(null);
  };

  const pkg = partner.package;

  const socialLinks: ReactNode[] = [];
  if (partner.facebook) {
    socialLinks.push(
      <div key="facebook" className="flex items-center gap-2">
        <Facebook className="size-4 text-blue-600" />
        <a
          href={partner.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          Facebook Profile
        </a>
      </div>,
    );
  }
  if (partner.linkedin) {
    socialLinks.push(
      <div key="linkedin" className="flex items-center gap-2">
        <Linkedin className="size-4 text-blue-600" />
        <a
          href={partner.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          LinkedIn Profile
        </a>
      </div>,
    );
  }
  if (partner.telegram) {
    socialLinks.push(
      <div key="telegram" className="flex items-center gap-2">
        <Send className="size-4 text-blue-600" />
        <a
          href={`https://t.me/${partner.telegram}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          {partner.telegram}
        </a>
      </div>,
    );
  }
  if (partner.website) {
    socialLinks.push(
      <div key="website" className="flex items-center gap-2">
        <Globe className="size-4 text-blue-600" />
        <a
          href={partner.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          Company Website
        </a>
      </div>,
    );
  }

  return (
    <div className="w-full rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/50">
            <Building2 className="size-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white md:text-2xl">
              {partner.name || "—"}
            </h3>
          </div>
          <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300">
            {partner.status}
          </span>
        </div>

        {/* Registration Information */}
        <div className="space-y-4 sm:space-y-6">
          <div className="border-l-4 border-blue-600 pl-3 sm:pl-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white sm:text-lg">
              Registration Information
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
            <div className="space-y-5">
              <InfoRow icon={Building2} label="Company Name">
                <p>{partner.name || "—"}</p>
              </InfoRow>

              <InfoRow icon={Mail} label="Email">
                <p>{partner.email}</p>
              </InfoRow>

              <InfoRow icon={Phone} label="Phone">
                <p>{partner.phoneNumber}</p>
              </InfoRow>

              {partner.registrationNumber && (
                <InfoRow icon={Hash} label="Registration Number">
                  <p>{partner.registrationNumber}</p>
                </InfoRow>
              )}

              <InfoRow icon={Briefcase} label="Sector Activity">
                <p>{partner.sectorActivity || "—"}</p>
              </InfoRow>
            </div>

            <div className="space-y-5">
              {partner.address && (
                <InfoRow icon={MapPin} label="Address">
                  <AddressBlock address={partner.address} />
                </InfoRow>
              )}

              {pkg && (
                <InfoRow icon={Building2} label="Package">
                  <span
                    className={`mt-1 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getPackageBadgeClasses(
                      pkg,
                    )}`}
                  >
                    {pkg}
                  </span>
                </InfoRow>
              )}

              <InfoRow icon={Calendar} label="Registration Date">
                <p>{formatRegistrationDate(partner.createdAt)}</p>
              </InfoRow>
            </div>
          </div>
        </div>

        {/* Social Links & Contact */}
        <div className="space-y-4 sm:space-y-6">
          <div className="border-l-4 border-slate-300 pl-3 dark:border-slate-600 sm:pl-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white sm:text-lg">
              Social Links &amp; Contact
            </h3>
          </div>
          {socialLinks.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {socialLinks}
            </div>
          ) : (
            <p className="text-sm italic text-slate-400 dark:text-slate-500">
              No social links provided
            </p>
          )}
        </div>

        {/* Contact Persons */}
        {contactPersons.length > 0 && (
          <div className="space-y-4 sm:space-y-6">
            <div className="border-l-4 border-blue-400 pl-3 sm:pl-4">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white sm:text-lg">
                Contact Persons
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {contactPersons.map((contact) => (
                <div
                  key={contact.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Users className="mt-1 size-5 shrink-0 text-blue-600" />
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900 dark:text-white">
                          {contact.title} {contact.firstName} {contact.lastName}
                        </h4>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                          {contact.position}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="size-3.5 shrink-0 text-blue-600/70" />
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {contact.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="size-3.5 shrink-0 text-blue-600/70" />
                        <span className="text-slate-600 dark:text-slate-300">
                          {contact.phoneNumber}
                        </span>
                      </div>
                      {contact.gender && (
                        <div className="flex items-center gap-2">
                          <VenusAndMars className="size-3.5 shrink-0 text-blue-600/70" />
                          <span className="text-slate-600 dark:text-slate-300">
                            {contact.gender}
                          </span>
                        </div>
                      )}
                      {contact.identityNumber && (
                        <div className="flex items-center gap-2">
                          <IdCard className="size-3.5 shrink-0 text-blue-600/70" />
                          <span className="text-slate-600 dark:text-slate-300">
                            {contact.identityNumber}
                          </span>
                        </div>
                      )}
                      {contact.telegram && (
                        <div className="flex items-center gap-2">
                          <Send className="size-3.5 shrink-0 text-blue-600/70" />
                          <a
                            href={`https://t.me/${contact.telegram}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {contact.telegram}
                          </a>
                        </div>
                      )}
                      {contact.linkedin && (
                        <div className="flex items-center gap-2">
                          <Linkedin className="size-3.5 shrink-0 text-blue-600/70" />
                          <a
                            href={contact.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            LinkedIn Profile
                          </a>
                        </div>
                      )}
                      {contact.facebook && (
                        <div className="flex items-center gap-2">
                          <Facebook className="size-3.5 shrink-0 text-blue-600/70" />
                          <a
                            href={contact.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Facebook Profile
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="border-t border-slate-100 pt-6 dark:border-slate-800">
          <div className="flex flex-col justify-end gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => handleActionClick("DELETE")}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-rose-300 px-6 py-2.5 font-semibold text-rose-600 transition-colors hover:bg-rose-50 disabled:pointer-events-none disabled:opacity-50 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950/40"
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <X className="size-4" />
              )}
              Reject
            </button>
            <button
              type="button"
              onClick={() => handleActionClick("ACTIVE")}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
              Accept
            </button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={handleCancelAction}
        onConfirm={handleConfirmAction}
        title={pendingAction === "ACTIVE" ? "Accept Partner" : "Reject Partner"}
        message={
          pendingAction === "ACTIVE"
            ? "Are you sure you want to approve this partner registration? This will set their status to Active."
            : "Are you sure you want to reject this partner registration? This action cannot be undone and will permanently remove all data from the database."
        }
        confirmText={pendingAction === "ACTIVE" ? "Accept" : "Reject"}
        cancelText="Cancel"
        variant={pendingAction === "DELETE" ? "error" : "info"}
        loading={isSubmitting}
      />
    </div>
  );
}
