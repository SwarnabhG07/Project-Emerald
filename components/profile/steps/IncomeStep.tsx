"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FarmerProfile } from "@/types";

interface Props {
  profile: Partial<FarmerProfile>;
  onChange: (data: Partial<FarmerProfile>) => void;
}

export function IncomeStep({ profile, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Annual Family Income (₹)</Label>
        <Input
          type="number"
          value={profile.annualIncome || ""}
          onChange={(e) =>
            onChange({ annualIncome: parseFloat(e.target.value) || undefined })
          }
          placeholder="120000"
        />
        <p className="text-xs text-gray-500">
          From all sources. Many schemes have income ceilings.
        </p>
      </div>
      <div className="space-y-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={profile.bankAccount || false}
            onChange={(e) => onChange({ bankAccount: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300"
          />
          <span className="text-sm">I have a bank account</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={profile.aadhaarLinked || false}
            onChange={(e) => onChange({ aadhaarLinked: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300"
          />
          <span className="text-sm">My Aadhaar is linked to my bank account</span>
        </label>
      </div>
    </div>
  );
}