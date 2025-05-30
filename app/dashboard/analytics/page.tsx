import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnalyticsChart } from '@/components/dashboard/analytics-chart';
import { TopPages } from '@/components/dashboard/top-pages';

export const metadata: Metadata = {
  title: 'Analytics',
  description: 'Detailed analytics and performance metrics',
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Detailed metrics and insights about your application.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="visitors">Visitors</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Your application performance over the last 30 days.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <AnalyticsChart />
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Visitors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">+32.5K</div>
                <p className="text-xs text-muted-foreground">
                  +24% from last month
                </p>
                <div className="mt-4 h-[60px]">
                  {/* Mini chart would go here */}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Page Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">+143.8K</div>
                <p className="text-xs text-muted-foreground">
                  +16% from last month
                </p>
                <div className="mt-4 h-[60px]">
                  {/* Mini chart would go here */}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Bounce Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">42.2%</div>
                <p className="text-xs text-muted-foreground">
                  -8% from last month
                </p>
                <div className="mt-4 h-[60px]">
                  {/* Mini chart would go here */}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="visitors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visitor Demographics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Detailed visitor demographics would be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                User engagement metrics would be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Top Pages</CardTitle>
          <CardDescription>
            Your most visited pages in the last 30 days.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TopPages />
        </CardContent>
      </Card>
    </div>
  );
}