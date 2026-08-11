"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tractor, CheckCircle2 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function OnboardingPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [name, setName] = useState("");
  
  const [formData, setFormData] = useState({
    areaOfLand: "",
    income: "",
    address: "",
    state: "",
    caste: "",
    landOwnership: ""
  });

  useEffect(() => {
    setIsMounted(true);
    const storedName = localStorage.getItem("farmer_name");
    const onboarded = localStorage.getItem("farmer_onboarded");
    
    if (!storedName) {
      router.push("/login");
    } else if (onboarded === "true") {
      router.push("/dashboard");
    } else {
      setName(storedName);
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to local storage
    Object.entries(formData).forEach(([key, value]) => {
      localStorage.setItem(`farmer_${key}`, value);
    });
    localStorage.setItem("farmer_onboarded", "true");
    
    router.push("/dashboard");
  };

  if (!isMounted || !name) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative font-sans transition-colors duration-300">
      <div className="fixed top-6 right-6 z-[100]">
        <ThemeToggle />
      </div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-orange-300 dark:bg-[#d4f826] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-40 dark:opacity-10 animate-blob transition-all duration-500"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-amber-300 dark:bg-emerald-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-40 dark:opacity-10 animate-blob animation-delay-2000 transition-all duration-500"></div>
      </div>
      
      <Card className="w-full max-w-2xl z-10 shadow-2xl border-slate-200 dark:border-white/5 bg-white/80 dark:bg-black/40 backdrop-blur-2xl rounded-3xl overflow-hidden transition-all duration-300">
        <CardHeader className="space-y-2 text-center border-b border-slate-200 dark:border-white/5 pb-8 pt-10 mb-6 bg-slate-50/50 dark:bg-white/[0.02]">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-orange-100 dark:bg-[#d4f826]/10 rounded-2xl flex items-center justify-center border border-orange-200 dark:border-[#d4f826]/20 transition-colors">
              <Tractor className="h-8 w-8 text-orange-600 dark:text-[#d4f826]" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors">Farmer Profile Setup</CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400 font-light text-base transition-colors">
            Welcome, <span className="text-orange-600 dark:text-[#d4f826] font-medium">{name}</span>! Please provide a few more details to complete your profile.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 px-8 md:px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              
              <div className="space-y-3">
                <Label htmlFor="areaOfLand" className="text-slate-600 dark:text-slate-300 text-xs uppercase tracking-widest font-semibold transition-colors">Area of Land (in Acres)</Label>
                <Input
                  id="areaOfLand"
                  type="number"
                  step="0.1"
                  placeholder="E.g. 5.5"
                  value={formData.areaOfLand}
                  onChange={(e) => setFormData(prev => ({ ...prev, areaOfLand: e.target.value }))}
                  required
                  className="border-slate-200 dark:border-white/10 focus-visible:ring-orange-500 dark:focus-visible:ring-[#d4f826] focus-visible:border-orange-500 dark:focus-visible:border-[#d4f826] bg-white dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 h-12 rounded-xl transition-colors"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="income" className="text-slate-600 dark:text-slate-300 text-xs uppercase tracking-widest font-semibold transition-colors">Annual Income (₹)</Label>
                <Input
                  id="income"
                  type="number"
                  placeholder="E.g. 150000"
                  value={formData.income}
                  onChange={(e) => setFormData(prev => ({ ...prev, income: e.target.value }))}
                  required
                  className="border-slate-200 dark:border-white/10 focus-visible:ring-orange-500 dark:focus-visible:ring-[#d4f826] focus-visible:border-orange-500 dark:focus-visible:border-[#d4f826] bg-white dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 h-12 rounded-xl transition-colors"
                />
              </div>

              <div className="space-y-3 md:col-span-2">
                <Label htmlFor="address" className="text-slate-600 dark:text-slate-300 text-xs uppercase tracking-widest font-semibold transition-colors">Address / Village</Label>
                <Input
                  id="address"
                  placeholder="Enter your complete address or village name"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  required
                  className="border-slate-200 dark:border-white/10 focus-visible:ring-orange-500 dark:focus-visible:ring-[#d4f826] focus-visible:border-orange-500 dark:focus-visible:border-[#d4f826] bg-white dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 h-12 rounded-xl transition-colors"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="state" className="text-slate-600 dark:text-slate-300 text-xs uppercase tracking-widest font-semibold transition-colors">State</Label>
                <select
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  required
                  className="flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-[#d4f826] focus:border-orange-500 dark:focus:border-[#d4f826] dark:[&>option]:bg-[#1a1a1a] dark:[&>option]:text-white transition-colors"
                >
                  <option value="" disabled>Select State</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="caste" className="text-slate-600 dark:text-slate-300 text-xs uppercase tracking-widest font-semibold transition-colors">Category / Caste</Label>
                <select
                  id="caste"
                  value={formData.caste}
                  onChange={(e) => setFormData(prev => ({ ...prev, caste: e.target.value }))}
                  required
                  className="flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-[#d4f826] focus:border-orange-500 dark:focus:border-[#d4f826] dark:[&>option]:bg-[#1a1a1a] dark:[&>option]:text-white transition-colors"
                >
                  <option value="" disabled>Select Category</option>
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-3 md:col-span-2">
                <Label htmlFor="landOwnership" className="text-slate-600 dark:text-slate-300 text-xs uppercase tracking-widest font-semibold transition-colors">Land Ownership Type</Label>
                <select
                  id="landOwnership"
                  value={formData.landOwnership}
                  onChange={(e) => setFormData(prev => ({ ...prev, landOwnership: e.target.value }))}
                  required
                  className="flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-[#d4f826] focus:border-orange-500 dark:focus:border-[#d4f826] dark:[&>option]:bg-[#1a1a1a] dark:[&>option]:text-white transition-colors"
                >
                  <option value="" disabled>Select Ownership Type</option>
                  <option value="Owner">Owner (Self-owned)</option>
                  <option value="Tenant">Tenant / Leased</option>
                  <option value="Sharecropper">Sharecropper</option>
                  <option value="Co-owner">Co-owner</option>
                </select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-8 pb-10 px-8 md:px-10 border-t-0 bg-transparent">
            <Button 
              type="submit" 
              className="w-full bg-orange-600 dark:bg-[#d4f826] hover:bg-orange-700 dark:hover:bg-[#bce015] text-white dark:text-black transition-all shadow-md dark:shadow-none hover:-translate-y-0.5 text-lg py-7 rounded-2xl font-semibold tracking-wide"
            >
              <CheckCircle2 className="mr-2 h-6 w-6" />
              Complete Profile
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
