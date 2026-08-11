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
      <Card className="border-slate-200 dark:border-white/5 bg-white dark:bg-[#121212] transition-colors">
        <CardContent className="py-8 text-center text-slate-500 dark:text-slate-400">
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
          <Card key={idx} className="border-slate-200 dark:border-white/5 bg-white dark:bg-[#121212] shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden">
            <CardHeader className="py-5 flex flex-row items-start gap-4 transition-colors">
              <div className="mt-1 bg-amber-100 dark:bg-amber-900/20 p-3 rounded-2xl border border-transparent dark:border-white/5 transition-colors">
                {isDocAction ? (
                  <Upload className="h-5 w-5 text-amber-600 dark:text-[#d4f826]" />
                ) : (
                  <FileText className="h-5 w-5 text-amber-600 dark:text-[#d4f826]" />
                )}
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg text-slate-900 dark:text-slate-100 transition-colors">{action.label}</CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400 mt-1 transition-colors">
                  Complete this action to unlock {action.unlockedSchemes.length} more scheme
                  {action.unlockedSchemes.length > 1 ? "s" : ""}.
                </CardDescription>
              </div>
              <Badge className="bg-green-100 dark:bg-[#d4f826]/10 text-green-700 dark:text-[#d4f826] shrink-0 border-transparent transition-colors">
                +{action.impact} schemes
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="ml-14">
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1 transition-colors">
                  <ArrowRight className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                  Unlocks the following schemes:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {action.unlockedSchemes.map((scheme, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
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