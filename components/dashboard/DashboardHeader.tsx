import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";

interface DashboardHeaderProps {
  isOffline?: boolean;
}

export function DashboardHeader({ isOffline = false }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm md:px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold tracking-tight text-green-800">
          AgriScheme Matcher
        </h1>
        {isOffline ? (
          <Badge variant="secondary" className="flex gap-1 bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <WifiOff className="h-3 w-3" />
            <span className="hidden sm:inline">Offline (Sync Pending)</span>
          </Badge>
        ) : (
          <Badge variant="outline" className="flex gap-1 border-green-200 bg-green-50 text-green-700">
            <Wifi className="h-3 w-3" />
            <span className="hidden sm:inline">Online</span>
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden flex-col items-end text-sm md:flex">
          <span className="font-semibold">Ramesh Kumar</span>
          <span className="text-xs text-muted-foreground">Kisan ID: 1049284</span>
        </div>
        <Avatar>
          <AvatarImage src="https://i.pravatar.cc/150?u=ramesh" alt="Farmer Profile" />
          <AvatarFallback>RK</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
