import type { ShouldRevalidateFunctionArgs } from "react-router";
import CreateEventPage from "../components/pages/create-event-page";
import { createEventAction } from "../services/create-event.action";
import { createEventLoader } from "../services/create-event.loader";

export const loader = createEventLoader;
export const action = createEventAction;

export function shouldRevalidate({
  currentUrl,
  nextUrl,
  formMethod,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  if (formMethod && formMethod.toUpperCase() !== "GET") {
    return defaultShouldRevalidate;
  }

  const currentStep = currentUrl.searchParams.get("step");
  const nextStep = nextUrl.searchParams.get("step");

  if (currentUrl.pathname === nextUrl.pathname && currentStep !== nextStep) {
    const currentParams = new URLSearchParams(currentUrl.searchParams);
    const nextParams = new URLSearchParams(nextUrl.searchParams);
    currentParams.delete("step");
    nextParams.delete("step");

    if (currentParams.toString() === nextParams.toString()) {
      return false;
    }
  }

  return defaultShouldRevalidate;
}

export function meta() {
  return [{ title: "Create Event | True Khmer" }];
}

export default function MyEventsCreate() {
  return <CreateEventPage />;
}
