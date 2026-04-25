"use client";

import { useStore, useActiveFilterEntries } from "@/lib/store";
import { MultiSelectDropdown } from "@/components/multi-select-dropdown";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LANGUAGES, FRAMEWORKS, EXPERIENCE_LEVELS, DIFFICULTIES, QUESTION_TYPES } from "@/lib/types";
import {
  SlidersHorizontal,
  X,
  Code2,
  Boxes,
  BriefcaseBusiness,
  Gauge,
  Layers,
  Sparkles,
} from "lucide-react";

export function FilterPanel() {
  const filters = useStore((s) => s.filters);
  const toggleFilter = useStore((s) => s.toggleFilter);
  const removeFilter = useStore((s) => s.removeFilter);
  const clearFilters = useStore((s) => s.clearFilters);
  const activeEntries = useActiveFilterEntries();

  const hasActiveFilters = activeEntries.length > 0;

  return (
    <div className="relative z-40 rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm p-4 space-y-3 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-indigo-500">
            <SlidersHorizontal className="h-3.5 w-3.5 text-white" />
          </div>
          <span>Filters</span>
          {hasActiveFilters && (
            <Badge className="h-5 min-w-5 px-1.5 text-[9px] bg-violet-600 text-white rounded-full font-bold">
              {activeEntries.length}
            </Badge>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-7 text-xs text-muted-foreground hover:text-destructive cursor-pointer gap-1 transition-colors"
          >
            <X className="h-3 w-3" />
            Clear all
          </Button>
        )}
      </div>

      {/* Dropdowns */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        <MultiSelectDropdown
          label="Language"
          options={LANGUAGES}
          selected={filters.language}
          onToggle={(v) => toggleFilter("language", v)}
          icon={<Code2 className="h-3.5 w-3.5" />}
          id="filter-language"
        />
        <MultiSelectDropdown
          label="Framework"
          options={FRAMEWORKS}
          selected={filters.framework}
          onToggle={(v) => toggleFilter("framework", v)}
          icon={<Boxes className="h-3.5 w-3.5" />}
          id="filter-framework"
        />
        <MultiSelectDropdown
          label="Experience"
          options={EXPERIENCE_LEVELS}
          selected={filters.experience}
          onToggle={(v) => toggleFilter("experience", v)}
          icon={<BriefcaseBusiness className="h-3.5 w-3.5" />}
          id="filter-experience"
        />
        <MultiSelectDropdown
          label="Difficulty"
          options={DIFFICULTIES}
          selected={filters.difficulty}
          onToggle={(v) => toggleFilter("difficulty", v)}
          icon={<Gauge className="h-3.5 w-3.5" />}
          id="filter-difficulty"
        />
        <MultiSelectDropdown
          label="Type"
          options={QUESTION_TYPES}
          selected={filters.type}
          onToggle={(v) => toggleFilter("type", v)}
          icon={<Layers className="h-3.5 w-3.5" />}
          id="filter-type"
        />
      </div>

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className="flex items-center gap-1.5 flex-wrap pt-1 animate-in fade-in slide-in-from-top-2 duration-300">
          <Sparkles className="h-3 w-3 text-violet-500 mr-0.5" />
          {activeEntries.map((entry) => (
            <Badge
              key={`${entry.key}-${entry.value}`}
              variant="secondary"
              className="text-[10px] px-2 py-0.5 gap-1 bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/20 hover:bg-violet-500/20 transition-colors group cursor-default"
            >
              {entry.label}
              <button
                onClick={() => removeFilter(entry.key, entry.value)}
                className="ml-0.5 rounded-full hover:bg-violet-500/20 p-0.5 cursor-pointer transition-colors"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
