import { useCallback } from "react";
import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  Eye,
  FileText,
  Mail,
  MapPin,
  Phone,
  Rocket,
  Send,
  Users,
} from "lucide-react";
import { Link, useLoaderData, useNavigate } from "react-router";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import ContentImagePreview from "~/features/admin/components/content-image-preview";
import DeadlineBadge from "~/features/admin/components/deadline-badge";
import DetailPanel from "~/features/admin/components/detail-panel";
import DetailRow from "~/features/admin/components/detail-row";
import ModerationHoldNotice from "~/features/admin/components/moderation-hold-notice";
import { formatDate, formatMinutesOrHoursAgo } from "~/lib/time";
import { formatCompactNumber, resolveImageURL } from "~/lib/utils";
import { useLaunchpadModeration } from "../../hooks/use-launchpad-moderation";
import type { manageLaunchpadDetailLoader } from "../../services/manage-launchpad-detail.loader";
import DeleteLaunchpadDialog from "../launchpad/delete-launchpad-dialog";
import SuspendLaunchpadDialog from "../launchpad/suspend-launchpad-dialog";

export default function ManageLaunchpadDetailPage() {
  const { project } = useLoaderData<typeof manageLaunchpadDetailLoader>();
  const navigate = useNavigate();

  const handleDeleted = useCallback(() => {
    navigate("/tk-admin/manage-launchpad");
  }, [navigate]);

  const { deleteProject, suspendProject, unsuspendProject, isModerating } =
    useLaunchpadModeration({ onDeleted: handleDeleted });

  const isSuspended = project.status === "SUSPENDED";

  const cover = project.coverKey ? resolveImageURL(project.coverKey) : null;
  const documents = project.documentKeys.map((key, index) => ({
    key,
    name: project.documentNames[index] ?? `Document ${index + 1}`,
    url: resolveImageURL(key),
  }));

  const totalCapacity = project.roles.reduce(
    (total, role) => total + role.capacity,
    0,
  );

  const contacts = [
    project.email && {
      icon: <Mail size={13} />,
      label: "Email",
      value: project.email,
    },
    project.phoneNumber && {
      icon: <Phone size={13} />,
      label: "Phone",
      value: project.phoneNumber,
    },
    project.telegramUsername && {
      icon: <Send size={13} />,
      label: "Telegram",
      value: project.telegramUsername,
    },
  ].filter(Boolean) as {
    icon: React.ReactNode;
    label: string;
    value: string;
  }[];

  return (
    <div className="relative flex h-[calc(100vh-4rem)] flex-col bg-[#f8fafc] md:h-[calc(100vh-5rem)] dark:bg-slate-950">
      <div className="custom-scrollbar flex-1 overflow-auto p-6">
        <div className="mx-auto w-full max-w-5xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              to="/tk-admin/manage-launchpad"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <ArrowLeft size={16} />
              Back to launchpad management
            </Link>

            <div className="flex items-center gap-2">
              <Link
                to={`/launchpad/detail/${project.id}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                <ExternalLink size={14} />
                View on site
              </Link>

              <SuspendLaunchpadDialog
                launchpadId={project.id}
                projectName={project.name}
                suspended={isSuspended}
                onSuspend={suspendProject}
                onUnsuspend={unsuspendProject}
                disabled={isModerating}
                withLabel
              />

              <DeleteLaunchpadDialog
                launchpadId={project.id}
                projectName={project.name}
                onConfirm={deleteProject}
                disabled={isModerating}
                withLabel
              />
            </div>
          </div>

          {isSuspended && (
            <ModerationHoldNotice
              noun="project"
              visibility="Only its poster can see it, and nobody can apply."
              reason={project.suspensionReason}
            />
          )}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            {cover ? (
              <ContentImagePreview
                src={cover}
                title={project.name}
                className="h-48 w-full sm:h-60"
              />
            ) : (
              <div className="flex h-48 w-full items-center justify-center bg-slate-100 text-slate-300 sm:h-60 dark:bg-slate-800 dark:text-slate-600">
                <Rocket size={40} />
              </div>
            )}

            <div className="p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  {project.category?.name ?? "Uncategorized"}
                </span>
                <DeadlineBadge deadline={project.deadline} />
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  Posted {formatMinutesOrHoursAgo(project.createdAt)}
                </span>
              </div>

              <h1 className="mt-3 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl dark:text-white">
                {project.name}
              </h1>

              <p className="mt-3 text-sm leading-6.5 whitespace-pre-line text-slate-600 dark:text-slate-300">
                {project.description}
              </p>

              <div className="mt-5 flex items-center gap-2.5 border-t border-slate-100 pt-4 dark:border-slate-800">
                <Avatar className="size-9 shrink-0 border border-slate-100 dark:border-slate-800">
                  <AvatarImage
                    src={resolveImageURL(project.createdBy.avatarKey)}
                    alt={project.createdBy.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-xs">
                    {project.createdBy.name.trim().charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {project.createdBy.name}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {project.createdBy.launchpadCount} project
                    {project.createdBy.launchpadCount === 1 ? "" : "s"} posted
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
            <DetailPanel title={`Open roles (${project.roles.length})`}>
              {project.roles.length === 0 ? (
                <p className="py-4 text-center text-xs text-slate-400 dark:text-slate-500">
                  This project lists no roles.
                </p>
              ) : (
                <ul className="space-y-2.5">
                  {project.roles.map((role) => (
                    <li
                      key={role.id}
                      className="rounded-xl border border-slate-200/70 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-900/50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="min-w-0 truncate text-sm font-semibold text-slate-900 dark:text-white">
                          {role.title}
                        </p>
                        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-white px-2 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200 ring-inset dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700">
                          <Users size={12} />
                          {role.capacity} spot
                          {role.capacity === 1 ? "" : "s"}
                        </span>
                      </div>
                      {role.description && (
                        <p className="mt-1.5 text-xs leading-5 whitespace-pre-line text-slate-500 dark:text-slate-400">
                          {role.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </DetailPanel>

            <div className="space-y-4">
              <DetailPanel title="Details">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  <DetailRow
                    icon={<MapPin size={13} />}
                    label="City"
                    value={project.city?.name ?? "—"}
                  />
                  <DetailRow
                    icon={<CalendarDays size={13} />}
                    label="Deadline"
                    value={
                      project.deadline ? formatDate(project.deadline) : "—"
                    }
                  />
                  <DetailRow
                    icon={<Users size={13} />}
                    label="Total spots"
                    value={totalCapacity}
                  />
                  <DetailRow
                    icon={<Eye size={13} />}
                    label="Views"
                    value={formatCompactNumber(project.totalView)}
                  />
                </div>
              </DetailPanel>

              {contacts.length > 0 && (
                <DetailPanel title="Contact">
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {contacts.map((contact) => (
                      <DetailRow
                        key={contact.label}
                        icon={contact.icon}
                        label={contact.label}
                        value={contact.value}
                      />
                    ))}
                  </div>
                </DetailPanel>
              )}

              {documents.length > 0 && (
                <DetailPanel title={`Materials (${documents.length})`}>
                  <ul className="space-y-2">
                    {documents.map((material) => (
                      <li key={material.key}>
                        <a
                          href={material.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2.5 rounded-xl border border-slate-200/70 bg-slate-50/60 p-2.5 transition-colors hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800"
                        >
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-400 ring-1 ring-slate-200 ring-inset dark:bg-slate-800 dark:ring-slate-700">
                            <FileText size={14} />
                          </span>
                          <span className="min-w-0 flex-1 truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
                            {material.name}
                          </span>
                          <ExternalLink
                            size={13}
                            className="shrink-0 text-slate-400"
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                </DetailPanel>
              )}
            </div>
          </div>

          <div className="pb-2" />
        </div>
      </div>
    </div>
  );
}
