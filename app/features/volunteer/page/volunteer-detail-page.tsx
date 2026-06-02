import { motion, useReducedMotion } from "motion/react";
import EmptyPost from "../components/empty-post";
import OpportunityCover from "../components/sections/opportunity-cover";
import OpportunityDetailsGrid from "../components/sections/opportunity-details-grid";
import ProjectOverviewSection from "../components/sections/project-overview-section";
import BenefitsSection from "../components/sections/benefit-section";
import CommunityImpactSection from "../components/sections/project-impact-section";
import ApplicationSummary from "../components/sections/application-summary";
import BackToButton from "~/components/back-to-button";
import { Card, CardContent } from "~/components/ui/card";
import { useLoaderData, useFetcher, useSearchParams } from "react-router";
import type { loader } from "../routes/volunteer.$id";
import {
  Bookmark,
  EllipsisVertical,
  Flag,
  Link as LinkIcon,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { cn } from "~/lib/utils";
import { toast } from "sonner";
import ShareButton from "~/components/share-button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import { useState } from "react";
import CommitmentSection from "../components/sections/commitment-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import AvailableRolesSection from "../components/sections/available-role-section";
import { Separator } from "~/components/ui/separator";
import OrganizerCard from "../components/sections/organizer-card";

interface VolunteerDetailPageProps {}

export function VolunteerDetailPage({}: VolunteerDetailPageProps) {
  const { userId, volunteer } = useLoaderData<typeof loader>();
  const prefersReducedMotion = useReducedMotion();
  const fetcher = useFetcher();
  const [isSaved, setIsSaved] = useState(volunteer?.viewerSave ?? false);
  const [activeTab, setActiveTab] = useState<"details" | "open-roles">(
    "details",
  );
  const handleTabChange = (value: string) => {
    setActiveTab(value === "open-roles" ? "open-roles" : "details");
  };
  const saving = fetcher.state === "loading" || fetcher.state === "submitting";

  if (!volunteer) {
    return <EmptyPost />;
  }

  const totalCapacity =
    (volunteer as any)?.roles?.reduce(
      (sum: number, role: any) => sum + (role?.capacity ?? 0),
      0,
    ) ?? 0;
  const hideApplyButton = (volunteer as any)?.organizer?.id === userId;

  const handleSave = () => {
    setIsSaved(!isSaved);
    fetcher.submit(
      {
        opportunityId: volunteer.id,
        actionType: isSaved ? "unsave-opportunity" : "save-opportunity",
      },
      { method: isSaved ? "DELETE" : "POST" },
    );
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/volunteer/detail/${volunteer.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/volunteer/detail/${volunteer.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleReport = () => {
    toast.success("Report submitted");
  };

  const tabItemClassName =
    "rounded-none px-4 pb-3 text-sm font-medium text-[#65758b] transition-colors hover:text-blue-600 data-[state=active]:text-blue-600 data-[state=active]:after:bg-[#2f6fe4]";

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 md:px-12 lg:px-28">
      <div className="mx-auto flex w-full max-w-304 flex-col gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.3,
          }}
          className="flex items-center justify-between"
        >
          <BackToButton to="/volunteer" />
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={isSaved ? "Unsave opportunity" : "Save opportunity"}
              className={cn(
                "cursor-pointer size-8.75 rounded-[16px] border-0 bg-[#f8fafb] text-[#9eacc0] hover:bg-[#eff3f8] hover:text-[#65758b]",
                {
                  "bg-blue-600 text-white hover:bg-blue-700 hover:text-white":
                    isSaved,
                },
              )}
              onClick={handleSave}
            >
              {saving ? (
                <Spinner />
              ) : (
                <Bookmark
                  className={cn("size-3.5", {
                    "fill-white text-white": isSaved,
                  })}
                />
              )}
            </Button>
            <ShareButton onClick={handleShare} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer size-8.75 rounded-[16px] border-0 bg-[#f8fafb] text-[#9eacc0] hover:bg-[#eff3f8] hover:text-[#65758b]"
                >
                  <EllipsisVertical className="size-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {/* <DropdownMenuItem
                  onClick={handleCopyLink}
                  className="cursor-pointer gap-2"
                >
                  <LinkIcon className="size-3.5" />
                  Copy Link
                </DropdownMenuItem> */}
                <DropdownMenuItem
                  onClick={handleReport}
                  className="cursor-pointer gap-2"
                >
                  <Flag className="size-3.5" />
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="flex min-w-0 flex-col gap-4 md:gap-8">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.3,
                delay: prefersReducedMotion ? 0 : 0.05,
              }}
              className="flex flex-col gap-8 overflow-hidden rounded-3xl bg-white"
            >
              <OpportunityCover volunteer={volunteer} />
            </motion.article>

            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList variant="line" className="transition-all ">
                <TabsTrigger value="details" className={tabItemClassName}>
                  Details
                </TabsTrigger>
                <TabsTrigger value="open-roles" className={tabItemClassName}>
                  Open Roles
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
                >
                  <Card className="rounded-3xl bg-white shadow-none">
                    <CardContent className="p-10 [&_h2]:text-xl [&_h3]:text-xl [&_h2]:font-semibold [&_h3]:font-semibold space-y-8">
                      <OpportunityDetailsGrid volunteer={volunteer} hideIcon />
                      <Separator />

                      <ProjectOverviewSection volunteer={volunteer} />

                      <CommitmentSection volunteer={volunteer} />

                      <BenefitsSection volunteer={volunteer} compact hideIcon />

                      {volunteer.communityImpact && (
                        <CommunityImpactSection
                          volunteer={volunteer}
                          compact
                          hideIcon
                        />
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="open-roles" className="mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
                >
                  <Card className="rounded-3xl bg-white shadow-none">
                    <CardContent className="p-6">
                      <AvailableRolesSection
                        roles={(volunteer as any).roles}
                        showHeader
                        hideApplyButton={hideApplyButton}
                        userId={userId}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </section>

          <div className="self-start lg:sticky lg:top-28">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.3,
                delay: prefersReducedMotion ? 0 : 0.1,
              }}
              className="flex flex-col gap-6"
            >
              <ApplicationSummary
                volunteer={volunteer}
                totalCapacity={totalCapacity}
                disableApplyButton={hideApplyButton}
                disableButtonMessage="You cannot apply for this opportunity as you are the organizer"
                onApplyNoRoles={() => setActiveTab("open-roles")}
                isActiveTabOpenRoles={activeTab === "open-roles"}
              />
              <OrganizerCard volunteer={volunteer} userId={userId ?? ""} />
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
