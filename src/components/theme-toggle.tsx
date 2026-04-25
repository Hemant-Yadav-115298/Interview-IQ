"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 cursor-pointer"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      id="theme-toggle"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-yellow-400 transition-transform duration-300 rotate-0" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700 transition-transform duration-300 rotate-0" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
