import type { PropsWithChildren } from "react";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";

interface SectionInputCardProps extends PropsWithChildren {
  header: {
    title: string;
    icon: React.ReactNode;
    description?: React.ReactNode;
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
        <div className="flex-1">
          <p className="text-xl font-medium">
            {header.title}
            {header.required && <span className="text-red-500">*</span>}
          </p>
          {header.description && (
            <p className="text-sm text-gray-500">{header.description}</p>
          )}
        </div>
        {header.action && <>{header.action}</>}
      </div>
    );
  };
  return (
    <Card className="space-y-6 p-6">
      <Header />
      {!hideSeparator && <Separator />}
      {children}
    </Card>
  );
}

export default SectionInputCard;
