import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { MoreVertical } from "lucide-react";

export function PageHeader() {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Space</h1>
        <p className="text-sm text-muted-foreground">
          Visualize your growth and community contributions.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Link to={"/edit-profile"}>
          <Button variant="default" className="h-9 bg-blue-600 cursor-pointer">
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
