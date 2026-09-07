import { ManageEducationPageSkeleton } from "../components/manage-education-page-skeleton";
import ManageEducationPage from "../components/pages/manage-education-page";
import { manageEducationAction } from "../services/manage-education.action";
import { manageEducationLoader } from "../services/manage-education.loader";

export function meta() {
  return [{ title: "Manage Education | True Khmer" }];
}

export const loader = manageEducationLoader;
export const action = manageEducationAction;

export function HydrateFallback() {
  return <ManageEducationPageSkeleton />;
}

export default function ManageEducationRoute() {
  return <ManageEducationPage />;
}
