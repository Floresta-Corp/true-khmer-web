import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useFetcher, useNavigate } from "react-router";
import {
  CheckCircle2,
  FileText,
  Globe,
  Send,
  Star,
  User,
  X,
} from "lucide-react";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";

interface LaunchpadSubmitApplicationDialogProps {
  trigger: ReactNode;
  launchpadId: string;
  launchpadName?: string;
  selectedRoleIds: string[];
  topPickRoleId: string | null;
  roles?: Array<{ id: string; title: string }>;
}

interface ApplyFetcherData {
  success?: boolean;
  error?: string | { name?: string; message?: string };
}

const launchpadApplicationSchema = z.object({
  motivation: z
    .string()
    .trim()
    .min(5, "Please type at least 5 characters.")
    .max(2000, "Motivation must be 2000 characters or fewer."),
  relevantExperience: z
    .string()
    .trim()
    .min(5, "Please type at least 5 characters.")
    .max(2000, "Relevant experience must be 2000 characters or fewer."),
  portfolioUrl: z
    .string()
    .trim()
    .max(255, "Portfolio URL must be 255 characters or fewer.")
    .superRefine((value, context) => {
      if (!value) {
        return;
      }

      try {
        const url = new URL(value);
        if (url.protocol !== "https:") {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Portfolio must use HTTPS.",
          });
        }
      } catch {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter a valid URL that starts with https://.",
        });
      }
    }),
});

type LaunchpadApplicationErrors = Partial<
  Record<keyof z.infer<typeof launchpadApplicationSchema>, string>
> & {
  documents?: string;
};

function getErrorMessage(error: ApplyFetcherData["error"]): string {
  if (!error) {
    return "";
  }

  if (typeof error === "string") {
    return error;
  }

  const message = error.message;
  if (!message) {
    return error.name ?? "";
  }

  try {
    const parsed = JSON.parse(message);

    if (Array.isArray(parsed) && parsed.length > 0) {
      const firstIssue = parsed[0];
      if (firstIssue && typeof firstIssue.message === "string") {
        return firstIssue.message;
      }
    }
  } catch {
    // Fall back to the raw message if it is not JSON.
  }

  return message;
}

function getLaunchpadApplicationErrors(values: {
  motivation: string;
  relevantExperience: string;
  portfolioUrl: string;
}): LaunchpadApplicationErrors {
  const parsed = launchpadApplicationSchema.safeParse(values);
  if (parsed.success) {
    return {};
  }

  const errors: LaunchpadApplicationErrors = {};

  for (const issue of parsed.error.issues) {
    const field = issue.path[0];

    if (field === "motivation" && !errors.motivation) {
      errors.motivation = issue.message;
    }

    if (field === "relevantExperience" && !errors.relevantExperience) {
      errors.relevantExperience = issue.message;
    }

    if (field === "portfolioUrl" && !errors.portfolioUrl) {
      errors.portfolioUrl = issue.message;
    }
  }

  return errors;
}

