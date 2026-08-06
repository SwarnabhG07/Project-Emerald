"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tractor, CheckCircle2 } from "lucide-react";

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
    <div className="min-h-screen bg-linear-to-br from-amber-50 to-orange-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[20%] w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
      </div>
      
      <Card className="w-full max-w-2xl z-10 shadow-xl border-orange-100/50 bg-white/90 backdrop-blur-xl">
        <CardHeader className="space-y-1 text-center border-b border-orange-100 pb-6 mb-6">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center shadow-inner">
              <Tractor className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-orange-950">Farmer Profile Setup</CardTitle>
          <CardDescription className="text-orange-700/80 text-base">
            Welcome, {name}! Please provide a few more details to complete your profile.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <Label htmlFor="areaOfLand" className="text-orange-900">Area of Land (in Acres)</Label>
                <Input
                  id="areaOfLand"
                  name="areaOfLand"
                  type="number"
                  step="0.1"
                  placeholder="E.g. 5.5"
                  value={formData.areaOfLand}
                  onChange={handleChange}
                  required
                  className="border-orange-200 focus-visible:ring-orange-500 bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="income" className="text-orange-900">Annual Income (₹)</Label>
                <Input
                  id="income"
                  name="income"
                  type="number"
                  placeholder="E.g. 150000"
                  value={formData.income}
                  onChange={handleChange}
                  required
                  className="border-orange-200 focus-visible:ring-orange-500 bg-white"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address" className="text-orange-900">Address / Village</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Enter your complete address or village name"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="border-orange-200 focus-visible:ring-orange-500 bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="text-orange-900">State</Label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="flex h-10 w-full items-center justify-between rounded-md border border-orange-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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

              <div className="space-y-2">
                <Label htmlFor="caste" className="text-orange-900">Category / Caste</Label>
                <select
                  id="caste"
                  name="caste"
                  value={formData.caste}
                  onChange={handleChange}
                  required
                  className="flex h-10 w-full items-center justify-between rounded-md border border-orange-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="" disabled>Select Category</option>
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="landOwnership" className="text-orange-900">Land Ownership Type</Label>
                <select
                  id="landOwnership"
                  name="landOwnership"
                  value={formData.landOwnership}
                  onChange={handleChange}
                  required
                  className="flex h-10 w-full items-center justify-between rounded-md border border-orange-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
          <CardFooter className="pt-4 border-t border-orange-100">
            <Button 
              type="submit" 
              className="w-full bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-200 transition-all hover:shadow-xl hover:-translate-y-0.5 text-lg py-6"
            >
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Complete Profile
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
