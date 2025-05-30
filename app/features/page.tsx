import { Metadata } from 'next';
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Users, Target, MessageSquare, BarChart, Workflow, Sparkles, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: 'Features',
  description: 'Discover how Brandcraft helps marketing teams work smarter with AI-powered tools',
};

const features = [
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Transform raw data into actionable insights with our advanced AI algorithms that understand customer behavior patterns."
  },
  {
    icon: Users,
    title: "Dynamic Persona Creation",
    description: "Generate detailed, data-driven customer personas that evolve with your audience's changing preferences."
  },
  {
    icon: Target,
    title: "Strategic Campaign Planning",
    description: "Create targeted campaigns with AI-recommended strategies based on persona insights and market trends."
  },
  {
    icon: MessageSquare,
    title: "Content Generation",
    description: "Generate on-brand content across all channels, perfectly aligned with your campaign objectives and persona preferences."
  },
  {
    icon: BarChart,
    title: "Performance Analytics",
    description: "Track campaign performance in real-time with detailed analytics and AI-powered optimization suggestions."
  },
  {
    icon: Workflow,
    title: "Automated Workflows",
    description: "Streamline your marketing processes with automated task management and campaign execution."
  },
  {
    icon: Sparkles,
    title: "Smart Recommendations",
    description: "Get AI-powered recommendations for improving campaign performance and audience engagement."
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "Keep your data secure with enterprise-grade security features and compliance standards."
  }
];

export default function FeaturesPage() {
  return (
    <div className="container max-w-7xl mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Powerful Features for Modern Marketing Teams
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Discover how Brandcraft's AI-powered platform helps marketing teams create more effective campaigns with less effort.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}