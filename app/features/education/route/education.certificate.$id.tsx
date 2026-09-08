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
  return [{ title: `Certificate · ${data?.course.title ?? "Course"}` }];
}

type CertificatePageData = Route.ComponentProps["loaderData"];

export default function CourseCertificatePage() {
  const data = useLoaderData<typeof loader>();

  return <CertificateView key={data.course.id} {...data} />;
}

function CertificateView({
  course,
  certificate,
  ownReview,
}: CertificatePageData) {
  const prefersReducedMotion = useReducedMotion();
  const duration = prefersReducedMotion ? 0 : 0.35;

  const [isRateOpen, setIsRateOpen] = useState(ownReview === null);

  return (
    <EducationPage surface="muted">
      <div className="mx-auto max-w-205">
        <BackLink
          to={`/education/${course.id}/learn`}
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1C5DD4] hover:underline print:hidden"
        >
          <ChevronLeft className="size-4" aria-hidden />
          Back to course
        </BackLink>

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
        courseTitle={course.title}
      />
    </EducationPage>
  );
}
