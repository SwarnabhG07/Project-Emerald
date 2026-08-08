"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EligibleSchemesList } from "@/components/dashboard/EligibleSchemesList";
import { ExplainabilityGraph } from "@/components/dashboard/ExplainabilityGraph";
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
    <div className="min-h-screen flex flex-col bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop')" }}>
      <div className="fixed inset-0 bg-[#0a0a0a]/90 backdrop-blur-xl z-0 pointer-events-none"></div>
      <div className="relative z-10 flex flex-col min-h-screen font-sans">
      {/* Navbar */}
      <header className="bg-black/20 backdrop-blur-2xl sticky top-0 z-20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#d4f826]/10 p-2 rounded-xl border border-[#d4f826]/20">
              <Sprout className="h-5 w-5 text-[#d4f826]" />
            </div>
            <h1 className="text-xl font-semibold text-white tracking-wide">AgriPortal</h1>
          </div>
          <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5 transition-colors" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-2">
            Welcome back, <span className="text-[#d4f826]">{userData.name}</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base font-light">Overview of your agricultural profile and eligible schemes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="col-span-1 border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl hover:bg-black/60 transition-all rounded-3xl overflow-hidden">
            <CardHeader className="border-b border-white/5 bg-white/[0.02] py-5">
              <CardTitle className="flex items-center text-sm font-medium text-slate-300 uppercase tracking-widest">
                <User className="h-4 w-4 mr-2 text-[#d4f826]" />
                Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Full Name</p>
                <p className="text-lg font-medium text-slate-100">{userData.name}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Mobile Number</p>
                <p className="text-lg font-medium text-slate-100">{userData.mobile}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Category / Caste</p>
                <p className="text-lg font-medium text-slate-100">{userData.caste || "Not provided"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Farm Details Card */}
          <Card className="col-span-1 md:col-span-2 border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl hover:bg-black/60 transition-all rounded-3xl overflow-hidden">
            <CardHeader className="border-b border-white/5 bg-white/[0.02] py-5">
              <CardTitle className="flex items-center text-sm font-medium text-slate-300 uppercase tracking-widest">
                <Map className="h-4 w-4 mr-2 text-[#d4f826]" />
                Agricultural Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <div className="bg-[#1a1a1a] p-3 rounded-2xl border border-white/5 shrink-0">
                    <Map className="h-5 w-5 text-[#d4f826]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Land Area</p>
                    <p className="text-xl font-medium text-slate-100">{userData.areaOfLand ? `${userData.areaOfLand} Acres` : "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#1a1a1a] p-3 rounded-2xl border border-white/5 shrink-0">
                    <IndianRupee className="h-5 w-5 text-[#d4f826]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Annual Income</p>
                    <p className="text-xl font-medium text-slate-100">{userData.income ? `₹ ${parseInt(userData.income).toLocaleString('en-IN')}` : "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#1a1a1a] p-3 rounded-2xl border border-white/5 shrink-0">
                    <FileText className="h-5 w-5 text-[#d4f826]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Land Ownership</p>
                    <p className="text-xl font-medium text-slate-100">{userData.landOwnership || "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#1a1a1a] p-3 rounded-2xl border border-white/5 shrink-0">
                    <MapPin className="h-5 w-5 text-[#d4f826]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Location</p>
                    <p className="text-lg font-medium text-slate-100">{userData.address || "Not provided"}</p>
                    <p className="text-sm text-slate-400">{userData.state}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schemes Section */}
        <div className="mt-12">
          <Tabs defaultValue="eligible" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:w-[400px] mb-8 bg-black/40 border border-white/5 backdrop-blur-xl p-1 rounded-2xl">
              <TabsTrigger value="eligible" className="rounded-xl data-[state=active]:bg-[#d4f826] data-[state=active]:text-black text-slate-400 transition-all">Eligible Schemes</TabsTrigger>
              <TabsTrigger value="unlock" className="rounded-xl data-[state=active]:bg-[#d4f826] data-[state=active]:text-black text-slate-400 transition-all">Unlock More Schemes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="eligible" className="space-y-4">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold tracking-tight text-white mb-1">Your Schemes</h2>
                <p className="text-slate-400 font-light">You are eligible for these schemes based on your profile.</p>
              </div>
              <div className="dark">
                <EligibleSchemesList />
              </div>
            </TabsContent>
            
            <TabsContent value="unlock" className="space-y-4">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold tracking-tight text-white mb-1">How to Unlock More</h2>
                <p className="text-slate-400 font-light">See how providing specific documents unlocks multiple schemes for you.</p>
              </div>
              <div className="dark">
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
