"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, ArrowRight, CheckCircle2 } from "lucide-react";
import type { NearMissResult, ActionNode } from "@/types";

interface ExplainabilityGraphProps {
  nearMiss: NearMissResult[];
}

export function ExplainabilityGraph({ nearMiss }: ExplainabilityGraphProps) {
  // Group actions across all near-miss schemes
  const actionMap = new Map<string, ActionNode>();

  for (const scheme of nearMiss) {
    for (const action of scheme.actions) {
      const key = action.actionType + ":" + (action.documentType || action.field);
      const existing = actionMap.get(key);
      if (existing) {
        existing.unlockedSchemes.push(scheme.schemeName);
        existing.impact += 1;
      } else {
        actionMap.set(key, {
          ...action,
          unlockedSchemes: [scheme.schemeName],
        });
      }
    }
  }

  const sortedActions = Array.from(actionMap.values()).sort(
    (a, b) => b.impact - a.impact
  );

  if (sortedActions.length === 0) {
    return (
      <Card className="border-green-100">
        <CardContent className="py-8 text-center text-gray-500">
          You have all conditions met for available schemes!
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sortedActions.map((action, idx) => {
        const isDocAction = action.actionType === "upload_doc";
        return (
          <Card key={idx} className="border-amber-200 bg-amber-50/30">
            <CardHeader className="pb-3 flex flex-row items-start gap-4">
              <div className="mt-1 bg-amber-100 p-2 rounded-full">
                {isDocAction ? (
                  <Upload className="h-5 w-5 text-amber-500" />
                ) : (
                  <FileText className="h-5 w-5 text-amber-500" />
                )}
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg text-amber-900">{action.label}</CardTitle>
                <CardDescription className="text-amber-700/80 mt-1">
                  Complete this action to unlock {action.unlockedSchemes.length} more scheme
                  {action.unlockedSchemes.length > 1 ? "s" : ""}.
                </CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-800 shrink-0">
                +{action.impact} schemes
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="ml-14">
                <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                  Unlocks the following schemes:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {action.unlockedSchemes.map((scheme, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                    >
                      {scheme}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}