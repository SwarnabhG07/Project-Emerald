"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { EligibleSchemesList } from "./EligibleSchemesList";
import { ExplainabilityGraph } from "./ExplainabilityGraph";
import { ProfileCard } from "./ProfileCard";
import { ProfileWizard } from "@/components/profile/ProfileWizard";
import { DocumentUploader } from "@/components/documents/DocumentUploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquareText, FileText, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MatchResponse } from "@/types";

interface FarmerDashboardProps {
  onLogout: () => void;
  initialNeedsProfile?: boolean;
}

export function FarmerDashboard({ onLogout, initialNeedsProfile = false }: FarmerDashboardProps) {
  const [showWizard, setShowWizard] = useState(initialNeedsProfile);
  const [matchData, setMatchData] = useState<MatchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.authenticated) {
        setProfile(data.farmer);
        setShowWizard(!data.farmer.profileComplete);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchMatches() {
    setLoading(true);
    try {
      const res = await fetch("/api/match");
      if (res.ok) {
        setMatchData(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile?.profileComplete) {
      fetchMatches();
    }
  }, [profile]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    onLogout();
  }

  const eligibleCount = matchData?.eligible.length || 0;
  const nearMissCount = matchData?.nearMiss.length || 0;

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50">
      <DashboardHeader isOffline={false} />

      {showWizard ? (
        <main className="flex-1 p-4 md:p-6">
          <ProfileWizard
            initialProfile={profile?.profile || {}}
            onComplete={() => {
              setShowWizard(false);
              fetchProfile();
            }}
          />
        </main>
      ) : (
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Stats Row */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-green-100">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Eligible Schemes</CardTitle>
                <Award className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">{eligibleCount}</div>
                <p className="text-xs text-muted-foreground">Ready to apply</p>
              </CardContent>
            </Card>
            <Card className="border-amber-100">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Unlock More</CardTitle>
                <FileText className="h-4 w-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-900">{nearMissCount}</div>
                <p className="text-xs text-muted-foreground">Missing a condition</p>
              </CardContent>
            </Card>
            <Card className="border-blue-100">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Schemes Evaluated</CardTitle>
                <FileText className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">
                  {matchData?.totalSchemesEvaluated || 0}
                </div>
                <p className="text-xs text-muted-foreground">In database</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="schemes" className="w-full">
            <TabsList className="grid w-full grid-cols-4 md:w-[600px] mb-6">
              <TabsTrigger value="schemes">Your Schemes</TabsTrigger>
              <TabsTrigger value="unlock">Unlock More</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="schemes" className="space-y-4">
              {loading ? (
                <Card><CardContent className="py-8 text-center">Analyzing schemes...</CardContent></Card>
              ) : eligibleCount > 0 ? (
                <EligibleSchemesList schemes={matchData!.eligible} />
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-gray-500">
                    {matchData ? "No eligible schemes at this time. Check 'Unlock More' for opportunities." : "Loading..."}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="unlock" className="space-y-4">
              <div className="mb-4">
                <h2 className="text-xl font-bold tracking-tight">How to Unlock More</h2>
                <p className="text-muted-foreground">
                  Complete these actions to unlock additional schemes.
                </p>
              </div>
              <ExplainabilityGraph nearMiss={matchData?.nearMiss || []} />
            </TabsContent>

            <TabsContent value="documents">
              <DocumentUploader onUploadSuccess={fetchMatches} />
            </TabsContent>

            <TabsContent value="profile">
              <ProfileCard profile={profile} onLogout={handleLogout} onEdit={() => setShowWizard(true)} />
            </TabsContent>
          </Tabs>
        </main>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <Button size="icon" className="h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg">
          <MessageSquareText className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}