"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-28 md:pt-36 lg:pt-40 pb-16 md:pb-20 lg:pb-24 overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none bg-gradient-to-b from-background via-background to-background/0 dark:from-background dark:via-background/80 dark:to-background/0"
        aria-hidden="true"
      />
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-screen bg-[radial-gradient(circle_500px_at_50%_200px,hsl(var(--hue)_100%_50%_/0.1),transparent)] animate-hue-shift " />

      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight md:leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Transform Your{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Marketing
            </span>{" "}
            with Artificial Intelligence
          </motion.h1>

          <motion.p
            className="mt-6 text-xl text-muted-foreground max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Create tailored social media posts, marketing strategies, and
            content that resonates with your target audience—all with the power
            of artificial intelligence.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button size="lg" className="h-12 px-8 font-medium rounded-full">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 font-medium rounded-full"
            >
              Watch Demo
            </Button>
          </motion.div>

          <motion.div
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            {["Twitter", "Instagram", "Facebook", "LinkedIn"].map(
              (platform) => (
                <div key={platform} className="flex flex-col items-center">
                  <p className="text-base font-medium text-muted-foreground">
                    {platform}
                  </p>
                </div>
              )
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
