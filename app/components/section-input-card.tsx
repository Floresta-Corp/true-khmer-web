import type { PropsWithChildren } from "react";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";

interface SectionInputCardProps extends PropsWithChildren {
  header: {
    title: string;
    icon: React.ReactNode;
    required?: boolean;
    action?: React.ReactNode;
  };
  hideSeparator?: boolean;
}

// 2. Define the main component
function SectionInputCard({
  children,
  header,
  hideSeparator,
}: SectionInputCardProps) {
  const Header = () => {
    return (
      <div className="flex items-center gap-3">
        <div className="text-blue-500">{header.icon}</div>
        <p className="text-xl font-medium flex-1">
          {header.title}
          {header.required && <span className="text-red-500">*</span>}
        </p>
        {header.action && <>{header.action}</>}
      </div>
    );
  };
  return (
    <Card className="p-6 space-y-6">
      <Header />
      {!hideSeparator && <Separator />}
      {children}
    </Card>
  );
}

export default SectionInputCard;
