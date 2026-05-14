import type { PostingDetail } from "./manage-post-detail-type";

export const MOCK_POSTING_DETAIL: PostingDetail = {
  id: "1",
  title: "Cambria Redesign",
  status: "active",
  postedAgo: "3 days ago",
  pending: 5,
  totalApplicants: 48,
  recruitmentGoal: { current: 12, target: 20 },
  applicants: [
    {
      id: "a1",
      name: "Jasper Nguyen",
      email: "jasper.nguyen@example.com",
      role: "Senior Brand Designer",
      appliedOn: "Nov 5, 2026",
      status: "new",
    },
    {
      id: "a2",
      name: "Maya Patel",
      email: "maya.patel@example.com",
      role: "Senior Brand Designer",
      appliedOn: "Dec 12, 2026",
      status: "in-review",
    },
    {
      id: "a3",
      name: "Liam O'Sullivan",
      email: "liam.osullivan@example.com",
      role: "Senior Brand Designer",
      appliedOn: "Jan 3, 2027",
      status: "passed",
    },
    {
      id: "a4",
      name: "Sofia Martinez",
      email: "sofia.martinez@example.com",
      role: "Visual Designer",
      appliedOn: "Feb 14, 2027",
      status: "passed",
    },
    {
      id: "a5",
      name: "Ethan Brooks",
      email: "ethan.brooks@example.com",
      role: "Senior Brand Designer",
      appliedOn: "Mar 9, 2027",
      status: "rejected",
    },
  ],
};
