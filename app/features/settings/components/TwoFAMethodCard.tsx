import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

export function TwoFAMethodCard({
  title,
  description,
  enabled,
  icon,
  onToggle,
  setupLabel,
}: {
  title: string;
  description: string;
  enabled: boolean;
  icon: React.ReactNode;
  onToggle: () => void;
  setupLabel?: string;
}) {
  return (
    <Card className="rounded-2xl border border-[#E5EAF2] shadow-sm">
      <CardContent className="space-y-4 p-6">
        <div>
          <h3 className="text-base font-semibold text-[#1A2233]">{title}</h3>
          <p className="mt-0.5 text-sm text-[#6B7A99]">{description}</p>
        </div>
        {enabled || !setupLabel ? (
          <div className="flex items-center justify-between rounded-xl bg-[#F8FAFC] px-4 py-3">
            <div className="flex items-center gap-2.5">
              {icon}
              <span className="text-sm font-semibold text-[#1A2233]">
                {enabled ? "Currently Enabled" : "Currently Disabled"}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onToggle}
              className={`h-8 rounded-lg px-4 text-sm font-semibold ${
                enabled
                  ? "border-[#D1D9E6] text-[#344256] hover:bg-[#F0F4FA]"
                  : "border-[#2F6FE4] text-[#2F6FE4] hover:bg-[#EEF3FD]"
              }`}
            >
              {enabled ? "Disable" : "Enable"}
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={onToggle}
            className="h-12 w-full rounded-xl border-[#E5EAF2] text-sm font-semibold text-[#1A2233] hover:bg-[#F0F4FA]"
          >
            {setupLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
