import { useFetcher, useLoaderData } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import {
  Ban,
  Calendar,
  Clock3,
  EllipsisVertical,
  Mail,
  MapPin,
  PhoneCall,
  Send,
  Star,
} from "lucide-react";
import BackToButton from "~/components/back-to-button";
import IconButton from "~/components/icon-button";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { cn, resolveImageURL } from "~/lib/utils";
import type { loader } from "../routes/my-application.$sourceType.$applicationId";

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

function formatDate(dateString?: string | null) {
  if (!dateString) return "TBD";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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

function StatusTimeline({
  activeStep,
  appliedAt,
}: {
  activeStep: number;
  appliedAt?: string | null;
}) {
  const prefersReducedMotion = useReducedMotion();
  const steps = [
    {
      label: "Submitted",
      date: formatDate(appliedAt),
    },
    {
      label: "Passed",
      date: "Oct 18, 2023",
    },
    {
      label: "Confirmed",
      date: "Pending",
    },
    {
      label: "Completed",
      date: "Next Step",
    },
  ];

  const progress = Math.max(0, Math.min((activeStep - 1) / 3, 1));

  return (
    <Card className="rounded-[28px] border-[#E7ECF3] bg-white shadow-none">
      <CardContent className="p-6 sm:p-8">
        <h2 className="text-[22px] font-semibold tracking-tight text-[#182031]">
          Application Status
        </h2>

        <div className="relative mt-8">
          <div className="absolute left-6 right-6 top-5 h-0.5 rounded-full bg-[#D8E3F4]" />
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ transformOrigin: "left" }}
            className="absolute left-6 right-6 top-5 h-0.5 rounded-full bg-[#2F6FE4]"
          />

          <div className="relative z-10 grid grid-cols-4 gap-2">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber <= activeStep;

              return (
                <div
                  key={step.label}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className={cn(
                      "flex size-9 items-center justify-center rounded-full border-4 shadow-sm",
                      isActive
                        ? "border-white bg-[#2F6FE4] text-white"
                        : "border-white bg-[#D5DCEC] text-[#94A3B8]",
                    )}
                  >
                    <span className="text-xs font-semibold">{stepNumber}</span>
                  </div>
                  <p
                    className={cn(
                      "mt-3 text-[13px] font-semibold",
                      isActive ? "text-[#1F2937]" : "text-[#94A3B8]",
                    )}
                  >
                    {step.label}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-[12px]",
                      isActive ? "text-[#64748B]" : "text-[#CBD5E1]",
                    )}
                  >
                    {step.date}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectOverviewCard({ overview }: { overview: string }) {
  return (
    <Card className="rounded-[28px] border-[#E7ECF3] bg-white shadow-none">
      <CardContent className="p-6 sm:p-8">
        <h2 className="text-[20px] font-semibold tracking-tight text-[#182031]">
          Project Overview
        </h2>
        <p className="mt-4 text-[15px] leading-7 text-[#556071]">{overview}</p>

        <Separator className="my-7 bg-[#EEF2F7]" />

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-[15px] font-semibold text-[#182031]">
              Responsibilities
            </h3>
            <ul className="space-y-3">
              {DEFAULT_RESPONSIBILITIES.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-[14px] leading-6 text-[#556071]"
                >
                  <span className="mt-1 inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-emerald-400 text-emerald-500">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[15px] font-semibold text-[#182031]">
              Requirements
            </h3>
            <ul className="space-y-3">
              {DEFAULT_REQUIREMENTS.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-[14px] leading-6 text-[#556071]"
                >
                  <span className="mt-1 inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-emerald-400 text-emerald-500">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RewardCard({
  date,
  flexibility,
  location,
  rewardPoints,
}: {
  date: string;
  flexibility: string;
  location: string;
  rewardPoints: number;
}) {
  return (
    <Card className="rounded-[24px] border-[#E7ECF3] bg-white shadow-none">
      <CardContent className="space-y-4 p-5">
        <div className="rounded-[20px] border border-[#E4EEF9] bg-[#F7FBFF] p-4">
          <div className="flex size-10 items-center justify-center rounded-full bg-[#2F6FE4] text-white shadow-[0px_12px_24px_-12px_rgba(47,111,228,0.9)]">
            <Star className="size-4.5 fill-current" />
          </div>
          <div className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">
            Impact Reward
          </div>
          <div className="text-[22px] font-bold tracking-tight text-[#2F6FE4]">
            {rewardPoints} Points
          </div>
        </div>

        <div className="space-y-3 text-[14px] text-[#5B687D]">
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-[#7C8BA1]" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock3 className="size-4 text-[#7C8BA1]" />
            <span>{flexibility}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-[#7C8BA1]" />
            <span>{location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function OwnerCard({
  avatar,
  name,
  role,
  phone,
  email,
  telegram,
}: {
  avatar: string;
  name: string;
  role: string;
  phone?: string;
  email?: string;
  telegram?: string;
}) {
  return (
    <Card className="rounded-[24px] border-[#E7ECF3] bg-white shadow-none">
      <CardContent className="space-y-4 p-5">
        <div className="text-[15px] font-medium text-[#182031]">
          Project Owner
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={avatar}
              alt={name}
              className="size-10 shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0">
              <div className="truncate text-[15px] font-semibold text-[#182031]">
                {name}
              </div>
              <div className="text-[12px] text-[#6A7282]">{role}</div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {telegram ? (
              <a
                href={telegram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex size-8 items-center justify-center rounded-lg border border-[#E7ECF3] bg-[#EDF4FF] text-[#2F6FE4] transition-colors hover:bg-[#DFEBFF]"
              >
                <Send className="size-3.5" />
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex size-8 items-center justify-center rounded-lg border border-[#E7ECF3] bg-[#EDF4FF] text-[#2F6FE4] opacity-50"
              >
                <Send className="size-3.5" />
              </button>
            )}

            {phone ? (
              <a
                href={phone}
                className="inline-flex size-8 items-center justify-center rounded-lg border border-[#E7ECF3] bg-white text-[#6A7282] transition-colors hover:bg-[#F8FAFB]"
              >
                <PhoneCall className="size-3.5" />
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex size-8 items-center justify-center rounded-lg border border-[#E7ECF3] bg-white text-[#6A7282] opacity-50"
              >
                <PhoneCall className="size-3.5" />
              </button>
            )}

            {email ? (
              <a
                href={email}
                className="inline-flex size-8 items-center justify-center rounded-lg border border-[#E7ECF3] bg-white text-[#6A7282] transition-colors hover:bg-[#F8FAFB]"
              >
                <Mail className="size-3.5" />
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex size-8 items-center justify-center rounded-lg border border-[#E7ECF3] bg-white text-[#6A7282] opacity-50"
              >
                <Mail className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function WithdrawCard({
  disabled,
  isSubmitting,
  onWithdraw,
}: {
  disabled: boolean;
  isSubmitting: boolean;
  onWithdraw: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      disabled={disabled || isSubmitting}
      onClick={onWithdraw}
      className="h-12 w-full rounded-2xl border-[#E7ECF3] bg-white text-sm font-medium text-[#5B687D] shadow-none transition-colors hover:bg-[#F8FAFC]"
    >
      <Ban className="mr-2 size-4" />
      {isSubmitting ? "Withdrawing..." : "Withdraw application"}
    </Button>
  );
}

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

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-304 flex-col gap-6">
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
            <Badge className="rounded-full bg-[#EAF2FF] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2F6FE4] hover:bg-[#EAF2FF]">
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
              <ProjectOverviewCard overview={overview} />
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
      </div>
    </main>
  );
}
