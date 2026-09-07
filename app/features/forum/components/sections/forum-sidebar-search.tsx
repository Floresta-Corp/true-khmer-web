import { Search } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";

export default function ForumSidebarSearch() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const trimmedSearchValue = searchValue.trim();
  const canSearch = trimmedSearchValue.length > 0;

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSearching || !canSearch) return;

    setIsSearching(true);
    navigate(`/forum/search?search=${encodeURIComponent(trimmedSearchValue)}`);
  };

  return (
    <form
      role="search"
      onSubmit={handleSearch}
      className="focus-within:ring-0.5 flex h-11 w-full items-center gap-1 rounded-xl border border-[#e2e8f0] bg-white pr-3.5 pl-1.5 transition-colors focus-within:border-[#2f6fe4] focus-within:ring-[#2f6fe4]/20"
    >
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        disabled={!canSearch || isSearching}
        aria-label="Search discussions"
        className="text-[#9eacc0] hover:text-[#2f6fe4]"
      >
        <Search className="size-4" />
      </Button>
      <input
        type="search"
        value={searchValue}
        disabled={isSearching}
        onChange={(event) => setSearchValue(event.currentTarget.value)}
        placeholder="Search discussions"
        aria-label="Search discussions"
        className="w-full border-0 bg-transparent text-sm text-[#344256] placeholder:text-[#9eacc0] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
      />
    </form>
  );
}
