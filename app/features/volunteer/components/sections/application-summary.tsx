import { useState } from "react";
import type {
  Opportunity,
  Role,
} from "~/services/volunteer/types/opportunities";
import VolunteerApplicationDialog from "../dialog/volunteer-application-dialog";
import { formatDate } from "date-fns";
import { SingleSelectDropdown } from "~/components/ui/single-select-dropdown";

interface ApplicationSummaryProps {
  volunteer: Opportunity;
  disableApplyButton?: boolean;
  totalCapacity: number;
}

export default function ApplicationSummary({
  volunteer,
  totalCapacity,
  disableApplyButton,
}: ApplicationSummaryProps) {
  const [selectedRoleId, setSelectedRoleId] = useState(
    volunteer.roles[0]?.id || "",
  );

  return (
    <aside className="rounded-[14px] border border-[#e1e7ef] bg-white p-8 h-fit">
      <h2 className="text-lg font-semibold tracking-[-0.44px] text-[#030213]">
        Application Summary
      </h2>

      <SummaryDetails
        volunteer={volunteer}
        totalCapacity={totalCapacity}
        selectedRoleId={selectedRoleId}
        setSelectedRoleId={setSelectedRoleId}
      />
      <ActionButtons
        roles={volunteer.roles}
        selectedRoleId={selectedRoleId}
        disableApplyButton={disableApplyButton}
      />
    </aside>
  );
}

interface SummaryDetailsProps {
  volunteer: Opportunity;
  totalCapacity: number;
  selectedRoleId: string;
  setSelectedRoleId: (id: string) => void;
}

function SummaryDetails({
  volunteer,
  totalCapacity,
  selectedRoleId,
  setSelectedRoleId,
}: SummaryDetailsProps) {
  return (
    <div className="mt-6 space-y-3.5 border-b border-[#f9fafb] text-sm">
      <div className="flex items-center justify-between">
        <span className="text-[#99a1af]">Applicants</span>
        <span className="font-semibold text-[#4a5565]">
          {totalCapacity} spots open
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[#99a1af]">Deadline</span>
        <span className="font-semibold text-[#4a5565]">
          {formatDate(volunteer?.applicationDeadline, "MMM dd, yyyy")}
        </span>
      </div>
      <div>
        <SingleSelectDropdown
          triggerClassName="mt-2"
          id="role-selection"
          label="Role of interest"
          value={selectedRoleId}
          onValueChange={setSelectedRoleId}
          options={volunteer.roles.map((r) => ({
            value: r.id,
            label: r.title,
          }))}
          placeholder="Select a role"
        />
      </div>
    </div>
  );
}

interface ActionButtonsProps {
  roles: Role[];
  selectedRoleId: string;
  disableApplyButton?: boolean;
}

function ActionButtons({
  roles,
  selectedRoleId,
  disableApplyButton,
}: ActionButtonsProps & { disableApplyButton?: boolean }) {
  const find = roles.find((r) => r.id === selectedRoleId);
  return (
    <div className="mt-6 space-y-3.5">
      <VolunteerApplicationDialog
        roles={roles}
        initialRoleId={selectedRoleId}
        disableApplyButton={disableApplyButton || find?.viewerApplied}
      />
    </div>
  );
}
