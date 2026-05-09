import type { PropsWithChildren } from "react";

interface WorkSpacePageLayoutProps extends PropsWithChildren {
  title: string;
  subtitle: string;
}

export default function WorkSpacePageLayout({
  title,
  subtitle,
  children,
}: WorkSpacePageLayoutProps) {
  return (
    <>
      <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
          {title}
        </h1>
        <p className="mt-3 text-base sm:text-lg text-gray-500 max-w-2xl">
          {subtitle}
        </p>
      </div>

      <main className="flex-1 px-4 sm:px-6 lg:px-10 pb-12">{children}</main>
    </>
  );
}
