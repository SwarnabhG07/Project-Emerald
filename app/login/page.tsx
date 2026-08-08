"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, ArrowRight } from "lucide-react";

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
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative font-sans">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#d4f826] rounded-full mix-blend-screen filter blur-[120px] opacity-10 animate-blob"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-500 rounded-full mix-blend-screen filter blur-[120px] opacity-10 animate-blob animation-delay-4000"></div>
      </div>
      
      <Card className="w-full max-w-md z-10 shadow-2xl border-white/5 bg-black/40 backdrop-blur-2xl rounded-3xl overflow-hidden">
        <CardHeader className="space-y-2 text-center pb-8 pt-10">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-[#d4f826]/10 rounded-2xl flex items-center justify-center border border-[#d4f826]/20">
              <Leaf className="h-8 w-8 text-[#d4f826]" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-white">Welcome to Agri</CardTitle>
          <CardDescription className="text-slate-400 font-light">
            Enter your details to sign in or create an account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-5 px-8">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-slate-300 text-xs uppercase tracking-widest font-semibold">Full Name</Label>
              <Input
                id="name"
                placeholder="E.g. Ramesh Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-white/10 focus-visible:ring-[#d4f826] focus-visible:border-[#d4f826] bg-white/5 text-white placeholder:text-slate-600 h-12 rounded-xl"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="mobile" className="text-slate-300 text-xs uppercase tracking-widest font-semibold">Mobile Number</Label>
              <Input
                id="mobile"
                type="tel"
                placeholder="E.g. 9876543210"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
                className="border-white/10 focus-visible:ring-[#d4f826] focus-visible:border-[#d4f826] bg-white/5 text-white placeholder:text-slate-600 h-12 rounded-xl"
              />
            </div>
          </CardContent>
          <CardFooter className="px-8 pb-10 pt-4">
            <Button 
              type="submit" 
              className="w-full bg-[#d4f826] hover:bg-[#bce015] text-black font-semibold tracking-wide h-12 rounded-xl transition-all"
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
