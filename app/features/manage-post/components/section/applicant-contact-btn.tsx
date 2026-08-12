import { Mail, Phone, Send } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { Candidate } from "~/features/manage-post/types";

interface CandidateProps {
  candidate: Candidate;
}

export default function ApplicantContactBtn({ candidate }: CandidateProps) {
  const telegramUrl = candidate.telegramUsername
    ? `https://t.me/${candidate.telegramUsername.replace("@", "")}`
    : undefined;
  const phoneUrl = candidate.phoneNumber
    ? `tel:+855${candidate.phoneNumber.replace(/^\+?855/, "")}`
    : undefined;
  const emailUrl = `mailto:${candidate.email}`;

  return (
    <div className="flex items-center gap-2">
      {telegramUrl ? (
        <Button
          asChild
          variant="outline"
          className="size-8 rounded-xl border-[#e1e7ef] bg-white p-0 text-[#0a0a0a] hover:bg-[#f8fafc]"
        >
          <a href={telegramUrl} target="_blank" rel="noopener noreferrer">
            <Send className="size-3.5" />
            <span className="sr-only">Telegram</span>
          </a>
        </Button>
      ) : null}

      {phoneUrl ? (
        <Button
          asChild
          variant="outline"
          className="size-8 rounded-xl border-[#e1e7ef] bg-white p-0 text-[#0a0a0a] hover:bg-[#f8fafc]"
        >
          <a href={phoneUrl}>
            <Phone className="size-3.5" />
            <span className="sr-only">Phone</span>
          </a>
        </Button>
      ) : null}

      <Button
        asChild
        variant="outline"
        className="size-8 rounded-xl border-[#e1e7ef] bg-white p-0 text-[#0a0a0a] hover:bg-[#f8fafc]"
      >
        <a href={emailUrl}>
          <Mail className="size-3.5" />
          <span className="sr-only">Email</span>
        </a>
      </Button>
    </div>
  );
}
