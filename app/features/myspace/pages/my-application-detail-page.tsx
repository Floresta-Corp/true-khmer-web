import { EllipsisVertical } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useFetcher, useLoaderData } from "react-router";
import BackToButton from "~/components/back-to-button";
import IconButton from "~/components/icon-button";
import { Badge } from "~/components/ui/badge";
import { cn, resolveImageURL } from "~/lib/utils";
import { OwnerCard } from "../components/owner-card";
import { ProjectOverviewCard } from "../components/project-overview-card";
import { RewardCard } from "../components/reward-card";
import { StatusTimeline } from "../components/status-timeline";
import { WithdrawCard } from "../components/withdraw-card";
import type { loader } from "../routes/my-application.$sourceType.$applicationId";
import { ForumPageLayout } from "~/features/forum/components/forum-page-layout";

const DEFAULT_OVERVIEW =
  "Join the Khmer Heritage Trust in a critical mission to preserve our nation's architectural history. We are looking for dedicated volunteers to help document and protect delicate 10th-century carvings at lesser-known temple sites in the Siem Reap region. Your work will directly contribute to the digital archives used by global scholars and local preservationists.";

const DEFAULT_RESPONSIBILITIES = [
  "Assist professional archaeologists in documenting site conditions",
  "Develop interactive maps to visualize excavation progress",
  "Create a database for cataloging artifacts and findings",
  "Design user-friendly forms for recording onsite observations",
  "Implement 3D modeling tools to reconstruct ancient structures",
];

const DEFAULT_REQUIREMENTS = [
  "Integrate 3D scanning data for virtual site reconstructions",
  "Create automated tools for artifact cataloging and classification",
  "Design mobile apps for real-time field data entry and sharing",
];

const DEFAULT_OWNER = {
  name: "Mai Nguyen",
  role: "10+ volunteer posted",
  avatar: "/images/forum-avatar.jpg",
};

export default function MyApplicationDetailPage() {
  const {
    application,
    applicationTitle,
    statusLabel,
    sourceType,
    applicationId,
  } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const prefersReducedMotion = useReducedMotion();

  const detail = application as Record<string, any>;
  const title =
    applicationTitle ||
    detail?.title ||
    detail?.opportunity?.title ||
    "Lead Planter";
  const activeStep = getTimelineActiveStep(statusLabel);
  const overview =
    detail?.description || detail?.opportunity?.description || DEFAULT_OVERVIEW;
  const rewardPoints = Number(detail?.rewardPoints ?? 50);
  const rewardDate = detail?.rewardDate || "Nov 15, 2023";
  const flexibility = detail?.flexibility || "Flexible";
  const location =
    detail?.location?.name || detail?.locationName || "Riverside Center";
  const ownerName =
    detail?.owner?.name || detail?.createdBy?.name || DEFAULT_OWNER.name;
  const ownerRole =
    detail?.owner?.role || detail?.createdBy?.role || DEFAULT_OWNER.role;
  const ownerAvatar = detail?.owner?.avatarKey
    ? resolveImageURL(detail.owner.avatarKey)
    : detail?.owner?.avatarUrl || DEFAULT_OWNER.avatar;
  const telegramUrl = detail?.owner?.telegramUsername
    ? `https://t.me/${String(detail.owner.telegramUsername).replace("@", "")}`
    : undefined;
  const phoneLink = detail?.owner?.phoneNumber
    ? `tel:${detail.owner.phoneNumber}`
    : undefined;
  const emailLink = detail?.owner?.email
    ? `mailto:${detail.owner.email}`
    : undefined;
  const canWithdraw = !["WITHDRAWN", "COMPLETED"].includes(statusLabel);

  const handleWithdraw = () => {
    if (!canWithdraw || fetcher.state !== "idle") return;

    const formData = new FormData();
    formData.set("sourceType", sourceType);
    formData.set("applicationId", applicationId);
    formData.set("statusAction", "withdraw");

    fetcher.submit(formData, {
      method: "POST",
      action: "/api/myspace/my-application/change-status",
    });
  };

  console.log({
    application,
    applicationTitle,
    statusLabel,
    sourceType,
    applicationId,
  });

  return (
    // <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
    //   <div className="mx-auto flex w-full max-w-304 flex-col gap-6">
    <ForumPageLayout contentClassName="flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
        className="flex items-center justify-between"
      >
        <BackToButton to="/my-applications" />
        <IconButton
          icon={<EllipsisVertical className="size-4" />}
          ariaLabel="More options"
          disabled
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.3,
          delay: prefersReducedMotion ? 0 : 0.05,
        }}
        className="flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-[#182031] sm:text-[30px]">
            {title}
          </h1>
          <Badge
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] hover:bg-[#EAF2FF]",
              statusLabel === "WITHDRAWN" || statusLabel === "DECLINED"
                ? "bg-red-50 text-red-600 hover:bg-red-50"
                : "bg-[#EAF2FF] text-[#2F6FE4]",
            )}
          >
            {statusLabel}
          </Badge>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="flex min-w-0 flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.28 }}
          >
            <StatusTimeline
              activeStep={activeStep}
              appliedAt={detail?.appliedAt}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.28,
              delay: prefersReducedMotion ? 0 : 0.05,
            }}
          >
            <ProjectOverviewCard
              overview={overview}
              responsibilities={DEFAULT_RESPONSIBILITIES}
              requirements={DEFAULT_REQUIREMENTS}
            />
          </motion.div>
        </section>

        <section className="flex flex-col gap-4 lg:sticky lg:top-26 lg:h-fit">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.28,
              delay: prefersReducedMotion ? 0 : 0.1,
            }}
          >
            <RewardCard
              date={rewardDate}
              flexibility={flexibility}
              location={location}
              rewardPoints={rewardPoints}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.28,
              delay: prefersReducedMotion ? 0 : 0.15,
            }}
          >
            <OwnerCard
              avatar={ownerAvatar}
              name={ownerName}
              role={ownerRole}
              phone={phoneLink}
              email={emailLink}
              telegram={telegramUrl}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.28,
              delay: prefersReducedMotion ? 0 : 0.2,
            }}
          >
            <WithdrawCard
              disabled={!canWithdraw}
              isSubmitting={fetcher.state !== "idle"}
              onWithdraw={handleWithdraw}
            />
          </motion.div>
        </section>
      </div>
      {/* </div>
    </main> */}
    </ForumPageLayout>
  );
}

function getTimelineActiveStep(status: string) {
  switch (status.toUpperCase()) {
    case "COMPLETED":
      return 4;
    case "CONFIRMED":
    case "ACTIVE":
      return 3;
    case "APPROVED":
    case "PASSED":
      return 2;
    default:
      return 2;
  }
}
