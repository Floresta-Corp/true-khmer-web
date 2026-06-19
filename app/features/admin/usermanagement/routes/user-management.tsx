import { Suspense } from "react";
import { Await, useLoaderData } from "react-router";

import {
  UserManagementPage,
  UserManagementPageSkeleton,
} from "../components/user-management-page";
import { userManagementAction } from "../service/user-management.action";
import { userManagementLoader } from "../service/user-management.loader";

export const loader = userManagementLoader;
export const action = userManagementAction;

export function meta() {
  return [{ title: "User Management | True Khmer" }];
}

export function HydrateFallback() {
  return <UserManagementPageSkeleton />;
}

export default function UserManagementRoute() {
  const { users } = useLoaderData<typeof loader>();

  return (
    <Suspense fallback={<UserManagementPageSkeleton />}>
      <Await resolve={users}>
        {(result) => <UserManagementPage result={result} />}
      </Await>
    </Suspense>
  );
}
