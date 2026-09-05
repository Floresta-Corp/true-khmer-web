/** Red star marking a field the builder will not let you skip. */
export function Required() {
  return (
    <span className="ml-0.5 text-[#FB3748]" aria-hidden>
      *
    </span>
  );
}
