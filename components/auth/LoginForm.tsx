"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tractor, ShieldCheck } from "lucide-react";

type Stage = "phone" | "otp" | "pin" | "new-pin";

interface LoginFormProps {
  onLoginSuccess: (needsProfile: boolean) => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [stage, setStage] = useState<Stage>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");
  const [ticket, setTicket] = useState(""); // <-- Added to store OTP proof

  async function handleSendOtp() {
    setError("");
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Enter a valid 10-digit Indian mobile number");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setInfo("OTP sent! Check server console in dev mode.");
      setStage("otp");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setTicket(data.ticket); // <-- Save the ticket
      setStage(data.isNewUser ? "new-pin" : "pin");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, pin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      onLoginSuccess(data.needsProfile);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSetPin() {
    setError("");
    if (!/^\d{4}$/.test(pin)) {
      setError("PIN must be exactly 4 digits");
      return;
    }
    if (pin !== confirmPin) {
      setError("PINs do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/set-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, pin, ticket }), // <-- Pass the ticket
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      onLoginSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-md border-green-200 shadow-lg">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-2">
            <Tractor className="h-8 w-8 text-green-700" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-900">
            {stage === "phone" && "Kisan Login"}
            {stage === "otp" && "Verify OTP"}
            {stage === "pin" && "Enter PIN"}
            {stage === "new-pin" && "Set Your PIN"}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {stage === "phone" && "Enter your mobile number to get started."}
            {stage === "otp" && `We sent a 6-digit code to +91 ${phone}`}
            {stage === "pin" && "Enter your 4-digit security PIN."}
            {stage === "new-pin" && "Create a 4-digit PIN for future logins."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {stage === "phone" && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-green-900">Mobile Number</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">+91</span>
                <Input
                  placeholder="9876543210"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  className="border-green-300 focus-visible:ring-green-500"
                />
              </div>
            </div>
          )}

          {stage === "otp" && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-green-900">6-Digit OTP</label>
              <Input
                placeholder="••••••"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="border-green-300 focus-visible:ring-green-500 text-center tracking-widest text-lg"
              />
              {info && <p className="text-xs text-blue-600">{info}</p>}
            </div>
          )}

          {(stage === "pin" || stage === "new-pin") && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-green-900">4-Digit PIN</label>
                <Input
                  type="password"
                  inputMode="numeric"
                  placeholder="••••"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  className="border-green-300 focus-visible:ring-green-500 text-center tracking-widest text-lg"
                />
              </div>
              {stage === "new-pin" && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-green-900">Confirm PIN</label>
                  <Input
                    type="password"
                    inputMode="numeric"
                    placeholder="••••"
                    maxLength={4}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                    className="border-green-300 focus-visible:ring-green-500 text-center tracking-widest text-lg"
                  />
                </div>
              )}
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pt-4">
          {stage === "phone" && (
            <Button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12"
            >
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          )}
          {stage === "otp" && (
            <>
              <Button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setStage("phone")}
                className="w-full"
              >
                Change number
              </Button>
            </>
          )}
          {stage === "pin" && (
            <Button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12"
            >
              {loading ? "Logging in..." : "Login Securely"}
            </Button>
          )}
          {stage === "new-pin" && (
            <Button
              onClick={handleSetPin}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12"
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          )}
          <p className="text-xs text-gray-500 text-center flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" /> PIN + OTP secured · documents encrypted at rest
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}