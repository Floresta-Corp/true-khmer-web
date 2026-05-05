import {
  SingleSelectDropdown,
  type SingleSelectOption,
} from "./single-select-dropdown";

export type SelectOption = {
  id: string;
  name: string;
};

type SelectOptionProps = {
  data: SelectOption[];
  defaultValue?: string;
  onChange: (id: string) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  searchable?: boolean;
  allowClear?: boolean;
  triggerClassName?: string;
  className?: string;
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
  id?: string;
};

export function SelectOption({
  data,
  defaultValue = "",
  onChange,
  placeholder = "Select option",
  triggerClassName,
  className,
  disabled = false,
  loading = false,
  searchable = false,
  allowClear = false,
  ariaInvalid = false,
  ariaDescribedBy,
  id = "location",
}: SelectOptionProps) {
  const options: SingleSelectOption[] = data.map((option) => ({
    value: option.id,
    label: option.name,
  }));

  return (
    <SingleSelectDropdown
      triggerClassName={triggerClassName}
      className={className}
      id={id}
      value={defaultValue}
      onValueChange={onChange}
      options={options}
      placeholder={placeholder}
      disabled={disabled}
      loading={loading}
      searchable={searchable}
      allowClear={allowClear}
      ariaInvalid={ariaInvalid}
      ariaDescribedBy={ariaDescribedBy}
      emptyText="No locations found"
    />
  );
}
