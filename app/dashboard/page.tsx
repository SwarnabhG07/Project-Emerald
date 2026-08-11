"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EligibleSchemesList } from "@/components/dashboard/EligibleSchemesList";
import { ExplainabilityGraph } from "@/components/dashboard/ExplainabilityGraph";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { User, MapPin, IndianRupee, Map, FileText, Sprout } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [userData, setUserData] = useState<Record<string, string>>({});
  const [matchResult, setMatchResult] = useState<any>(null);

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

    // Fetch schemes
    fetch("/api/match")
      .then(res => res.json())
      .then(data => {
        if (!data.error) setMatchResult(data);
      })
      .catch(e => console.error("Failed to fetch schemes:", e));
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
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0a0a] transition-colors duration-300">
      <div className="relative z-10 flex flex-col min-h-screen font-sans">
      <Navbar />

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
          <Card className="col-span-1 border-slate-200 dark:border-white/5 bg-white dark:bg-[#121212] shadow-xl dark:shadow-2xl transition-all rounded-3xl overflow-hidden">
            <CardHeader className="py-5 transition-colors">
              <CardTitle className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 uppercase tracking-widest transition-colors">
                <User className="h-4 w-4 mr-2 text-blue-500 dark:text-[#d4f826]" />
                Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2 space-y-6">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Full Name</p>
                <p className="text-xl font-medium text-slate-900 dark:text-slate-100 transition-colors">{userData.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Mobile Number</p>
                <p className="text-xl font-medium text-slate-900 dark:text-slate-100 transition-colors">{userData.mobile}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Category / Caste</p>
                <p className="text-xl font-medium text-slate-900 dark:text-slate-100 transition-colors">{userData.caste || "Not provided"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Farm Details Card */}
          <Card className="col-span-1 md:col-span-2 border-slate-200 dark:border-white/5 bg-white dark:bg-[#121212] shadow-xl dark:shadow-2xl transition-all rounded-3xl overflow-hidden">
            <CardHeader className="py-5 transition-colors">
              <CardTitle className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 uppercase tracking-widest transition-colors">
                <Map className="h-4 w-4 mr-2 text-green-500 dark:text-[#d4f826]" />
                Agricultural Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 dark:bg-[#1a1a1a] p-3 rounded-2xl border border-green-200 dark:border-white/5 shrink-0 transition-colors">
                    <Map className="h-5 w-5 text-green-700 dark:text-[#d4f826]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Land Area</p>
                    <p className="text-2xl font-medium text-slate-900 dark:text-slate-100 transition-colors">{userData.areaOfLand ? `${userData.areaOfLand} Acres` : "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 dark:bg-[#1a1a1a] p-3 rounded-2xl border border-amber-200 dark:border-white/5 shrink-0 transition-colors">
                    <IndianRupee className="h-5 w-5 text-amber-700 dark:text-[#d4f826]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Annual Income</p>
                    <p className="text-2xl font-medium text-slate-900 dark:text-slate-100 transition-colors">{userData.income ? `₹ ${parseInt(userData.income).toLocaleString('en-IN')}` : "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 dark:bg-[#1a1a1a] p-3 rounded-2xl border border-purple-200 dark:border-white/5 shrink-0 transition-colors">
                    <FileText className="h-5 w-5 text-purple-700 dark:text-[#d4f826]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Land Ownership</p>
                    <p className="text-2xl font-medium text-slate-900 dark:text-slate-100 transition-colors">{userData.landOwnership || "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 dark:bg-[#1a1a1a] p-3 rounded-2xl border border-blue-200 dark:border-white/5 shrink-0 transition-colors">
                    <MapPin className="h-5 w-5 text-blue-700 dark:text-[#d4f826]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Location</p>
                    <p className="text-xl font-medium text-slate-900 dark:text-slate-100 transition-colors">{userData.address || "Not provided"}</p>
                    <p className="text-base text-slate-500 dark:text-slate-400 transition-colors">{userData.state}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schemes Section */}
        <div className="mt-12">
          <Tabs defaultValue="eligible" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:w-[400px] mb-8 bg-slate-100 dark:bg-black border border-slate-200 dark:border-white/5 p-1 rounded-full transition-colors">
              <TabsTrigger value="eligible" className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-slate-900 dark:data-[state=active]:text-white text-slate-500 dark:text-slate-400 transition-all">Eligible Schemes</TabsTrigger>
              <TabsTrigger value="unlock" className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-slate-900 dark:data-[state=active]:text-white text-slate-500 dark:text-slate-400 transition-all">Unlock More Schemes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="eligible" className="space-y-4">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white mb-1 transition-colors">Your Schemes</h2>
                <p className="text-slate-500 dark:text-slate-400 font-light transition-colors">You are eligible for these schemes based on your profile.</p>
              </div>
              <div>
                <EligibleSchemesList schemes={matchResult?.eligible || []} />
              </div>
            </TabsContent>
            
            <TabsContent value="unlock" className="space-y-4">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white mb-1 transition-colors">How to Unlock More</h2>
                <p className="text-slate-500 dark:text-slate-400 font-light transition-colors">See how providing specific documents unlocks multiple schemes for you.</p>
              </div>
              <div>
                <ExplainabilityGraph nearMiss={matchResult?.nearMiss || []} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      </div>
    </div>
  );
}
