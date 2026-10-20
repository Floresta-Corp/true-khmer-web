import { Paperclip, Plus, ExternalLink, FileUp } from "lucide-react";
import { useId, useRef } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import LaunchpadMaterialComponent from "../launchpad-material-component";
import SectionInputCard from "~/components/section-input-card";
import { useFileDropPaste } from "~/hooks/use-image-drop-paste";
import { fileMatchesAccept } from "~/lib/file-accept";
import { cn } from "~/lib/utils";

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

  const selectFile = (file: File) => {
    // Dropped files skip the picker's `accept` filter.
    if (!fileMatchesAccept(file, "application/pdf,.pdf")) {
      toast.error(`${file.name} is not a PDF.`);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error(
        `${file.name} is too large. Maximum file size is ${MAX_FILE_SIZE_MB} MB.`,
      );
      return;
    }

    onChange([file]);
  };

  const handleAddFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = Array.from(event.target.files ?? []);
    event.currentTarget.value = "";
    if (file) selectFile(file);
  };

  const drop = useFileDropPaste<HTMLDivElement>({
    onFiles: ([file]) => selectFile(file),
  });

  const handleRemoveFile = (index: number) => {
    onChange(files.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div ref={drop.ref} {...drop.dropZoneProps}>
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
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed px-4 py-5 text-center transition-colors",
            drop.isDragging
              ? "border-blue-500 bg-blue-50"
              : error
                ? "border-red-400"
                : "border-gray-200 hover:bg-gray-50",
          )}
        >
          <FileUp className="size-5 text-gray-400" />
          <span className="text-xs font-semibold text-blue-500">
            {files.length > 0
              ? "Drop a PDF to replace"
              : "Drag and drop a PDF here"}
          </span>
          <span className="text-[11px] text-gray-400">or click to browse</span>
        </button>
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
    </div>
  );
}
