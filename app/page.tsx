import { Hero } from '@/components/sections/hero';
import { Features } from '@/components/sections/features';
import { CTA } from '@/components/sections/cta';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <Hero />
      <Features />
      <CTA />
    </div>
  );
}