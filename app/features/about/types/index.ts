export interface SocialLink {
  platform: "youtube" | "linkedin" | "facebook" | "tiktok";
  url: string;
}

export interface Member {
  name: string;
  role?: string;
  imageUrl: string;
  imagePosition?: string;
  imageTransform?: string;
  socialLinks?: SocialLink[];
}

export interface Pillar {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
}
