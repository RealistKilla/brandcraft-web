import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/auth-server';
import { Hero } from '@/components/sections/hero';
import { Features } from '@/components/sections/features';
import { CTA } from '@/components/sections/cta';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const user = await getServerUser();
  
  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="flex flex-col items-center">
      <Hero />
      <Features />
      <CTA />
    </div>
  );
}