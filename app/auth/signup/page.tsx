import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerUser } from "@/lib/auth-server";
import { SignUpFlow } from "@/components/forms/sign-up-flow";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a new account",
};

export default async function SignUpPage() {
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
          <SignUpFlow />
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="font-medium text-primary hover:underline transition-colors"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
