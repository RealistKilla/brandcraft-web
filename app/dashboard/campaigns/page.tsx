import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Target, Calendar, DollarSign, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Campaigns',
  description: 'Manage your marketing campaigns and track performance',
};

const campaigns = [
  {
    id: '1',
    name: 'Summer Product Launch',
    description: 'Promoting our new product line for the summer season',
    status: 'active',
    persona: 'Tech-Savvy Millennials',
    budget: '$5,000',
    spent: '$2,340',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    performance: {
      impressions: '125K',
      clicks: '3.2K',
      conversions: '156',
      ctr: '2.56%'
    }
  },
  {
    id: '2',
    name: 'B2B Lead Generation',
    description: 'Targeting small business owners for our SaaS platform',
    status: 'draft',
    persona: 'Small Business Owners',
    budget: '$3,500',
    spent: '$0',
    startDate: '2024-07-15',
    endDate: '2024-09-15',
    performance: {
      impressions: '0',
      clicks: '0',
      conversions: '0',
      ctr: '0%'
    }
  },
  {
    id: '3',
    name: 'Creative Portfolio Showcase',
    description: 'Showcasing our design tools to creative professionals',
    status: 'completed',
    persona: 'Creative Professionals',
    budget: '$2,000',
    spent: '$1,890',
    startDate: '2024-04-01',
    endDate: '2024-05-31',
    performance: {
      impressions: '89K',
      clicks: '2.1K',
      conversions: '98',
      ctr: '2.36%'
    }
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'draft':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'completed':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    case 'paused':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  }
};

export default function CampaignsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">
            Create, manage, and track your marketing campaigns across all channels.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,500</div>
            <p className="text-xs text-muted-foreground">
              Across all campaigns
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. CTR</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.46%</div>
            <p className="text-xs text-muted-foreground">
              +0.3% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{campaign.name}</CardTitle>
                  <CardDescription>{campaign.description}</CardDescription>
                </div>
                <Badge className={getStatusColor(campaign.status)}>
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Target Persona</h4>
                  <p className="text-sm text-muted-foreground">{campaign.persona}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Budget</h4>
                  <p className="text-sm text-muted-foreground">
                    {campaign.spent} / {campaign.budget}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Duration</h4>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Performance</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>{campaign.performance.impressions} impressions</p>
                    <p>{campaign.performance.clicks} clicks ({campaign.performance.ctr})</p>
                    <p>{campaign.performance.conversions} conversions</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}