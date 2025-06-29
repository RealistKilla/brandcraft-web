import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Grid3X3, Zap, Settings, ExternalLink, Play, Pause } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Applications',
  description: 'Manage your connected applications and integrations',
};

const applications = [
  {
    id: '1',
    name: 'Facebook Ads Manager',
    description: 'Manage and optimize your Facebook advertising campaigns',
    category: 'Advertising',
    status: 'connected',
    lastSync: '2 minutes ago',
    campaigns: 5,
    icon: '📘'
  },
  {
    id: '2',
    name: 'Google Analytics',
    description: 'Track website traffic and user behavior analytics',
    category: 'Analytics',
    status: 'connected',
    lastSync: '5 minutes ago',
    campaigns: 8,
    icon: '📊'
  },
  {
    id: '3',
    name: 'Instagram Business',
    description: 'Manage Instagram posts and stories for your business',
    category: 'Social Media',
    status: 'connected',
    lastSync: '1 hour ago',
    campaigns: 3,
    icon: '📷'
  },
  {
    id: '4',
    name: 'LinkedIn Ads',
    description: 'Create and manage LinkedIn advertising campaigns',
    category: 'Advertising',
    status: 'disconnected',
    lastSync: 'Never',
    campaigns: 0,
    icon: '💼'
  },
  {
    id: '5',
    name: 'Mailchimp',
    description: 'Email marketing automation and newsletter management',
    category: 'Email Marketing',
    status: 'connected',
    lastSync: '30 minutes ago',
    campaigns: 2,
    icon: '📧'
  },
  {
    id: '6',
    name: 'Twitter Ads',
    description: 'Promote tweets and manage Twitter advertising',
    category: 'Social Media',
    status: 'error',
    lastSync: '2 days ago',
    campaigns: 1,
    icon: '🐦'
  }
];

const availableApps = [
  {
    id: '7',
    name: 'TikTok Ads Manager',
    description: 'Create engaging video ads on TikTok platform',
    category: 'Social Media',
    icon: '🎵'
  },
  {
    id: '8',
    name: 'Shopify',
    description: 'Sync product data and manage e-commerce campaigns',
    category: 'E-commerce',
    icon: '🛍️'
  },
  {
    id: '9',
    name: 'HubSpot',
    description: 'CRM integration for lead tracking and management',
    category: 'CRM',
    icon: '🎯'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'connected':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'disconnected':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    case 'error':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    case 'syncing':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'connected':
      return <Play className="h-3 w-3" />;
    case 'disconnected':
      return <Pause className="h-3 w-3" />;
    case 'error':
      return <Settings className="h-3 w-3" />;
    default:
      return <Settings className="h-3 w-3" />;
  }
};

export default function ApplicationsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground">
            Connect and manage your marketing tools and platforms in one place.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Browse Apps
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Apps</CardTitle>
            <Grid3X3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applications.filter(app => app.status === 'connected').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Out of {applications.length} total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applications.reduce((sum, app) => sum + app.campaigns, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all platforms
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sync Status</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applications.filter(app => app.status === 'connected').length}/
              {applications.filter(app => app.status !== 'disconnected').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Apps syncing properly
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Apps</CardTitle>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableApps.length}</div>
            <p className="text-xs text-muted-foreground">
              Ready to connect
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Connected Applications</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {applications.map((app) => (
              <Card key={app.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{app.icon}</div>
                      <div>
                        <CardTitle className="text-lg">{app.name}</CardTitle>
                        <CardDescription className="text-sm">{app.category}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(app.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(app.status)}
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </div>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{app.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Active Campaigns:</span>
                      <span className="font-medium">{app.campaigns}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Sync:</span>
                      <span className="font-medium">{app.lastSync}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    {app.status === 'connected' ? (
                      <>
                        <Button variant="outline" size="sm" className="flex-1">
                          Configure
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" className="flex-1">
                        {app.status === 'error' ? 'Reconnect' : 'Connect'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Available Applications</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availableApps.map((app) => (
              <Card key={app.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{app.icon}</div>
                    <div>
                      <CardTitle className="text-lg">{app.name}</CardTitle>
                      <CardDescription className="text-sm">{app.category}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{app.description}</p>
                  <Button size="sm" className="w-full">
                    <Plus className="mr-2 h-3 w-3" />
                    Connect App
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}