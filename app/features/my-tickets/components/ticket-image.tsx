import { useState } from "react";
import { ImageIcon } from "lucide-react";

export default function TicketImage({
  src,
  alt,
  className,
  fallbackClassName,
}: {
  src: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}) {
  const [failed, setFailed] = useState<string | null>(null);
  return src && failed !== src ? (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(src)}
    />
  ) : (
    <ImageIcon aria-label={alt} className={fallbackClassName} />
  );
}
