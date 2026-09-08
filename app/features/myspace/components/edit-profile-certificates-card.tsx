import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { Award, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Spinner } from "~/components/ui/spinner";
import type {
  EditProfileCertificate,
  EditProfileCertificateOption,
} from "~/features/myspace/types";
import { formatDate } from "~/lib/time";

/** What the share action at /education/:id/certificate sends back. */
interface ShareCertificateResult {
  ok: boolean;
  courseId?: string;
  message?: string;
}

interface EditProfileCertificatesCardProps {
  /** Issued certificates; the ones on the profile are listed in the card. */
  certificates: EditProfileCertificate[];
  /** Completed courses the member can add, whether issued yet or not. */
  certificateOptions: EditProfileCertificateOption[];
}

/**
 * Certificates the member shows on their profile. Earned certificates come
 * from finishing a course, so this section adds and removes them from the
 * profile rather than creating them.
 */
export default function EditProfileCertificatesCard({
  certificates,
  certificateOptions,
}: EditProfileCertificatesCardProps) {
  const fetcher = useFetcher<ShareCertificateResult>();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [pendingCourseId, setPendingCourseId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const wasSubmitting = useRef(false);

  const shared = certificates.filter(
    (certificate) => certificate.sharedToProfile,
  );

  const query = search.trim().toLowerCase();
  const matches = query
    ? certificateOptions.filter(
        (option) =>
          option.courseTitle.toLowerCase().includes(query) ||
          (option.categoryName ?? "").toLowerCase().includes(query),
      )
    : certificateOptions;

  useEffect(() => {
    if (fetcher.state === "submitting") {
      wasSubmitting.current = true;
      return;
    }

    if (wasSubmitting.current && fetcher.state === "idle" && fetcher.data) {
      wasSubmitting.current = false;
      setPendingCourseId(null);

      if (fetcher.data.ok) {
        toast.success(fetcher.data.message ?? "Certificates updated.");
      } else {
        toast.error(
          fetcher.data.message ?? "Could not update your certificates.",
        );
      }
    }
  }, [fetcher.state, fetcher.data]);

  const handleAddOpenChange = (open: boolean) => {
    setIsAddOpen(open);
    if (!open) setSearch("");
  };

  const submitShare = (courseId: string, intent: "share" | "unshare") => {
    setPendingCourseId(courseId);
    fetcher.submit(
      { intent },
      { method: "post", action: `/education/${courseId}/certificate` },
    );
  };

  return (
    <Card className="border border-gray-200">
      <CardContent className="p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-gray-900">Certificates</h3>

          <Dialog open={isAddOpen} onOpenChange={handleAddOpenChange}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="flex shrink-0 cursor-pointer items-center gap-1 text-sm font-bold text-blue-600 transition-colors hover:text-blue-700"
              >
                <Plus className="size-4" aria-hidden />
                Add
              </button>
            </DialogTrigger>

            <DialogContent className="rounded-3xl p-6 sm:max-w-125 [&>button]:top-5 [&>button]:right-5">
              <DialogHeader>
                <DialogTitle className="pr-10 text-left text-xl font-bold text-gray-900">
                  Add a Certificate
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Certificates you have earned but are not showing on your
                  profile
                </DialogDescription>
              </DialogHeader>

              {certificateOptions.length > 0 ? (
                <>
                  <div className="relative">
                    <Search
                      className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-gray-400"
                      aria-hidden
                    />
                    <Input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search certificates..."
                      aria-label="Search certificates"
                      className="h-12 rounded-xl border-gray-200 pl-11 text-sm shadow-none"
                    />
                  </div>

                  {matches.length > 0 ? (
                    <div className="max-h-95 space-y-3 overflow-y-auto">
                      {matches.map((option) => (
                        <button
                          key={option.courseId}
                          type="button"
                          disabled={pendingCourseId === option.courseId}
                          onClick={() => submitShare(option.courseId, "share")}
                          className="flex w-full cursor-pointer items-center gap-4 rounded-2xl border border-gray-200 px-4 py-3 text-left transition-colors hover:border-blue-200 hover:bg-blue-50/40 disabled:opacity-60"
                        >
                          <CertificateIcon />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[15px] font-bold text-gray-900">
                              {option.courseTitle}
                            </span>
                            {option.categoryName && (
                              <span className="mt-0.5 block truncate text-[13px] font-semibold text-gray-400">
                                {option.categoryName}
                              </span>
                            )}
                          </span>
                          {pendingCourseId === option.courseId && (
                            <Spinner className="size-4 shrink-0 text-blue-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="py-6 text-center text-sm text-gray-400">
                      No certificate matches “{search.trim()}”.
                    </p>
                  )}
                </>
              ) : (
                <p className="py-6 text-center text-sm text-gray-400">
                  Every certificate you have earned is already on your profile.
                  Finish a course to earn another.
                </p>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {shared.length > 0 ? (
          <div className="space-y-3">
            {shared.map((certificate) => (
              <div
                key={certificate.id}
                className="flex items-center gap-4 rounded-2xl border border-gray-200 px-4 py-3"
              >
                <CertificateIcon />
                <CertificateText certificate={certificate} />
                <button
                  type="button"
                  aria-label={`Remove ${certificate.courseTitle} from your profile`}
                  className="shrink-0 cursor-pointer rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
                  disabled={pendingCourseId === certificate.courseId}
                  onClick={() => submitShare(certificate.courseId, "unshare")}
                >
                  {pendingCourseId === certificate.courseId ? (
                    <Spinner className="size-5" />
                  ) : (
                    <Trash2 className="size-5" aria-hidden />
                  )}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-10 text-center">
            <Award className="mb-2 size-7 text-gray-300" aria-hidden />
            <p className="text-sm font-semibold text-gray-400">
              No certificates on your profile
            </p>
            {certificateOptions.length === 0 && (
              <p className="mt-1 text-sm text-gray-400">
                Finish a course to earn your first certificate.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CertificateIcon() {
  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
      <Award className="size-5" aria-hidden />
    </span>
  );
}

function CertificateText({
  certificate,
}: {
  certificate: EditProfileCertificate;
}) {
  return (
    <span className="min-w-0 flex-1">
      <span className="block truncate text-[15px] font-bold text-gray-900">
        {certificate.courseTitle}
      </span>
      <span className="mt-0.5 block text-[13px] font-semibold text-gray-400">
        Completed {formatDate(certificate.completedAt)}
      </span>
    </span>
  );
}
