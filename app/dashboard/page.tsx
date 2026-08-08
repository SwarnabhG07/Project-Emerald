"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EligibleSchemesList } from "@/components/dashboard/EligibleSchemesList";
import { ExplainabilityGraph } from "@/components/dashboard/ExplainabilityGraph";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { LogOut, User, MapPin, IndianRupee, Map, FileText, Home, Sprout } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [userData, setUserData] = useState<Record<string, string>>({});

  useEffect(() => {
    setIsMounted(true);
    const storedName = localStorage.getItem("farmer_name");
    
    if (!storedName) {
      router.push("/login");
      return;
    }

    const data = {
      name: localStorage.getItem("farmer_name") || "",
      mobile: localStorage.getItem("farmer_mobile") || "",
      areaOfLand: localStorage.getItem("farmer_areaOfLand") || "",
      income: localStorage.getItem("farmer_income") || "",
      address: localStorage.getItem("farmer_address") || "",
      state: localStorage.getItem("farmer_state") || "",
      caste: localStorage.getItem("farmer_caste") || "",
      landOwnership: localStorage.getItem("farmer_landOwnership") || ""
    };
    setUserData(data);
  }, [router]);

  const handleLogout = () => {
    // Clear everything related to farmer
    const keysToRemove = [
      "farmer_name", "farmer_mobile", "farmer_areaOfLand", 
      "farmer_income", "farmer_address", "farmer_state", 
      "farmer_caste", "farmer_landOwnership", "farmer_onboarded"
    ];
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    router.push("/login");
  };

  if (!isMounted || !userData.name) return null;

  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center bg-fixed transition-colors duration-300" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop')" }}>
      <div className="fixed inset-0 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl z-0 pointer-events-none transition-colors duration-500"></div>
      <div className="relative z-10 flex flex-col min-h-screen font-sans">
      {/* Navbar */}
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
              <Button variant="ghost" className="text-slate-600 dark:text-slate-300 hover:text-green-700 dark:hover:text-[#d4f826] hover:bg-green-50 dark:hover:bg-white/5">
                Misinfo Checker
              </Button>
              <Button variant="ghost" className="text-slate-600 dark:text-slate-300 hover:text-green-700 dark:hover:text-[#d4f826] hover:bg-green-50 dark:hover:bg-white/5">
                Chat with us
              </Button>
              <Button variant="ghost" className="text-slate-600 dark:text-slate-300 hover:text-green-700 dark:hover:text-[#d4f826] hover:bg-green-50 dark:hover:bg-white/5">
                About us
              </Button>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 font-medium transition-colors" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white tracking-tight mb-2 transition-colors">
            Welcome back, <span className="text-green-600 dark:text-[#d4f826]">{userData.name}</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-light transition-colors">Overview of your agricultural profile and eligible schemes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="col-span-1 border-slate-200 dark:border-white/5 bg-white/70 dark:bg-black/40 backdrop-blur-xl shadow-xl dark:shadow-2xl hover:bg-white/90 dark:hover:bg-black/60 transition-all rounded-3xl overflow-hidden">
            <CardHeader className="border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] py-5 transition-colors">
              <CardTitle className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 uppercase tracking-widest transition-colors">
                <User className="h-4 w-4 mr-2 text-blue-500 dark:text-[#d4f826]" />
                Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Full Name</p>
                <p className="text-lg font-medium text-slate-900 dark:text-slate-100 transition-colors">{userData.name}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Mobile Number</p>
                <p className="text-lg font-medium text-slate-900 dark:text-slate-100 transition-colors">{userData.mobile}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Category / Caste</p>
                <p className="text-lg font-medium text-slate-900 dark:text-slate-100 transition-colors">{userData.caste || "Not provided"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Farm Details Card */}
          <Card className="col-span-1 md:col-span-2 border-slate-200 dark:border-white/5 bg-white/70 dark:bg-black/40 backdrop-blur-xl shadow-xl dark:shadow-2xl hover:bg-white/90 dark:hover:bg-black/60 transition-all rounded-3xl overflow-hidden">
            <CardHeader className="border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] py-5 transition-colors">
              <CardTitle className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 uppercase tracking-widest transition-colors">
                <Map className="h-4 w-4 mr-2 text-green-500 dark:text-[#d4f826]" />
                Agricultural Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 dark:bg-[#1a1a1a] p-3 rounded-2xl border border-green-200 dark:border-white/5 shrink-0 transition-colors">
                    <Map className="h-5 w-5 text-green-700 dark:text-[#d4f826]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Land Area</p>
                    <p className="text-xl font-medium text-slate-900 dark:text-slate-100 transition-colors">{userData.areaOfLand ? `${userData.areaOfLand} Acres` : "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 dark:bg-[#1a1a1a] p-3 rounded-2xl border border-amber-200 dark:border-white/5 shrink-0 transition-colors">
                    <IndianRupee className="h-5 w-5 text-amber-700 dark:text-[#d4f826]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Annual Income</p>
                    <p className="text-xl font-medium text-slate-900 dark:text-slate-100 transition-colors">{userData.income ? `₹ ${parseInt(userData.income).toLocaleString('en-IN')}` : "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 dark:bg-[#1a1a1a] p-3 rounded-2xl border border-purple-200 dark:border-white/5 shrink-0 transition-colors">
                    <FileText className="h-5 w-5 text-purple-700 dark:text-[#d4f826]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Land Ownership</p>
                    <p className="text-xl font-medium text-slate-900 dark:text-slate-100 transition-colors">{userData.landOwnership || "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 dark:bg-[#1a1a1a] p-3 rounded-2xl border border-blue-200 dark:border-white/5 shrink-0 transition-colors">
                    <MapPin className="h-5 w-5 text-blue-700 dark:text-[#d4f826]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Location</p>
                    <p className="text-lg font-medium text-slate-900 dark:text-slate-100 transition-colors">{userData.address || "Not provided"}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">{userData.state}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schemes Section */}
        <div className="mt-12">
          <Tabs defaultValue="eligible" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:w-[400px] mb-8 bg-white/60 dark:bg-black/40 border border-slate-200 dark:border-white/5 backdrop-blur-xl p-1 rounded-2xl transition-colors">
              <TabsTrigger value="eligible" className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-[#d4f826] data-[state=active]:text-slate-900 dark:data-[state=active]:text-black text-slate-500 dark:text-slate-400 data-[state=active]:shadow-sm transition-all">Eligible Schemes</TabsTrigger>
              <TabsTrigger value="unlock" className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-[#d4f826] data-[state=active]:text-slate-900 dark:data-[state=active]:text-black text-slate-500 dark:text-slate-400 data-[state=active]:shadow-sm transition-all">Unlock More Schemes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="eligible" className="space-y-4">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white mb-1 transition-colors">Your Schemes</h2>
                <p className="text-slate-500 dark:text-slate-400 font-light transition-colors">You are eligible for these schemes based on your profile.</p>
              </div>
              <div>
                <EligibleSchemesList />
              </div>
            </TabsContent>
            
            <TabsContent value="unlock" className="space-y-4">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white mb-1 transition-colors">How to Unlock More</h2>
                <p className="text-slate-500 dark:text-slate-400 font-light transition-colors">See how providing specific documents unlocks multiple schemes for you.</p>
              </div>
              <div>
                <ExplainabilityGraph />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      </div>
    </div>
  );
}
