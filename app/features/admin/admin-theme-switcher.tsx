import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

type Theme = "light" | "dark";
type ThemePreference = Theme | "system";

const ADMIN_THEME_STORAGE_KEY = "true-khmer-admin-theme-preference";

function deviceTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolvedTheme(preference: ThemePreference): Theme {
  return preference === "system" ? deviceTheme() : preference;
}

export function AdminThemeSwitcher() {
  const [themePreference, setThemePreference] =
    useState<ThemePreference>("system");
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const root = window.document.documentElement;
    const savedPreference = window.localStorage.getItem(
      ADMIN_THEME_STORAGE_KEY,
    ) as ThemePreference | null;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (nextTheme: Theme) => {
      root.classList.toggle("dark", nextTheme === "dark");
      root.style.colorScheme = nextTheme;
      setTheme(nextTheme);
    };

    const initialPreference: ThemePreference =
      savedPreference === "light" ||
      savedPreference === "dark" ||
      savedPreference === "system"
        ? savedPreference
        : "system";

    setThemePreference(initialPreference);
    applyTheme(resolvedTheme(initialPreference));

    const handleDeviceThemeChange = (event: MediaQueryListEvent) => {
      const preference = window.localStorage.getItem(ADMIN_THEME_STORAGE_KEY);
      if (preference && preference !== "system") return;
      applyTheme(event.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleDeviceThemeChange);
    return () =>
      mediaQuery.removeEventListener("change", handleDeviceThemeChange);
  }, []);

  function changeTheme(preference: ThemePreference) {
    const nextTheme = resolvedTheme(preference);
    window.localStorage.setItem(ADMIN_THEME_STORAGE_KEY, preference);
    window.document.documentElement.classList.toggle(
      "dark",
      nextTheme === "dark",
    );
    window.document.documentElement.style.colorScheme = nextTheme;
    setThemePreference(preference);
    setTheme(nextTheme);
  }

  const themeIcon =
    themePreference === "system" ? (
      <Monitor size={16} />
    ) : theme === "light" ? (
      <Moon size={16} />
    ) : (
      <Sun size={16} />
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="p-2 md:p-2.5 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl cursor-pointer transition-all text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
          aria-label="Select theme"
          title={`Theme: ${themePreference}`}
        >
          {themeIcon}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-44 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/60 rounded-xl shadow-lg p-1.5"
      >
        <DropdownMenuRadioGroup
          value={themePreference}
          onValueChange={(value) => changeTheme(value as ThemePreference)}
        >
          <DropdownMenuRadioItem
            value="light"
            className="cursor-pointer rounded-lg py-2 pr-3 text-[13px] font-medium dark:text-white data-[state=checked]:bg-blue-50 dark:data-[state=checked]:bg-blue-900/20 data-[state=checked]:text-blue-600 dark:data-[state=checked]:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
          >
            <div className="flex items-center gap-3">
              <Sun size={15} className="shrink-0" />
              <span>Light</span>
            </div>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="dark"
            className="cursor-pointer rounded-lg py-2 pr-3 text-[13px] font-medium dark:text-white data-[state=checked]:bg-blue-50 dark:data-[state=checked]:bg-blue-900/20 data-[state=checked]:text-blue-600 dark:data-[state=checked]:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
          >
            <div className="flex items-center gap-3">
              <Moon size={15} className="shrink-0" />
              <span>Dark</span>
            </div>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="system"
            className="cursor-pointer rounded-lg py-2 pr-3 text-[13px] font-medium dark:text-white data-[state=checked]:bg-blue-50 dark:data-[state=checked]:bg-blue-900/20 data-[state=checked]:text-blue-600 dark:data-[state=checked]:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
          >
            <div className="flex items-center gap-3">
              <Monitor size={15} className="shrink-0" />
              <span>System</span>
            </div>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
