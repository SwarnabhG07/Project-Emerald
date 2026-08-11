"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Settings, Play, CheckCircle2, ShieldCheck, FileText, Loader2, ArrowRight } from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [schemes, setSchemes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlResult, setCrawlResult] = useState<any>(null);
  const [approving, setApproving] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    // Demo bypass: Check if they logged in via Admin button
    const adminFlag = localStorage.getItem("is_admin");
    if (adminFlag !== "true") {
      router.push("/login");
      return;
    }
    setIsAdmin(true);
    fetchPendingSchemes();
  }, [router]);

  const fetchPendingSchemes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/schemes");
      if (res.ok) {
        const data = await res.json();
        setSchemes(data.schemes || []);
      }
    } catch (e) {
      console.error("Failed to fetch schemes", e);
    }
    setIsLoading(false);
  };

  const handleRunCrawler = async () => {
    setIsCrawling(true);
    setCrawlResult(null);
    try {
      const res = await fetch("/api/admin/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sources: ["all"] }),
      });
      const data = await res.json();
      setCrawlResult(data);
      if (data.success) {
        // Refresh the pending schemes list
        fetchPendingSchemes();
      }
    } catch (e) {
      console.error("Failed to run crawler", e);
    }
    setIsCrawling(false);
  };

  const handleApprove = async (schemeId: string) => {
    setApproving(schemeId);
    try {
      const res = await fetch("/api/admin/schemes/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schemeId }),
      });
      if (res.ok) {
        // Remove from list
        setSchemes((prev) => prev.filter((s) => s.id !== schemeId));
      }
    } catch (e) {
      console.error("Failed to approve scheme", e);
    }
    setApproving(null);
  };

  if (!isMounted || !isAdmin) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] transition-colors duration-300">
      <div className="relative z-10 flex flex-col min-h-screen font-sans">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-10 flex justify-between items-end">
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-2 transition-colors flex items-center gap-3">
                <ShieldCheck className="h-8 w-8 text-[#d4f826]" />
                Admin Dashboard
              </h2>
              <p className="text-slate-400 text-sm md:text-base font-light transition-colors">
                Manage ingestion sources and approve pending schemes for public rollout.
              </p>
            </div>
            <Button
              variant="outline"
              className="rounded-xl border-white/10 text-slate-300 hover:bg-white/5"
              onClick={() => {
                localStorage.removeItem("is_admin");
                router.push("/login");
              }}
            >
              Exit Admin
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Actions */}
            <div className="space-y-6">
              <Card className="border-white/5 bg-[#121212] shadow-2xl transition-all rounded-3xl overflow-hidden">
                <CardHeader className="py-5 border-b border-white/5 bg-white/[0.02]">
                  <CardTitle className="flex items-center text-sm font-medium text-slate-300 uppercase tracking-widest">
                    <Settings className="h-4 w-4 mr-2 text-[#d4f826]" />
                    Data Ingestion
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <p className="text-slate-400 text-sm">
                    Trigger the web crawler to fetch the latest schemes from all configured sources (Central & State portals).
                  </p>
                  
                  <Button 
                    onClick={handleRunCrawler}
                    disabled={isCrawling}
                    className="w-full bg-[#d4f826] text-black hover:bg-[#bce015] font-semibold tracking-wide h-12 rounded-xl transition-all"
                  >
                    {isCrawling ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Crawling...</>
                    ) : (
                      <><Play className="mr-2 h-5 w-5 fill-current" /> Run Crawler</>
                    )}
                  </Button>

                  {crawlResult && (
                    <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 text-sm">
                      <p className="font-semibold text-white mb-2">Last Run Results:</p>
                      <ul className="space-y-1 text-slate-400">
                        <li><span className="text-slate-300">Status:</span> {crawlResult.status}</li>
                        <li><span className="text-slate-300">Fetched:</span> {crawlResult.stats?.fetched || 0}</li>
                        <li><span className="text-emerald-400">Created:</span> {crawlResult.stats?.created || 0}</li>
                        <li><span className="text-blue-400">Updated:</span> {crawlResult.stats?.updated || 0}</li>
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Pending Schemes */}
            <div className="lg:col-span-2">
              <Card className="border-white/5 bg-[#121212] shadow-2xl transition-all rounded-3xl overflow-hidden min-h-[500px]">
                <CardHeader className="py-5 border-b border-white/5 bg-white/[0.02] flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center text-sm font-medium text-slate-300 uppercase tracking-widest">
                    <FileText className="h-4 w-4 mr-2 text-[#d4f826]" />
                    Pending Approvals
                  </CardTitle>
                  <Badge className="bg-[#d4f826]/10 text-[#d4f826] hover:bg-[#d4f826]/20 border-transparent">
                    {schemes.length} Schemes
                  </Badge>
                </CardHeader>
                <CardContent className="pt-6">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                      <Loader2 className="h-8 w-8 animate-spin mb-4 text-[#d4f826]" />
                      <p>Loading pending schemes...</p>
                    </div>
                  ) : schemes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                      <CheckCircle2 className="h-12 w-12 mb-4 text-emerald-500/50" />
                      <p className="text-lg font-medium text-slate-300">All caught up!</p>
                      <p className="text-sm mt-1">No schemes are pending approval.</p>
                      <p className="text-sm mt-4 text-slate-600">Run the crawler to fetch new data.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {schemes.map((scheme) => {
                        const version = scheme.versions?.[0];
                        return (
                          <div key={scheme.id} className="p-5 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-start gap-2">
                                <h3 className="text-lg font-semibold text-white leading-tight">{scheme.name}</h3>
                                {scheme.category && (
                                  <Badge variant="outline" className="border-white/10 text-slate-300 whitespace-nowrap">
                                    {scheme.category}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-slate-400">
                                {scheme.ministry} {scheme.state ? `• ${scheme.state}` : ""}
                              </p>
                              {version && (
                                <p className="text-sm text-slate-500 line-clamp-1">
                                  <span className="text-slate-400">Benefit:</span> {version.benefit}
                                </p>
                              )}
                            </div>
                            
                            <Button 
                              onClick={() => handleApprove(scheme.id)}
                              disabled={approving === scheme.id}
                              className="shrink-0 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 border border-emerald-500/20 rounded-xl"
                            >
                              {approving === scheme.id ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : (
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                              )}
                              Approve
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
