"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tractor } from "lucide-react";

// Form Schema Definition
const loginSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, {
    message: "Please enter a valid 10-digit mobile number.",
  }),
  pin: z.string().length(4, {
    message: "PIN must be exactly 4 digits.",
  }),
});

export function LoginForm({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false);

  // Initialize React Hook Form with Zod Resolver
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      pin: "",
    },
  });

  // Submit Handler
  function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    // Mock API call delay
    setTimeout(() => {
      setIsLoading(false);
      console.log(values);
      onLoginSuccess();
    }, 1500);
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-md border-green-200 shadow-lg">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-2">
            <Tractor className="h-8 w-8 text-green-700" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-900">Kisan Login</CardTitle>
          <CardDescription className="text-gray-600">
            Enter your mobile number and 4-digit PIN to access your schemes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-green-900 font-semibold">Mobile Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. 9876543210" 
                        maxLength={10} 
                        className="border-green-300 focus-visible:ring-green-500" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-green-900 font-semibold">4-Digit PIN</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••" 
                        maxLength={4}
                        className="border-green-300 focus-visible:ring-green-500 text-center tracking-widest text-lg" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 text-lg rounded-xl"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Login securely"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-green-100 pt-4">
          <p className="text-sm text-gray-500">
            Protected by end-to-end encryption.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
