/**
 * Copy for the hold shown while a visitor is being sent to Plumpi. Exported so
 * every surface that hands off — the create-event dialog, the My Events
 * listing, the ticket tiers on an event page, and the interstitial written into
 * a newly opened tab — always says the same thing.
 */
export const PLUMPI_HANDOFF_TITLE = "Redirecting you to Plumpi…";
export const PLUMPI_HANDOFF_MESSAGE =
  "Hang tight while we take you to Plumpi to finish setup.";

/**
 * Full-screen hold shown while the visitor is handed over to Plumpi. Mirrors
 * the connecting state in the design system, and the interstitial written into
 * the new tab by `openPlumpiHandoffWindow`.
 */
export default function PlumpiRedirectOverlay() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#12141C]/45 p-5"
    >
      <div className="w-full max-w-95 rounded-2xl bg-white px-10 py-12 text-center shadow-[0_20px_60px_rgba(26,26,46,0.25)]">
        <img
          src="/images/Plumpi.svg"
          alt="Plumpi"
          className="mx-auto h-10 w-auto"
        />
        <div className="mx-auto mt-5.5 size-14 animate-spin rounded-full border-4 border-[#D5E2FA] border-t-[#1C5DD4] motion-reduce:[animation-duration:2.4s]" />
        <h2 className="mt-6.5 text-[19px] font-extrabold text-[#1A1A2E]">
          {PLUMPI_HANDOFF_TITLE}
        </h2>
        <p className="mt-2.5 text-[14px] leading-[1.6] text-[#9A9AB0]">
          {PLUMPI_HANDOFF_MESSAGE}
        </p>
      </div>
    </div>
  );
}
