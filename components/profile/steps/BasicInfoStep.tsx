"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FarmerProfile } from "@/types";

interface Props {
  profile: Partial<FarmerProfile>;
  onChange: (data: Partial<FarmerProfile>) => void;
}

export function BasicInfoStep({ profile, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Full Name *</Label>
        <Input
          value={profile.fullName || ""}
          onChange={(e) => onChange({ fullName: e.target.value })}
          placeholder="Ramesh Kumar"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Age *</Label>
          <Input
            type="number"
            value={profile.age || ""}
            onChange={(e) => onChange({ age: parseInt(e.target.value) || undefined })}
            placeholder="35"
            min="16"
            max="100"
          />
        </div>
        <div className="space-y-2">
          <Label>Gender *</Label>
          <select
            value={profile.gender || ""}
            onChange={(e) => onChange({ gender: e.target.value as any })}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>State *</Label>
        <Input
          value={profile.state || ""}
          onChange={(e) => onChange({ state: e.target.value })}
          placeholder="Maharashtra"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>District</Label>
          <Input
            value={profile.district || ""}
            onChange={(e) => onChange({ district: e.target.value })}
            placeholder="Pune"
          />
        </div>
        <div className="space-y-2">
          <Label>Village</Label>
          <Input
            value={profile.village || ""}
            onChange={(e) => onChange({ village: e.target.value })}
            placeholder="Shivane"
          />
        </div>
      </div>
    </div>
  );
}