import { Award } from "lucide-react";
import { Button } from "~/components/ui/button";

export function CertificatesCta({
  certificates,
  onViewCertificates,
}: {
  certificates: number;
  onViewCertificates: () => void;
}) {
  if (certificates === 0) return null;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#e2e8f0] bg-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-[#2F6FE4]">
          <Award size={20} aria-hidden />
        </span>
        <div>
          <h3 className="text-[15px] font-bold text-[#1A1A2E]">
            Showcase your new skills
          </h3>
          <p className="text-[13px] text-[#8A94A6]">
            Download your {certificates === 1 ? "certificate" : "certificates"}{" "}
            and add {certificates === 1 ? "it" : "them"} to your profile.
          </p>
        </div>
      </div>

      <Button
        variant="outline"
        size="lg"
        className="shrink-0 border-[#1C5DD4] text-[#1C5DD4] hover:bg-[#EFF6FF] hover:text-[#1C5DD4]"
        onClick={onViewCertificates}
      >
        View my certificates
      </Button>
    </div>
  );
}
