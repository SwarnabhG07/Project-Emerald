"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FarmerProfile } from "@/types";

interface Props {
  profile: Partial<FarmerProfile>;
}

export function ReviewStep({ profile }: Props) {
  return (
    <div className="space-y-4">
      <Card className="border-green-100">
        <CardHeader>
          <CardTitle className="text-green-900">Review Your Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-700">
          <p><strong>Name:</strong> {profile.fullName || "-"}</p>
          <p><strong>Age / Gender:</strong> {profile.age || "-"} / {profile.gender || "-"}</p>
          <p><strong>Location:</strong> {profile.village || "-"}, {profile.district || "-"}, {profile.state || "-"}</p>
          <p><strong>Category:</strong> {profile.category || "-"} {profile.subCategory ? `(${profile.subCategory})` : ""}</p>
          <p><strong>Land:</strong> {profile.landOwnership || "-"} {profile.landSizeAcres ? `(${profile.landSizeAcres} acres)` : ""}</p>
          <p><strong>Income:</strong> ₹{profile.annualIncome?.toLocaleString("en-IN") || "Not specified"}</p>
          <p><strong>Bank Account:</strong> {profile.bankAccount ? "Yes" : "No"}</p>
          <p><strong>Aadhaar Linked:</strong> {profile.aadhaarLinked ? "Yes" : "No"}</p>
        </CardContent>
      </Card>
      <p className="text-xs text-gray-500 text-center">
        Please review your information. You can update these details later from your profile.
      </p>
    </div>
  );
}