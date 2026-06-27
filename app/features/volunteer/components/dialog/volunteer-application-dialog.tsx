import { useEffect, useRef, useState } from "react";
import { useFetcher, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import type { Role } from "~/features/volunteer/types/opportunities";
import { BatchApplyApplicationInputSchema } from "~/features/volunteer/types/application";
import { User, FileText, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import ApplicationSubmitSuccessDialog from "./application-submit-success-dialog";
import { cn } from "~/lib/utils";

interface VolunteerApplicationDialogProps {
  roles: Role[];
  selectedRoleIds: string[];
  topPickRoleId: string | null;
  opportunityTitle: string;
  trigger?: React.ReactNode;
}

interface ApiError {
  status: number;
  code: string | undefined;
  details: {
    ok: false;
    error: string;
  };
}

export default function VolunteerApplicationDialog({
  roles,
  selectedRoleIds,
  topPickRoleId,
  opportunityTitle,
  trigger,
}: VolunteerApplicationDialogProps & { disableApplyButton?: boolean }) {
  const { id: opportunityId } = useParams();
  const fetcher = useFetcher();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    availability: "",
    relevantExperience: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const data = fetcher.data as {
        ok: boolean;
        data?: unknown;
        error?: string;
      };
      if (data.ok) {
        toast.success("Application submitted successfully");
        setFormData({
          availability: "",
          relevantExperience: "",
        });
        setFiles([]);
        setErrors({});
        setOpen(false);
        setSuccessDialogOpen(true);
      } else if (data.error) {
        toast.error(data.error);
      }
    }
  }, [fetcher.state, fetcher.data]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);
      const fileKey = (file: File) =>
        `${file.name}-${file.size}-${file.lastModified}`;
      const existingFileKeys = new Set(files.map(fileKey));
      const duplicates = newFiles.filter((f) =>
        existingFileKeys.has(fileKey(f)),
      );

      if (duplicates.length > 0) {
        toast.error("This file has already been added");
      }

      const uniqueNewFiles = newFiles.filter(
        (f) => !existingFileKeys.has(fileKey(f)),
      );

      if (uniqueNewFiles.length > 0) {
        setFiles((prev) => [...prev, ...uniqueNewFiles]);
        setErrors((prev) => {
          const next = { ...prev };
          delete next.files;
          return next;
        });
      }
      e.target.value = "";
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    if (selectedRoleIds.length === 0) {
      toast.error("Please select at least one role");
      return;
    }

    const validationResult = BatchApplyApplicationInputSchema.safeParse({
      roleIds: selectedRoleIds,
      topPickRoleId: topPickRoleId,
      availability: formData.availability,
      relevantExperience: formData.relevantExperience,
    });
    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    const submitData = new FormData();
    submitData.append("actionType", "apply-batch-application");

    const submitPayload = {
      opportunityId,
      roleIds: selectedRoleIds,
      topPickRoleId: topPickRoleId,
      availability: formData.availability,
      relevantExperience: formData.relevantExperience,
    };

    submitData.append("data", JSON.stringify(submitPayload));

    if (files && files.length > 0) {
      files.forEach((file) => {
        submitData.append("files", file);
      });
    }

    fetcher.submit(submitData, {
      method: "POST",
      encType: "multipart/form-data",
    });
  };

  const selectedRoles = roles.filter((r) => selectedRoleIds.includes(r.id));
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="min-w-lg rounded-[14px] border border-[#e1e7ef] p-0 [&>button]:right-6 [&>button]:top-5.5 [&>button]:rounded-full [&>button]:p-1.5 [&>button]:text-[#99a1af] [&>button]:opacity-100">
        <div className="border-b border-[#f3f4f6] px-6 pb-3.75 pt-5 mb-6">
          <h2 className="text-[20px] font-semibold leading-[25.2px] text-[#030213]">
            Volunteer Application
          </h2>
        </div>

        <div className="space-y-5 px-6 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center gap-3.5 rounded-[14px] border-[0.8px] border-[rgba(47,111,228,0.1)] bg-[#f0f6ff] px-[18.3px] py-[20.8px] mb-5">
            <div className="flex size-8.75 items-center justify-center rounded-2xl bg-[#2f6fe4]">
              <User className="size-6 text-white" />
            </div>
            <div>
              <p className="text-[13px] font-bold leading-[19.5px] text-[#2f6fe4]">
                Your True Khmer profile will be automatically shared
              </p>
              <p className="text-[11px] font-medium leading-[16.5px] text-[rgba(47,111,228,0.7)]">
                The project owner will see your profile, tier, and details.
              </p>
            </div>
          </div>

          {selectedRoles.length > 0 && (
            <div className="space-y-2 mb-6">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                Roles of Interest
              </p>
              <div className="space-y-2">
                {selectedRoles.map((role) => (
                  <div
                    key={role.id}
                    className={cn(
                      "flex items-center justify-between rounded-lg border px-3 py-2 text-sm",
                      topPickRoleId === role.id
                        ? "border-[#2f6fe4] bg-[#f0f6ff]"
                        : "border-[#e1e7ef] bg-[#f8fafc]",
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
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

          <div className="space-y-2 mb-6">
            <label
              htmlFor="availability"
              className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1"
            >
              Why do you want to join this project?
            </label>
            <Textarea
              id="availability"
              value={formData.availability}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  availability: e.target.value,
                }));
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.availability;
                  return next;
                });
              }}
              aria-invalid={!!errors.availability}
              placeholder="e.g. Weekend only, 2-4 hours per week..."
              className="h-21 w-full resize-none rounded-lg border border-transparent bg-[#f8fafc] px-3 py-3 text-sm font-medium text-[#364153] placeholder:text-[#65758b] focus-visible:border-[#2f6fe4] focus-visible:outline-none"
            />
            {errors.availability && (
              <p className="text-[11px] font-medium text-red-500">
                {errors.availability}
              </p>
            )}
          </div>

          <div className="space-y-2 mb-5">
            <label
              htmlFor="experience"
              className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1"
            >
              Relevant experience
            </label>
            <Textarea
              id="experience"
              value={formData.relevantExperience}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  relevantExperience: e.target.value,
                }));
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.relevantExperience;
                  return next;
                });
              }}
              aria-invalid={!!errors.relevantExperience}
              placeholder="Briefly describe your experience relevant to this role..."
              className="h-23.75 w-full resize-none rounded-lg border border-transparent bg-[#f8fafc] px-3 py-3 text-sm font-medium text-[#364153] placeholder:text-[#65758b] focus-visible:border-[#2f6fe4] focus-visible:outline-none"
            />
            {errors.relevantExperience && (
              <p className="text-[11px] font-medium text-red-500">
                {errors.relevantExperience}
              </p>
            )}
          </div>

          <div className="space-y-3 mb-5 flex justify-between">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx"
              multiple
            />
            <p className={`text-sm font-medium leading-5.25`}>
              Supporting Documents (Optional)
            </p>
            <Button
              type="button"
              variant="ghost"
              className={`text-sm font-semibold leading-4.5`}
              onClick={handleTriggerUpload}
            >
              + Add
            </Button>
          </div>
          {errors.files && (
            <p className="text-[11px] font-medium text-red-500">
              {errors.files}
            </p>
          )}

          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="rounded-lg border border-[#f1f5f9] p-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="size-6 text-[#2f6fe4]" />
                    <p className="text-xs font-medium leading-[19.5px] text-[#0a0a0a]">
                      {file.name}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    className="rounded-full bg-[#f8fafc] px-3 py-1 text-xs font-medium leading-[19.5px] text-[#ef4444] hover:text-[#dc2626]"
                    onClick={() => handleRemoveFile(index)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 px-6 pb-6">
          <DialogClose asChild>
            <Button variant="outline" className="h-10 rounded-lg px-6 text-sm">
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="h-10 rounded-lg bg-[#2f6fe4] px-6 text-sm text-[#f8fafc] hover:bg-[#245fca]"
            onClick={handleSubmit}
            disabled={fetcher.state !== "idle"}
          >
            {fetcher.state === "idle" ? "Submit Application" : "Submitting..."}
          </Button>
        </div>
      </DialogContent>

      <ApplicationSubmitSuccessDialog
        open={successDialogOpen}
        onViewPost={() => navigate("/my-applications")}
        onOpenChange={setSuccessDialogOpen}
        applicationName={opportunityTitle}
      />
    </Dialog>
  );
}
