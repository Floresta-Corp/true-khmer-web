import { ChevronLeft } from "lucide-react";
import { Link } from "react-router";

export default function BackToVolunteerButton() {
  return (
    <Link
      to="/volunteer"
      className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#9eacc0] hover:text-[#7b8aa1]"
    >
      <ChevronLeft className="size-4.5" />
      Back to volunteers
    </Link>
  );
}
