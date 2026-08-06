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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-green-100 p-2 rounded-lg">
              <Sprout className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">AgriPortal</h1>
          </div>
          <Button variant="ghost" className="text-slate-600 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Welcome back, {userData.name}!</h2>
          <p className="text-slate-500">Here is an overview of your profile and farming details.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="col-span-1 shadow-md border-slate-200/60 bg-white hover:shadow-lg transition-all">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="flex items-center text-lg text-slate-800">
                <User className="h-5 w-5 mr-2 text-blue-500" />
                Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Full Name</p>
                <p className="text-base font-semibold text-slate-900">{userData.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Mobile Number</p>
                <p className="text-base font-semibold text-slate-900">{userData.mobile}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Category / Caste</p>
                <p className="text-base font-semibold text-slate-900">{userData.caste || "Not provided"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Farm Details Card */}
          <Card className="col-span-1 md:col-span-2 shadow-md border-slate-200/60 bg-white hover:shadow-lg transition-all">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="flex items-center text-lg text-slate-800">
                <Map className="h-5 w-5 mr-2 text-green-500" />
                Agricultural Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-lg shrink-0">
                    <Map className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Total Land Area</p>
                    <p className="text-lg font-semibold text-slate-900">{userData.areaOfLand ? `${userData.areaOfLand} Acres` : "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 p-2 rounded-lg shrink-0">
                    <IndianRupee className="h-5 w-5 text-amber-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Annual Income</p>
                    <p className="text-lg font-semibold text-slate-900">{userData.income ? `₹ ${parseInt(userData.income).toLocaleString('en-IN')}` : "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg shrink-0">
                    <FileText className="h-5 w-5 text-purple-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Land Ownership</p>
                    <p className="text-lg font-semibold text-slate-900">{userData.landOwnership || "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg shrink-0">
                    <MapPin className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Location</p>
                    <p className="text-base font-semibold text-slate-900">{userData.address || "Not provided"}</p>
                    <p className="text-sm text-slate-600">{userData.state}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schemes Section */}
        <div className="mt-8">
          <Tabs defaultValue="eligible" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:w-[400px] mb-6">
              <TabsTrigger value="eligible">Eligible Schemes</TabsTrigger>
              <TabsTrigger value="unlock">Unlock More Schemes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="eligible" className="space-y-4">
              <div className="mb-4">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">Your Schemes</h2>
                <p className="text-slate-500">You are eligible for these schemes based on your profile.</p>
              </div>
              <EligibleSchemesList />
            </TabsContent>
            
            <TabsContent value="unlock" className="space-y-4">
              <div className="mb-4">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">How to Unlock More</h2>
                <p className="text-slate-500">See how providing specific documents unlocks multiple schemes for you.</p>
              </div>
              <ExplainabilityGraph />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
