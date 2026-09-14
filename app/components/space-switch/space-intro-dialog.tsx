import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

export type SpaceIntroItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

export type SpaceIntro = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  items: SpaceIntroItem[];
  confirmLabel: string;
};

export default function SpaceIntroDialog({
  intro,
  open,
  onOpenChange,
  onConfirm,
}: {
  intro: SpaceIntro;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  const TileIcon = intro.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 rounded-2xl p-6 sm:max-w-95">
        <DialogHeader className="gap-0">
          <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-[#EFF6FF]">
            <TileIcon className="size-6 text-[#2F6FE4]" />
          </div>
          <DialogTitle className="text-xl leading-snug font-bold text-[#1A1A2E]">
            {intro.title}
          </DialogTitle>
          <DialogDescription className="mt-3 text-sm leading-relaxed text-[#6B7280]">
            {intro.description}
          </DialogDescription>
        </DialogHeader>

        <ul className="mt-5 flex flex-col gap-4">
          {intro.items.map((item) => (
            <li key={item.label} className="flex items-center gap-3">
              <item.icon className="size-5 shrink-0 text-[#2F6FE4]" />
              <span className="text-[15px] font-medium text-[#344256]">
                {item.label}
              </span>
            </li>
          ))}
        </ul>

        <Button
          onClick={onConfirm}
          className="mt-7 h-12 w-full rounded-xl bg-[#0b57d0] text-sm font-bold text-white hover:bg-[#0b57d0]/90"
        >
          {intro.confirmLabel}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
