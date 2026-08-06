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
    <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-lime-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      
      <Card className="w-full max-w-md z-10 shadow-xl border-green-100/50 bg-white/80 backdrop-blur-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center shadow-inner">
              <Leaf className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-green-900">Welcome to Agri</CardTitle>
          <CardDescription className="text-green-700/70">
            Enter your details to sign in or create an account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-green-900">Full Name</Label>
              <Input
                id="name"
                placeholder="E.g. Ramesh Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-green-200 focus-visible:ring-green-500 bg-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile" className="text-green-900">Mobile Number</Label>
              <Input
                id="mobile"
                type="tel"
                placeholder="E.g. 9876543210"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
                className="border-green-200 focus-visible:ring-green-500 bg-white/50"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200 transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
