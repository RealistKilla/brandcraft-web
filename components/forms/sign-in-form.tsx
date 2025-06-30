"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/components/providers/auth-provider";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { refreshUser } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const response = await api.auth.signIn({
        email: values.email,
        password: values.password,
      });

      toast({
        title: "Success",
        description: "Welcome back!",
      });
      
      // Refresh user data to update auth state
      await refreshUser();
      router.push("/dashboard");
    } catch (error) {
      console.error("Sign in error:", error);
      
      let errorMessage = "Invalid email or password.";
      
      if (error instanceof ApiError) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Email Address"
                    type="email"
                    className="bg-muted border-0 rounded-lg py-3 px-4 placeholder:text-muted-foreground"
                    {...field}
                  />
                  {form.formState.errors.email && (
                    <p className="text-xs text-destructive mt-1 italic">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Password"
                    type="password"
                    className="bg-muted border-0 rounded-lg py-3 px-4 placeholder:text-muted-foreground"
                    {...field}
                  />
                  {form.formState.errors.password && (
                    <p className="text-xs text-destructive mt-1 italic">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full py-3 rounded-lg font-medium" 
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </Form>
  );
}