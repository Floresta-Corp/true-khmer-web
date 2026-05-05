import { Paperclip, Plus } from "lucide-react";
import { useId } from "react";
import { Button } from "~/components/ui/button";
import LaunchpadMaterialComponent from "../launchpad-material-component";
import SectionInputCard from "~/components/section-input-card";

interface LaunchpadProjectMaterialCardProps {
  files: File[];
  error?: string;
  onChange: (files: File[]) => void;
}

export default function LaunchpadProjectMaterialCard({
  files,
  error,
  onChange,
}: LaunchpadProjectMaterialCardProps) {
  const inputId = useId();
  const errorId = useId();

  const handleAddFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(event.target.files ?? []);
    if (incoming.length === 0) return;

    const nextFiles = [...files, ...incoming].slice(0, 5);
    onChange(nextFiles);
    event.currentTarget.value = "";
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
        action: (
          <>
            <label htmlFor={inputId}>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer h-10 bg-gray-100 hover:bg-gray-200 border-none"
                asChild
              >
                <span>
                  <Plus /> Add file
                </span>
              </Button>
            </label>
            <input
              id={inputId}
              type="file"
              multiple
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