export default function LaunchpadSubmitApplicationDialog({
  trigger,
  launchpadId,
  launchpadName,
  selectedRoleIds,
  topPickRoleId,
  roles = [],
}: LaunchpadSubmitApplicationDialogProps) {
  const fetcher = useFetcher<ApplyFetcherData>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [motivation, setMotivation] = useState("");
  const [relevantExperience, setRelevantExperience] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [clientErrors, setClientErrors] = useState<LaunchpadApplicationErrors>(
    {},
  );
  const [documents, setDocuments] = useState<File[]>([]);
  const [open, setOpen] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);

  const selectedRole =
    roles.find((r) => r.id === topPickRoleId) ??
    roles.find((r) => r.id === selectedRoleIds[0]);
  const isSubmitting = fetcher.state !== "idle";
  const isSuccess = justSubmitted || fetcher.data?.success === true;
  const errorMessage = getErrorMessage(fetcher.data?.error);
  const isFormValid = launchpadApplicationSchema.safeParse({
    motivation,
    relevantExperience,
    portfolioUrl,
  }).success;

  useEffect(() => {
    if (fetcher.data?.success) {
      setJustSubmitted(true);
    }
  }, [fetcher.data?.success]);

  useEffect(() => {
    if (open) {
      setJustSubmitted(false);
    }
  }, [open]);

  function validateCurrentValues(nextValues?: {
    motivation: string;
    relevantExperience: string;
    portfolioUrl: string;
  }) {
    const values = nextValues ?? {
      motivation,
      relevantExperience,
      portfolioUrl,
    };
    const errors = getLaunchpadApplicationErrors(values);
    setClientErrors(errors);
    return errors;
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) {
      setDocuments((prev) => [...prev, ...files].slice(0, 5));
      // Clear document error when a file is added
      if (clientErrors.documents) {
        setClientErrors((prev) => {
          const { documents: _, ...rest } = prev;
          return rest;
        });
      }
    }
    e.target.value = "";
  }

  function replaceDocument(index: number) {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setDocuments((prev) => {
          const next = [...prev];
          next[index] = file;
          return next;
        });
      }
    };
    input.click();
  }

  function removeDocument(index: number) {
    setDocuments((prev) => {
      return prev.filter((_, i) => i !== index);
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (selectedRoleIds.length === 0) {
      return;
    }

    const errors = validateCurrentValues();
    if (Object.keys(errors).length > 0) {
      return;
    }

    const formData = new FormData();
    formData.set("launchpadId", launchpadId);
    formData.set("launchpadRoleId", topPickRoleId ?? selectedRoleIds[0] ?? "");
    formData.set("launchpadRoleIds", JSON.stringify(selectedRoleIds));
    if (topPickRoleId) {
      formData.set("topPickRoleId", topPickRoleId);
    }
    formData.set("motivation", motivation);
    formData.set("relevantExperience", relevantExperience);
    if (portfolioUrl.trim()) {
      formData.set("portfolio", portfolioUrl.trim());
    }
    for (const file of documents) {
      formData.append("documentFiles", file);
    }
    fetcher.submit(formData, {
      method: "POST",
      action: "/api/launchpad/batch-apply",
      encType: "multipart/form-data",
    });
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setMotivation("");
      setRelevantExperience("");
      setPortfolioUrl("");
      setClientErrors({});
      setDocuments([]);
      setJustSubmitted(false);
    }
  }

  const selectedRolesList = roles.filter((r) => selectedRoleIds.includes(r.id));

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        className={
          isSuccess
            ? "w-[320px] max-w-[320px] gap-5 rounded-[14px] border-[0.8px] border-[#D0FAE5] bg-[#ECFDF5] px-4.25 py-5.5 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.10),0px_4px_6px_-2px_rgba(0,0,0,0.05)] sm:max-w-[320px] [&>button]:top-3 [&>button]:right-3 [&>button]:size-4 [&>button]:rounded-full [&>button]:p-0 [&>button]:text-[#65758B] [&>button_svg]:size-4"
            : "flex max-h-[90vh] flex-col gap-4 rounded-lg border border-[#E2E8F0] p-4 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.10),0px_4px_6px_-2px_rgba(0,0,0,0.05)] sm:max-w-140 sm:p-6 [&>button]:top-3.75 [&>button]:right-3.75 [&>button]:size-4 [&>button]:rounded-full [&>button]:p-0 [&>button]:text-[#65758B] [&>button_svg]:size-4"
        }
      >
        {isSuccess ? (
          <SuccessState
            roleName={selectedRole?.title ?? ""}
            projectName={launchpadName ?? ""}
            onClose={() => {
              setOpen(false);
              navigate("/launchpad");
            }}
            onViewApplications={() => {
              setOpen(false);
              navigate("/my-applications");
            }}
          />
        ) : (
          <>
            <DialogHeader className="shrink-0 gap-0">
              <DialogTitle className="text-lg font-semibold text-[#0F1729]">
                Apply for project
              </DialogTitle>
            </DialogHeader>

            <Separator className="shrink-0 bg-[#E1E7EF]" />

            <div className="flex shrink-0 items-center gap-3.5 rounded-[14px] border-[0.8px] border-[rgba(47,111,228,0.10)] bg-[#F0F6FF] px-4.5 py-[20.8px]">
              <div className="flex size-8.75 items-center justify-center rounded-2xl bg-[#2F6FE4] text-white">
                <User className="size-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] leading-[19.5px] font-bold text-[#2F6FE4]">
                  Your True Khmer profile will be automatically shared
                </p>
                <p className="text-[11px] leading-[16.5px] font-medium text-[rgba(47,111,228,0.70)]">
                  The project owner will see your profile, tier, and details.
                </p>
              </div>
            </div>

            {errorMessage && (
              <p className="shrink-0 rounded-lg bg-red-50 px-4 py-2 text-xs text-red-600">
                {errorMessage}
              </p>
            )}

            <form
              className="flex min-h-0 flex-1 flex-col"
              onSubmit={handleSubmit}
            >
              <div className="min-h-0 flex-1 space-y-5 overflow-y-auto">
                {selectedRolesList.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs leading-4.5 font-medium text-[#364153]">
                      Roles of Interest
                    </p>
                    <div className="space-y-2">
                      {selectedRolesList.map((role) => (
                        <div
                          key={role.id}
                          className={cn(
                            "flex items-center justify-between rounded-lg border px-3 py-2 text-sm",
                            topPickRoleId === role.id
                              ? "border-[#2f6fe4] bg-[#f0f6ff]"
                              : "border-[#e1e7ef] bg-[#f8fafc]",
                          )}
                        >
                          <div className="flex min-w-0 flex-1 items-center gap-2">
                            {topPickRoleId === role.id && (
                              <Star className="size-3.5 shrink-0 fill-[#2f6fe4] text-[#2f6fe4]" />
                            )}
                            <span className="truncate font-medium text-[#030213]">
                              {role.title}
                            </span>
                            {topPickRoleId === role.id && (
                              <span className="shrink-0 text-[10px] font-semibold text-[#2f6fe4] uppercase">
                                Top Pick
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-xs leading-4.5 font-medium text-[#364153]">
                    Why do you want to join this project?
                  </p>
                  <Textarea
                    value={motivation}
                    onChange={(e) => {
                      const nextValue = e.target.value.slice(0, 2000);
                      setMotivation(nextValue);
                      if (clientErrors.motivation) {
                        setClientErrors((previous) => ({
                          ...previous,
                          motivation: getLaunchpadApplicationErrors({
                            motivation: nextValue,
                            relevantExperience,
                            portfolioUrl,
                          }).motivation,
                        }));
                      }
                    }}
                    onBlur={() => validateCurrentValues()}
                    placeholder="Share what excites you about this project and what you bring to the team."
                    required
                    rows={3}
                    aria-invalid={Boolean(clientErrors.motivation)}
                    className="w-full resize-none rounded-lg border-0 bg-[#F8FAFC] px-3 py-2.5 text-xs text-[#344256] outline-none placeholder:text-[#9EACC0] focus:ring-0"
                  />
                  {clientErrors.motivation && (
                    <p className="text-xs text-red-500">
                      {clientErrors.motivation}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-xs leading-4.5 font-medium text-[#364153]">
                    Relevant Experience
                  </p>
                  <Textarea
                    value={relevantExperience}
                    onChange={(e) => {
                      const nextValue = e.target.value.slice(0, 2000);
                      setRelevantExperience(nextValue);
                      if (clientErrors.relevantExperience) {
                        setClientErrors((previous) => ({
                          ...previous,
                          relevantExperience: getLaunchpadApplicationErrors({
                            motivation,
                            relevantExperience: nextValue,
                            portfolioUrl,
                          }).relevantExperience,
                        }));
                      }
                    }}
                    onBlur={() => validateCurrentValues()}
                    placeholder="Tell us about the experience that makes you a strong fit for these roles."
                    required
                    rows={3}
                    aria-invalid={Boolean(clientErrors.relevantExperience)}
                    className="w-full resize-none rounded-lg border-0 bg-[#F8FAFC] px-3 py-2.5 text-xs text-[#344256] outline-none placeholder:text-[#9EACC0] focus:ring-0"
                  />
                  {clientErrors.relevantExperience && (
                    <p className="text-xs text-red-500">
                      {clientErrors.relevantExperience}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-xs leading-4.5 font-medium text-[#364153]">
                    Portfolio
                  </p>
                  <InputGroup className="h-11 rounded-lg bg-[#F8FAFC]">
                    <InputGroupAddon>
                      <Globe className="size-4 shrink-0 text-[#9EACC0]" />
                    </InputGroupAddon>
                    <InputGroupInput
                      type="url"
                      value={portfolioUrl}
                      onChange={(e) => {
                        const nextValue = (
                          e.target as HTMLInputElement
                        ).value.slice(0, 255);
                        setPortfolioUrl(nextValue);
                        if (clientErrors.portfolioUrl) {
                          setClientErrors((previous) => ({
                            ...previous,
                            portfolioUrl: getLaunchpadApplicationErrors({
                              motivation,
                              relevantExperience,
                              portfolioUrl: nextValue,
                            }).portfolioUrl,
                          }));
                        }
                      }}
                      onBlur={() => validateCurrentValues()}
                      aria-invalid={Boolean(clientErrors.portfolioUrl)}
                      placeholder="https://..."
                      className="h-full bg-transparent p-0 text-xs text-[#344256] placeholder:text-[#9EACC0] focus-visible:ring-0"
                    />
                  </InputGroup>
                  {clientErrors.portfolioUrl && (
                    <p className="text-xs text-red-500">
                      {clientErrors.portfolioUrl}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <p className="text-xs leading-4.5 font-medium text-[#364153]">
                      Supporting Documents
                    </p>
                    {documents.length < 5 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="cursor-pointer text-xs leading-4.5 font-semibold text-[#2F6FE4]"
                      >
                        + Add
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  {documents.length > 0 && (
                    <div className="space-y-2">
                      {documents.map((file, index) => (
                        <div
                          key={`${file.name}-${index}`}
                          className="flex items-center justify-between rounded-lg border border-[#F1F5F9] p-2.5"
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            <FileText className="size-6 shrink-0 text-[#344256]" />
                            <p className="truncate text-xs leading-3.75 text-[#0A0A0A]">
                              {file.name}
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-1">
                            <button
                              type="button"
                              onClick={() => replaceDocument(index)}
                              className="rounded-full bg-[#F8FAFC] px-3 py-1 text-xs leading-[19.5px] font-medium text-[#65758B]"
                            >
                              Replace
                            </button>
                            <button
                              type="button"
                              onClick={() => removeDocument(index)}
                              className="flex size-6 cursor-pointer items-center justify-center rounded-full text-[#9EACC0] hover:text-[#64748B]"
                            >
                              <X className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {clientErrors.documents && (
                    <p className="text-xs text-red-500">
                      {clientErrors.documents}
                    </p>
                  )}
                </div>
              </div>

              <DialogFooter className="mx-0 mt-4 mb-0 shrink-0 border-0 bg-transparent p-0 sm:justify-end">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 rounded-lg border-[#E1E7EF] px-6 text-sm font-medium text-[#1D283A]"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={
                    isSubmitting || selectedRoleIds.length === 0 || !isFormValid
                  }
                  className="h-10 gap-2 rounded-lg bg-[#2F6FE4] px-6 text-sm font-medium text-white hover:bg-[#245cc2] disabled:opacity-50"
                >
                  <Send className="size-4" />
                  {isSubmitting ? "Submitting…" : "Submit application"}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function SuccessState({
  roleName,
  projectName,
  onClose,
  onViewApplications,
}: {
  roleName: string;
  projectName: string;
  onClose: () => void;
  onViewApplications: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#DCFCE7]">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#00BC7D]">
          <CheckCircle2 className="size-6 text-white" />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xl font-bold text-[#1FC16B]">You're in the queue!</p>
        <p className="text-sm leading-relaxed text-[#007A55]">
          Your application for{" "}
          <span className="font-bold text-[#007A55]">{roleName}</span>
          {projectName ? (
            <>
              {" "}
              at <span>{projectName}</span>
            </>
          ) : null}{" "}
          has been submitted. The team will review and get back to you soon.
        </p>
      </div>
      <div className="flex w-full flex-col gap-2.5">
        <Button
          className="h-11 w-full rounded-lg bg-[#2F6FE4] text-sm font-semibold text-white hover:bg-[#245cc2]"
          onClick={onViewApplications}
        >
          View My Application
        </Button>
        <Button
          variant="outline"
          onClick={onClose}
          className="h-11 w-full rounded-lg border border-[#E1E7EF] bg-white text-sm font-medium text-[#1D283A] hover:bg-[#F8FAFC]"
        >
          Explore More Projects
        </Button>
      </div>
    </div>
  );
}
