import type { OpportunityDetail } from "~/services/volunteer/types/opportunities";
import AuthorCard from "~/components/author-card";

interface OrganizerCardProps {
  volunteer: OpportunityDetail;
  userId?: string;
}

export default function OrganizerCard({
  volunteer,
  userId,
}: OrganizerCardProps) {
  const organizer = volunteer.organizer;

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

  const emailUrl = organizer.contact.email
    ? `mailto:${organizer.contact.email}`
    : undefined;

  return (
    <AuthorCard
      name={organizer.name || "Unknown"}
      avatarKey={organizer.avatarKey}
      postedLabel={opportunityCountLabel}
      telegramUrl={telegramUrl}
      phoneUrl={phoneUrl}
      emailUrl={emailUrl}
      authorId={organizer.id}
      isAuthor={userId === organizer.id ? true : false}
    />
  );
}
