"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, LogOut, User, MapPin, Sprout } from "lucide-react";

interface ProfileCardProps {
  profile: any;
  onLogout: () => void;
  onEdit: () => void;
}

export function ProfileCard({ profile, onLogout, onEdit }: ProfileCardProps) {
  const p = profile?.profile;

  return (
    <Card className="border-slate-200 dark:border-white/5 bg-white dark:bg-[#121212] shadow-xl dark:shadow-2xl transition-all rounded-3xl overflow-hidden">
      <CardHeader className="py-5 flex flex-row justify-between items-start transition-colors">
        <div>
          <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 transition-colors">{p?.fullName || "Farmer"}</CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400 mt-1 transition-colors">Kisan Profile</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onEdit} className="rounded-xl dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5 transition-all">
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={onLogout} className="rounded-xl transition-all">
            <LogOut className="h-4 w-4 mr-1" /> Logout
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-2">
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-slate-100 dark:bg-[#1a1a1a] p-2 rounded-xl shrink-0 transition-colors">
              <User className="h-4 w-4 text-slate-500 dark:text-[#d4f826]" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Age / Gender</p>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 transition-colors">{p?.age || "-"} / {p?.gender || "-"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-slate-100 dark:bg-[#1a1a1a] p-2 rounded-xl shrink-0 transition-colors">
              <MapPin className="h-4 w-4 text-slate-500 dark:text-[#d4f826]" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Location</p>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 transition-colors">{p?.state || "-"}, {p?.district || ""}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="dark:border-white/10 dark:text-slate-300 transition-colors">{p?.category || "General"}</Badge>
            {p?.subCategory && <Badge variant="secondary" className="dark:bg-white/5 dark:text-slate-300 transition-colors">{p.subCategory}</Badge>}
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-slate-100 dark:bg-[#1a1a1a] p-2 rounded-xl shrink-0 transition-colors">
              <Sprout className="h-4 w-4 text-slate-500 dark:text-[#d4f826]" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Land</p>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 transition-colors">
                {p?.landOwnership} {p?.landSizeAcres ? `(${p.landSizeAcres} acres)` : ""}
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-100 dark:border-white/5 pt-5 mt-5 text-sm text-slate-600 dark:text-slate-400 space-y-2 transition-colors">
          <p className="flex justify-between items-center">
            <span>Annual Income:</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">₹{(p?.annualIncome || 0).toLocaleString("en-IN")}</span>
          </p>
          <p className="flex justify-between items-center">
            <span>Bank Account:</span>
            <span>{p?.bankAccount ? "✅" : "❌"}</span>
          </p>
          <p className="flex justify-between items-center">
            <span>Aadhaar Linked:</span>
            <span>{p?.aadhaarLinked ? "✅" : "❌"}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
