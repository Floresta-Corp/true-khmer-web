import { resolveImageURL } from "~/lib/utils";
import type { OpportunityDetail } from "~/services/volunteer/types/opportunities";
import AuthorCard from "~/components/author-card";

interface OrganizerCardProps {
  volunteer: OpportunityDetail;
}

export default function OrganizerCard({ volunteer }: OrganizerCardProps) {
  const organizer = volunteer.organizer;

  const avatarUrl = resolveImageURL(
    organizer.avatarUrl || undefined,
    "/avatar_placeholer.webp",
  );

  const opportunityCountLabel =
    organizer.opportunityCount > 10
      ? `${organizer.opportunityCount}+ volunteers posted`
      : `${organizer.opportunityCount} volunteers posted`;

  const telegramUrl = organizer.contact.telegramUsername
    ? `https://t.me/${organizer.contact.telegramUsername.replace("@", "")}`
    : undefined;

  const phoneUrl = organizer.contact.phone
    ? `tel:+855${organizer.contact.phone.replace(/^\+?855/, "")}`
    : undefined;

  const emailUrl = `mailto:${organizer.contact.email}`;

  return (
    <AuthorCard
      name={organizer.name || "Unknown"}
      avatarUrl={avatarUrl}
      postedLabel={opportunityCountLabel}
      telegramUrl={telegramUrl}
      phoneUrl={phoneUrl}
      emailUrl={emailUrl}
      authorId={organizer.id}
    />
  );
}
