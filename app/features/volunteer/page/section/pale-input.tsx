import { Input } from "~/components/ui/input";

interface PaleInputProps {
  placeholder: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function PaleInput({
  placeholder,
  type = "text",
  value,
  onChange,
  className = "",
}: PaleInputProps) {
  return (
    <Input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onChange(e.target.value)
      }
      className={`h-11 rounded-lg border border-transparent bg-[#f8fafc] px-4 text-sm font-medium text-[#364153] placeholder:text-[#c8d6e5] ${className}`}
    />
  );
}
