import { Form, Link, useActionData } from "react-router";
import type { Route } from "./+types/register";
import { createUser, findUserByEmail } from "~/lib/auth.server";
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
  const confirmPassword = String(formData.get("confirmPassword") || "");

  const errors: {
    email?: string;
    password?: string;
    confirmPassword?: string;
    form?: string;
  } = {};
  if (!email) errors.email = "Email is required";
  else if (!email.includes("@")) errors.email = "Must be a valid email";
  if (!password) errors.password = "Password is required";
  else if (password.length < 6)
    errors.password = "Password must be at least 6 characters";
  if (password !== confirmPassword)
    errors.confirmPassword = "Passwords do not match";
  if (Object.keys(errors).length > 0) return { errors };

  const existing = await findUserByEmail(email);
  if (existing)
    return { errors: { email: "An account with this email already exists" } };

  const user = await createUser(email, password);
  return createUserSession(user.id, user.email, "/dashboard");
}

export function meta() {
  return [{ title: "Register | True Khmer" }];
}

export default function RegisterPage() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={null} />

      <main className="flex items-center justify-center px-4 py-16 sm:py-24">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>Sign up to get started</CardDescription>
          </CardHeader>
          <CardContent>
            {actionData?.errors?.form && (
              <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive-foreground">
                {actionData.errors.form}
              </div>
            )}

            <Form method="post" className="space-y-4">
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
                  autoComplete="new-password"
                  placeholder="••••••••"
                />
                {actionData?.errors?.password && (
                  <p className="text-sm text-destructive-foreground">
                    {actionData.errors.password}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                />
                {actionData?.errors?.confirmPassword && (
                  <p className="text-sm text-destructive-foreground">
                    {actionData.errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </Form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
