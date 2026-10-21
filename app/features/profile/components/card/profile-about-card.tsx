import { ArrowUpRight, Mail, Phone, Send } from "lucide-react";
import {
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";
import type { ReactNode } from "react";
import SkillBadgeComponent from "~/components/skill-badge";
import { Card } from "~/components/ui/card";
import type { ProfileSkill, ProfileUser } from "~/features/profile/types";

export type ProfileContact = Pick<
  ProfileUser,
  "email" | "phone" | "telegramUsername"
>;

interface ProfileAboutCardProps {
  about?: string;
  skills?: Array<string | ProfileSkill>;
  contact?: ProfileContact | null;
}

function formatPhone(phone: NonNullable<ProfileContact["phone"]>) {
  const parsed = parsePhoneNumberFromString(
    phone.nationalNumber,
    phone.country as CountryCode,
  );
  return parsed
    ? { label: parsed.formatInternational(), href: parsed.getURI() }
    : { label: phone.nationalNumber, href: `tel:${phone.nationalNumber}` };
}

/** True when the API returned at least one contact field for this viewer. */
export function hasContactDetails(contact?: ProfileContact | null) {
  return Boolean(contact?.email || contact?.phone || contact?.telegramUsername);
}

function ContactTile({
  icon,
  label,
  value,
  href,
  external,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      title={value}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex min-w-0 items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3 transition-colors hover:border-blue-100 hover:bg-blue-50/60 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-blue-900/50 dark:hover:bg-blue-950/30"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#1A73E8] shadow-[0_1px_2px_rgba(15,23,42,0.06)] dark:bg-slate-900 dark:text-blue-400">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-black tracking-widest text-slate-400 uppercase">
          {label}
        </span>
        <span className="mt-0.5 block truncate text-sm font-bold text-slate-800 dark:text-slate-200">
          {value}
        </span>
      </span>
      <ArrowUpRight
        className="size-4 shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#1A73E8] dark:text-slate-600"
        aria-hidden
      />
    </a>
  );
}

const SECTION_HEADING = "mb-4 border-b pb-3 text-lg font-bold";
const CARD = "h-full rounded-3xl p-6 shadow-none sm:p-8";

export default function ProfileAboutCard({
  about,
  skills,
  contact,
}: ProfileAboutCardProps) {
  // Fields hidden by the member's Contact Details visibility arrive as null.
  const phone = contact?.phone ? formatPhone(contact.phone) : null;
  const telegram = contact?.telegramUsername?.replace(/^@/, "");
  const hasSkills = Boolean(skills && skills.length > 0);
  const hasIntro = Boolean(about) || hasSkills;
  const hasContact = hasContactDetails(contact);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {hasIntro ? (
        <Card
          className={`${CARD} space-y-8 ${hasContact ? "lg:col-span-2" : "lg:col-span-3"}`}
        >
          {about ? (
            <section>
              <h2 className={SECTION_HEADING}>About</h2>
              <p className="text-sm leading-7 font-medium whitespace-pre-line text-slate-600 dark:text-slate-400">
                {about}
              </p>
            </section>
          ) : null}
          {hasSkills ? (
            <section>
              <h2 className={SECTION_HEADING}>Skills</h2>
              <div className="flex flex-wrap items-center gap-2">
                {skills?.map((skill, index) => {
                  const name = typeof skill === "string" ? skill : skill.name;
                  const key =
                    typeof skill === "string" ? `${name}-${index}` : skill.id;
                  return <SkillBadgeComponent key={key} skill={name} />;
                })}
              </div>
            </section>
          ) : null}
        </Card>
      ) : null}

      {hasContact ? (
        <Card className={`${CARD} ${hasIntro ? "" : "lg:col-span-3"}`}>
          <section>
            <h2 className={SECTION_HEADING}>Contact</h2>
            <div
              className={`grid grid-cols-1 gap-3 ${
                hasIntro ? "sm:grid-cols-2 lg:grid-cols-1" : "sm:grid-cols-3"
              }`}
            >
              {contact?.email ? (
                <ContactTile
                  icon={<Mail className="size-4" />}
                  label="Email"
                  value={contact.email}
                  href={`mailto:${contact.email}`}
                />
              ) : null}
              {phone ? (
                <ContactTile
                  icon={<Phone className="size-4" />}
                  label="Phone"
                  value={phone.label}
                  href={phone.href}
                />
              ) : null}
              {telegram ? (
                <ContactTile
                  icon={<Send className="size-4" />}
                  label="Telegram"
                  value={`@${telegram}`}
                  href={`https://t.me/${telegram}`}
                  external
                />
              ) : null}
            </div>
          </section>
        </Card>
      ) : null}
    </div>
  );
}
