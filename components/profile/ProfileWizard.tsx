"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { LandStep } from "./steps/LandStep";
import { CategoryStep } from "./steps/CategoryStep";
import { IncomeStep } from "./steps/IncomeStep";
import { ReviewStep } from "./steps/ReviewStep";
import type { FarmerProfile } from "@/types";

interface ProfileWizardProps {
  onComplete: () => void;
  initialProfile?: Partial<FarmerProfile>;
}

const STEPS = ["Basic Info", "Land Details", "Category", "Income", "Review"];

export function ProfileWizard({ onComplete, initialProfile = {} }: ProfileWizardProps) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Partial<FarmerProfile>>(initialProfile);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const progress = ((step + 1) / STEPS.length) * 100;

  function update(data: Partial<FarmerProfile>) {
    setProfile((prev) => ({ ...prev, ...data }));
  }

  function next() {
    if (step < STEPS.length - 1) setStep(step + 1);
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  async function submit() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profile, isComplete: true }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }
      onComplete();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-green-900">Complete Your Profile</CardTitle>
          <CardDescription>
            Step {step + 1} of {STEPS.length}: {STEPS[step]}
          </CardDescription>
          <Progress value={progress} className="mt-2 h-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 0 && <BasicInfoStep profile={profile} onChange={update} />}
          {step === 1 && <LandStep profile={profile} onChange={update} />}
          {step === 2 && <CategoryStep profile={profile} onChange={update} />}
          {step === 3 && <IncomeStep profile={profile} onChange={update} />}
          {step === 4 && <ReviewStep profile={profile} />}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={back}
              disabled={step === 0 || saving}
            >
              Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={next} className="bg-green-600 hover:bg-green-700 text-white">
                Continue
              </Button>
            ) : (
              <Button
                onClick={submit}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {saving ? "Saving..." : "Complete Profile"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}