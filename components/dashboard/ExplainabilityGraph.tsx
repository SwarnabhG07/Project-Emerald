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
        <Card key={action.id} className="border-amber-200 bg-amber-50/30">
          <CardHeader className="pb-3 flex flex-row items-start gap-4">
            <div className="mt-1 bg-amber-100 p-2 rounded-full">
              {action.icon}
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg text-amber-900">{action.title}</CardTitle>
              <CardDescription className="text-amber-700/80 mt-1">
                Complete this action to unlock {action.unlocks.length} more schemes.
              </CardDescription>
            </div>
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 shrink-0">
              Complete Action
            </Button>
          </CardHeader>
          <CardContent>
            <div className="ml-14">
              <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                <ArrowRight className="h-4 w-4 text-slate-400" />
                Unlocks the following schemes:
              </h4>
              <div className="flex flex-wrap gap-2">
                {action.unlocks.map((scheme, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
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
