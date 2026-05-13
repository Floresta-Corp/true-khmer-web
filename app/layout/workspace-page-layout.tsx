import type React from "react";
import type { PropsWithChildren } from "react";

interface WorkSpacePageLayoutProps extends PropsWithChildren {
  title: string;
  subtitle: string;
  action: React.ReactNode;
}

export default function WorkSpacePageLayout({
  title,
  subtitle,
  action,
  children,
}: WorkSpacePageLayoutProps) {
  return (
    <>
      <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        {/* Header Container */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
              {title}
            </h1>
            <p className="text-base sm:text-lg text-gray-500 max-w-2xl">
              {subtitle}
            </p>
          </div>

          {/* Action Slot */}
          {action && <div className="mt-4">{action}</div>}
        </div>
      </div>

      <main className="flex-1 px-4 sm:px-6 lg:px-10 pb-12">{children}</main>
    </>
  );
}
