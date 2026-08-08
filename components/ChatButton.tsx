"use client";

import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ChatButton() {
  return (
    <Button 
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl bg-green-600 hover:bg-green-700 dark:bg-[#d4f826] dark:hover:bg-[#bce015] text-white dark:text-black z-[100] flex items-center justify-center transition-transform hover:scale-110"
      size="icon"
      onClick={() => alert("Chat functionality coming soon!")}
    >
      <MessageSquare className="h-6 w-6" />
      <span className="sr-only">Chat with us</span>
    </Button>
  );
}
