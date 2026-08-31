import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Globe, Image as ImageIcon, MapPin, Trash2, Video } from "lucide-react";
import { toast } from "sonner";
import FieldLabel from "~/components/field-label";
import IconButton from "~/components/icon-button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { SingleSelectDropdown } from "~/components/ui/single-select-dropdown";
import { cn } from "~/lib/utils";
import CreateEventDateFields from "./create-event-date-fields";
import {
  CREATE_EVENT_COVER_ACCEPT,
  validateCreateEventCover,
} from "~/features/workspace/lib/create-event-cover";
import {
  CREATE_EVENT_DESCRIPTION_LIMIT,
  CREATE_EVENT_NAME_LIMIT,
  type CreateEventFieldErrors,
  type CreateEventFormat,
  type CreateEventFormState,
  type EventCategory,
  type EventVenue,
} from "~/features/workspace/types/my-events";

const FORMAT_OPTIONS: Array<{
  value: CreateEventFormat;
  label: string;
  hint: string;
  icon: typeof MapPin;
  disabled?: boolean;
}> = [
  {
    value: "IN_PERSON",
    label: "In-person",
    hint: "Physical event at a venue",
    icon: MapPin,
  },
  {
    value: "ONLINE",
    label: "Online",
    hint: "Coming soon",
    icon: Video,
    disabled: true,
  },
];

const inputClassName =
  "h-11.5 rounded-lg border-[#E1E7EF] bg-white px-3.5 text-sm text-[#364153] placeholder:text-slate-400 focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500/20";

type Props = {
  form: CreateEventFormState;
  categories: EventCategory[];
  venues: EventVenue[];
  venueLoadError: string | null;
  errors: CreateEventFieldErrors;
  onFieldChange: <K extends keyof CreateEventFormState>(
    field: K,
    value: CreateEventFormState[K],
  ) => void;
  onCoverChange: (file: File | null) => void;
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-2 text-xs text-red-500">{message}</p>;
}

