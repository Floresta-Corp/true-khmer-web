import MyTicketsPage from "../components/my-tickets-page";
export { myTicketsLoader as loader } from "../services/my-tickets.loader";
export function meta() {
  return [{ title: "My Tickets | True Khmer" }];
}
export default MyTicketsPage;

export { default as ErrorBoundary } from "../components/my-tickets-error";
