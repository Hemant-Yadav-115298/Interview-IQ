"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Copy, Check, Terminal } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CodeDisplayProps {
  code: string;
  language: string;
  showCopy?: boolean;
}

export function CodeDisplay({ code, language, showCopy = true }: CodeDisplayProps) {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl overflow-hidden border border-border/40 bg-transparent">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/30 bg-muted/20">
        <div className="flex items-center gap-1.5">
          <Terminal className="h-3 w-3 text-muted-foreground/60" />
          <span className="text-[10px] font-mono text-muted-foreground/60 uppercase">{language}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-red-500/40" />
          <div className="h-2 w-2 rounded-full bg-amber-500/40" />
          <div className="h-2 w-2 rounded-full bg-emerald-500/40" />
        </div>
      </div>

      {showCopy && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-8 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 bg-background/60 backdrop-blur-sm cursor-pointer hover:bg-background/80"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
      )}
      <SyntaxHighlighter
        language={language}
        style={theme === "dark" ? oneDark : oneLight}
        customStyle={{
          margin: 0,
          padding: "0.875rem 1rem",
          fontSize: "0.8rem",
          lineHeight: "1.65",
          borderRadius: 0,
          background: "transparent",
        }}
        wrapLines
        wrapLongLines
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
