"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, CalendarDays, IndianRupee, ExternalLink } from "lucide-react";
import type { MatchResult } from "@/types";

const formatDate = (dateString: string | null) => {
  if (!dateString) return "No deadline";
  const d = new Date(dateString);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

export function EligibleSchemesList({ schemes }: { schemes: MatchResult[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {schemes.map((scheme) => (
        <Card key={scheme.schemeId} className="flex flex-col border-slate-200 dark:border-white/5 bg-white dark:bg-[#121212] shadow-xl dark:shadow-2xl hover:bg-white/90 dark:hover:bg-[#181818] transition-all rounded-3xl overflow-hidden">
          <CardHeader className="py-5 transition-colors">
            <div className="flex justify-between items-start gap-4">
              <CardTitle className="text-lg font-semibold leading-tight text-slate-900 dark:text-slate-100 transition-colors">
                {scheme.schemeName}
              </CardTitle>
              <Badge className="bg-green-100 dark:bg-[#d4f826]/10 text-green-700 dark:text-[#d4f826] hover:bg-green-200 dark:hover:bg-[#d4f826]/20 border-transparent shrink-0 transition-colors">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Eligible
              </Badge>
            </div>
            <CardDescription className="text-sm text-slate-500 dark:text-slate-400 transition-colors">{scheme.ministry}</CardDescription>
            {scheme.state && (
              <Badge variant="outline" className="w-fit mt-1 dark:border-white/10 dark:text-slate-300">
                {scheme.state}
              </Badge>
            )}
          </CardHeader>
          <CardContent className="flex-1 pb-4 space-y-3">
            <div className="flex flex-col gap-3 text-sm text-slate-700 dark:text-slate-300 transition-colors">
              <div className="flex items-center gap-2">
                <IndianRupee className="h-4 w-4 text-green-600 dark:text-[#d4f826] shrink-0 transition-colors" />
                <span className="font-semibold text-slate-500 dark:text-slate-400 uppercase text-[11px] tracking-wider transition-colors">Benefit:</span> 
                <span className="font-medium text-slate-900 dark:text-white transition-colors">{scheme.benefit}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-green-600 dark:text-[#d4f826] shrink-0 transition-colors" />
                <span className="font-semibold text-slate-500 dark:text-slate-400 uppercase text-[11px] tracking-wider transition-colors">Deadline:</span> 
                <span className="font-medium text-slate-900 dark:text-white transition-colors">{formatDate(scheme.deadline)}</span>
              </div>
            </div>
            {typeof scheme.matchScore === "number" && (
              <div className="text-xs font-medium text-green-700 dark:text-[#d4f826] mt-3 bg-green-50 dark:bg-[#d4f826]/10 p-2 rounded-xl">
                Match score: {Math.round(scheme.matchScore * 100)}%
              </div>
            )}
            {scheme.missingDocuments.length > 0 && (
              <div className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-xl mt-2">
                Missing {scheme.missingDocuments.length} docs
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-4 pb-5 px-5 flex-col gap-3 border-t-0 bg-transparent">
            <Button className="w-full h-12 bg-green-600 dark:bg-[#d4f826] text-white dark:text-black hover:bg-green-700 dark:hover:bg-[#bce015] font-semibold tracking-wide rounded-xl shadow-md dark:shadow-none transition-all">
              Apply Now
            </Button>
            {scheme.link && (
              <Button
                variant="outline"
                className="w-full h-12 rounded-xl border-slate-200 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5 bg-transparent"
                onClick={() => window.open(scheme.link!, "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" /> Official Link
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}