export function StandingUnavailable({ label }: { label: string }) {
  return (
    <p className="py-12 text-center text-sm text-gray-500">
      We couldn't load your {label} right now. Please try again later.
    </p>
  );
}
