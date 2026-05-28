import { myApplicationDetailLoader } from "~/routes/api.my-space/my-application-detail/my-application-detiail-loader";
import MyApplicationDetailPage from "../pages/my-application-detail-page";

export const loader = myApplicationDetailLoader;

export default function MyApplicationDetailRoute() {
  return <MyApplicationDetailPage />;
}