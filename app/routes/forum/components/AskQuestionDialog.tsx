import { useState } from "react";

import { ChevronDown, Plus, X } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

const categories = [
  "Business Growth",
  "Career Advice",
  "Tech & Innovation",
  "Khmer Culture",
  "Networking",
];

export default function AskQuestionDialog() {
  const [selectedCategory, setSelectedCategory] = useState("Business Growth");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex h-10 items-center gap-1.5 rounded-lg bg-[#2f6fe4] px-6 py-0 text-sm font-medium whitespace-nowrap text-white hover:bg-[#245fca]">
          <Plus size={24} />
          Ask question
        </Button>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="max-w-[calc(100%-1rem)] gap-4 overflow-hidden rounded-lg border border-[#e2e8f0] p-6 shadow-lg sm:max-w-130"
      >
        <DialogClose asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute top-3.75 right-3.75 h-4 w-4 rounded-sm p-0 text-[#364153]/70 hover:bg-transparent hover:text-[#364153]"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogClose>

        <div className="flex flex-col gap-1.5">
          <DialogTitle className="text-lg leading-7 font-semibold text-[#0f1729]">
            Ask question
          </DialogTitle>
          <DialogDescription className="text-sm leading-5 font-normal text-[#6a7282]">
            Share knowledge with the community
          </DialogDescription>
        </div>

        <div className="-mx-6 border-t border-[#e2e8f0]" />

        <form className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <Label className="text-xs leading-4.5 font-medium text-[#364153]">
              Question title
            </Label>
            <Input
              placeholder="What are the best resources for learning Khmer business law?"
              className="h-11 rounded-lg border-transparent bg-[#f8fafc] text-sm text-[#344256] placeholder:text-[#9eacc0] focus-visible:border-[#2f6fe4] focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs leading-4.5 font-medium text-[#364153]">
              Category
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex h-11 w-full items-center justify-between rounded-lg border border-transparent bg-[#f8fafc] px-3 text-left text-sm font-medium text-[#344256] outline-none transition-colors focus:border-[#2f6fe4]"
                >
                  <span>{selectedCategory}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-[#99a1af]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-(--radix-dropdown-menu-trigger-width) rounded-lg border-[#e2e8f0] bg-white p-1 shadow-lg"
              >
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    onSelect={() => setSelectedCategory(category)}
                    className="rounded-md px-3 py-2 text-sm font-medium text-[#344256] focus:bg-[#f8fafc] focus:text-[#344256]"
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs leading-4.5 font-medium text-[#364153]">
              Discussion Details
            </Label>
            <textarea
              placeholder="What are the best resources for learning Khmer business law?"
              className="min-h-11 w-full resize-none rounded-lg border border-transparent bg-[#f8fafc] px-3 py-3 text-sm text-[#344256] placeholder:text-[#9eacc0] outline-none focus:border-[#2f6fe4]"
              rows={1}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs leading-4.5 font-medium text-[#364153]">
              Tags
            </Label>
            <Input
              placeholder="Separate with commas"
              className="h-11 rounded-lg border-transparent bg-[#f8fafc] text-sm text-[#344256] placeholder:text-[#9eacc0] focus-visible:border-[#2f6fe4] focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="h-8 rounded-lg border-[#e1e7ef] px-3 text-sm font-medium text-[#1d283a]"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="h-8 rounded-lg bg-[#2f6fe4] px-3 text-sm font-medium text-white hover:bg-[#245fca]"
            >
              Post question
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
