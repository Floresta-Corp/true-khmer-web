import { Form, Link, useActionData, useSearchParams } from "react-router";
import type { Route } from "./+types/login";
import { verifyLogin } from "~/lib/auth.server";
import { createUserSession, getUser } from "~/lib/session.server";
import { redirect } from "react-router";
import { Navbar } from "~/components/navbar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

// If already logged in, redirect to dashboard
export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUser(request);
  if (user) throw redirect("/dashboard");
  return {};
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const redirectTo = String(formData.get("redirectTo") || "/dashboard");

  const errors: { email?: string; password?: string; form?: string } = {};
  if (!email) errors.email = "Email is required";
  if (!password) errors.password = "Password is required";
  if (Object.keys(errors).length > 0) return { errors };

  const user = await verifyLogin(email, password);
  if (!user) return { errors: { form: "Invalid email or password" } };

  return createUserSession(user.id, user.email, redirectTo);
}

export function meta() {
  return [{ title: "Login | True Khmer" }];
}

export default function LoginPage() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={null} />

      <main className="flex items-center justify-center px-4 py-16 sm:py-24">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            {actionData?.errors?.form && (
              <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive-foreground">
                {actionData.errors.form}
              </div>
            )}

            <Form method="post" className="space-y-4">
              <input type="hidden" name="redirectTo" value={redirectTo} />

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                />
                {actionData?.errors?.email && (
                  <p className="text-sm text-destructive-foreground">
                    {actionData.errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                />
                {actionData?.errors?.password && (
                  <p className="text-sm text-destructive-foreground">
                    {actionData.errors.password}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </Form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-primary hover:underline"
              >
                Create one
              </Link>
            </p>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Demo: admin@example.com / password123
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
