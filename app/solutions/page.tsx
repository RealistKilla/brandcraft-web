import { Metadata } from 'next';
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, Megaphone, ShoppingBag, Globe, Briefcase } from "lucide-react";

export const metadata: Metadata = {
  title: 'Solutions',
  description: 'Tailored marketing solutions for agencies and in-house teams',
};

const solutions = [
  {
    icon: Building2,
    title: "For Marketing Agencies",
    description: "Scale your agency operations with AI-powered tools that help you create better campaigns faster.",
    features: [
      "Multi-client persona management",
      "White-label reporting",
      "Team collaboration tools",
      "Client access portal"
    ]
  },
  {
    icon: Users,
    title: "For In-House Teams",
    description: "Streamline your marketing operations with integrated tools that work seamlessly with your existing workflow.",
    features: [
      "Custom brand guidelines",
      "Workflow automation",
      "Asset management",
      "Performance tracking"
    ]
  }
];

const industries = [
  {
    icon: Megaphone,
    title: "Digital Marketing",
    description: "Create data-driven digital campaigns that deliver results"
  },
  {
    icon: ShoppingBag,
    title: "E-commerce",
    description: "Drive sales with personalized marketing strategies"
  },
  {
    icon: Globe,
    title: "SaaS",
    description: "Acquire and retain customers with targeted campaigns"
  },
  {
    icon: Briefcase,
    title: "B2B",
    description: "Generate quality leads with account-based marketing"
  }
];

export default function SolutionsPage() {
  return (
    <div className="container max-w-7xl mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Solutions Tailored to Your Needs
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Whether you're an agency serving multiple clients or an in-house team, Brandcraft has the tools you need to succeed.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {solutions.map((solution, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <solution.icon className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">{solution.title}</h2>
              </div>
              <p className="text-muted-foreground mb-6">{solution.description}</p>
              <ul className="space-y-3">
                {solution.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-12">Industries We Serve</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((industry, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <industry.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{industry.title}</h3>
                </div>
                <p className="text-muted-foreground">{industry.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}