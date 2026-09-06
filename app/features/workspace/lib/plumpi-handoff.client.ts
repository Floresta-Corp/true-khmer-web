import { PLUMPI_HANDOFF_MESSAGE, PLUMPI_HANDOFF_TITLE } from "./plumpi-handoff";

/**
 * The handoff URL can only be minted server-side, so the tab has to be opened
 * synchronously on click — before the action answers — or the browser blocks it
 * as an unrequested pop-up. That leaves a blank tab sitting in front of the
 * user for as long as the round trip takes, so it is dressed as the same
 * "Redirecting you to Plumpi" card the opening tab shows.
 *
 * The document is written inline rather than pointed at a route: the tab exists
 * before there is anything to navigate to, and a route would cost a request
 * that competes with the handoff itself. Design values are taken from the
 * True Khmer design system (`--tk-primary-100`, `--tk-brand-primary`,
 * `--tk-text-heading`, `--tk-text-muted`) as literals, since a fresh document
 * has none of the app's stylesheets.
 */
function plumpiHandoffDocument(origin: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Opening Plumpi</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  html, body { height: 100%; }
  body {
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: #F5F6F8;
    font-family: "Geist Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  }
  /* Matches the scrim the in-app overlay sits on, so the two tabs read as one
     step rather than two different screens. */
  body::before { content: ""; position: fixed; inset: 0; background: rgba(18,20,28,0.45); }
  .card {
    position: relative;
    width: 100%;
    max-width: 380px;
    padding: 48px 40px;
    border-radius: 16px;
    background: #FFFFFF;
    box-shadow: 0 20px 60px rgba(26,26,46,0.25);
    text-align: center;
  }
  .logo { display: block; height: 40px; width: auto; margin: 0 auto 22px; }
  .spinner {
    width: 56px;
    height: 56px;
    margin: 0 auto 26px;
    border-radius: 50%;
    border: 4px solid #D5E2FA;
    border-top-color: #1C5DD4;
    animation: plumpi-spin 0.9s linear infinite;
  }
  h1 { margin: 0 0 10px; font-size: 19px; font-weight: 800; color: #1A1A2E; }
  p { margin: 0; font-size: 14px; line-height: 1.6; color: #9A9AB0; }
  @keyframes plumpi-spin { to { transform: rotate(360deg); } }
  @media (prefers-reduced-motion: reduce) { .spinner { animation-duration: 2.4s; } }
</style>
</head>
<body>
  <main class="card" role="status" aria-live="polite">
    <img class="logo" src="${origin}/images/Plumpi.svg" alt="Plumpi">
    <div class="spinner" aria-hidden="true"></div>
    <h1>${PLUMPI_HANDOFF_TITLE}</h1>
    <p>${PLUMPI_HANDOFF_MESSAGE}</p>
  </main>
</body>
</html>`;
}

/**
 * Opens the tab the Plumpi handoff will land in, already showing the redirect
 * card. Returns `null` when the browser blocked the pop-up, which the caller
 * has to surface — nothing else can be done from script at that point.
 */
export function openPlumpiHandoffWindow(): Window | null {
  const plumpiWindow = window.open("about:blank", "_blank");
  if (!plumpiWindow) return null;

  // Cuts the new tab's scripting access back to this one.
  plumpiWindow.opener = null;

  plumpiWindow.document.write(plumpiHandoffDocument(window.location.origin));
  plumpiWindow.document.close();

  return plumpiWindow;
}
