import { Metadata } from 'next';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing for teams of all sizes',
};

const tiers = [
  {
    name: "Starter",
    price: "$99",
    description: "Perfect for small marketing teams getting started with AI",
    features: [
      "Up to 5 team members",
      "3 customer personas",
      "Basic campaign generation",
      "Standard analytics",
      "Email support"
    ]
  },
  {
    name: "Professional",
    price: "$199",
    description: "Ideal for growing marketing teams and small agencies",
    features: [
      "Up to 15 team members",
      "10 customer personas",
      "Advanced campaign generation",
      "Detailed analytics & reporting",
      "Priority support",
      "Custom branding",
      "API access"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large teams and agencies with complex needs",
    features: [
      "Unlimited team members",
      "Unlimited personas",
      "Custom AI model training",
      "Advanced security features",
      "24/7 dedicated support",
      "Custom integrations",
      "SLA guarantee",
      "Dedicated success manager"
    ]
  }
];

export default function PricingPage() {
  return (
    <div className="container max-w-7xl mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Choose the plan that's right for your team. All plans include a 14-day free trial.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {tiers.map((tier, index) => (
          <Card 
            key={index} 
            className={tier.popular ? "border-primary shadow-lg relative" : ""}
          >
            {tier.popular && (
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{tier.name}</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">{tier.price}</span>
                {tier.price !== "Custom" && <span className="text-muted-foreground">/month</span>}
              </div>
              <p className="text-muted-foreground mt-4">{tier.description}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/dashboard">
                  {tier.price === "Custom" ? "Contact Sales" : "Start Free Trial"}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Need a custom solution?</h2>
        <p className="text-muted-foreground mb-6">
          Contact our sales team for a custom plan tailored to your specific needs.
        </p>
        <Button variant="outline" asChild>
          <Link href="/contact">Contact Sales</Link>
        </Button>
      </div>
    </div>
  );
}