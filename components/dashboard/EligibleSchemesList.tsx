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
        <Card key={scheme.id} className="flex flex-col transition-shadow hover:shadow-md border-green-100">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start gap-4">
              <CardTitle className="text-lg font-semibold leading-tight text-green-900">{scheme.name}</CardTitle>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200 shrink-0">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Eligible
              </Badge>
            </div>
            <CardDescription className="text-sm">{scheme.ministry}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-4">
            <div className="flex flex-col gap-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <IndianRupee className="h-4 w-4 text-gray-400" />
                <span className="font-medium">Benefit:</span> {scheme.benefit}
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-red-400" />
                <span className="font-medium">Deadline:</span> {formatDate(scheme.deadline)}
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button className="w-full bg-green-600 hover:bg-green-700">Apply Now</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
