"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/components/providers/auth-provider";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

const WaitlistForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { refreshUser } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      await api.waitlist.join({
        email: values.email,
      });

      toast({
        title: "Success",
        description: "Successfully added to waitlist!",
      });
      form.reset();
    } catch (error) {
      console.error("Sign in error:", error);

      toast({
        title: "Error",
        description:
          error instanceof ApiError
            ? error.message
            : "Something went wrong. Please try again.",
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

        <Button
          type="submit"
          className="w-full py-3 rounded-lg font-medium"
          disabled={isLoading}
        >
          {isLoading ? "Joining Waitlist..." : "Join Waitlist"}
        </Button>
      </form>
    </Form>
  );
};
export default WaitlistForm;
