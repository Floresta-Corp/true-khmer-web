import {
  Award,
  Calendar,
  ChevronDown,
  ChevronLeft,
  Clock3,
  ImageIcon,
  MapPin,
  Target,
} from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import BackToVolunteerButton from "./BackToVolunteerButton";

function FieldLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("text-sm font-medium text-[#030213]", className)}>
      {children}
    </label>
  );
}

function TextArea({
  placeholder,
  rows = 4,
}: {
  placeholder: string;
  rows?: number;
}) {
  return (
    <textarea
      rows={rows}
      placeholder={placeholder}
      className="w-full resize-none rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#4a5565] placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-ring"
    />
  );
}

interface OpportunityDetailProps {
  onContinueToRole: () => void;
}

export default function OpportunityDetail({
  onContinueToRole,
}: OpportunityDetailProps) {
  const navigate = useNavigate();
  return (
    <main className="min-h-screen bg-white px-6 py-10 md:px-12 lg:px-28">
      <div className="mx-auto flex w-full max-w-193 flex-col gap-8">
        <BackToVolunteerButton />

        <section className="space-y-1">
          <h1 className="text-[32px] font-semibold leading-[38.4px] text-[#030213]">
            Post new opportunity
          </h1>
          <p className="text-base text-[#6a7282]">
            Share the mission and core details of your project
          </p>
        </section>

        <section className="rounded-[14px] border border-[#e1e7ef] bg-white p-6">
          <h2 className="text-xl font-semibold text-[#030213]">
            Opportunity Details
            <span className="inline-block text-red-600">*</span>
          </h2>

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <FieldLabel>Opportunity title</FieldLabel>
              <Input
                placeholder="e.g., Digital Literacy for Artisans"
                className="h-12.5 rounded-xl border-[#e2e8f0] px-4"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <FieldLabel>Category</FieldLabel>
                <div className="relative">
                  <select className="h-11 w-full appearance-none rounded-xl border border-[#e2e8f0] bg-white px-3.5 pr-10 text-sm text-[#6a7282] focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>e.g., Education</option>
                    <option>Environment</option>
                    <option>Health</option>
                    <option>Technology</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#99a1af]" />
                </div>
              </div>

              <div className="space-y-2">
                <FieldLabel>Location</FieldLabel>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#99a1af]" />
                  <Input
                    placeholder="e.g., Phnom Penh"
                    className="h-11 rounded-xl border-[#e2e8f0] pl-9 pr-9"
                  />
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#99a1af]" />
                </div>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <FieldLabel>Duration</FieldLabel>
                <div className="relative">
                  <Calendar className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#99a1af]" />
                  <Input
                    placeholder="e.g., 3 months"
                    className="h-11 rounded-xl border-[#e2e8f0] pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <FieldLabel>Commitment</FieldLabel>
                <div className="relative">
                  <Clock3 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#99a1af]" />
                  <Input
                    placeholder="e.g., 5 hours/week"
                    className="h-11 rounded-xl border-[#e2e8f0] pl-9 pr-9"
                  />
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#99a1af]" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <FieldLabel>Application deadline</FieldLabel>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#99a1af]" />
                <Input
                  type="date"
                  className="h-11 rounded-xl border-[#e2e8f0] pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <FieldLabel className="mb-2">Main Event Cover</FieldLabel>
              <label className="flex h-37 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#e5e5e5] bg-[#fafafa] px-4 py-3 text-center">
                <ImageIcon className="size-8 text-[#a3a3a3]" />

                <p className="mt-3 text-xs font-semibold leading-4.5">
                  <span className="text-[#0ea5e9]">Click to upload</span>{" "}
                  <span className="text-[#525252]">or drag and drop</span>
                </p>

                <p className="mt-0.5 text-[11px] leading-4 text-[#a3a3a3]">
                  JPG or PNG • 3MB max
                  <br />
                  Recommended size: 1280 × 720 px (16:9)
                </p>

                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>
          </div>
        </section>

        <section className="rounded-[14px] border border-[#e1e7ef] bg-white p-6">
          <FieldLabel>Overview</FieldLabel>
          <div className="mt-3">
            <TextArea
              placeholder="Briefly describe the social or community impact of this project..."
              rows={3}
            />
          </div>
        </section>

        <section className="rounded-[14px] border border-[#e1e7ef] bg-white p-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-[#030213]">
            <Target className="size-4 text-[#00BC7D]" />
            Project impact
          </h3>
          <div className="mt-3">
            <TextArea
              placeholder="Briefly describe the social or community impact of this project..."
              rows={3}
            />
          </div>
        </section>

        <section className="rounded-[14px] border border-[#e1e7ef] bg-white p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-[#030213]">
              <Award className="size-4 text-[#FE9A00]" />
              Volunteer benefits
            </h3>
            <button
              type="button"
              className="text-sm font-medium text-[#2f6fe4] hover:text-[#245fca]"
            >
              + Add point
            </button>
          </div>
          <div className="mt-3">
            <TextArea
              placeholder="Lorem ipsum dolor sit amet consectetur."
              rows={2}
            />
          </div>
        </section>

        <div className="flex items-center justify-between pb-5">
          <Button
            type="button"
            variant="outline"
            className="h-10 px-4"
            onClick={() => navigate("/volunteer")}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="h-10 bg-[#2f6fe4] px-6 hover:bg-[#245fca]"
            onClick={onContinueToRole}
          >
            Continue to role
          </Button>
        </div>
      </div>
    </main>
  );
}
