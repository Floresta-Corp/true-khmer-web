import { ChevronDown, Info, Mail } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

const profile = {
  id: "user-1",
  name: "Moran Hadad",
  role: "Founder & CEO",
  imageUrl: "/images/profile.jpg",
};

export default function LaunchpadAuthorCard() {
  return (
    <Card className="p-8 gap-6 h-53.25 flex flex-col bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <img
            src={profile.imageUrl}
            className="object-cover size-12 rounded-2xl shadow border border-[#F3F4F6]"
            alt="User"
          />
          <div>
            <div className="flex items-center gap-3.5">
              <div className="text-lg font-bold">{profile.name}</div>
            </div>
            <div className="uppercase text-[#6A7282] text-xs">
              {profile.role}
            </div>
          </div>
        </div>
        <Button
          variant="secondary"
          className="px-4 py-4.5 cursor-pointer bg-gray-100"
        >
          View Profile
        </Button>
      </div>
      <div className="flex items-center p-[17.5px] bg-[#F9FAFB] rounded-xl border border-[#F3F4F6] gap-3.5">
        <div className="p-2 rounded-full bg-white shadow border border-[#F3F4F6]">
          <Info size={17.5} className="text-blue-500" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm">Have Questions?</p>
          <p className="text-xs text-[#6A7282]">
            Contact the founder directly for more details about this role.
          </p>
        </div>
        <div className="rounded-full gap-2 flex border border-[#F3F4F6] bg-white text-blue-500 font-bold items-center py-2.5 px-4.5">
          <Mail size={14} />
          <p className="text-xs">Contact Organizer</p>
          <ChevronDown size={14} />
        </div>
      </div>
    </Card>
  );
}
