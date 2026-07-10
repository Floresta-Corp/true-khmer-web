export interface Benefit {
  name: string;
  value: string | number | boolean;
  available: boolean;
}

export interface Tier {
  name: string;
  id: string;
  price: string;
  description: string;
  benefits: Benefit[];
  featured: boolean;
}

export const tiers: Tier[] = [
  {
    name: "Platinum",
    id: "platinum",
    price: "$12000",
    description: "Premuim experience with maximum exposure.",
    benefits: [
      { name: "Shout out FB post", value: "", available: true },
      {
        name: "Tiktok branded video",
        value: "Big logo on all videos 1st screen",
        available: true,
      },
      { name: "10x Tiktok dedicated video", value: "", available: true },
      { name: "Product placement", value: "", available: true },
      { name: "Physical label", value: "", available: true },
      { name: "Digital label", value: "", available: true },
      {
        name: "Registration in the Media Directory",
        value: "Yes with Logo and top tiers",
        available: true,
      },
      { name: "Logo on national campaign", value: "", available: true },
      { name: "Logo on official merch", value: "", available: true },
      { name: "Gift for online contests", value: "", available: true },
      { name: "1x CEO interview", value: "", available: true },
      { name: "Website Visibility", value: "", available: true },
    ],
    featured: true,
  },
  {
    name: "Gold",
    id: "gold",
    price: "$8000",
    description: "Excellent visibility with strong branding and exposure.",
    benefits: [
      { name: "Shout out FB post", value: "", available: true },
      {
        name: "5x Tiktok branded video",
        value: "On second screen+ dedicated",
        available: true,
      },
      { name: "5x Tiktok dedicated video", value: "", available: true },
      { name: "Product placement", value: "", available: true },
      { name: "Physical label", value: "", available: true },
      { name: "Digital label", value: "", available: true },
      {
        name: "Registration in the Media Directory",
        value: "Yes with Logo and top tiers",
        available: true,
      },
      { name: "Logo on national campaign", value: "", available: true },
      { name: "Gift for online contests", value: "", available: true },
      { name: "1x CEO interview", value: "", available: true },
      { name: "Website Visibility", value: "", available: true },
      {
        name: "Logo on official merch",
        value: "",
        available: false,
      },
    ],
    featured: false,
  },
  {
    name: "Silver",
    id: "silver",
    price: "$3500",
    description: "Advanced engagement, clear commitment for Cambodia.",
    benefits: [
      { name: "Shout out FB post", value: "", available: true },
      {
        name: "Tiktok branded video",
        value: "Only on dedicated",
        available: true,
      },
      { name: "3x Tiktok dedicated video", value: "", available: true },
      { name: "Physical label", value: "", available: true },
      { name: "Digital label", value: "", available: true },
      {
        name: "Registration in the Media Directory",
        value: "",
        available: true,
      },
      { name: "Gift for online contests", value: "", available: true },
      { name: "1x CEO interview", value: "", available: true },
      { name: "Website Visibility", value: "", available: true },
      { name: "Product placement", value: "", available: false },
      {
        name: "Logo on national campaign",
        value: "",
        available: false,
      },
      {
        name: "Logo on official merch",
        value: "",
        available: false,
      },
    ],
    featured: false,
  },
  {
    name: "Bronze",
    id: "bronze",
    price: "$1800",
    description: "Basic interactive visibility package.",
    benefits: [
      { name: "Shout out FB post", value: "", available: true },
      {
        name: "Tiktok branded video",
        value: "Only on dedicated",
        available: true,
      },
      { name: "1x Tiktok dedicated video", value: "", available: true },
      { name: "Physical label", value: "", available: true },
      { name: "Digital label", value: "", available: true },
      {
        name: "Registration in the Media Directory",
        value: "",
        available: true,
      },
      { name: "Gift for online contests", value: "", available: true },
      { name: "Website Visibility", value: "", available: true },
      { name: "Product placement", value: "", available: false },
      {
        name: "Logo on national campaign",
        value: "",
        available: false,
      },
      {
        name: "Logo on official merch",
        value: "",
        available: false,
      },
      { name: "CEO interview", value: "", available: false },
    ],
    featured: false,
  },
  {
    name: "Government",
    id: "government",
    price: "$1500",
    description: "Special offer for government organizations and agencies.",
    benefits: [
      { name: "Shout out FB post", value: "", available: true },
      {
        name: "Tiktok branded video",
        value: "20 video as 2nd screen",
        available: true,
      },
      { name: "Tiktok dedicated video", value: "1", available: true },
      { name: "Physical label", value: "", available: true },
      { name: "Digital label", value: "", available: true },
      {
        name: "Registration in the Media Directory",
        value: "",
        available: true,
      },
      { name: "Logo on national campaign", value: "", available: true },
      { name: "Logo on official merch", value: "", available: true },
      { name: "Website Visibility", value: "", available: true },
      { name: "Product placement", value: "", available: false },
      {
        name: "Gift for online contests",
        value: "",
        available: false,
      },
      { name: "CEO interview", value: "", available: false },
    ],
    featured: false,
  },
  {
    name: "Video",
    id: "video",
    price: "$500",
    description: "Let them know, share the story of a True Khmer.",
    benefits: [
      { name: "Shout out FB post", value: "", available: true },
      { name: "1x Tiktok dedicated video", value: "", available: true },
      { name: "Digital label", value: "", available: true },
      { name: "CEO interview", value: "", available: true },
      { name: "Website Visibility", value: "", available: true },
      {
        name: "Tiktok branded video",
        value: "",
        available: false,
      },
      { name: "Product placement", value: "", available: false },
      { name: "Physical label", value: "", available: false },
      {
        name: "Registration in the Media Directory",
        value: "",
        available: false,
      },
      {
        name: "Logo on national campaign",
        value: "",
        available: false,
      },
      {
        name: "Logo on official merch",
        value: "",
        available: false,
      },
      {
        name: "Gift for online contests",
        value: "",
        available: false,
      },
    ],
    featured: false,
  },
  {
    name: "SME",
    id: "sme",
    price: "$200",
    description: "Affordable option for small and medium enterprises.",
    benefits: [
      { name: "Shout out FB post", value: "", available: true },
      { name: "Physical label", value: "", available: true },
      { name: "Digital label", value: "", available: true },
      { name: "Website Visibility", value: "", available: true },
      {
        name: "Tiktok branded video",
        value: "",
        available: false,
      },
      {
        name: "Tiktok dedicated video",
        value: "",
        available: false,
      },
      { name: "Product placement", value: "", available: false },
      {
        name: "Registration in the Media Directory",
        value: "",
        available: false,
      },
      {
        name: "Logo on national campaign",
        value: "",
        available: false,
      },
      {
        name: "Logo on official merch",
        value: "",
        available: false,
      },
      {
        name: "Gift for online contests",
        value: "",
        available: false,
      },
      { name: "CEO interview", value: "", available: false },
    ],
    featured: false,
  },
  {
    name: "Free",
    id: "free",
    price: "$0",
    description: "Free package for companies and organizations.",
    benefits: [
      { name: "Website Visibility", value: "", available: true },
      { name: "Shout out FB post", value: "", available: false },
      { name: "Physical label", value: "", available: false },
      { name: "Digital label", value: "", available: false },
      {
        name: "Tiktok branded video",
        value: "",
        available: false,
      },
      {
        name: "Tiktok dedicated video",
        value: "",
        available: false,
      },
      { name: "Product placement", value: "", available: false },
      {
        name: "Registration in the Media Directory",
        value: "",
        available: false,
      },
      {
        name: "Logo on national campaign",
        value: "",
        available: false,
      },
      {
        name: "Logo on official merch",
        value: "",
        available: false,
      },
      {
        name: "Gift for online contests",
        value: "",
        available: false,
      },
      { name: "CEO interview", value: "", available: false },
    ],
    featured: false,
  },
];
