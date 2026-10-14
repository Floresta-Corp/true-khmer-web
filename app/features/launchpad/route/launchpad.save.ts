import { launchpadSaveAction } from "~/features/launchpad/services/launchpad.action";

export const loader = () =>
  new Response("Method Not Allowed", {
    status: 405,
    headers: { Allow: "POST" },
  });

export const action = launchpadSaveAction;
