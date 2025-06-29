import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, Target, Brain } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Personas',
  description: 'Manage your customer personas and target audiences',
};

const personas = [
  {
    id: '1',
    name: 'Tech-Savvy Millennials',
    description: 'Young professionals interested in the latest technology trends',
    demographics: {
      ageRange: '25-35',
      income: '$50k-$80k',
      location: 'Urban areas'
    },
    interests: ['Technology', 'Startups', 'Social Media'],
    campaigns: 3,
    lastUpdated: '2 days ago'
  },
  {
    id: '2',
    name: 'Small Business Owners',
    description: 'Entrepreneurs looking to grow their businesses',
    demographics: {
      ageRange: '30-50',
      income: '$40k-$100k',
      location: 'Suburban/Urban'
    },
    interests: ['Business Growth', 'Marketing', 'Productivity'],
    campaigns: 5,
    lastUpdated: '1 week ago'
  },
  {
    id: '3',
    name: 'Creative Professionals',
    description: 'Designers, artists, and content creators',
    demographics: {
      ageRange: '22-40',
      income: '$35k-$70k',
      location: 'Urban areas'
    },
    interests: ['Design', 'Art', 'Content Creation'],
    campaigns: 2,
    lastUpdated: '3 days ago'
  }
];

export default function PersonasPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Personas</h1>
          <p className="text-muted-foreground">
            Create and manage customer personas to better understand your target audience.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Persona
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {personas.map((persona) => (
          <Card key={persona.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{persona.name}</CardTitle>
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-4 w-4 text-primary" />
                </div>
              </div>
              <CardDescription>{persona.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Demographics</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Age: {persona.demographics.ageRange}</p>
                    <p>Income: {persona.demographics.income}</p>
                    <p>Location: {persona.demographics.location}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Interests</h4>
                  <div className="flex flex-wrap gap-1">
                    {persona.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-xs"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Target className="h-3 w-3" />
                    {persona.campaigns} campaigns
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Updated {persona.lastUpdated}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Persona Insights
          </CardTitle>
          <CardDescription>
            Get AI-powered recommendations for your personas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted">
              <h4 className="font-medium mb-2">Recommended Persona</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Based on your recent campaign data, consider creating a persona for "Health-Conscious Consumers" 
                aged 28-45 who are interested in wellness and sustainable living.
              </p>
              <Button variant="outline" size="sm">
                Create Suggested Persona
              </Button>
            </div>
            
            <div className="p-4 rounded-lg bg-muted">
              <h4 className="font-medium mb-2">Persona Optimization</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Your "Tech-Savvy Millennials" persona could benefit from updated interests 
                based on recent engagement patterns.
              </p>
              <Button variant="outline" size="sm">
                Review Suggestions
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}