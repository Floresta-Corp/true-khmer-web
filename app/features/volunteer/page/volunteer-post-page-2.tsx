import {
  Globe,
  Info,
  Mail,
  Phone,
  Plus,
  Send,
  User,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useNavigate } from "react-router";
import { Separator } from "~/components/ui/separator";
import PublishOpportunitySuccessDialog from "../components/dialog/publish-opportunity-dialog";

interface VolunteerPostPage2Props {
  onBackToDetails: () => void;
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.6px] text-[#99a1af]">
      {children}
    </p>
  );
}

function PaleInput({
  placeholder,
  type = "text",
}: {
  placeholder: string;
  type?: string;
}) {
  return (
    <Input
      type={type}
      placeholder={placeholder}
      className="h-11 rounded-2xl border-transparent bg-[#f8fafc] px-4 text-sm text-[#364153] placeholder:text-[rgba(10,10,10,0.5)]"
    />
  );
}

export default function VolunteerPostPage2({
  onBackToDetails,
}: VolunteerPostPage2Props) {
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <section className="space-y-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-[#030213]">
          <Users className="size-4.5 text-[#2f6fe4]" />
          Available roles
        </h3>

        <div className="rounded-2xl border border-[#f3f4f6] bg-white p-6">
          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <SectionLabel>Role title</SectionLabel>
                <PaleInput placeholder="e.g., Field Researcher" />
              </div>

              <div className="space-y-2">
                <SectionLabel>Commitment</SectionLabel>
                <PaleInput placeholder="Flexible" />
              </div>

              <div className="space-y-2">
                <SectionLabel>Capacity</SectionLabel>
                <PaleInput placeholder="1" type="number" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-semibold text-[#030213]">
                    Responsibilities
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-xs font-semibold text-[#2f6fe4]"
                  >
                    + Add point
                  </Button>
                </div>
                <div className="h-10.5 rounded-2xl bg-[#f8fafc]" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-semibold text-[#030213]">
                    Requirements
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-xs font-semibold text-[#2f6fe4]"
                  >
                    + Add point
                  </Button>
                </div>
                <div className="h-10.5 rounded-2xl bg-[#f8fafc]" />
              </div>
            </div>

            <div className="border-t border-[#f9fafb] pt-4">
              <Button className="h-10 w-full bg-[#2f6fe4] text-sm text-[#f8fafc] hover:bg-[#245fca]">
                <Plus className="size-4" />
                Add role
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3.5">
        <h4 className="text-sm font-bold text-[#65758b]">Added roles (0)</h4>
        <div className="rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-6 text-sm font-medium text-[#99a1af]">
          No roles added yet. Use the form above to add roles to your
          opportunity.
        </div>
      </section>

      <section className="rounded-2xl border border-[#f3f4f6] bg-white p-6">
        <div className="space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-[#030213]">
              <Mail className="size-4.5 text-[#2f6fe4]" />
              Contact details
            </h3>

            <div className="inline-flex h-10.5 rounded-lg border border-[#f1f5f9] bg-[#f8fafc] p-1">
              <Button
                type="button"
                variant="ghost"
                className="h-auto inline-flex items-center gap-1.5 rounded-lg border border-[#f1f5f9] bg-white px-3.5 py-0 text-xs font-bold text-[#2f6fe4]"
              >
                <User className="size-3.5" />
                Use profile
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-auto px-3.5 py-0 text-xs font-bold text-[#65758b]"
              >
                Different contact
              </Button>
            </div>
          </div>

          <div className="grid gap-7 md:grid-cols-2">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[13px] font-semibold text-[#364153]">
                <Send className="size-3.5 text-[#2f6fe4]" />
                Telegram username
              </label>
              <PaleInput placeholder="@virak_hou" />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[13px] font-semibold text-[#364153]">
                <Mail className="size-3.5 text-[#ef4444]" />
                Email address
              </label>
              <PaleInput placeholder="virak.hou@impactkhmer.com" />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[13px] font-semibold text-[#364153]">
                <Phone className="size-3.5 text-[#00BC7D]" />
                Phone number (optional)
              </label>
              <PaleInput placeholder="+855 12 345 678" />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[13px] font-semibold text-[#364153]">
                <Globe className="size-3.5 text-[#2f6fe4]" />
                Website or link
              </label>
              <PaleInput placeholder="https://truekhmer.org" />
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-[#d5edff] bg-[#f4f8ff] px-3 py-2.5 text-xs font-semibold text-[#2f6fe4]">
            <Info className="size-3.5" />
            Using verified contact details from your True Khmer profile.
          </div>
        </div>
      </section>

      <section className="flex items-start gap-3.5 rounded-2xl border border-[#d5edff] bg-[#ebf5ff] p-4">
        <div className="flex size-9 items-center justify-center rounded-full border border-[#d5edff] bg-white">
          <Info className="size-4.5 text-[#174fb4]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#174fb4]">
            Platform verification
          </p>
          <p className="mt-0.5 max-w-165.25 text-xs font-medium leading-4.5 text-[#65758b]">
            To maintain quality, new opportunities from unverified accounts
            undergo a quick review process (4-6 hours) before being published
            globally.
          </p>
        </div>
      </section>

      <Separator className="bg-[#f3f4f6]" />

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          className="h-10 px-6"
          onClick={onBackToDetails}
        >
          Back to details
        </Button>
        <Button
          type="button"
          className="cursor-pointer h-10 bg-[#2f6fe4] px-6 hover:bg-[#245fca]"
          onClick={() => setIsPublishModalOpen(true)}
        >
          Publish opportunity
        </Button>
      </div>

      <PublishOpportunitySuccessDialog
        open={isPublishModalOpen}
        onOpenChange={setIsPublishModalOpen}
        onViewPost={() => navigate("/myposts")}
      />
    </div>
  );
}
