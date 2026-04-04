import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function resolveImageURL(url?: string, fallback?: string) {
  if (!url) {
    return fallback || "";
  }
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Assuming it's an R2 key, construct the full URL
  const baseUrl = import.meta.env.VITE_R2_PUBLIC_BASE_URL;
  if (!baseUrl) {
    console.warn("VITE_R2_PUBLIC_BASE_URL is not defined in environment variables.");
    return url; // Fallback to the original URL
  }
  return `${baseUrl}/${url}`;
}