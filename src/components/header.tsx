"use client";

import { useStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Menu, Sparkles } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
}

export function Header({ onMenuClick, title = "Dashboard" }: HeaderProps) {
  const searchQuery = useStore((s) => s.searchQuery);
  const setSearchQuery = useStore((s) => s.setSearchQuery);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border/30 bg-background/70 backdrop-blur-xl px-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 lg:hidden cursor-pointer"
        onClick={onMenuClick}
        id="mobile-menu-toggle"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex items-center gap-2">
        <h2 className="text-base font-bold tracking-tight hidden sm:block">{title}</h2>
        <Sparkles className="h-3.5 w-3.5 text-violet-500 hidden sm:block" />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="relative w-56 sm:w-72 lg:w-80 group">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-violet-500" />
          <Input
            id="search-bar"
            placeholder="Search questions, tags, languages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-muted/30 focus:border-violet-500/50 focus:bg-background focus:ring-violet-500/20 transition-all duration-300 rounded-xl"
          />
        </div>
      </div>
    </header>
  );
}
