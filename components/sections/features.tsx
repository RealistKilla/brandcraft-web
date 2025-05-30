"use client";

import { useEffect } from "react";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  Shield, 
  Smartphone, 
  Layers,
  Users,
  Target,
  MessageSquare,
  BarChart
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "AI Persona Creation",
    description:
      "Generate detailed customer personas from your existing data, uncovering valuable insights about your audience."
  },
  {
    icon: Target,
    title: "Campaign Strategy",
    description:
      "Create targeted marketing campaigns tailored to each persona, with AI-powered strategy recommendations."
  },
  {
    icon: MessageSquare,
    title: "Content Generation",
    description:
      "Generate on-brand content for all your marketing channels, perfectly aligned with your campaign objectives."
  },
  {
    icon: BarChart,
    title: "Performance Analytics",
    description:
      "Track campaign performance and get AI-powered insights to optimize your marketing efforts."
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