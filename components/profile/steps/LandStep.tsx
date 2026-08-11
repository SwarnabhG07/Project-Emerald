"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FarmerProfile } from "@/types";

interface Props {
  profile: Partial<FarmerProfile>;
  onChange: (data: Partial<FarmerProfile>) => void;
}

export function LandStep({ profile, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Land Ownership Status *</Label>
        <select
          value={profile.landOwnership || ""}
          onChange={(e) => onChange({ landOwnership: e.target.value as any })}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
        >
          <option value="">Select</option>
          <option value="Owner">Owner</option>
          <option value="Tenant">Tenant / Lease</option>
          <option value="Sharecropper">Sharecropper</option>
          <option value="Landless">Landless Agricultural Laborer</option>
        </select>
        <p className="text-xs text-gray-500">
          Tenants and sharecroppers are eligible for many schemes (PMFBY, KCC, etc.)
        </p>
      </div>
      {profile.landOwnership !== "Landless" && (
        <>
          <div className="space-y-2">
            <Label>Land Size (acres)</Label>
            <Input
              type="number"
              step="0.01"
              value={profile.landSizeAcres || ""}
              onChange={(e) =>
                onChange({ landSizeAcres: parseFloat(e.target.value) || undefined })
              }
              placeholder="2.5"
            />
          </div>
          <div className="space-y-2">
            <Label>Khasra / Khatauni Number</Label>
            <Input
              value={profile.khasraNumber || ""}
              onChange={(e) => onChange({ khasraNumber: e.target.value })}
              placeholder="As shown in land record"
            />
          </div>
        </>
      )}
    </div>
  );
}