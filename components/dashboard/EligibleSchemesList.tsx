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
        <Card key={scheme.id} className="flex flex-col border-white/5 bg-black/40 backdrop-blur-xl shadow-xl hover:bg-black/50 transition-all rounded-3xl overflow-hidden">
          <CardHeader className="pb-3 border-b border-white/5 bg-white/[0.02]">
            <div className="flex justify-between items-start gap-4">
              <CardTitle className="text-lg font-semibold leading-tight text-slate-100">{scheme.name}</CardTitle>
              <Badge className="bg-[#d4f826]/10 text-[#d4f826] hover:bg-[#d4f826]/20 border-transparent shrink-0">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Eligible
              </Badge>
            </div>
            <CardDescription className="text-sm text-slate-400">{scheme.ministry}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pt-4 pb-4">
            <div className="flex flex-col gap-3 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <IndianRupee className="h-4 w-4 text-[#d4f826]" />
                <span className="font-semibold text-slate-400 uppercase text-[11px] tracking-wider">Benefit:</span> <span className="font-medium text-white">{scheme.benefit}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-[#d4f826]" />
                <span className="font-semibold text-slate-400 uppercase text-[11px] tracking-wider">Deadline:</span> <span className="font-medium text-white">{formatDate(scheme.deadline)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2 pb-5">
            <Button className="w-full bg-[#d4f826] text-black hover:bg-[#bce015] font-semibold tracking-wide rounded-xl">Apply Now</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
