import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

type DebouncedFn<TArgs extends unknown[]> = ((...args: TArgs) => void) & {
  cancel: () => void;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function debounce<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  delay = 300,
): DebouncedFn<TArgs> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const debounced = (...args: TArgs) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };

  return debounced;
}

export function formatCompactNumber(value: number): string {
  const absValue = Math.abs(value);

  if (absValue >= 1_000_000) {
    const compactValue = value / 1_000_000;
    return `${compactValue % 1 === 0 ? compactValue.toFixed(0) : compactValue.toFixed(1)}M`;
  }

  if (absValue >= 1_000) {
    const compactValue = value / 1_000;
    return `${compactValue % 1 === 0 ? compactValue.toFixed(0) : compactValue.toFixed(1)}K`;
  }

  return value.toString();
}

export function resolveImageURL(url?: string | null, fallback?: string) {
  if (!url) {
    return fallback || "";
  }
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Assuming it's an R2 key, construct the full URL
  const baseUrl = import.meta.env.VITE_R2_PUBLIC_BASE_URL;
  if (!baseUrl) {
    console.warn(
      "VITE_R2_PUBLIC_BASE_URL is not defined in environment variables.",
    );
    return url; // Fallback to the original URL
  }
  return `${baseUrl}/${url}`;
}

export const convertFileSize = (sizeInKB: number) => {
  if (sizeInKB < 1024) {
    return `${sizeInKB.toFixed(2)} KB`;
  } else if (sizeInKB < 1024 * 1024) {
    const sizeInMB = sizeInKB / 1024;
    return `${sizeInMB.toFixed(2)} MB`;
  } else {
    const sizeInGB = sizeInKB / (1024 * 1024);
    return `${sizeInGB.toFixed(2)} GB`;
  }
};
