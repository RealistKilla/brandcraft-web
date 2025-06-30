import { Metadata } from "next";
import Link from "next/link";
import { SignInForm } from "@/components/forms/sign-in-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

export default function SignInPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - City illustration - 67% on desktop, hidden on mobile */}
      <div className="hidden lg:flex lg:w-2/3 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-64">
          <svg
            viewBox="0 0 800 400"
            className="w-full h-full text-gray-600"
            fill="currentColor"
          >
            {/* City skyline silhouette */}
            <rect x="50" y="200" width="40" height="200" />
            <rect x="100" y="150" width="50" height="250" />
            <rect x="160" y="180" width="35" height="220" />
            <rect x="200" y="120" width="60" height="280" />
            <rect x="270" y="160" width="45" height="240" />
            <rect x="320" y="100" width="55" height="300" />
            <rect x="380" y="140" width="40" height="260" />
            <rect x="430" y="90" width="65" height="310" />
            <rect x="500" y="130" width="50" height="270" />
            <rect x="560" y="170" width="45" height="230" />
            <rect x="610" y="110" width="55" height="290" />
            <rect x="670" y="150" width="40" height="250" />
            <rect x="720" y="180" width="50" height="220" />
            
            {/* Building details */}
            <rect x="110" y="160" width="8" height="8" className="text-yellow-400" />
            <rect x="125" y="170" width="8" height="8" className="text-yellow-400" />
            <rect x="110" y="185" width="8" height="8" className="text-yellow-400" />
            <rect x="220" y="140" width="10" height="10" className="text-yellow-400" />
            <rect x="240" y="155" width="10" height="10" className="text-yellow-400" />
            <rect x="330" y="120" width="12" height="12" className="text-yellow-400" />
            <rect x="350" y="140" width="12" height="12" className="text-yellow-400" />
            <rect x="450" y="110" width="15" height="15" className="text-yellow-400" />
            <rect x="470" y="135" width="15" height="15" className="text-yellow-400" />
          </svg>
        </div>
      </div>

      {/* Right side - Form - 33% on desktop, full width on mobile */}
      <div className="w-full lg:w-1/3 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h1>
            <p className="text-muted-foreground">Sign in to your account to continue</p>
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