"use client";

import { useState } from "react";
import { FarmerDashboard } from "@/components/dashboard/FarmerDashboard";
import { LoginForm } from "@/components/auth/LoginForm";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {isLoggedIn ? (
        <FarmerDashboard />
      ) : (
        <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
}
