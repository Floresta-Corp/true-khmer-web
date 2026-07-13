import { redirect } from "react-router";

export function loader() {
  return redirect("/registration/partner-registration");
}

export default function RegistrationIndex() {
  return null;
}
