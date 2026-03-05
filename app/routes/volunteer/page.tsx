import { AvailableOpportunities } from "./components/AvailableOpportunities";
import { BrowseCategories } from "./components/BrowseCategories";
import VolunteerHeader from "./components/VolunteerHeader";

export default function VolunteerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <VolunteerHeader />
      <BrowseCategories />
      <AvailableOpportunities />
    </div>
  );
}
