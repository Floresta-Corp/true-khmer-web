import { Mail, PhoneCall, Send } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { resolveImageURL } from "~/lib/utils";
import ProfileLinkWrapper from "./profile-link-wrapper";

export interface AuthorCardProps {
  name: string;
  avatarKey: string | null;
  postedLabel: string;
  telegramUrl?: string;
  phoneUrl?: string;
  emailUrl?: string;
  authorId?: string | number;
  isAuthor?: boolean;
}

export default function AuthorCard({
  name,
  avatarKey,
  postedLabel,
  telegramUrl,
  phoneUrl,
  emailUrl,
  authorId,
  isAuthor,
}: AuthorCardProps) {
  const profileName = name;
  const profileImage = resolveImageURL(
    avatarKey,
    "/images/avatar_placeholder.webp",
  );

  return (
    <article className="rounded-[14px] border border-[`#e1e7ef`] bg-[`#F9FAFB`] p-4 h-[6.625rem]">
      <div className="flex items-center gap-5">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700 mb-3">Posted By</p>
          <div className="">
            <div className="flex h-full gap-3 items-center">
              <img
                src={profileImage}
                className="h-10 w-10 rounded-full object-cover"
                alt={profileName}
              />
              <div>
                <p className="whitespace-nowrap text-[16px] font-semibold leading-4">
                  {authorId ? (
                    <ProfileLinkWrapper authorId={authorId} isAuthor={isAuthor}>
                      {profileName}
                    </ProfileLinkWrapper>
                  ) : (
                    profileName
                  )}
                </p>
                <span className="whitespace-nowrap text-[12px] font-medium leading-3.75 text-slate-700">
                  {postedLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {telegramUrl ? (
            <Button
              asChild
              variant="outline"
              className="size-10 rounded-xl border-[#e1e7ef] bg-white p-0 text-[#0a0a0a] hover:bg-[#f8fafc]"
            >
              <a href={telegramUrl} target="_blank" rel="noopener noreferrer">
                <Send className="size-4" />
                <span className="sr-only">Telegram</span>
              </a>
            </Button>
          ) : null}

          {phoneUrl ? (
            <Button
              asChild
              variant="outline"
              className="size-10 rounded-xl border-[#e1e7ef] bg-white p-0 text-[#0a0a0a] hover:bg-[#f8fafc]"
            >
              <a href={phoneUrl}>
                <PhoneCall className="size-4" />
                <span className="sr-only">Phone</span>
              </a>
            </Button>
          ) : null}

          {emailUrl ? (
            <Button
              asChild
              variant="outline"
              className="size-10 rounded-xl border-[#e1e7ef] bg-white p-0 text-[#0a0a0a] hover:bg-[#f8fafc]"
            >
              <a href={emailUrl}>
                <Mail className="size-4" />
                <span className="sr-only">Email</span>
              </a>
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
