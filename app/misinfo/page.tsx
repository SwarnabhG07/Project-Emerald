"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, ShieldCheck, Search, Info } from "lucide-react";

export default function MisinfoCheckerPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<null | {
    score: number;
    status: 'Safe' | 'Suspicious' | 'Misinformation';
    analysis: string;
  }>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleCheck = () => {
    if (!text.trim()) return;
    setIsChecking(true);
    setResult(null);
    
    // Mocking an API call
    setTimeout(() => {
      setIsChecking(false);
      // Fake logic just for UI demonstration
      if (text.length > 50) {
        setResult({
          score: 85,
          status: 'Misinformation',
          analysis: "This message contains typical characteristics of a viral hoax. Claims about unverified government payouts or urgent warnings without credible sources are usually false."
        });
      } else {
        setResult({
          score: 15,
          status: 'Safe',
          analysis: "This text does not exhibit strong signs of misinformation based on our current database and linguistic patterns."
        });
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0a0a] transition-colors duration-300 font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-amber-100 dark:bg-amber-900/30 rounded-2xl mb-4">
            <ShieldCheck className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white tracking-tight mb-3 transition-colors">
            WhatsApp Misinformation Checker
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Received a forwarded message about a new scheme, crop disease, or alert? Paste it below to analyze its authenticity and protect your community from fake news.
          </p>
        </div>

        <Card className="border-slate-200 dark:border-white/10 bg-white dark:bg-[#111111] shadow-xl rounded-3xl overflow-hidden mb-8">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-4">
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Paste the forwarded message here
              </label>
              <textarea
                id="message"
                rows={6}
                className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/50 p-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-[#d4f826] transition-all resize-none"
                placeholder="e.g. Forwarded as received: Government is giving free tractors to everyone who clicks this link..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button 
                onClick={handleCheck}
                disabled={!text.trim() || isChecking}
                className="bg-green-600 hover:bg-green-700 dark:bg-[#d4f826] dark:hover:bg-[#bce015] text-white dark:text-black font-semibold rounded-xl px-8 h-12 shadow-lg dark:shadow-none transition-all w-full sm:w-auto"
              >
                {isChecking ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full border-2 border-white dark:border-black border-t-transparent animate-spin"></div>
                    Analyzing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Check Message
                  </span>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
            <Card className={`border-2 rounded-3xl overflow-hidden shadow-xl ${
              result.status === 'Misinformation' 
                ? 'border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20' 
                : 'border-green-200 dark:border-green-900/50 bg-green-50/50 dark:bg-green-950/20'
            }`}>
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <div className={`p-4 rounded-2xl shrink-0 ${
                    result.status === 'Misinformation'
                      ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400'
                      : 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400'
                  }`}>
                    {result.status === 'Misinformation' ? <AlertTriangle className="h-8 w-8" /> : <ShieldCheck className="h-8 w-8" />}
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className={`text-xl font-bold ${
                        result.status === 'Misinformation' ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'
                      }`}>
                        {result.status === 'Misinformation' ? 'High Risk of Misinformation' : 'Likely Safe'}
                      </h3>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                        Confidence Score: {result.score}%
                      </p>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full h-2 bg-slate-200 dark:bg-black/50 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          result.status === 'Misinformation' ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${result.score}%` }}
                      ></div>
                    </div>

                    <div className="bg-white/60 dark:bg-black/40 p-4 rounded-2xl border border-slate-200 dark:border-white/5 mt-4">
                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                          {result.analysis}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
