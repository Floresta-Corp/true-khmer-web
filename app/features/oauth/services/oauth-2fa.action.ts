// Reused wholesale from the main login's two-factor step — see the note on
// the loader. Verifying here writes `__session` and redirects back to the
// authorization page, where the consent card picks the session up.
export {
  action as Oauth2faAction,
  type LoginTwoFactorActionData as Oauth2faActionData,
} from "~/routes/auth/domain/login-2fa.server";
