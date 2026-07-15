export const BLOG_TAG_LIMIT = 5;
export const BLOG_PREVIEW_STORAGE_KEY = "moderator.blog.preview";
export const BLOG_AUTOSAVE_STORAGE_PREFIX = "moderator.blog.autosave:";

export interface BlogPreviewDraft {
  title: string;
  excerpt: string;
  authorName: string;
  authorRole?: string;
  tags: string[];
  categoryName?: string;
  coverImageUrl?: string;
  coverImageAlt?: string;
  coverImageCaption?: string;
  content: string;
  previewDate: string;
  editorUrl?: string;
}
