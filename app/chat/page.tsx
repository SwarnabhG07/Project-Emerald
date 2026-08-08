"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Send, User, Sprout } from "lucide-react";

export default function ChatPage() {
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    {
      role: 'bot',
      text: "Welcome to AgriPortal! 🌱 How can we assist you today? You can ask me about eligible schemes, crop diseases, or farming best practices."
    }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput("");
    
    // Mock bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: "I'm a demo assistant. Soon, I will be connected to an AI to provide you with expert agricultural advice and support!" 
      }]);
    }, 1000);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-[#0a0a0a] transition-colors duration-300 font-sans overflow-hidden">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col min-h-0">
        {/* Chat Container */}
        <div className="flex-1 bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/10 rounded-3xl shadow-xl overflow-hidden flex flex-col">
          
          {/* Header */}
          <div className="h-16 bg-green-50 dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-white/5 flex items-center px-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 dark:bg-[#d4f826]/10 p-2 rounded-xl shrink-0">
                <Sprout className="h-5 w-5 text-green-600 dark:text-[#d4f826]" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">AgriPortal Assistant</h2>
                <p className="text-xs text-green-600 dark:text-[#d4f826] font-medium">Online</p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 dark:bg-[#0a0a0a]/50 flex flex-col gap-6">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex items-end gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' 
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' 
                    : 'bg-green-100 dark:bg-[#d4f826]/10 text-green-600 dark:text-[#d4f826]'
                }`}>
                  {msg.role === 'user' ? <User className="h-4 w-4" /> : <Sprout className="h-4 w-4" />}
                </div>
                
                <div className={`max-w-[80%] md:max-w-[70%] p-4 text-sm md:text-base shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-600 dark:bg-blue-600 text-white rounded-2xl rounded-br-sm'
                    : 'bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 rounded-2xl rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-[#111111] border-t border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2 max-w-4xl mx-auto">
              <input 
                type="text" 
                placeholder="Type your message..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 h-14 px-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-[#d4f826] transition-all text-base"
              />
              <Button 
                onClick={handleSend}
                size="icon" 
                className="h-14 w-14 rounded-2xl bg-green-600 hover:bg-green-700 dark:bg-[#d4f826] dark:hover:bg-[#bce015] text-white dark:text-black shrink-0 shadow-lg dark:shadow-none transition-all"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
