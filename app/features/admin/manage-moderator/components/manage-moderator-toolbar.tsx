import { useEffect, useRef, useState } from "react";
import { Filter, Search } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { debounce } from "~/lib/utils";

interface ManageModeratorToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export function ManageModeratorToolbar({
  searchValue,
  onSearchChange,
}: ManageModeratorToolbarProps) {
  const [inputValue, setInputValue] = useState(searchValue);

  useEffect(() => {
    setInputValue(searchValue);
  }, [searchValue]);

  const onSearchChangeRef = useRef(onSearchChange);
  useEffect(() => {
    onSearchChangeRef.current = onSearchChange;
  }, [onSearchChange]);
  const debouncedSearchRef = useRef(
    debounce((value: string) => {
      onSearchChangeRef.current(value);
    }, 300),
  );
  useEffect(() => {
    return () => debouncedSearchRef.current.cancel();
  }, []);
  const handleInputChange = (value: string) => {
    setInputValue(value);
    debouncedSearchRef.current(value);
  };

  return (
    <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between gap-4">
      <div className="relative flex-1 max-w-md">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
          size={18}
        />
        <Input
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl py-5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-slate-950 transition-all"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button
          disabled
          variant="ghost"
          className="p-3 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 dark:hover:text-white rounded-xl transition-all"
        >
          <Filter size={20} />
        </Button>
      </div>
    </div>
  );
}
