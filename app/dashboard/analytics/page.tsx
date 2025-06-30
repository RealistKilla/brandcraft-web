"use client";

import { useState, useEffect } from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AnalyticsChart } from '@/components/dashboard/analytics-chart';
import { DemographicsChart } from '@/components/dashboard/demographics-chart';
import { RecentUsersTable } from '@/components/dashboard/recent-users-table';
import { api, ApiError } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { Users, DollarSign, TrendingUp, Activity, Brain, Sparkles } from 'lucide-react';

interface Application {
  id: string;
  name: string;
  applicationId: string;
}

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalRevenue: number;
    avgSpend: number;
  };
  chartData: Array<{
    date: string;
    signups: number;
    revenue: number;
  }>;
  demographics: {
    industry: Array<{ name: string; count: number }>;
    age: Array<{ name: string; count: number }>;
    location: Array<{ name: string; count: number }>;
  };
  recentUsers: Array<{
    id: string;
    company: string | null;
    jobTitle: string | null;
    industry: string | null;
    location: string | null;
    age: string | null;
    signupDate: string;
    monthlySpendUsd: number | null;
    active: boolean;
  }>;
}

export default function AnalyticsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<string>('');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoadingApps, setIsLoadingApps] = useState(true);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [isGeneratingPersona, setIsGeneratingPersona] = useState(false);

  // Fetch applications on component mount
  useEffect(() => {
    fetchApplications();
  }, []);

  // Fetch analytics when application is selected
  useEffect(() => {
    if (selectedApplication) {
      fetchAnalytics(selectedApplication);
    }
  }, [selectedApplication]);

  const fetchApplications = async () => {
    try {
      setIsLoadingApps(true);
      const response = await api.applications.getAll();
      const apps = response.data || [];
      setApplications(apps);
      
      // Auto-select first application if available
      if (apps.length > 0) {
        setSelectedApplication(apps[0].applicationId);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      toast({
        title: "Error",
        description: "Failed to load applications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingApps(false);
    }
  };

  const fetchAnalytics = async (applicationId: string) => {
    try {
      setIsLoadingAnalytics(true);
      const response = await api.analytics.getData(applicationId);
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      
      let errorMessage = "Failed to load analytics data. Please try again.";
      
      if (error instanceof ApiError) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  const handleGeneratePersona = async () => {
    if (!selectedApplication) {
      toast({
        title: "Error",
        description: "Please select an application first.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingPersona(true);

    try {
      const response = await api.personas.generate({
        applicationId: selectedApplication,
      });

      toast({
        title: "Persona Generated!",
        description: `"${response.data.name}" has been created based on your analytics data.`,
      });
    } catch (error) {
      console.error('Failed to generate persona:', error);
      
      let errorMessage = "Failed to generate persona. Please try again.";
      
      if (error instanceof ApiError) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPersona(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (isLoadingApps) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-muted animate-pulse rounded w-32 mb-2"></div>
            <div className="h-4 bg-muted animate-pulse rounded w-64"></div>
          </div>
          <div className="h-10 bg-muted animate-pulse rounded w-48"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted animate-pulse rounded w-24"></div>
                <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted animate-pulse rounded w-20 mb-2"></div>
                <div className="h-3 bg-muted animate-pulse rounded w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Detailed analytics and performance metrics for your applications.
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-6 w-24 h-24 flex items-center justify-center mb-4">
              <Activity className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No applications found</h3>
            <p className="text-muted-foreground text-center max-w-md">
              You need to create at least one application to view analytics data. 
              Go to the Applications page to create your first application.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Detailed analytics and performance metrics for your applications.
          </p>
        </div>
        <Select value={selectedApplication} onValueChange={setSelectedApplication}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select an application" />
          </SelectTrigger>
          <SelectContent>
            {applications.map((app) => (
              <SelectItem key={app.applicationId} value={app.applicationId}>
                {app.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedApplication && analyticsData && (
          <Button 
            onClick={handleGeneratePersona}
            disabled={isGeneratingPersona}
            className="flex items-center gap-2"
          >
            {isGeneratingPersona ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate AI Persona
              </>
            )}
          </Button>
        )}
      </div>

      {isLoadingAnalytics ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted animate-pulse rounded w-24"></div>
                <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted animate-pulse rounded w-20 mb-2"></div>
                <div className="h-3 bg-muted animate-pulse rounded w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : analyticsData ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(analyticsData.overview.totalUsers)}</div>
                <p className="text-xs text-muted-foreground">
                  Platform users registered
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(analyticsData.overview.activeUsers)}</div>
                <p className="text-xs text-muted-foreground">
                  {analyticsData.overview.totalUsers > 0 
                    ? `${Math.round((analyticsData.overview.activeUsers / analyticsData.overview.totalUsers) * 100)}% of total users`
                    : 'No users yet'
                  }
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(analyticsData.overview.totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">
                  Monthly recurring revenue
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Spend</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(analyticsData.overview.avgSpend)}</div>
                <p className="text-xs text-muted-foreground">
                  Per user per month
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="demographics">Demographics</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Signups & Revenue</CardTitle>
                  <CardDescription>
                    Daily user signups and revenue over the last 30 days.
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <AnalyticsChart data={analyticsData.chartData} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="demographics" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Industry Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DemographicsChart 
                      data={analyticsData.demographics.industry} 
                      type="industry"
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Age Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DemographicsChart 
                      data={analyticsData.demographics.age} 
                      type="age"
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Location Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DemographicsChart 
                      data={analyticsData.demographics.location} 
                      type="location"
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>
                    Latest users who signed up for your platform.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentUsersTable users={analyticsData.recentUsers} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-6 w-24 h-24 flex items-center justify-center mb-4">
              <Activity className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No data available</h3>
            <p className="text-muted-foreground text-center max-w-md">
              No analytics data is available for the selected application yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}