export interface VolunteerRole {
  id: number;
  title: string;
  commitment: string;
  spotLeft: number;
  responsibilities: string[];
  requirements: string[];
}

export interface VolunteerCreatorProfile {
  name: string;
  status: string;
  isVerified: boolean;
  imageUrl: string;
}

export interface VolunteerCreatorDetails {
  website: string;
  opportunitiesCount: string;
  location: string;
}

export interface VolunteerPost {
  id: number;
  title: string;
  status: string;
  location: string;
  commitment: string;
  duration: string;
  applicants: number;
  totalApplcants: number;
  deadLine: string;
  overview: string;
  availableRoles: VolunteerRole[];
  benefits: string[];
  projectImpact: string;
  createdBy: {
    profile: VolunteerCreatorProfile;
    details: VolunteerCreatorDetails;
  };
}

export interface GetPostResponse {
  volunteer: VolunteerPost | null;
}

const volunteer: VolunteerPost = {
  id: 1,
  title: "Temple Restoration Support",
  status: "Urgent",
  location: "Siem Reap",
  commitment: "Full-Week",
  duration: "7 days",
  applicants: 7,
  totalApplcants: 10,
  deadLine: "Dec 15, 2026",
  overview:
    "Join the Khmer Heritage Trust in a critical mission to preserve our nation's architectural history. We are looking for dedicated volunteers to help document and protect delicate 10th-century carvings at lesser-known temple sites in the Siem Reap region. Your work will directly contribute to the digital archives used by global scholars and local preservationists.",
  availableRoles: [
    {
      id: 1,
      title: "Temple Restoration Support",
      commitment: "Full-Week",
      spotLeft: 3,
      responsibilities: [
        "Assist professional archeologists in documenting site conditions",
        "Catalog fragile carvings and annotate preservation priorities",
        "Photograph key artifacts and log findings in the field report",
        "Support local teams with safe site-mapping coordination",
      ],
      requirements: [
        "Physical fitness for walking in tropical environments",
        "Comfort working outdoors for extended periods",
        "Basic note-taking and reporting discipline",
        "Respect for cultural heritage and local customs",
      ],
    },
  ],
  benefits: [
    "Hands-on mentorship from conservation experts",
    "Field certification for heritage preservation support",
    "Networking with researchers and local cultural teams",
    "Direct contribution to Cambodia's digital heritage archive",
  ],
  projectImpact:
    "Lorem ipsum dolor sit amet consectetur. Pretium nulla tellus volutpat augue vulputate amet. Id facilisis elit aliquam mattis. Pellentesque tristique eget mauris tempus egestas sapien libero. In tincidunt duis volutpat pellentesque mauris ac lacus nisi a. Gravida nulla risus massa viverra praesent. Elit malesuada condimentum neque in amet eget. Tincidunt diam nulla lectus.",
  createdBy: {
    profile: {
      name: "User Profile Name",
      status: "PREMIUM PARTNER",
      isVerified: true,
      imageUrl: "https://khmerheritage.org/assets/profile-placeholder.png", // Replace with actual image source
    },
    details: {
      website: "khmerheritage.org",
      opportunitiesCount: "10+",
      location: "Phnom Penh",
    },
  },
};

const roleList: VolunteerRole[] = [
  {
    id: 1,
    title: "Temple Restoration Support",
    commitment: "Full-Week",
    spotLeft: 3,
    responsibilities: [
      "Assist professional archeologists in documenting site conditions",
      "Catalog fragile carvings and annotate preservation priorities",
      "Photograph key artifacts and log findings in the field report",
      "Support local teams with safe site-mapping coordination",
    ],
    requirements: [
      "Physical fitness for walking in tropical environments",
      "Comfort working outdoors for extended periods",
      "Basic note-taking and reporting discipline",
      "Respect for cultural heritage and local customs",
    ],
  },
  {
    id: 1,
    title: "Temple Restoration Support",
    commitment: "Full-Week",
    spotLeft: 3,
    responsibilities: [
      "Assist professional archeologists in documenting site conditions",
      "Catalog fragile carvings and annotate preservation priorities",
      "Photograph key artifacts and log findings in the field report",
      "Support local teams with safe site-mapping coordination",
    ],
    requirements: [
      "Physical fitness for walking in tropical environments",
      "Comfort working outdoors for extended periods",
      "Basic note-taking and reporting discipline",
      "Respect for cultural heritage and local customs",
    ],
  },
  {
    id: 1,
    title: "Temple Restoration Support",
    commitment: "Full-Week",
    spotLeft: 3,
    responsibilities: [
      "Assist professional archeologists in documenting site conditions",
      "Catalog fragile carvings and annotate preservation priorities",
      "Photograph key artifacts and log findings in the field report",
      "Support local teams with safe site-mapping coordination",
    ],
    requirements: [
      "Physical fitness for walking in tropical environments",
      "Comfort working outdoors for extended periods",
      "Basic note-taking and reporting discipline",
      "Respect for cultural heritage and local customs",
    ],
  },
];

// GET /api/me — returns the current user as JSON
export async function getPostById(id: number): Promise<GetPostResponse> {
  if (id === volunteer.id) {
    return { volunteer };
  }
  return { volunteer: null };
}
