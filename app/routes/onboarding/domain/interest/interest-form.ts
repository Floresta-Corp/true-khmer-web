export type ParsedInterestFormInput = {
  selectedIds: string[];
  initialSelectedIds: string[];
};

export type InterestFormErrors = {
  form?: string;
};

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function normalizeInterestIds(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))].sort();
}

function parseLegacyCommaValue(value: string) {
  if (!value) return [];
  return value.split(",");
}

export function parseInterestForm(formData: FormData): ParsedInterestFormInput {
  const selectedValues = formData.getAll("selected").map(String);
  const initialSelectedValues = formData.getAll("initialSelected").map(String);

  const normalizedSelected =
    selectedValues.length > 0
      ? normalizeInterestIds(selectedValues)
      : normalizeInterestIds(
          parseLegacyCommaValue(String(formData.get("selected") || "")),
        );

  const normalizedInitialSelected =
    initialSelectedValues.length > 0
      ? normalizeInterestIds(initialSelectedValues)
      : normalizeInterestIds(
          parseLegacyCommaValue(String(formData.get("initialSelected") || "")),
        );

  return {
    selectedIds: normalizedSelected,
    initialSelectedIds: normalizedInitialSelected,
  };
}

export function validateInterestInput(selectedIds: string[]): InterestFormErrors {
  if (selectedIds.length < 2) {
    return { form: "Please select at least 2 interests." };
  }

  if (selectedIds.some((id) => !UUID_REGEX.test(id))) {
    return {
      form: "Interest options are out of sync. Please refresh and try again.",
    };
  }

  return {};
}

export function isInterestInputUnchanged(input: ParsedInterestFormInput) {
  if (input.selectedIds.length !== input.initialSelectedIds.length) return false;
  return input.selectedIds.every((value, index) => {
    return value === input.initialSelectedIds[index];
  });
}
