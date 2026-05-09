import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useFetcher, useNavigate } from "react-router";
import { CheckCircle2, FileText, Globe, User, X } from "lucide-react";
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
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { SelectOption } from "~/components/ui/select-option";

interface LaunchpadSubmitApplicationDialogProps {
  trigger: ReactNode;
  launchpadId: string;
  launchpadName?: string;
  selectedRoleId?: string;
  roles?: Array<{ id: string; title: string }>;
}

interface ApplyFetcherData {
  success?: boolean;
  error?: string;
}

export default function LaunchpadSubmitApplicationDialog({
  trigger,
  launchpadId,
  launchpadName,
  selectedRoleId,
  roles = [],
}: LaunchpadSubmitApplicationDialogProps) {
  const fetcher = useFetcher<ApplyFetcherData>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const roleOptions = roles.map((r) => ({ id: r.id, name: r.title }));
  const [roleId, setRoleId] = useState(
    selectedRoleId ?? roleOptions[0]?.id ?? "",
  );
  const [roleKey, setRoleKey] = useState(0);

  useEffect(() => {
    const defaultId = selectedRoleId ?? roleOptions[0]?.id ?? "";
    if (defaultId && defaultId !== roleId) {
      setRoleId(defaultId);
    }
  }, [selectedRoleId, roles]);
  const [motivation, setMotivation] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [documents, setDocuments] = useState<File[]>([]);
  const [open, setOpen] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);

  const selectedRole = roles.find((r) => r.id === roleId);
  const isSubmitting = fetcher.state !== "idle";
  const isSuccess = justSubmitted || fetcher.data?.success === true;
  const errorMessage = fetcher.data?.error;

  useEffect(() => {
    if (fetcher.data?.success) {
      setJustSubmitted(true);
    }
  }, [fetcher.data?.success]);

  useEffect(() => {
    if (errorMessage) {
      setRoleKey((k) => k + 1);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (open) {
      setJustSubmitted(false);
    }
  }, [open]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setDocuments((prev) => [...prev, ...files].slice(0, 5));
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
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData();
    formData.set("launchpadId", launchpadId);
    formData.set("launchpadRoleId", roleId);
    formData.set("motivation", motivation);
    if (portfolioUrl.trim()) {
      formData.set("portfolio", portfolioUrl.trim());
    }
    for (const file of documents) {
      formData.append("documentFiles", file);
    }
    fetcher.submit(formData, {
      method: "POST",
      action: "/api/launchpad/apply",
      encType: "multipart/form-data",
    });
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setMotivation("");
      setPortfolioUrl("");
      setDocuments([]);
      setRoleId(selectedRoleId ?? roleOptions[0]?.id ?? "");
      setJustSubmitted(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        className={
          isSuccess
            ? "w-[320px] max-w-[320px] gap-5 rounded-[14px] border-[0.8px] border-[#D0FAE5] bg-[#ECFDF5] px-4.25 py-5.5 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.10),0px_4px_6px_-2px_rgba(0,0,0,0.05)] sm:max-w-[320px] [&>button]:right-3 [&>button]:top-3 [&>button]:size-4 [&>button]:rounded-full [&>button]:p-0 [&>button]:text-[#65758B] [&>button_svg]:size-4"
            : "max-w-140 gap-4 rounded-lg border border-[#E2E8F0] p-6 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.10),0px_4px_6px_-2px_rgba(0,0,0,0.05)] sm:max-w-140 [&>button]:right-3.75 [&>button]:top-3.75 [&>button]:size-4 [&>button]:rounded-full [&>button]:p-0 [&>button]:text-[#65758B] [&>button_svg]:size-4"
        }
      >
        {isSuccess ? (
          <SuccessState
            roleName={selectedRole?.title ?? ""}
            projectName={launchpadName ?? ""}
            onClose={() => setOpen(false)}
            onViewApplications={() => {
              setOpen(false);
              navigate("/my-applications");
            }}
          />
        ) : (
          <>
            <DialogHeader className="gap-0">
              <DialogTitle className="text-lg font-semibold text-[#0F1729]">
                Apply for project
              </DialogTitle>
            </DialogHeader>

            <Separator className="bg-[#E1E7EF]" />

            <div className="flex items-center gap-3.5 rounded-[14px] border-[0.8px] border-[rgba(47,111,228,0.10)] bg-[#F0F6FF] px-4.5 py-[20.8px]">
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
              <p className="rounded-lg bg-red-50 px-4 py-2 text-xs text-red-600">
                {errorMessage}
              </p>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <p className="text-xs leading-4.5 font-medium text-[#364153]">
                  Which role are you applying for?
                </p>
                <SelectOption
                  key={roleKey}
                  id="apply-role"
                  data={roleOptions}
                  defaultValue={roleId}
                  onChange={setRoleId}
                  placeholder="Select a role"
                  triggerClassName="h-11 rounded-lg border-0 bg-[#F8FAFC] text-sm"
                />
              </div>

              <div className="space-y-2">
                <p className="text-xs leading-4.5 font-medium text-[#364153]">
                  Why do you want to join this project?
                </p>
                <textarea
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value.slice(0, 2000))}
                  placeholder="Share what excites you about this project and what you bring to the team."
                  required
                  rows={3}
                  className="w-full resize-none rounded-lg border-0 bg-[#F8FAFC] px-3 py-2.5 text-xs text-[#344256] outline-none placeholder:text-[#9EACC0] focus:ring-0"
                />
              </div>

              <div className="space-y-2">
                <p className="text-xs leading-4.5 font-medium text-[#364153]">
                  Portfolio
                </p>
                <div className="flex h-11 items-center gap-2 rounded-lg bg-[#F8FAFC] px-3">
                  <Globe className="size-4 shrink-0 text-[#9EACC0]" />
                  <Input
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) =>
                      setPortfolioUrl(e.target.value.slice(0, 255))
                    }
                    placeholder="https://..."
                    className="h-full border-0 bg-transparent p-0 text-xs text-[#344256] shadow-none placeholder:text-xs placeholder:text-[#9EACC0] focus-visible:ring-0"
                  />
                </div>
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
                            className="flex size-6 items-center justify-center cursor-pointer rounded-full text-[#9EACC0] hover:text-[#64748B]"
                          >
                            <X className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <DialogFooter className="mx-0 mb-0 mt-4 border-0 bg-transparent p-0 sm:justify-end">
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
                    isSubmitting || !roleId || motivation.trim().length < 10
                  }
                  className="h-10 rounded-lg bg-[#2F6FE4] px-6 text-sm font-medium text-white hover:bg-[#245cc2] disabled:opacity-50"
                >
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
      <div className="flex w-14 h-14 items-center justify-center rounded-full bg-[#DCFCE7]">
        <div className="flex w-11 h-11 items-center justify-center rounded-full bg-[#00BC7D]">
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
