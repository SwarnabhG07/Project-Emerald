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
    <Card className="border-green-100">
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle className="text-green-900">{p?.fullName || "Farmer"}</CardTitle>
          <CardDescription>Kisan Profile</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-1" /> Logout
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Age / Gender</p>
              <p className="text-sm font-medium">{p?.age || "-"} / {p?.gender || "-"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Location</p>
              <p className="text-sm font-medium">{p?.state || "-"}, {p?.district || ""}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{p?.category || "General"}</Badge>
            {p?.subCategory && <Badge variant="secondary">{p.subCategory}</Badge>}
          </div>
          <div className="flex items-center gap-2">
            <Sprout className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Land</p>
              <p className="text-sm font-medium">
                {p?.landOwnership} {p?.landSizeAcres ? `(${p.landSizeAcres} acres)` : ""}
              </p>
            </div>
          </div>
        </div>
        <div className="border-t pt-4 text-sm text-gray-600">
          <p>Annual Income: ₹{(p?.annualIncome || 0).toLocaleString("en-IN")}</p>
          <p>Bank Account: {p?.bankAccount ? "✅" : "❌"}</p>
          <p>Aadhaar Linked: {p?.aadhaarLinked ? "✅" : "❌"}</p>
        </div>
      </CardContent>
    </Card>
  );
}
