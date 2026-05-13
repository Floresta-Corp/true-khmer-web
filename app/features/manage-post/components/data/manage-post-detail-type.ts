export type ApplicantStatus = "new" | "in-review" | "passed" | "rejected";
export type TimeFilter = "today" | "this-week" | "all-time";

export type Applicant = {
  id: string;
  name: string;
  email: string;
  role: string;
  appliedOn: string;
  status: ApplicantStatus;
};

export type PostingDetail = {
  id: string;
  title: string;
  status: "active" | "draft" | "filled";
  postedAgo: string;
  pending: number;
  totalApplicants: number;
  recruitmentGoal: { current: number; target: number };
  applicants: Applicant[];
};
