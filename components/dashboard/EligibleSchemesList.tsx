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
        <Card key={scheme.schemeId} className="flex flex-col transition-shadow hover:shadow-md border-green-100">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start gap-4">
              <CardTitle className="text-lg font-semibold leading-tight text-green-900">
                {scheme.schemeName}
              </CardTitle>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200 shrink-0">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Eligible
              </Badge>
            </div>
            <CardDescription className="text-sm">{scheme.ministry}</CardDescription>
            {scheme.state && (
              <Badge variant="outline" className="w-fit mt-1">
                {scheme.state}
              </Badge>
            )}
          </CardHeader>
          <CardContent className="flex-1 pb-4 space-y-2">
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <IndianRupee className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
              <span>{scheme.benefit}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <CalendarDays className="h-4 w-4 text-red-400 shrink-0" />
              <span>Deadline: {formatDate(scheme.deadline)}</span>
            </div>
            {typeof scheme.matchScore === "number" && (
              <div className="text-xs font-medium text-green-700">
                Hybrid match score: {Math.round(scheme.matchScore * 100)}%
                {scheme.signals && (
                  <span className="text-gray-400 font-normal">
                    {" "}(keyword {Math.round(scheme.signals.keyword * 100)}% · semantic {Math.round(scheme.signals.semantic * 100)}% · docs {Math.round(scheme.signals.documentReadiness * 100)}%)
                  </span>
                )}
              </div>
            )}
            {scheme.missingDocuments.length > 0 && (
              <div className="text-xs text-amber-700 bg-amber-50 p-2 rounded">
                Missing: {scheme.missingDocuments.length} documents (optional for preview)
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-0 flex-col gap-2">
            <Button className="w-full bg-green-600 hover:bg-green-700">
              Apply Now
            </Button>
            {scheme.link && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => window.open(scheme.link!, "_blank")}
              >
                <ExternalLink className="h-3 w-3 mr-1" /> Official Link
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}