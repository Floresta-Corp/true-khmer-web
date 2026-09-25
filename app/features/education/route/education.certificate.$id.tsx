import { useState } from "react";
import { useLoaderData } from "react-router";
import { BackLink } from "~/components/back-link";
import { motion, useReducedMotion } from "motion/react";
import { ChevronLeft } from "lucide-react";
import { EducationPage } from "../components/education-page";
import { CertificateCard } from "../components/certificate-card";
import { RateCourseDialog } from "../components/rate-course-dialog";
import { educationCertificateAction } from "../services/education-certificate.action";
import { educationCertificateLoader } from "../services/education-certificate.loader";
import type { Route } from "./+types/education.certificate.$id";

export const loader = educationCertificateLoader;
export const action = educationCertificateAction;

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: `Certificate · ${data?.certificate.courseTitle ?? "Course"}` },
  ];
}

type CertificatePageData = Route.ComponentProps["loaderData"];

export default function CourseCertificatePage() {
  const data = useLoaderData<typeof loader>();

  return <CertificateView key={data.certificate.courseId} {...data} />;
}

function CertificateView({
  certificate,
  isCourseAvailable,
  backTo,
  ownReview,
}: CertificatePageData) {
  const prefersReducedMotion = useReducedMotion();
  const duration = prefersReducedMotion ? 0 : 0.35;

  const [isRateOpen, setIsRateOpen] = useState(
    isCourseAvailable && ownReview === null,
  );

  return (
    <EducationPage surface="muted">
      <div className="mx-auto max-w-205">
        <BackLink
          to={backTo}
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1C5DD4] hover:underline print:hidden"
        >
          <ChevronLeft className="size-4" aria-hidden />
          {isCourseAvailable ? "Back to course" : "Back to my classes"}
        </BackLink>

        {!isCourseAvailable && (
          <p className="mb-5 rounded-lg border border-[#F59E0B]/40 bg-[#F59E0B]/10 px-4 py-3 text-[13px] font-semibold text-[#B45309] print:hidden">
            This course is no longer offered. Your certificate stays valid and
            you can still share or print it.
          </p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration }}
        >
          <CertificateCard certificate={certificate} />
        </motion.div>
      </div>

      <RateCourseDialog
        open={isRateOpen}
        onOpenChange={setIsRateOpen}
        courseTitle={certificate.courseTitle}
      />
    </EducationPage>
  );
}