export default function CreateEventBasicsForm({
  form,
  categories,
  venues,
  venueLoadError,
  errors,
  onFieldChange,
  onCoverChange,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewHovered, setPreviewHovered] = useState(false);
  const [isDraggingCover, setIsDraggingCover] = useState(false);

  const selectCover = (file: File) => {
    const error = validateCreateEventCover(file);
    if (error) {
      toast.error(error);
      return;
    }

    onCoverChange(file);
  };

  const handleCoverInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.currentTarget.value = "";
    if (file) selectCover(file);
  };

  return (
    <section className="overflow-hidden rounded-xl border border-[#E1E7EF] bg-white">
      <div className="flex items-center gap-3.5 border-b border-[#E1E7EF] px-5 py-4.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
          <Globe className="size-4.5" />
        </span>
        <div>
          <div className="text-[15px] font-bold text-[#1D283A]">
            Event Profile
          </div>
          <div className="text-[12.5px] text-slate-500">
            Key information attendees see before they open your event
          </div>
        </div>
      </div>

      <div className="space-y-6 px-5 pt-5 pb-6">
        <div>
          <FieldLabel required className="text-[13px] font-bold text-[#344256]">
            Event Name
          </FieldLabel>
          <Input
            name="name"
            value={form.name}
            maxLength={CREATE_EVENT_NAME_LIMIT}
            onChange={(event) => onFieldChange("name", event.target.value)}
            placeholder="e.g. Summer Music Festival"
            aria-invalid={Boolean(errors.name)}
            className={cn("mt-2", inputClassName)}
          />
          <FieldError message={errors.name} />
        </div>

        <div>
          <FieldLabel required className="text-[13px] font-bold text-[#344256]">
            Event Category
          </FieldLabel>
          <Select
            value={form.category}
            onValueChange={(value) => onFieldChange("category", value)}
          >
            <SelectTrigger
              id="createEventCategory"
              aria-invalid={Boolean(errors.category)}
              className="mt-2 h-11.5 w-full rounded-lg border-[#E1E7EF] bg-white px-3.5 text-sm text-[#364153] focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500/20 data-placeholder:text-slate-400"
            >
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-[#E1E7EF]">
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={errors.category} />
        </div>

        <div>
          <FieldLabel required className="text-[13px] font-bold text-[#344256]">
            Short Description
          </FieldLabel>
          <Textarea
            name="description"
            rows={3}
            maxLength={CREATE_EVENT_DESCRIPTION_LIMIT}
            value={form.description}
            onChange={(event) =>
              onFieldChange("description", event.target.value)
            }
            placeholder="Briefly describe your event (1-2 lines)"
            aria-invalid={Boolean(errors.description)}
            className="mt-2 min-h-24 rounded-lg border-[#E1E7EF] bg-white px-3.5 py-3 text-sm text-[#364153] placeholder:text-slate-400 focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500/20"
          />
          <div className="mt-1 text-right text-xs text-slate-400">
            {form.description.length}/{CREATE_EVENT_DESCRIPTION_LIMIT}
          </div>
          <FieldError message={errors.description} />
        </div>

        <CreateEventDateFields
          dates={form.eventDates}
          error={errors.eventDates}
          onChange={(dates) => onFieldChange("eventDates", dates)}
        />

        <div>
          <FieldLabel required className="text-[13px] font-bold text-[#344256]">
            Format
          </FieldLabel>
          <div className="mt-2.5 grid gap-3 sm:grid-cols-2">
            {FORMAT_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isActive = form.format === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={isActive}
                  aria-disabled={option.disabled}
                  disabled={option.disabled}
                  onClick={() => onFieldChange("format", option.value)}
                  className={cn(
                    "flex cursor-pointer items-center gap-2.5 rounded-[10px] border p-4 text-left transition-all",
                    isActive
                      ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20"
                      : "border-[#E1E7EF] bg-white hover:border-blue-200 hover:bg-slate-50",
                    option.disabled &&
                      "cursor-not-allowed border-[#E1E7EF] bg-slate-50 opacity-55 hover:border-[#E1E7EF] hover:bg-slate-50",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4.5 shrink-0",
                      isActive ? "text-blue-600" : "text-slate-400",
                    )}
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-[#1D283A]">
                      {option.label}
                    </span>
                    <span className="block text-xs text-slate-500">
                      {option.hint}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          <FieldError message={errors.format} />
        </div>

        {form.format === "IN_PERSON" && (
          <>
            <div className="h-px bg-[#E1E7EF]" />

            <div className="space-y-4">
              <div>
                <FieldLabel
                  required
                  className="text-[13px] font-bold text-[#344256]"
                >
                  Venue
                </FieldLabel>
                <SingleSelectDropdown
                  id="createEventVenue"
                  value={form.venueId}
                  onValueChange={(venueId) => {
                    const venue = venues.find((item) => item.id === venueId);
                    onFieldChange("venueId", venueId);
                    if (venue?.address) {
                      onFieldChange("address", venue.address);
                    }
                    if (venue?.googleMapLink) {
                      onFieldChange("googleMapLink", venue.googleMapLink);
                    }
                  }}
                  options={venues.map((venue) => ({
                    value: venue.id,
                    label: venue.name,
                  }))}
                  placeholder="Search for a venue"
                  searchPlaceholder="Search venues..."
                  emptyText={
                    venueLoadError
                      ? "Venues are temporarily unavailable"
                      : "No venues found"
                  }
                  searchable
                  disabled={Boolean(venueLoadError)}
                  ariaInvalid={Boolean(errors.venueId)}
                  triggerClassName={cn("mt-2 h-11.5", inputClassName)}
                  contentClassName="rounded-lg border-[#E1E7EF]"
                />
                {venueLoadError && (
                  <p className="mt-2 text-xs text-amber-700">
                    {venueLoadError}
                  </p>
                )}
                <FieldError message={errors.venueId} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel
                    required
                    className="text-[13px] font-bold text-[#344256]"
                  >
                    Address
                  </FieldLabel>
                  <Input
                    name="address"
                    value={form.address}
                    onChange={(event) =>
                      onFieldChange("address", event.target.value)
                    }
                    placeholder="Street, building, district"
                    aria-invalid={Boolean(errors.address)}
                    className={cn("mt-2", inputClassName)}
                  />
                  <FieldError message={errors.address} />
                </div>

                <div>
                  <FieldLabel className="text-[13px] font-bold text-[#344256]">
                    Google Map Link
                  </FieldLabel>
                  <Input
                    type="url"
                    name="googleMapLink"
                    value={form.googleMapLink}
                    onChange={(event) =>
                      onFieldChange("googleMapLink", event.target.value)
                    }
                    placeholder="https://maps.google.com/..."
                    aria-invalid={Boolean(errors.googleMapLink)}
                    className={cn("mt-2", inputClassName)}
                  />
                  <FieldError message={errors.googleMapLink} />
                </div>
              </div>
            </div>
          </>
        )}

        <div className="h-px bg-[#E1E7EF]" />

        <div>
          <FieldLabel required className="text-[13px] font-bold text-[#344256]">
            Event Cover
          </FieldLabel>
          <label
            id="createEventCover"
            role="button"
            tabIndex={0}
            htmlFor="createEventCover-input"
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDraggingCover(true);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = "copy";
              setIsDraggingCover(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              setIsDraggingCover(false);
            }}
            onDrop={(event) => {
              event.preventDefault();
              setIsDraggingCover(false);
              const file = event.dataTransfer.files[0];
              if (file) selectCover(file);
            }}
            onPaste={(event) => {
              const file = Array.from(event.clipboardData.items)
                .find((item) => item.kind === "file")
                ?.getAsFile();
              if (!file) return;

              event.preventDefault();
              selectCover(file);
            }}
            aria-invalid={Boolean(errors.coverImageName)}
            aria-label="Upload an event cover by choosing, dropping, or pasting an image"
            className={cn(
              "relative mt-2.5 flex aspect-video cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl bg-white px-4 py-3 text-center transition-colors",
              errors.coverImageName
                ? "border border-red-500 ring-4 ring-red-200"
                : isDraggingCover
                  ? "border border-dashed border-blue-500 bg-blue-50 ring-4 ring-blue-100"
                  : "border border-dashed border-[#E5E5E5] hover:border-blue-300 hover:bg-blue-50/30",
            )}
          >
            {form.coverPreviewUrl ? (
              <motion.div
                className="size-full"
                onHoverStart={() => setPreviewHovered(true)}
                onHoverEnd={() => setPreviewHovered(false)}
              >
                <img
                  src={form.coverPreviewUrl}
                  alt="Selected event cover"
                  className="size-full rounded-[11px] object-cover"
                />
                <motion.span
                  className="absolute top-3 right-3 z-10"
                  initial={{ y: -8, opacity: 0 }}
                  animate={
                    previewHovered
                      ? { y: 0, opacity: 1 }
                      : { y: -8, opacity: 0 }
                  }
                  transition={{ duration: 0.18 }}
                  style={{ pointerEvents: previewHovered ? "auto" : "none" }}
                >
                  <IconButton
                    icon={<Trash2 className="size-4" />}
                    ariaLabel="Clear event cover"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      onCoverChange(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  />
                </motion.span>
              </motion.div>
            ) : (
              <>
                <ImageIcon className="size-8 text-[#A3A3A3]" />
                <p className="mt-3 text-xs leading-4.5 font-semibold">
                  <span className="text-blue-600">Click to upload</span>{" "}
                  <span className="text-[#525252]">
                    or drag, drop, and paste
                  </span>
                </p>
                <p className="mt-0.5 text-[11px] leading-4 text-[#A3A3A3]">
                  JPG, PNG, or WebP • 2 MB max
                  <br />
                  Recommended size: 1280 × 720 px (16:9)
                </p>
              </>
            )}

            <input
              id="createEventCover-input"
              ref={fileInputRef}
              hidden
              type="file"
              accept={CREATE_EVENT_COVER_ACCEPT}
              onChange={handleCoverInput}
            />
          </label>
          <FieldError message={errors.coverImageName} />
        </div>
      </div>
    </section>
  );
}
