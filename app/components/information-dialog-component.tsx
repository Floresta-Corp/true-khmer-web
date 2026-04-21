import { DialogContent } from "@radix-ui/react-dialog";
import { Dialog } from "./ui/dialog";
import type { PropsWithChildren } from "react";

interface InformationDialogComponentProps extends PropsWithChildren {
  open: boolean;
  onChange: (open: boolean) => void;
}

export default function InformationDialogComponent({
  children,
  open,
  onChange,
}: InformationDialogComponentProps) {
  return (
    <Dialog open={open} onOpenChange={onChange}>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}
