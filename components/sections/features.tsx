"use client";

import { useEffect } from "react";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  Shield, 
  Smartphone, 
  Layers 
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Built on Next.js 15 with the App Router for optimal performance and SEO."
  },
  {
    icon: Shield,
    title: "Type Safe",
    description:
      "Fully typed with TypeScript for better developer experience and fewer bugs."
  },
  {
    icon: Smartphone,
    title: "Responsive Design",
    description:
      "Beautiful on all devices with a mobile-first approach and responsive components."
  },
  {
    icon: Layers,
    title: "Component Library",
    description:
      "Built with shadcn/ui components that are accessible, customizable, and reusable."
  }
];

export function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  return (
    <section
      ref={ref}
      className="w-full py-16 md:py-24 lg:py-32 bg-muted/50"
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
              Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Everything you need to build modern web applications
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Our template comes with all the tools and components you need to create
              beautiful, responsive, and accessible web applications.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center space-y-4 rounded-lg border p-6 bg-background shadow-sm"
            >
              <div className="rounded-full bg-primary/10 p-3">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-center text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}