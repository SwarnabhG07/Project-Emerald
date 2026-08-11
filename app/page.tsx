"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [needsProfile, setNeedsProfile] = useState(false);

  function handleLoginSuccess(needsProfileSetup: boolean) {
    setNeedsProfile(needsProfileSetup);
    setIsLoggedIn(true);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {isLoggedIn ? (
        <FarmerDashboard
          initialNeedsProfile={needsProfile}
          onLogout={() => setIsLoggedIn(false)}
        />
      ) : (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}