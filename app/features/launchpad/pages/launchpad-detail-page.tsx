import { motion, useReducedMotion } from "motion/react";
import { useLoaderData } from "react-router";
import { useState } from "react";
import { EllipsisVertical } from "lucide-react";
import LaunchpadProjectDetailCard from "../components/card/launchpad-project-detail-card";
import LaunchpadProjectCoverCard from "../components/card/launchpad-project-cover-card";
import LaunchpadSeekingCollaborationCard from "../components/card/launchpad-seeking-collaboration-card";
import LaunchpadPresentationCard from "../components/card/launchpad-presentation-card";
import AuthorCard from "~/components/author-card";
import BackToButton from "~/components/back-to-button";
import IconButton from "~/components/icon-button";
import { Card, CardContent } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import type { loader } from "../routes/launchpad.$id";
import LaunchpadJoinProjectCard from "../components/card/launchpad-join-project-card";
import { ShareLaunchpadDialog } from "../components/dialog/share-launchpad-dialog";
import { Share2 } from "lucide-react";
import { resolveImageURL } from "~/lib/utils";

function formatPostedProjectCount(count: number): string {
  if (count >= 1000) return "1000+";
  if (count >= 500) return "500+";
  if (count >= 200) return "200+";
  if (count >= 100) return "100+";
  if (count >= 50) return "50+";
  if (count >= 10) return "10+";
  return "1+";
}

export default function LaunchpadDetailPage() {
  const { project, userId } = useLoaderData<typeof loader>();
  const hideApplyButton = project.createdBy.id === userId;
  const prefersReducedMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<"details" | "open-roles">(
    "details",
  );
  const handleTabChange = (value: string) => {
    setActiveTab(value === "open-roles" ? "open-roles" : "details");
  };
  const authorCardProps = {
    name: project.createdBy.name,
    avatarUrl: resolveImageURL(project.createdBy.avatarKey || undefined),
    postedLabel: `${formatPostedProjectCount(project.createdBy.launchpadCount)} projects posted`,
    telegramUrl: project.telegramUsername
      ? `https://t.me/${project.telegramUsername.replace("@", "")}`
      : undefined,
    phoneUrl: project.phoneNumber ? `tel:${project.phoneNumber}` : undefined,
    emailUrl: project.email ? `mailto:${project.email}` : undefined,
    authorId: project.createdBy.id,
  };
  const tabItemClassName =
    "rounded-none px-4 pb-3 text-sm font-medium text-[#65758b] transition-colors hover:text-blue-600 data-[state=active]:text-blue-600 data-[state=active]:after:bg-[#2f6fe4]";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-304 flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.3,
          }}
          className="flex items-center justify-between"
        >
          <BackToButton to="/launchpad" />
          <div className="flex items-center gap-2">
            <ShareLaunchpadDialog
              projectId={project.id}
              trigger={
                <IconButton
                  icon={<Share2 className="size-4" />}
                  ariaLabel="Share project"
                />
              }
            />
            <IconButton
              icon={<EllipsisVertical className="size-4" />}
              ariaLabel="More options"
              disabled
            />
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="flex min-w-0 flex-col gap-6">
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
              <LaunchpadProjectCoverCard project={project} />
            </motion.article>

            <Tabs value={activeTab} onValueChange={handleTabChange}>
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
                  <Card className="rounded-3xl bg-white shadow-none border-[#E7ECF3]">
                    <CardContent className="p-10 space-y-8">
                      <LaunchpadProjectDetailCard project={project} />
                      <LaunchpadPresentationCard project={project} />
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
                  <LaunchpadSeekingCollaborationCard
                    project={project}
                    hideApplyButton={hideApplyButton}
                  />
                </motion.div>
              </TabsContent>
            </Tabs>
          </section>

          <section className="flex flex-col gap-4 lg:sticky lg:top-26 lg:h-fit">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.3,
                delay: prefersReducedMotion ? 0 : 0.2,
              }}
            >
              <LaunchpadJoinProjectCard
                project={project}
                userId={userId}
                isActiveTabOpenRoles={activeTab === "open-roles"}
                onApplyNoRoles={() => setActiveTab("open-roles")}
                disableApplyButton={hideApplyButton}
                disableButtonMessage="You cannot apply for this project as you are the creator"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.3,
                delay: prefersReducedMotion ? 0 : 0.25,
              }}
            >
              <AuthorCard
                {...authorCardProps}
                isAuthor={userId === project.createdBy.id ? true : false}
              />
            </motion.div>
          </section>
        </div>
      </div>
    </main>
  );
}
