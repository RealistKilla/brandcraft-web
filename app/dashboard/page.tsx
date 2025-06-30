"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Overview } from '@/components/dashboard/overview';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { api, ApiError } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { Users, Target, FileText, Grid3X3 } from 'lucide-react';

interface OverviewData {
  overview: {
    totalApplications: number;
    totalCampaigns: number;
    totalPersonas: number;
    newUsersThisWeek: number;
    totalRevenue: number;
    totalPlatformUsers: number;
  };
  chartData: Array<{
    name: string;
    total: number;
  }>;
  recentActivity: Array<{
    id: string;
    jobTitle: string;
    location: string;
    age: string;
    industry: string;
    signupDate: string;
    monthlySpendUsd: number | null;
    active: boolean;
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const fetchOverviewData = async () => {
    try {
      setIsLoading(true);
      const response = await api.dashboard.getOverview();
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch overview data:', error);
      
      let errorMessage = "Failed to load dashboard data. Please try again.";
      
      if (error instanceof ApiError) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-8 bg-muted animate-pulse rounded w-32 mb-2"></div>
          <div className="h-4 bg-muted animate-pulse rounded w-64"></div>
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

  if (!data) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your account activity and performance.
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-6 w-24 h-24 flex items-center justify-center mb-4">
              <Grid3X3 className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No data available</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Unable to load dashboard data. Please try refreshing the page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your account activity and performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Grid3X3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.overview.totalApplications)}</div>
            <p className="text-xs text-muted-foreground">
              API applications created
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.overview.totalCampaigns)}</div>
            <p className="text-xs text-muted-foreground">
              Marketing campaigns
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Personas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.overview.totalPersonas)}</div>
            <p className="text-xs text-muted-foreground">
              Customer personas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Users This Week</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.overview.newUsersThisWeek)}</div>
            <p className="text-xs text-muted-foreground">
              Platform signups
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
              Monthly revenue from platform users over the last 12 months.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={data.chartData} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Platform Users</CardTitle>
            <CardDescription>
              New users who joined in the last 7 days ({data.overview.newUsersThisWeek} total).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity users={data.recentActivity} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}