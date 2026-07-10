import { format } from "date-fns";
import { Building2, Calendar, Factory } from "lucide-react";
import FullFlower from "~/components/icons/fullFlower";

interface PartnerInfoCardsProps {
  name: string;
  description?: string | null;
  sectorActivity?: string | null;
  createdAt: string;
}

export function PartnerInfoCards({
  name,
  description,
  sectorActivity,
  createdAt,
}: PartnerInfoCardsProps) {
  const partnerSince = (() => {
    const date = new Date(createdAt);
    return Number.isNaN(date.getTime()) ? null : format(date, "MMMM d, yyyy");
  })();

  return (
    <div>
      <h2 className="mb-8 text-3xl font-bold text-card-foreground">
        About {name}
      </h2>

      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-muted to-card p-8 shadow-md transition-shadow duration-300 hover:shadow-lg">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-600/10">
              <Building2 className="size-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="mb-4 text-xl font-semibold text-card-foreground">
                Company Overview
              </h3>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {description || "No description available."}
              </p>
            </div>
          </div>
          <div className="absolute -top-4 -right-5 rotate-90 text-blue-600">
            <FullFlower width={100} height={100} />
          </div>
          <div className="absolute top-5 right-15 rotate-12 text-blue-600">
            <FullFlower width={60} height={60} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-r from-muted to-card p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary/40">
                <Factory className="size-5 text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <h4 className="mb-3 font-semibold text-card-foreground">
                  Industry Sector
                </h4>
                <p className="text-lg text-muted-foreground">
                  {sectorActivity || "—"}
                </p>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 rotate-45 text-blue-600">
              <FullFlower width={80} height={80} />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-r from-muted to-card p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/40">
                <Calendar className="size-5 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <h4 className="mb-2 font-semibold text-card-foreground">
                  Partnership Since
                </h4>
                <p className="text-lg text-muted-foreground">
                  {partnerSince ?? "—"}
                </p>
              </div>
            </div>
            <div className="absolute -top-6 -left-6 rotate-12 text-blue-600">
              <FullFlower width={60} height={60} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
