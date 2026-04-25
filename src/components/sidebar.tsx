"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  LayoutDashboard,
  Archive,
  ShieldCheck,
  BookOpen,
  X,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, gradient: "from-violet-500 to-indigo-500" },
  { href: "/archive", label: "Archive", icon: Archive, gradient: "from-amber-500 to-orange-500" },
  { href: "/admin", label: "Admin Portal", icon: ShieldCheck, gradient: "from-emerald-500 to-teal-500" },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-full w-[260px] flex-col border-r border-border/40 bg-card/95 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5 group" onClick={onClose}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/20 transition-transform duration-300 group-hover:scale-110">
              <BookOpen className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight flex items-center gap-1">
                InterviewIQ
                <Sparkles className="h-3 w-3 text-violet-500" />
              </h1>
              <p className="text-[9px] font-medium text-muted-foreground -mt-0.5">Question Manager</p>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 lg:hidden cursor-pointer"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Separator className="opacity-30" />

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider px-3 mb-2">
            Navigation
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                  isActive
                    ? "text-white shadow-lg"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
              >
                {/* Active background gradient */}
                {isActive && (
                  <div className={cn("absolute inset-0 bg-gradient-to-r rounded-xl", item.gradient)} />
                )}
                <div className={cn(
                  "relative z-10 flex items-center gap-3",
                )}>
                  <item.icon className={cn("h-4 w-4", isActive ? "text-white" : "group-hover:scale-110 transition-transform duration-200")} />
                  <span className="relative z-10">{item.label}</span>
                </div>
                {isActive && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-white/80 z-10" />
                )}
              </Link>
            );
          })}
        </nav>

        <Separator className="opacity-30" />

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3.5">
          <span className="text-[10px] text-muted-foreground font-medium">Theme</span>
          <ThemeToggle />
        </div>
      </aside>
    </>
  );
}
