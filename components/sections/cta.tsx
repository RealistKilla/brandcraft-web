"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="w-full py-16 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-8 text-center"
        >
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-heading">
              Ready to get started?
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl font-dm-sans">
              Start building your next project with our modern Next.js 15
              template. It&apos;s fast, flexible, and designed for a great
              developer experience.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="font-heading" asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" className="font-heading" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
