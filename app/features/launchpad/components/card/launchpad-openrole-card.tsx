import { Plus, Users2 } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import FieldLabel from "~/components/field-label";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";

export default function LaunchpadOpenRoleCard() {
  return (
    <Card className="p-6 space-y-5">
      <div className="flex items-center gap-3">
        <Users2 size={17.5} className="text-blue-500" />
        <div className="text-xl font-medium">
          Open Roles<span className="text-destructive">*</span>
        </div>
      </div>
      <Separator />
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <FieldLabel>Role title</FieldLabel>
          <Input
            placeholder="e.g., Field Researcher"
            className="h-12.5 rounded-xl border-none px-4 bg-[#F8FAFC]"
          />
        </div>
        <div className="space-y-3">
          <FieldLabel>Capacity</FieldLabel>
          <Input
            placeholder="1"
            className="h-12.5 rounded-xl border-none px-4 bg-[#F8FAFC]"
          />
        </div>
        <div className="space-y-3 col-span-2">
          <FieldLabel>Role Description</FieldLabel>
          <Textarea
            placeholder="What will this person do and what skills are you looking for?"
            className="h-12.5 rounded-xl border-none px-4 bg-[#F8FAFC]"
          />
        </div>
        <Button className="cursor-pointer col-span-2 h-10 bg-blue-500 hover:bg-blue-600">
          <Plus /> Add role
        </Button>
      </div>
    </Card>
  );
}
