import { motion, AnimatePresence } from "motion/react";
import { useLoaderData } from "react-router";
import { cn } from "~/lib/utils";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";
import type { loader } from "../../routes/my-applications";
import { MyApplicationActions } from "../my-application-actions";
import { resolveImageURL } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "~/components/ui/accordion";
import type { Application } from "~/services/myspace/myspace-type";

function getSourceTypeStyle(sourceType: string) {
  switch (sourceType.toUpperCase()) {
    case "PROJECT":
      return {
        bg: "bg-[#EFF6FF]",
        border: "border-[#ACC5F4]",
        text: "text-blue-600",
      };
    case "VOLUNTEER":
    default:
      return {
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        text: "text-emerald-700",
      };
  }
}

function getStatusStyle(status: string) {
  switch (status.toUpperCase()) {
    case "CONFIRMED":
      return {
        bg: "bg-emerald-100",
        text: "text-emerald-800",
        border: "border-emerald-200",
        label: "Confirmed",
      };
    case "UNDER_REVIEW":
      return {
        bg: "bg-amber-100",
        text: "text-amber-800",
        border: "border-amber-200",
        label: "Under Review",
      };
    case "APPROVED":
      return {
        bg: "bg-blue-100",
        text: "text-blue-800",
        border: "border-blue-200",
        label: "Approved",
      };
    case "DECLINED":
      return {
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-200",
        label: "Declined",
      };
    case "COMPLETED":
      return {
        bg: "bg-gray-100",
        text: "text-gray-800",
        border: "border-gray-200",
        label: "Completed",
      };
    case "WITHDRAWN":
      return {
        bg: "bg-slate-100",
        text: "text-slate-800",
        border: "border-slate-200",
        label: "Withdrawn",
      };
    default:
      return {
        bg: "bg-gray-100",
        text: "text-gray-800",
        border: "border-gray-200",
        label: status,
      };
  }
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "TBD";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ApplicationCard({ app, index }: { app: Application; index: number }) {
  const statusStyle = getStatusStyle(app.status);
  const sourceTypeStyle = getSourceTypeStyle(app.sourceType);
  const image = resolveImageURL(app.imageKey || "");
  const showActionButtons =
    app.status === "COMPLETED" ||
    app.status === "WITHDRAWN" ||
    app.status === "DECLINED";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
    >
      <Card className="w-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6 space-y-4">
          <div className="flex gap-4">
            {/* Image Section */}
            <div className="relative shrink-0">
              <img
                src={image}
                alt={app.title}
                className="w-62.75 h-39.75 object-cover rounded-lg"
              />
              {/* Category Badge */}
              <span
                className={cn(
                  "absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border",
                  sourceTypeStyle.bg,
                  sourceTypeStyle.border,
                  sourceTypeStyle.text,
                )}
              >
                {app.sourceType}
              </span>
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2">
                  <h3 className="text-[22px] leading-8.25 font-bold text-gray-800">
                    {app.title}
                  </h3>
                  <p className="text-sm font-medium text-gray-500">
                    Applied {formatDate(app.appliedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border} rounded-full text-xs font-bold uppercase tracking-wide`}
                  >
                    {statusStyle.label}
                  </span>
                  {showActionButtons && (
                    <MyApplicationActions applicationId={app.id} />
                  )}
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex flex-col pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(app.deadline)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>TBD</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span>{app.location.name}</span>
                </div>
              </div>
            </div>
          </div>
          <Accordion
            type="single"
            collapsible
            defaultValue={
              app.status.toUpperCase() === "APPROVED" ? "approve" : undefined
            }
          >
            <AccordionItem value="approve">
              <AccordionContent className="space-y-4">
                <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl p-4">
                  <p className="text-sm font-semibold text-blue-600">
                    Congratulations! You've passed.
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    Please confirm your participation to finalize the
                    application.
                  </p>
                </div>
                <div>
                  <hr />
                </div>
                <div className="flex items-center justify-end gap-3">
                  <Button
                    variant={"outline"}
                    className="h-10.5 px-7 border border-[#CBD5E1] text-[#475569] rounded-xl"
                  >
                    Decline
                  </Button>
                  <Button className="h-10.5 px-7 bg-blue-600 rounded-xl">
                    Accept
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function MyApplicationCardList() {
  const { myApplication } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence mode="wait">
        {myApplication.applications.map((app, index) => (
          <ApplicationCard key={app.id} app={app} index={index} />
        ))}
      </AnimatePresence>
    </div>
  );
}
