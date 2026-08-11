"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check if user is already logged in
    const storedName = localStorage.getItem("farmer_name");
    const onboarded = localStorage.getItem("farmer_onboarded");
    
    if (storedName) {
      if (onboarded === "true") {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim()) return;

    localStorage.setItem("farmer_name", name);
    localStorage.setItem("farmer_mobile", mobile);

    const onboarded = localStorage.getItem("farmer_onboarded");
    if (onboarded === "true") {
      router.push("/dashboard");
    } else {
      router.push("/onboarding");
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] flex items-center justify-center p-4 relative font-sans transition-colors duration-300">
      <div className="fixed top-6 right-6 z-[100] flex items-center gap-2">
        <LanguageSelector />
        <ThemeToggle />
      </div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-300 dark:bg-[#d4f826] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-40 dark:opacity-10 animate-blob transition-all duration-500"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-300 dark:bg-emerald-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-40 dark:opacity-10 animate-blob animation-delay-4000 transition-all duration-500"></div>
      </div>
      
      <Card className="w-full max-w-md z-10 shadow-2xl border-slate-200 dark:border-white/5 bg-white/80 dark:bg-black/40 backdrop-blur-2xl rounded-3xl overflow-hidden transition-all duration-300">
        <CardHeader className="space-y-2 text-center pb-8 pt-10">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-green-100 dark:bg-[#d4f826]/10 rounded-2xl flex items-center justify-center border border-green-200 dark:border-[#d4f826]/20 transition-colors">
              <Leaf className="h-8 w-8 text-green-600 dark:text-[#d4f826]" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors">Welcome to Agri</CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400 font-light transition-colors">
            Enter your details to sign in or create an account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-5 px-8">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-slate-600 dark:text-slate-300 text-xs uppercase tracking-widest font-semibold transition-colors">Full Name</Label>
              <Input
                id="name"
                placeholder="E.g. Ramesh Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-slate-200 dark:border-white/10 focus-visible:ring-green-500 dark:focus-visible:ring-[#d4f826] focus-visible:border-green-500 dark:focus-visible:border-[#d4f826] bg-white dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 h-12 rounded-xl transition-colors"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="mobile" className="text-slate-600 dark:text-slate-300 text-xs uppercase tracking-widest font-semibold transition-colors">Mobile Number</Label>
              <Input
                id="mobile"
                type="tel"
                placeholder="E.g. 9876543210"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
                className="border-slate-200 dark:border-white/10 focus-visible:ring-green-500 dark:focus-visible:ring-[#d4f826] focus-visible:border-green-500 dark:focus-visible:border-[#d4f826] bg-white dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 h-12 rounded-xl transition-colors"
              />
            </div>
          </CardContent>
          <CardFooter className="px-8 pb-10 pt-4 border-t-0 bg-transparent">
            <Button 
              type="submit" 
              className="w-full bg-green-600 dark:bg-[#d4f826] text-white dark:text-black hover:bg-green-700 dark:hover:bg-[#bce015] font-semibold tracking-wide h-12 rounded-xl transition-all shadow-md dark:shadow-none"
            >
              Continue
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
