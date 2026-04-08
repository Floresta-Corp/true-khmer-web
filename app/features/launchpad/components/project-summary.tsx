import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

const data = {
  projectSummary: {
    location: "Phnom Penh",
    applicants: {
      status: "6 spots open",
      count: 6,
    },
    deadline: "2026-04-12",
  },
};

export default function ProjectSummary() {
  return (
    <Card className="w-[327] bg-white p-6">
      <CardHeader>Project Summary</CardHeader>
      <CardContent>
        <div className="w-full grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Location</p>
            <p className="text-lg font-bold">{data.projectSummary.location}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Applicants</p>
            <p className="text-lg font-bold">
              {data.projectSummary.applicants.status}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Deadline</p>
            <p className="text-lg font-bold">{data.projectSummary.deadline}</p>
          </div>
        </div>
        <div>
          <Button variant="default" className="bg-primary rounded-lg">
            Apply Now
          </Button>
          <Button className="bg-white rounded-lg" variant="outline">
            Save for Later
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
