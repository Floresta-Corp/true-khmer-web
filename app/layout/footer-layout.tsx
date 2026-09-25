import { Outlet, useMatches } from "react-router";
import { Footer } from "~/components/footer";

export interface FooterHandle {
  hideFooter?: (data: unknown) => boolean;
}

/**
 * A child route can drop the footer by exporting `handle.hideFooter`, which
 * gets that route's loader data so the choice can follow what was loaded.
 */
export default function FooterLayout() {
  const matches = useMatches();
  const hideFooter = matches.some((match) =>
    (match.handle as FooterHandle | undefined)?.hideFooter?.(match.data),
  );

  return (
    <>
      <Outlet />
      {hideFooter ? null : <Footer />}
    </>
  );
}
