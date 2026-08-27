import { Link, useNavigate, type LinkProps } from "react-router";

interface BackLinkProps extends Omit<LinkProps, "to"> {
  /**
   * Where to go when there is no in-app history to return to — a fresh tab, a
   * shared link, or a hard refresh. It is also the `href`, so middle-clicking
   * and "open in new tab" still work.
   */
  to: string;
}

/**
 * A back link that actually goes back.
 *
 * A plain `<Link to="/somewhere">` always lands on the same page, which is
 * wrong when the user arrived from somewhere else: opening the course builder
 * from the Education hub and pressing back should return to the hub, not jump
 * to Course Listing. This walks history when there is history, and uses `to`
 * only as the fallback.
 */
export function BackLink({ to, onClick, ...rest }: BackLinkProps) {
  const navigate = useNavigate();

  return (
    <Link
      {...rest}
      to={to}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;

        // Leave new-tab and new-window intents to the browser.
        if (
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }

        // React Router keeps its position in `history.state.idx`. Index 0 means
        // this entry started the session, so there is nothing to go back to and
        // the fallback should be used instead.
        const index =
          (window.history.state as { idx?: number } | null)?.idx ?? 0;
        if (index <= 0) return;

        event.preventDefault();
        navigate(-1);
      }}
    />
  );
}
