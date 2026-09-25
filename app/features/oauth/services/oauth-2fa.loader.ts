// The popup runs the exact same two-factor challenge as the main login: the
// same `__2fa_pending_login` cookie, the same verify endpoints, and the same
// redirect to whatever `redirectTo` asks for. Only the layout differs, so the
// server halves are reused as-is rather than copied and left to drift.
export { loader as Oauth2faLoader } from "~/routes/auth/domain/login-2fa.server";
