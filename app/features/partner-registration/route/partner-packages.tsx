import { useEffect, useState } from "react";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router";
import { ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { partnerPackagesLoader } from "../services/partner-packages.loader";
import { partnerPackagesAction } from "../services/partner-packages.action";
import { tiers } from "../data/tiers";
import { PackageCard } from "../components/package-card";

export const loader = partnerPackagesLoader;
export const action = partnerPackagesAction;

export function meta() {
  return [
    { title: "Choose your Package | True Khmer" },
    {
      name: "description",
      content:
        "Select a partnership package that aligns with your organization's goals and budget.",
    },
  ];
}

export default function PartnerPackages() {
  const { selectedPackage } = useLoaderData<typeof partnerPackagesLoader>();
  const actionData = useActionData<{ ok: boolean; error?: string }>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [selectedTier, setSelectedTier] = useState<string | null>(
    selectedPackage,
  );
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData.error);
    }
  }, [actionData]);

  const toggleCard = (tierId: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(tierId)) next.delete(tierId);
      else next.add(tierId);
      return next;
    });
  };

  const handleTierSelect = (tierId: string) => {
    if (tierId === "government") return;
    const tier = tiers.find((item) => item.id === tierId);
    setSelectedTier(tier ? tier.name : tierId);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[url('/images/registerBG2.webp')] bg-cover bg-no-repeat">
      <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-white p-5 lg:py-10 xl:px-24 dark:bg-slate-950">
        <button
          type="button"
          onClick={() => navigate("/registration/partner-registration")}
          disabled={isSubmitting}
          className="absolute left-4 top-4 flex items-center gap-2 text-slate-700 transition-colors hover:text-blue-600 lg:left-6 lg:top-6 dark:text-slate-300"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-medium">Go back</span>
        </button>

        <Form method="post" className="w-full max-w-7xl p-8">
          <input
            type="hidden"
            name="selectedPackage"
            value={selectedTier ?? ""}
          />

          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-base font-semibold text-blue-600">
                Partnership Packages
              </h2>
              <p className="mt-2 text-balance text-3xl font-semibold tracking-tight text-[#1e3a8a] sm:text-5xl dark:text-white">
                Choose Your Partnership Package
              </p>
            </div>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-center text-md font-medium text-slate-600 sm:text-xl dark:text-slate-400">
              Select a partnership package that aligns with your organization's
              goals and budget. Each package offers unique benefits and
              visibility opportunities.
            </p>

            <div className="mx-auto mt-10">
              <div className="mb-8 grid max-w-sm gap-8 sm:max-w-none sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {tiers.map((tier) => (
                  <PackageCard
                    key={tier.id}
                    tier={tier}
                    isSelected={selectedTier === tier.name}
                    isDisabled={tier.id === "government"}
                    isExpanded={expandedCards.has(tier.id)}
                    onSelect={() => handleTierSelect(tier.id)}
                    onToggle={() => toggleCard(tier.id)}
                  />
                ))}
              </div>

              <div className="mt-12 flex justify-center">
                <button
                  type="submit"
                  disabled={!selectedTier || isSubmitting}
                  className="inline-flex min-w-64 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Processing...
                    </>
                  ) : selectedTier ? (
                    "Continue to Contact Information"
                  ) : (
                    "Select a Package to Continue"
                  )}
                </button>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
