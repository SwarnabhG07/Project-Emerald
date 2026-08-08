import { eligibleSchemes } from "./mock-data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, CalendarDays, IndianRupee } from "lucide-react";

const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

export function EligibleSchemesList() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {eligibleSchemes.map((scheme) => (
        <Card key={scheme.id} className="flex flex-col border-slate-200 dark:border-white/5 bg-white/70 dark:bg-black/40 backdrop-blur-xl shadow-xl dark:shadow-2xl hover:bg-white/80 dark:hover:bg-black/50 transition-all rounded-3xl overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] transition-colors">
            <div className="flex justify-between items-start gap-4">
              <CardTitle className="text-lg font-semibold leading-tight text-slate-900 dark:text-slate-100 transition-colors">{scheme.name}</CardTitle>
              <Badge className="bg-green-100 dark:bg-[#d4f826]/10 text-green-700 dark:text-[#d4f826] hover:bg-green-200 dark:hover:bg-[#d4f826]/20 border-transparent shrink-0 transition-colors">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Eligible
              </Badge>
            </div>
            <CardDescription className="text-sm text-slate-500 dark:text-slate-400 transition-colors">{scheme.ministry}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pt-4 pb-4">
            <div className="flex flex-col gap-3 text-sm text-slate-700 dark:text-slate-300 transition-colors">
              <div className="flex items-center gap-2">
                <IndianRupee className="h-4 w-4 text-green-600 dark:text-[#d4f826] transition-colors" />
                <span className="font-semibold text-slate-500 dark:text-slate-400 uppercase text-[11px] tracking-wider transition-colors">Benefit:</span> <span className="font-medium text-slate-900 dark:text-white transition-colors">{scheme.benefit}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-green-600 dark:text-[#d4f826] transition-colors" />
                <span className="font-semibold text-slate-500 dark:text-slate-400 uppercase text-[11px] tracking-wider transition-colors">Deadline:</span> <span className="font-medium text-slate-900 dark:text-white transition-colors">{formatDate(scheme.deadline)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2 pb-5">
            <Button className="w-full bg-green-600 dark:bg-[#d4f826] text-white dark:text-black hover:bg-green-700 dark:hover:bg-[#bce015] font-semibold tracking-wide rounded-xl shadow-md dark:shadow-none transition-all">Apply Now</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
