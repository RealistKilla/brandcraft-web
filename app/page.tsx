import { Hero } from '@/components/sections/hero';
import { Features } from '@/components/sections/features';
import { CTA } from '@/components/sections/cta';
"use client";

import { useEffect } from "react";
import { useAuth } from '@/components/providers/auth-provider';
import { useRouter } from "next/navigation";
export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <Hero />
      <Features />
      <CTA />
    </div>
  );
}