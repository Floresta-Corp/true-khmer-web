import { useState } from "react";
import { Link, useLoaderData } from "react-router";
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

export default function CourseCertificatePage() {
  const { course, certificate } = useLoaderData<typeof loader>();
  const prefersReducedMotion = useReducedMotion();
  const duration = prefersReducedMotion ? 0 : 0.35;

  // The design opens the rating prompt as soon as the certificate is shown.
  const [isRateOpen, setIsRateOpen] = useState(true);

  return (
    <EducationPage surface="muted">
      <Link
        to={`/education/${course.id}/learn`}
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1C5DD4] hover:underline print:hidden"
      >
        <ChevronLeft className="size-4" aria-hidden />
        Back to course
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration }}
      >
        <CertificateCard certificate={certificate} />
      </motion.div>

      <RateCourseDialog
        open={isRateOpen}
        onOpenChange={setIsRateOpen}
        courseTitle={course.title}
      />
    </EducationPage>
  );
}
