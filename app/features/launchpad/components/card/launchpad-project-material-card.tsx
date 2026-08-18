import { Paperclip, Plus, ExternalLink } from "lucide-react";
import { useId, useRef } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import LaunchpadMaterialComponent from "../launchpad-material-component";
import SectionInputCard from "~/components/section-input-card";

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

interface ExistingDocument {
  name: string;
  url?: string;
}

interface LaunchpadProjectMaterialCardProps {
  files: File[];
  existingDocuments?: ExistingDocument[];
  error?: string;
  onChange: (files: File[]) => void;
}

export default function LaunchpadProjectMaterialCard({
  files,
  existingDocuments,
  error,
  onChange,
}: LaunchpadProjectMaterialCardProps) {
  const inputId = useId();
  const errorId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(event.target.files ?? []);
    if (incoming.length === 0) return;

    const [file] = incoming;
    event.currentTarget.value = "";

    if (file.size > MAX_FILE_SIZE) {
      toast.error(
        `${file.name} is too large. Maximum file size is ${MAX_FILE_SIZE_MB} MB.`,
      );
      return;
    }

    onChange([file]);
  };

  const handleRemoveFile = (index: number) => {
    onChange(files.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <SectionInputCard
      header={{
        title: "Project Deck & Materials",
        icon: <Paperclip size={17.5} className="text-blue-500" />,
        required: true,
        description: `PDF only, 1 file, up to ${MAX_FILE_SIZE_MB} MB.`,
        action: (
          <>
            <Button
              type="button"
              variant="outline"
              className="h-10 border-none bg-gray-100 hover:bg-gray-200"
              onClick={() => inputRef.current?.click()}
            >
              <Plus /> {files.length > 0 ? "Replace file" : "Add file"}
            </Button>
            <input
              ref={inputRef}
              id={inputId}
              type="file"
              accept="application/pdf"
              className="sr-only"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              onChange={handleAddFile}
            />
          </>
        ),
      }}
      hideSeparator
    >
      {existingDocuments?.map((doc, index) => (
        <div
          key={`existing-${doc.name}-${index}`}
          className="flex items-center rounded-lg border border-[#F3F4F6] px-4 py-2"
        >
          <div className="flex-1">{doc.name}</div>
          {doc.url ? (
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              <ExternalLink size={14} />
            </a>
          ) : null}
        </div>
      ))}
      {files?.map((file, index) => (
        <LaunchpadMaterialComponent
          key={`${file.name}-${index}`}
          data={{ name: file.name }}
          onRemove={() => handleRemoveFile(index)}
        />
      ))}
      {error ? (
        <p id={errorId} className="text-xs text-red-500">
          {error}
        </p>
      ) : null}
    </SectionInputCard>
  );
}
