import { ErrorState } from "./error-state";

/** Shared by the catch-all route and the root error boundary. */
export function NotFound() {
  return (
    <ErrorState
      code="Error 404"
      heading="Oops! This page does not exist"
      lines={[
        "The page you're looking for may have been moved or removed.",
        "Check the address, or head back to the home page.",
      ]}
    />
  );
}
