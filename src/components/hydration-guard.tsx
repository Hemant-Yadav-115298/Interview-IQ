"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";

export function HydrationGuard({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const isLoading = useStore((s) => s.isLoading);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 animate-pulse" />
          <p className="text-sm text-muted-foreground animate-pulse">
            {!hydrated ? "Loading..." : "Fetching database..."}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
