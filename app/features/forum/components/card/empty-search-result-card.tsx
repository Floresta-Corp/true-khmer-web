import { Search } from "lucide-react";

interface EmptySearchResultCardProps {
  message?: string;
  description?: string;
}

export default function EmptySearchResultCard({
  message = "No results found",
  description = "Try using different keywords or change the filters",
}: EmptySearchResultCardProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e2e8f0] bg-white p-10 text-center">
      <Search className="mx-auto mb-3 h-8 w-8 text-[#c8d6e5]" />
      <p className="text-sm font-medium text-[#9eacc0]">{message}</p>
      {description && (
        <p className="mt-1 text-xs text-[#9eacc0]">{description}</p>
      )}
    </div>
  );
}
