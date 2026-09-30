import { Check, X } from "lucide-react";
import { cn } from "~/lib/utils";
import { PASSWORD_REQUIREMENTS } from "~/routes/auth/domain/password-validation";

export function PasswordRequirements({ password }: { password: string }) {
  return (
    <ul className="space-y-1.5" aria-live="polite">
      {PASSWORD_REQUIREMENTS.map((requirement) => {
        const met = requirement.test(password);
        const Icon = met ? Check : X;

        return (
          <li
            key={requirement.label}
            className={cn(
              "flex items-center gap-2 text-sm",
              met ? "text-[#16A34A]" : "text-[#9AA7B8]",
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            <span>{requirement.label}</span>
            <span className="sr-only">{met ? "(met)" : "(not met)"}</span>
          </li>
        );
      })}
    </ul>
  );
}
