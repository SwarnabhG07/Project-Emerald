"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { FarmerProfile } from "@/types";

interface Props {
  profile: Partial<FarmerProfile>;
  onChange: (data: Partial<FarmerProfile>) => void;
}

export function CategoryStep({ profile, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Reservation Category *</Label>
        <select
          value={profile.category || ""}
          onChange={(e) => onChange({ category: e.target.value as any })}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
        >
          <option value="">Select</option>
          <option value="General">General</option>
          <option value="OBC">OBC (Other Backward Class)</option>
          <option value="SC">SC (Scheduled Caste)</option>
          <option value="ST">ST (Scheduled Tribe)</option>
          <option value="EWS">EWS (Economically Weaker Section)</option>
        </select>
        <p className="text-xs text-gray-500">
          Based on official government category, not caste name.
        </p>
      </div>
      <div className="space-y-2">
        <Label>Sub-category (if any)</Label>
        <Input
          value={profile.subCategory || ""}
          onChange={(e) => onChange({ subCategory: e.target.value })}
          placeholder="e.g., VJNT, SBC, etc."
        />
      </div>
    </div>
  );
}