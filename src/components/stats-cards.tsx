"use client";

import { useStats } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import {
  CircleDot,
  FileText,
  Code2,
  Archive,
  BarChart3,
  Layers,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const cards = [
  { key: "total" as const, label: "Total Questions", icon: Layers, color: "text-violet-500", bg: "bg-violet-500/10", gradient: "from-violet-500/20 to-indigo-500/20", border: "border-violet-500/20" },
  { key: "active" as const, label: "Active", icon: BarChart3, color: "text-emerald-500", bg: "bg-emerald-500/10", gradient: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-500/20" },
  { key: "archived" as const, label: "Archived", icon: Archive, color: "text-amber-500", bg: "bg-amber-500/10", gradient: "from-amber-500/20 to-orange-500/20", border: "border-amber-500/20" },
  { key: "mcq" as const, label: "MCQ", icon: CircleDot, color: "text-blue-500", bg: "bg-blue-500/10", gradient: "from-blue-500/20 to-cyan-500/20", border: "border-blue-500/20" },
  { key: "theory" as const, label: "Theory", icon: FileText, color: "text-purple-500", bg: "bg-purple-500/10", gradient: "from-purple-500/20 to-pink-500/20", border: "border-purple-500/20" },
  { key: "code" as const, label: "Code", icon: Code2, color: "text-cyan-500", bg: "bg-cyan-500/10", gradient: "from-cyan-500/20 to-sky-500/20", border: "border-cyan-500/20" },
];

export function StatsCards() {
  const stats = useStats();

  const values: Record<string, number> = {
    total: stats.total,
    active: stats.active,
    archived: stats.archived,
    mcq: stats.mcq,
    theory: stats.theory,
    code: stats.code,
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.key}
            className={cn(
              "border-border/40 transition-all duration-500 hover:scale-[1.03] hover:shadow-lg group overflow-hidden relative cursor-default",
              `hover:${card.border}`
            )}
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            {/* Gradient overlay on hover */}
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", card.gradient)} />
            
            {/* Decorative corner glow */}
            <div className={cn("absolute -top-4 -right-4 h-12 w-12 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500", card.bg)} />

            <CardContent className="p-4 relative">
              <div className="flex items-center gap-3">
                <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110", card.bg)}>
                  <Icon className={cn("h-5 w-5", card.color)} />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight tabular-nums">{values[card.key]}</p>
                  <p className="text-[10px] font-medium text-muted-foreground">{card.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
