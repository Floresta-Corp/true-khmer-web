import type { ReactNode } from "react";
import BackToButton from "./back-to-button";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  backTo?: string;
  backText?: string;
}

export function PageLayout({ children, className, backTo, backText }: PageLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-white">
      <main className={`mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 sm:py-10 lg:px-20 ${className || ""}`}>
        {backTo && (
          <div className="-ml-4 sm:-ml-8 lg:-ml-20 mb-4">
            <BackToButton text={backText} to={backTo} />
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
