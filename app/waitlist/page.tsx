import { Metadata } from "next";

import WaitlistForm from "@/components/forms/waitlist-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

export default async function WaitlistPage() {
  return (
    <div className="min-h-screen w-screen flex">
      {/* Left side - City illustration - 67% on desktop, hidden on mobile */}
      <div className="hidden lg:flex lg:w-2/3 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-64"></div>
      </div>

      {/* Right side - Form - 33% on desktop, full width on mobile */}
      <div className="w-full lg:w-1/3 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome!</h1>
            <p className="text-muted-foreground">
              While we are working hard to launch an exciting new product, join
              our waitlist to be the first to know when we go live!
            </p>
          </div>

          <WaitlistForm />
        </div>
      </div>
    </div>
  );
}
