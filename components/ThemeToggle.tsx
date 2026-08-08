"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full bg-white/10 opacity-0" />;
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-10 h-10 rounded-full bg-slate-200/50 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/20 transition-all z-50 text-slate-700 dark:text-[#d4f826] overflow-hidden"
    >
      <div className={`absolute transition-all duration-500 ease-in-out ${isDark ? '-translate-y-10 opacity-0' : 'translate-y-0 opacity-100'}`}>
        <Sun className="h-5 w-5" />
      </div>
      <div className={`absolute transition-all duration-500 ease-in-out ${isDark ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <Moon className="h-5 w-5" />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
