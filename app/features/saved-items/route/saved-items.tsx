import { savedItemsLoader } from "../services/saved-items.loader";
import { savedItemsAction } from "../services/saved-items.action";
import SaveItemPage from "../components/pages/saved-items-page";

export const loader = savedItemsLoader;
export const action = savedItemsAction;

export function meta() {
  return [{ title: "Saved Items | True Khmer" }];
}

export default function SavedItems() {
  return <SaveItemPage />;
}
