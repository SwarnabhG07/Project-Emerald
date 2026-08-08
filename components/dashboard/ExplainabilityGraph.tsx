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
        <Card key={action.id} className="border-white/5 bg-black/40 backdrop-blur-xl shadow-xl hover:bg-black/50 transition-all rounded-3xl overflow-hidden">
          <CardHeader className="pb-3 flex flex-row items-start gap-4 border-b border-white/5 bg-white/[0.02]">
            <div className="mt-1 bg-[#d4f826]/10 p-2 rounded-xl border border-[#d4f826]/20">
              {React.cloneElement(action.icon as React.ReactElement, { className: "h-5 w-5 text-[#d4f826]" })}
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-slate-100">{action.title}</CardTitle>
              <CardDescription className="text-slate-400 mt-1">
                Complete this action to unlock {action.unlocks.length} more schemes.
              </CardDescription>
            </div>
            <Button size="sm" className="bg-[#d4f826] text-black hover:bg-[#bce015] font-semibold shrink-0 rounded-xl">
              Complete Action
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="ml-[3.25rem]">
              <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <ArrowRight className="h-3 w-3 text-[#d4f826]" />
                Unlocks the following schemes:
              </h4>
              <div className="flex flex-wrap gap-2">
                {action.unlocks.map((scheme, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-white/5 text-slate-200 hover:bg-white/10 border border-white/10">
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
