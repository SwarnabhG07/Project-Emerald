"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sprout, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";

export function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    const keysToRemove = [
      "farmer_name", "farmer_mobile", "farmer_areaOfLand", 
      "farmer_income", "farmer_address", "farmer_state", 
      "farmer_caste", "farmer_landOwnership", "farmer_onboarded"
    ];
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    router.push("/login");
  };

  return (
    <header className="bg-white/60 dark:bg-black/20 backdrop-blur-2xl sticky top-0 z-20 border-b border-slate-200 dark:border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 dark:bg-[#d4f826]/10 p-2 rounded-xl border border-green-200 dark:border-[#d4f826]/20 transition-colors">
              <Sprout className="h-5 w-5 text-green-600 dark:text-[#d4f826]" />
            </div>
            <h1 className="text-xl font-semibold text-slate-800 dark:text-white tracking-wide transition-colors">AgriPortal</h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-slate-600 dark:text-slate-300 hover:text-green-700 dark:hover:text-[#d4f826] hover:bg-green-50 dark:hover:bg-white/5">
                Home
              </Button>
            </Link>
            <Link href="/misinfo">
              <Button variant="ghost" className="text-slate-600 dark:text-slate-300 hover:text-green-700 dark:hover:text-[#d4f826] hover:bg-green-50 dark:hover:bg-white/5">
                Misinfo Checker
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="ghost" className="text-slate-600 dark:text-slate-300 hover:text-green-700 dark:hover:text-[#d4f826] hover:bg-green-50 dark:hover:bg-white/5">
                Chat with us
              </Button>
            </Link>
            <Button variant="ghost" className="text-slate-600 dark:text-slate-300 hover:text-green-700 dark:hover:text-[#d4f826] hover:bg-green-50 dark:hover:bg-white/5">
              About us
            </Button>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <ThemeToggle />
          <Button variant="ghost" className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 font-medium transition-colors" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
