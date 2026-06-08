import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { MoreVertical, PenLine } from "lucide-react";

export function PageHeader() {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">My Space</h1>
        <p className="text-base text-muted-foreground">
          Visualize your growth and community contributions.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Link to={"/edit-profile"}>
          <Button
            variant="default"
            className="h-9 bg-blue-500 hover:bg-blue-600 rounded-xl cursor-pointer"
          >
            <PenLine className="h-4 w-4 text-white" />
            Edit profile
          </Button>
        </Link>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
