"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { BookOpen, Sparkles } from "lucide-react";

export function HydrationGuard({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const isLoading = useStore((s) => s.isLoading);

  useEffect(() => {
    setHydrated(true);

    // Force a beautiful 5-second splash screen
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const isActuallyLoading = !hydrated || isLoading || showSplash;

  if (isActuallyLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background overflow-hidden selection:bg-violet-500/30">
        {/* Animated Background Mesh & Grid */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-60">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/15 blur-[120px] animate-pulse-glow" />
          <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-indigo-600/15 blur-[120px] animate-float" style={{ animationDelay: '1s', animationDuration: '7s' }} />
          <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[40%] rounded-full bg-cyan-600/15 blur-[100px] animate-pulse-glow" style={{ animationDelay: '2s', animationDuration: '5s' }} />
        </div>

        <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in-95 duration-1000">
          {/* Logo Animation */}
          <div className="relative mb-8">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 blur-2xl opacity-40 animate-pulse-glow" />
            <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-[0_0_40px_rgba(139,92,246,0.4)] animate-float">
              <BookOpen className="h-14 w-14 text-white" />
            </div>
            <Sparkles className="absolute -top-4 -right-4 h-10 w-10 text-violet-400 animate-pulse-glow delay-300" />
            <Sparkles className="absolute -bottom-2 -left-3 h-6 w-6 text-cyan-400 animate-pulse-glow delay-700" />
          </div>

          {/* Text Animation */}
          <h1 className="text-5xl font-black tracking-tight flex items-center gap-2 bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent mb-4 animate-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
            InterviewIQ
          </h1>
          <p className="text-sm font-bold tracking-[0.25em] text-muted-foreground uppercase animate-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both">
            The Ultimate Question Manager
          </p>

          {/* Loading Progress Bar */}
          <div className="mt-14 w-64 h-1.5 bg-muted/40 rounded-full overflow-hidden animate-in fade-in duration-1000 delay-700 fill-mode-both shadow-inner">
            <div className="h-full w-full rounded-full bg-gradient-to-r from-violet-600 via-cyan-400 to-violet-600 bg-[length:200%_100%] animate-[shimmer_2s_linear_infinite]" />
          </div>
          <p className="mt-5 text-[10px] text-muted-foreground/60 font-mono tracking-widest animate-pulse uppercase">
            {!hydrated ? "Initializing System..." : isLoading ? "Syncing Database..." : "Ready to Launch"}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
