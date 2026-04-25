"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiSelectDropdownProps {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  icon?: React.ReactNode;
  id?: string;
}

export function MultiSelectDropdown({
  label,
  options,
  selected,
  onToggle,
  icon,
  id,
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="outline"
        size="sm"
        id={id}
        onClick={() => setOpen(!open)}
        className={cn(
          "h-9 w-full justify-between text-xs font-normal cursor-pointer gap-1.5 transition-all duration-200",
          selected.length > 0
            ? "border-violet-500/40 bg-violet-500/5 text-violet-700 dark:text-violet-300 dark:border-violet-500/30"
            : "text-muted-foreground"
        )}
      >
        <span className="flex items-center gap-1.5 truncate">
          {icon}
          {selected.length > 0 ? (
            <span className="flex items-center gap-1">
              {label}
              <Badge className="h-4 min-w-4 px-1 text-[9px] bg-violet-600 text-white rounded-full">
                {selected.length}
              </Badge>
            </span>
          ) : (
            label
          )}
        </span>
        <ChevronDown className={cn("h-3.5 w-3.5 shrink-0 transition-transform duration-200", open && "rotate-180")} />
      </Button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full min-w-[180px] rounded-xl border border-border bg-popover p-1 shadow-xl shadow-black/10 dark:shadow-black/30 animate-in fade-in zoom-in-95 duration-150">
          <div className="max-h-52 overflow-y-auto">
            {options.map((opt) => {
              const isSelected = selected.includes(opt);
              return (
                <button
                  key={opt}
                  onClick={() => onToggle(opt)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs transition-colors cursor-pointer",
                    isSelected
                      ? "bg-violet-500/10 text-violet-700 dark:text-violet-300"
                      : "text-foreground hover:bg-accent"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded border transition-all duration-200",
                      isSelected
                        ? "border-violet-500 bg-violet-600 text-white"
                        : "border-border bg-background"
                    )}
                  >
                    {isSelected && <Check className="h-2.5 w-2.5" />}
                  </div>
                  <span className="truncate">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
