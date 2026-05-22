import { savedItemsLoader } from "~/routes/api/saved-items/saved-items-loader";
import SaveItemPage from "../components/pages/saved-items-page";
import { savedItemsAction } from "~/routes/api/saved-items/saved-items-action";

export const loader = savedItemsLoader;
export const action = savedItemsAction;

export function meta() {
  return [{ title: "Saved Items | True Khmer" }];
}

export default function SavedItems() {
  return <SaveItemPage />;
}
