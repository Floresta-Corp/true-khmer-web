import { AvailableOpportunities } from "./section/AvailableOpportunities";
import { BrowseCategories } from "./section/BrowseCategories";

import VolunteerHeader from "./section/VolunteerHeader";

export default function VolunteerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <VolunteerHeader />
      <BrowseCategories />
      <AvailableOpportunities />
    </div>
  );
}
