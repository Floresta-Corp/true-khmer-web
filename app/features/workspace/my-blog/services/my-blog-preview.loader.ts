import { BLOG_PREVIEW_STORAGE_KEY, type BlogPreviewDraft } from "../types";

export async function myBlogPreviewClientLoader() {
  try {
    const raw = window.localStorage.getItem(BLOG_PREVIEW_STORAGE_KEY);
    return { draft: raw ? (JSON.parse(raw) as BlogPreviewDraft) : null };
  } catch {
    return { draft: null };
  }
}
