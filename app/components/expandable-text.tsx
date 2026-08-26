import { ChevronDown, ChevronUp } from "lucide-react";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { cn } from "~/lib/utils";

interface ExpandableTextProps {
  children: string;
  className?: string;
  collapsedLines?: number;
}

export default function ExpandableText({
  children,
  className,
  collapsedLines = 4,
}: ExpandableTextProps) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const collapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const [shouldClamp, setShouldClamp] = useState(true);
  const [collapsedHeight, setCollapsedHeight] = useState<number>();
  const [expandedHeight, setExpandedHeight] = useState<number>();

  const collapsedStyle: CSSProperties =
    shouldClamp && !expanded
      ? {
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: collapsedLines,
        }
      : {};

  useLayoutEffect(() => {
    const element = textRef.current;
    if (!element) {
      return;
    }

    setExpanded(false);
    setShouldClamp(true);

    const updateCanExpand = () => {
      const lineHeight = parseFloat(
        window.getComputedStyle(element).lineHeight,
      );
      const nextCollapsedHeight = lineHeight * collapsedLines;
      const nextExpandedHeight = element.scrollHeight;

      setCollapsedHeight(nextCollapsedHeight);
      setExpandedHeight(nextExpandedHeight);
      setCanExpand(nextExpandedHeight > nextCollapsedHeight + 1);
    };

    const frameId = requestAnimationFrame(updateCanExpand);

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateCanExpand);
      return () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener("resize", updateCanExpand);
      };
    }

    const observer = new ResizeObserver(updateCanExpand);
    observer.observe(element);

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [children, collapsedLines]);

  useEffect(() => {
    return () => {
      if (collapseTimerRef.current) {
        clearTimeout(collapseTimerRef.current);
        collapseTimerRef.current = null;
      }
    };
  }, []);

  const handleToggle = () => {
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current);
      collapseTimerRef.current = null;
    }

    if (expanded) {
      setExpanded(false);
      collapseTimerRef.current = setTimeout(() => {
        setShouldClamp(true);
        collapseTimerRef.current = null;
      }, 300);
      return;
    }

    setShouldClamp(false);
    setExpanded(true);
  };

  const maxHeight =
    canExpand && collapsedHeight && expandedHeight
      ? expanded
        ? expandedHeight
        : collapsedHeight
      : undefined;

  return (
    <div>
      <p
        ref={textRef}
        className={cn(
          "overflow-hidden text-lg leading-relaxed whitespace-pre-line text-gray-600 transition-[max-height] duration-300 ease-in-out dark:text-slate-400",
          className,
        )}
        style={{
          ...collapsedStyle,
          maxHeight,
        }}
      >
        {children}
      </p>

      {canExpand && (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={handleToggle}
          className="mt-3 inline-flex cursor-pointer items-center gap-1 rounded-md text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          {expanded ? "Show less" : "Show more"}
          {expanded ? (
            <ChevronUp className="size-4" aria-hidden="true" />
          ) : (
            <ChevronDown className="size-4" aria-hidden="true" />
          )}
        </button>
      )}
    </div>
  );
}
