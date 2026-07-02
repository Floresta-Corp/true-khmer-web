import { isRouteErrorResponse, useRouteError } from "react-router";

import { notificationBroadcastAction } from "../services/notification-broadcast.action";
import { AccessRestricted } from "~/features/admin/components/access-restricted";

export const action = notificationBroadcastAction;

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 403) {
    return <AccessRestricted message={error.data?.message} />;
  }
  throw error;
}
