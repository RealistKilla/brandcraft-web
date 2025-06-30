import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerUser } from "@/lib/auth-server";
import { SignInForm } from "@/components/forms/sign-in-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

export default async function SignInPage() {
  const user = await getServerUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - City illustration - 67% on desktop, hidden on mobile */}
      <div className="hidden lg:flex lg:w-2/3 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-64"></div>
      </div>

      {/* Right side - Form - 33% on desktop, full width on mobile */}
      <div className="w-full lg:w-1/3 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <SignInForm />

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/auth/signup"
                className="font-medium text-primary hover:underline transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
