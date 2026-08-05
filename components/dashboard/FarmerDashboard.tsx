"use client";

import { DashboardHeader } from "./DashboardHeader";
import { EligibleSchemesList } from "./EligibleSchemesList";
import { ExplainabilityGraph } from "./ExplainabilityGraph";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FarmerDashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50">
      <DashboardHeader isOffline={false} />
      
      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Profile Summary Card */}
        <Card className="border-green-100 shadow-sm bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-green-900">Profile Completion</CardTitle>
            <CardDescription>Complete your profile to unlock more schemes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Progress value={65} className="h-3 flex-1 bg-green-100" />
              <span className="text-sm font-medium text-green-800 shrink-0">65%</span>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs defaultValue="eligible" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px] mb-6">
            <TabsTrigger value="eligible">Eligible Schemes</TabsTrigger>
            <TabsTrigger value="unlock">Unlock More Schemes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="eligible" className="space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-bold tracking-tight">Your Schemes</h2>
              <p className="text-muted-foreground">You are eligible for these schemes based on your profile.</p>
            </div>
            <EligibleSchemesList />
          </TabsContent>
          
          <TabsContent value="unlock" className="space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-bold tracking-tight">How to Unlock More</h2>
              <p className="text-muted-foreground">See how providing specific documents unlocks multiple schemes for you.</p>
            </div>
            <ExplainabilityGraph />
          </TabsContent>
        </Tabs>
      </main>

      {/* Floating Action Button for Helpline/Chatbot */}
      <div className="fixed bottom-6 right-6">
        <Button size="icon" className="h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg">
          <MessageSquareText className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
