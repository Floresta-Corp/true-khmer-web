import { Calendar, Clock3, MapPin, Users } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

interface ApplyForRoleModalProps {
  roleTitle: string;
  location: string;
  commitment: string;
  duration: string;
  spotsLeft: number;
}

export default function ApplyForRoleModal({
  roleTitle,
  location,
  commitment,
  duration,
  spotsLeft,
}: ApplyForRoleModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-10 bg-[#2f6fe4] px-6 text-sm font-medium text-[#f8fafc] hover:bg-[#245fca]">
          Apply for this Role
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[560px] rounded-[14px] border border-[#e1e7ef] p-0">
        <DialogHeader className="border-b border-[#f3f4f6] px-6 py-5">
          <DialogTitle className="text-xl text-[#030213]">
            Apply for role
          </DialogTitle>
          <DialogDescription className="text-sm text-[#6a7282]">
            Review this opportunity and confirm your application.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 px-6 py-5">
          <div>
            <p className="text-base font-semibold text-[#030213]">
              {roleTitle}
            </p>
            <p className="mt-1 text-sm text-[#6a7282]">
              Help preserve Khmer heritage with on-site documentation and
              support.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <p className="flex items-center gap-2 text-sm text-[#4a5565]">
              <MapPin className="size-4 text-[#99a1af]" /> {location}
            </p>
            <p className="flex items-center gap-2 text-sm text-[#4a5565]">
              <Clock3 className="size-4 text-[#99a1af]" /> {commitment}
            </p>
            <p className="flex items-center gap-2 text-sm text-[#4a5565]">
              <Calendar className="size-4 text-[#99a1af]" /> {duration}
            </p>
            <p className="flex items-center gap-2 text-sm text-[#009966]">
              <Users className="size-4" /> {spotsLeft} spots left
            </p>
          </div>

          <div className="rounded-xl border border-[#f3f4f6] bg-[#f9fafb] px-4 py-3 text-sm text-[#6a7282]">
            By continuing, your profile will be shared with the organizer for
            review.
          </div>
        </div>

        <DialogFooter className="border-t border-[#f3f4f6] px-6 py-4 sm:justify-between">
          <DialogClose asChild>
            <Button variant="outline" className="h-10 px-5">
              Cancel
            </Button>
          </DialogClose>
          <Button className="h-10 bg-[#2f6fe4] px-5 text-[#f8fafc] hover:bg-[#245fca]">
            Submit Application
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
