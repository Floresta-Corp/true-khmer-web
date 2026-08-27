/**
 * Full-screen hold shown while the draft is handed over to Plumpi.
 */
export default function CreateEventConnecting() {
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
          className="mx-auto h-7 w-auto"
        />
        <div className="mx-auto mt-5.5 size-14 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
        <h2 className="mt-6.5 text-[19px] font-extrabold text-[#1D283A]">
          Redirecting you to Plumpi…
        </h2>
        <p className="mt-2.5 text-sm leading-relaxed text-slate-500">
          Hang tight while we take you to Plumpi to finish setup.
        </p>
      </div>
    </div>
  );
}
