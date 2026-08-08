import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, ArrowRight } from "lucide-react";

export function ExplainabilityGraph() {
  const missingActions = [
    {
      id: "action-1",
      title: "Upload OBC Certificate",
      icon: <Upload className="h-5 w-5 text-amber-500" />,
      unlocks: ["State Tractor Scheme", "National Fertilizer Subsidy"],
    },
    {
      id: "action-2",
      title: "Register Land Document (Khasra/Khatauni)",
      icon: <FileText className="h-5 w-5 text-amber-500" />,
      unlocks: ["National Fertilizer Subsidy", "Kisan Credit Card Extension"],
    },
  ];

  return (
    <div className="space-y-4">
      {missingActions.map((action) => (
        <Card key={action.id} className="border-slate-200 dark:border-white/5 bg-white/70 dark:bg-black/40 backdrop-blur-xl shadow-xl dark:shadow-2xl hover:bg-white/80 dark:hover:bg-black/50 transition-all rounded-3xl overflow-hidden">
          <CardHeader className="pb-3 flex flex-row items-start gap-4 border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] transition-colors">
            <div className="mt-1 bg-amber-100 dark:bg-[#d4f826]/10 p-2 rounded-xl border border-amber-200 dark:border-[#d4f826]/20 transition-colors">
              {React.cloneElement(action.icon as React.ReactElement, { className: "h-5 w-5 text-amber-600 dark:text-[#d4f826] transition-colors" })}
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 transition-colors">{action.title}</CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400 mt-1 transition-colors">
                Complete this action to unlock {action.unlocks.length} more schemes.
              </CardDescription>
            </div>
            <Button size="sm" className="bg-amber-500 dark:bg-[#d4f826] text-white dark:text-black hover:bg-amber-600 dark:hover:bg-[#bce015] font-semibold shrink-0 rounded-xl shadow-md dark:shadow-none transition-all">
              Complete Action
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="ml-[3.25rem]">
              <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1 transition-colors">
                <ArrowRight className="h-3 w-3 text-amber-500 dark:text-[#d4f826] transition-colors" />
                Unlocks the following schemes:
              </h4>
              <div className="flex flex-wrap gap-2">
                {action.unlocks.map((scheme, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors">
                    {scheme}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
