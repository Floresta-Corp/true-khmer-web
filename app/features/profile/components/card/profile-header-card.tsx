import { Card } from "~/components/ui/card";
import { resolveImageURL } from "~/lib/utils";

interface ProfileHeaderCardProps {
  profileImage?: string;
}

export default function ProfileHeaderCard({
  profileImage,
}: ProfileHeaderCardProps) {
  const displayImage = resolveImageURL(profileImage);
  return (
    <Card className="p-4">
      <div className="flex items-center">
        <div className="flex-1">
          <img
            src={displayImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div></div>
      </div>
    </Card>
  );
}
