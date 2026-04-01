import { ChevronLeft } from "lucide-react";
import { Link } from "react-router";

export default function BackToForum() {
  return (
    <Link
      to="/forum"
      className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#9eacc0] transition-colors hover:text-[#2f6fe4]"
    >
      <ChevronLeft className="h-4.5 w-4.5" />
      Back to forum
    </Link>
  );
}
