import { motion, useReducedMotion } from "motion/react";
import EmptyPost from "../empty-post";
import OpportunityCover from "../sections/opportunity-cover";
import OpportunityDetailsGrid from "../sections/opportunity-details-grid";
import ProjectOverviewSection from "../sections/project-overview-section";
import BenefitsSection from "../sections/benefit-section";
import CommunityImpactSection from "../sections/project-impact-section";
import ApplicationSummary from "../sections/application-summary";
import BackToButton from "~/components/back-to-button";
import { Card, CardContent } from "~/components/ui/card";
import {
  useLoaderData,
  useFetcher,
  useSearchParams,
  useLocation,
  useNavigate,
} from "react-router";
import type { loader } from "../../route/volunteer.$id";
import { Bookmark, EllipsisVertical, Flag } from "lucide-react";
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
import { useState, useEffect, useRef } from "react";
import CommitmentSection from "../sections/commitment-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import AvailableRolesSection from "../sections/available-role-section";
import { Separator } from "~/components/ui/separator";
import OrganizerCard from "../sections/organizer-card";
import VolunteerReportDialog from "../dialog/volunteer-report-dialog";

interface VolunteerDetailPageProps {}

export function VolunteerDetailPage({}: VolunteerDetailPageProps) {
  const { userId, volunteer, reportReasons } = useLoaderData<typeof loader>();
  const prefersReducedMotion = useReducedMotion();
  const fetcher = useFetcher();
  const [isSaved, setIsSaved] = useState(volunteer?.viewerSave ?? false);
  const [reportOpen, setReportOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = `${location.pathname}${location.search}`;
  const reportReasonOptions =
    reportReasons?.reportingTypes.map((v) => ({
      id: v.id,
      reason: v.type,
    })) ?? [];
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<"details" | "open-roles">(
    searchParams.get("tab") === "open-roles" ? "open-roles" : "details",
  );
  useEffect(() => {
    setActiveTab(
      searchParams.get("tab") === "open-roles" ? "open-roles" : "details",
    );
  }, [searchParams]);
  const rolesSectionRef = useRef<HTMLDivElement>(null);
  const handleTabChange = (value: string) => {
    setActiveTab(value === "open-roles" ? "open-roles" : "details");
  };
  const handleShowAvailableRoles = () => {
    setActiveTab("open-roles");
    if (typeof window !== "undefined" && window.innerWidth < 1280) {
      requestAnimationFrame(() => {
        rolesSectionRef.current?.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
      });
    }
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

  const handleReport = () => {
    if (!userId) {
      navigate(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
      return;
    }
    setReportOpen(true);
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
                "size-8.75 cursor-pointer rounded-[16px] border-0 bg-[#f8fafb] text-[#9eacc0] hover:bg-[#eff3f8] hover:text-[#65758b]",
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
                  className={cn("size-4.5 md:size-4", {
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
                  aria-label="More options"
                  className="size-8.75 cursor-pointer rounded-[16px] border-0 bg-[#f8fafb] text-[#9eacc0] hover:bg-[#eff3f8] hover:text-[#65758b]"
                >
                  <EllipsisVertical className="size-4.5 md:size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onSelect={(event) => {
                    // Keep Radix from returning focus to the menu trigger while the
                    // report dialog is mounting, which would steal focus from it.
                    event.preventDefault();
                    handleReport();
                  }}
                  className="cursor-pointer gap-2"
                >
                  <Flag className="size-4.5 md:size-4" />
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {userId && (
              <VolunteerReportDialog
                opportunityId={volunteer.id}
                title={volunteer.title}
                isAuthenticated={!!userId}
                reportReasons={reportReasonOptions}
                open={reportOpen}
                onOpenChange={setReportOpen}
              />
            )}
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

            <Tabs
              ref={rolesSectionRef}
              value={activeTab}
              onValueChange={handleTabChange}
              className="scroll-mt-24"
            >
              <TabsList variant="line" className="transition-all">
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
                    <CardContent className="space-y-5 p-8 md:space-y-8 md:p-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-xl [&_h3]:font-semibold">
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
                onApplyNoRoles={handleShowAvailableRoles}
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
