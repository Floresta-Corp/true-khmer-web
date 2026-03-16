import {
  maxContributionSelections,
  onboardingContributionOptionKeys,
} from "./contribution-options";

export type ParsedContributionFormInput = {
  selectedKeys: string[];
  initialSelectedKeys: string[];
};

export type ContributionFormErrors = {
  form?: string;
};

const ALLOWED_CONTRIBUTION_KEYS = new Set<string>(
  onboardingContributionOptionKeys,
);

function normalizeContributionKeys(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))].sort();
}

function parseLegacyCommaValue(value: string) {
  if (!value) return [];
  return value.split(",");
}

export function parseContributionForm(
  formData: FormData,
): ParsedContributionFormInput {
  const selectedValues = formData.getAll("selected").map(String);
  const initialSelectedValues = formData.getAll("initialSelected").map(String);

  const normalizedSelectedKeys =
    selectedValues.length > 0
      ? normalizeContributionKeys(selectedValues)
      : normalizeContributionKeys(
          parseLegacyCommaValue(String(formData.get("selected") || "")),
        );

  const normalizedInitialSelectedKeys =
    initialSelectedValues.length > 0
      ? normalizeContributionKeys(initialSelectedValues)
      : normalizeContributionKeys(
          parseLegacyCommaValue(String(formData.get("initialSelected") || "")),
        );

  return {
    selectedKeys: normalizedSelectedKeys,
    initialSelectedKeys: normalizedInitialSelectedKeys,
  };
}

export function validateContributionInput(
  selectedKeys: string[],
): ContributionFormErrors {
  if (selectedKeys.length === 0) {
    return { form: "Select at least one contribution role." };
  }

  if (selectedKeys.length > maxContributionSelections) {
    return {
      form: `You can select up to ${maxContributionSelections} contribution roles.`,
    };
  }

  if (selectedKeys.some((key) => !ALLOWED_CONTRIBUTION_KEYS.has(key))) {
    return {
      form: "Contribution options are out of sync. Please refresh and try again.",
    };
  }

  return {};
}

export function isContributionInputUnchanged(
  input: ParsedContributionFormInput,
) {
  if (input.selectedKeys.length !== input.initialSelectedKeys.length) return false;
  return input.selectedKeys.every((value, index) => {
    return value === input.initialSelectedKeys[index];
  });
}
