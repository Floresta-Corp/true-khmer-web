export type ParsedContributionFormInput = {
  selectedIds: string[];
  initialSelectedIds: string[];
};

export type ContributionFormErrors = {
  form?: string;
};

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function normalizeContributionIds(values: string[]) {
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

  const normalizedSelected =
    selectedValues.length > 0
      ? normalizeContributionIds(selectedValues)
      : normalizeContributionIds(
          parseLegacyCommaValue(String(formData.get("selected") || "")),
        );

  const normalizedInitialSelected =
    initialSelectedValues.length > 0
      ? normalizeContributionIds(initialSelectedValues)
      : normalizeContributionIds(
          parseLegacyCommaValue(String(formData.get("initialSelected") || "")),
        );

  return {
    selectedIds: normalizedSelected,
    initialSelectedIds: normalizedInitialSelected,
  };
}

export function validateContributionInput(
  selectedIds: string[],
): ContributionFormErrors {
  if (selectedIds.length === 0) {
    return { form: "Select at least one contribution role." };
  }

  if (selectedIds.some((id) => !UUID_REGEX.test(id))) {
    return {
      form: "Contribution options are out of sync. Please refresh and try again.",
    };
  }

  return {};
}

export function isContributionInputUnchanged(
  input: ParsedContributionFormInput,
) {
  if (input.selectedIds.length !== input.initialSelectedIds.length) return false;
  return input.selectedIds.every((value, index) => {
    return value === input.initialSelectedIds[index];
  });
}
