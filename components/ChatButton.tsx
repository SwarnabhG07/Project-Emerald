"use client";

import { useState } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export function ChatButton() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (pathname === "/login" || pathname === "/onboarding") {
    return null;
  }

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] max-h-[80vh] bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl z-[100] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          {/* Header */}
          <div className="h-16 bg-green-600 dark:bg-[#111111] border-b border-transparent dark:border-white/10 flex items-center justify-between px-4 text-white">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-white dark:text-[#d4f826]" />
              <span className="font-semibold text-lg text-white">Chat with us</span>
            </div>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 dark:bg-[#0a0a0a] flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-[#d4f826]/10 flex items-center justify-center shrink-0">
                <MessageSquare className="h-4 w-4 text-green-600 dark:text-[#d4f826]" />
              </div>
              <div className="bg-white dark:bg-[#1a1a1a] p-3 rounded-2xl rounded-tl-sm border border-slate-100 dark:border-white/5 shadow-sm text-sm text-slate-700 dark:text-slate-300">
                Welcome to AgriPortal! 🌱<br /><br />
                How can we assist you today?
              </div>
            </div>
          </div>
          
          {/* Input Area */}
          <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a]">
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Type your message..." 
                className="flex-1 h-10 px-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-[#d4f826] transition-all text-sm"
              />
              <Button size="icon" className="h-10 w-10 rounded-xl bg-green-600 hover:bg-green-700 dark:bg-[#d4f826] dark:hover:bg-[#bce015] text-white dark:text-black shrink-0 shadow-md dark:shadow-none">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <Button 
        className={`fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl bg-green-600 hover:bg-green-700 dark:bg-[#d4f826] dark:hover:bg-[#bce015] text-white dark:text-black z-[100] flex items-center justify-center transition-all duration-300 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100 hover:scale-110'}`}
        size="icon"
        onClick={() => setIsOpen(true)}
      >
        <MessageSquare className="h-6 w-6" />
        <span className="sr-only">Chat with us</span>
      </Button>
    </>
  );
}
