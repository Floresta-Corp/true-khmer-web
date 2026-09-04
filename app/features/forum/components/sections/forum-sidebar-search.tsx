import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function ForumSidebarSearch() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const trimmedSearchValue = searchValue.trim();
  const canSearch = trimmedSearchValue.length > 0;

  const handleSearch = () => {
    if (isSearching || !canSearch) return;

    setIsSearching(true);
    navigate(`/forum/search?search=${encodeURIComponent(trimmedSearchValue)}`);
  };

  return (
    <div className="flex h-11 w-full items-center gap-2.5 rounded-xl border border-[#e2e8f0] bg-white px-3.5">
      <Search className="size-4 shrink-0 text-[#9eacc0]" />
      <input
        type="search"
        value={searchValue}
        disabled={isSearching}
        onChange={(event) => setSearchValue(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && canSearch) {
            handleSearch();
          }
        }}
        placeholder="Search discussions"
        aria-label="Search discussions"
        className="w-full border-0 bg-transparent text-sm text-[#344256] placeholder:text-[#9eacc0] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}
