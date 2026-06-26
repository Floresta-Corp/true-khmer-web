import { acceptInviteAction } from "../services/accept-invite.action";
import AcceptInvitePage from "../pages/accept-invite-page";

export const action = acceptInviteAction;

export function meta() {
  return [{ title: "Create Moderator Account | True Khmer" }];
}

export default function AcceptInviteRoute() {
  return <AcceptInvitePage />;
}
