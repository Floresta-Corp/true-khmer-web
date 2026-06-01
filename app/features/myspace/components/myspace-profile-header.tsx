import { Linkedin, Facebook, Twitter, Globe } from "lucide-react";
import { Card } from "~/components/ui/card";

interface ProfileHeaderProps {
  displayName: string;
  avatarUrl: string | null;
  firstName: string;
  lastName: string;
  occupation: string | null;
  bio: string | null;
  socialLinks: {
    linkedin?: string | null;
    facebook?: string | null;
    twitter?: string | null;
    website?: string | null;
  };
}

export function ProfileHeader({
  displayName,
  avatarUrl,
  firstName,
  lastName,
  occupation,
  bio,
  socialLinks,
}: ProfileHeaderProps) {
  return (
    <Card className="bg-white flex gap-8 items-center overflow-clip p-8 relative rounded-3xl shadow-none">
      <div className="flex flex-col items-start shrink-0">
        <div className="flex flex-col items-start justify-center overflow-clip p-2 rounded-[24px] size-40">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="object-cover size-full rounded-[24px]"
            />
          ) : (
            <div className="size-full bg-gray-200 rounded-[24px] flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-500">
                {firstName[0]}
                {lastName[0]}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 items-start min-w-0">
        <div className="flex flex-col gap-3 w-full">
          <div className="flex items-start w-full">
            <div className="flex flex-1 flex-col gap-2 justify-center min-w-0">
              <p className="font-bold text-[26px] leading-9.75 text-[#2c2f31] whitespace-nowrap">
                {displayName}
              </p>
              <p className="font-medium text-[18px] leading-6.75 text-[#65758b] whitespace-nowrap">
                {occupation || "No occupation set"}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start max-w-xl w-full">
            <p className="font-medium text-[14px] leading-5.25 text-[#595c5e]">
              {bio || "No bio set"}
            </p>
          </div>
        </div>
        <div className="flex items-end w-full">
          <div className="flex gap-2 items-center">
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#f1f5f9] rounded-full flex items-center justify-center size-8 hover:bg-[#e9f0ff] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="size-4" />
              </a>
            )}
            {socialLinks.facebook && (
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#f1f5f9] rounded-full flex items-center justify-center size-8 hover:bg-[#e9f0ff] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="size-4" />
              </a>
            )}
            {socialLinks.twitter && (
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#f1f5f9] rounded-full flex items-center justify-center size-8 hover:bg-[#e9f0ff] transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="size-4" />
              </a>
            )}
            {socialLinks.website && (
              <a
                href={socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#f1f5f9] rounded-full flex items-center justify-center size-8 hover:bg-[#e9f0ff] transition-colors"
                aria-label="Website"
              >
                <Globe className="size-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
