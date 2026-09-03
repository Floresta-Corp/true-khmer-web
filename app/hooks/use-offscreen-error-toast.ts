import { useEffect, useRef } from "react";
import { toast } from "sonner";

let nextToastId = 0;

/**
 * Mirrors an inline form error into a toast while the inline banner is out of
 * view.
 *
 * Long forms put their error banner at the top, so a submit made from the
 * bottom of the page reports the failure somewhere the user cannot see. The
 * returned ref goes on the element wrapping the inline error: while a message
 * is active, the banner's visibility is watched and the toast tracks it — it
 * appears whenever the banner scrolls out of view (or is already out of view
 * when the error arrives) and is dismissed as soon as the banner scrolls back
 * in, so the message is shown in exactly one place at a time.
 *
 * `occurrence` should be a value that changes per submission (the action data
 * object works) so an identical error raised twice starts a fresh toast.
 */
export function useOffscreenErrorToast(
  message?: string | null,
  occurrence?: unknown,
) {
  const anchorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const anchor = anchorRef.current;
    if (!message || !anchor) return;

    const toastId = `offscreen-error:${nextToastId++}`;
    const show = () =>
      toast.error(message, { id: toastId, duration: Infinity });
    const hide = () => toast.dismiss(toastId);

    if (typeof IntersectionObserver === "undefined") {
      const isOffscreen = () => {
        const rect = anchor.getBoundingClientRect();
        return rect.bottom < 0 || rect.top > window.innerHeight;
      };
      const sync = () => (isOffscreen() ? show() : hide());

      sync();
      window.addEventListener("scroll", sync, { passive: true });
      window.addEventListener("resize", sync);

      return () => {
        window.removeEventListener("scroll", sync);
        window.removeEventListener("resize", sync);
        hide();
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) hide();
        else show();
      },
      { threshold: 0 },
    );
    observer.observe(anchor);

    return () => {
      observer.disconnect();
      hide();
    };
  }, [message, occurrence]);

  return anchorRef;
}
