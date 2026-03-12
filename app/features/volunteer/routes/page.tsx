import { AvailableOpportunities } from "../page/section/AvailableOpportunities";
import { BrowseCategories } from "../page/section/BrowseCategories";

import VolunteerHeader from "../page/section/VolunteerHeader";

export default function VolunteerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <VolunteerHeader />
      <BrowseCategories />
      <AvailableOpportunities />
    </div>
  );
}
