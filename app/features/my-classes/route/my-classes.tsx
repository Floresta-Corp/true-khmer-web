import MyClassesPage from "../components/pages/my-classes-page";
import { myClassesAction } from "../services/my-classes.action";
import { myClassesLoader } from "../services/my-classes.loader";

export const loader = myClassesLoader;
export const action = myClassesAction;

export function meta() {
  return [{ title: "My Classes | True Khmer" }];
}

export default function MyClassesRoute() {
  return <MyClassesPage />;
}
