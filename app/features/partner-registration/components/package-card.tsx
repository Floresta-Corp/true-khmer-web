import { ChevronRight, Check, CircleX } from "lucide-react";

import { Button } from "~/components/ui/button";
import type { Tier } from "../data/tiers";

interface PackageCardProps {
  tier: Tier;
  isSelected: boolean;
  isDisabled: boolean;
  isExpanded: boolean;
  onSelect: () => void;
  onToggle: () => void;
}

export function PackageCard({
  tier,
  isSelected,
  isDisabled,
  isExpanded,
  onSelect,
  onToggle,
}: PackageCardProps) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: card acts as a button
    <div
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      onClick={() => !isDisabled && onSelect()}
      onKeyDown={(event) => {
        if (!isDisabled && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onSelect();
        }
      }}
      className={`group flex h-full flex-col rounded-3xl p-6 text-left ring-1 ring-slate-200 transition-all duration-200 dark:ring-slate-700 ${
        isDisabled
          ? "cursor-not-allowed"
          : `cursor-pointer hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
              isSelected ? "bg-blue-50 ring-2 ring-blue-600 dark:bg-blue-950/40" : ""
            }`
      }`}
    >
      <div className="flex items-center justify-between gap-x-4">
        <h3 className="text-lg font-semibold text-blue-600">{tier.name}</h3>
      </div>

      <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
        {tier.description}
      </p>

      <p className="mt-6 flex items-baseline gap-x-1">
        <span className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
          {tier.price}
        </span>
      </p>

      {/* Mobile toggle button */}
      <Button
        type="button"
        variant="ghost"
        onClick={(event) => {
          event.stopPropagation();
          onToggle();
        }}
        disabled={isDisabled}
        className={`mt-4 flex w-full items-center justify-between rounded-lg p-2 text-left text-sm font-medium transition-colors lg:hidden ${
          isDisabled
            ? "cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800"
            : "bg-blue-600/10 text-slate-700 hover:bg-blue-600/20 dark:text-slate-200"
        }`}
      >
        <span>View Benefits</span>
        <ChevronRight
          className={`h-4 w-4 transition-transform duration-200 ${
            isExpanded ? "rotate-90" : ""
          }`}
        />
      </Button>

      {/* Benefits — always visible on desktop, toggleable on mobile */}
      <div
        className={`mt-6 grow ${!isExpanded ? "hidden lg:block" : "block"}`}
      >
        <ul className="space-y-3 text-sm">
          {tier.benefits.map((benefit) => (
            <li key={benefit.name} className="flex items-start gap-x-3">
              {benefit.available ? (
                <Check className="mt-0.5 h-5 w-5 flex-none text-blue-600" />
              ) : (
                <CircleX className="mt-0.5 h-5 w-5 flex-none text-slate-400" />
              )}
              <span
                className={
                  benefit.available
                    ? "text-slate-600 dark:text-slate-300"
                    : "text-slate-400 line-through dark:text-slate-500"
                }
              >
                <span className="font-medium">{benefit.name}</span>
                {benefit.value ? <>: {benefit.value}</> : null}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          if (!isDisabled) onSelect();
        }}
        disabled={isDisabled}
        className={`mt-6 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold transition-all duration-200 ${
          isDisabled
            ? "cursor-not-allowed bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
            : isSelected
              ? "bg-blue-600 text-white"
              : "text-blue-600 ring-1 ring-inset ring-blue-600/30 hover:bg-blue-600/10 hover:ring-blue-600"
        }`}
      >
        {isDisabled
          ? "Not Available"
          : isSelected
            ? "Selected"
            : `Choose ${tier.name}`}
      </Button>
    </div>
  );
}
