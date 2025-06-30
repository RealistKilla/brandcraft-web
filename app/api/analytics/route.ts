import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: 'No authentication token found',
        },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid or expired token',
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('applicationId');

    if (!applicationId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Application ID is required',
        },
        { status: 400 }
      );
    }

    // Verify the application belongs to the user's organization
    const application = await prisma.application.findFirst({
      where: {
        applicationId,
        orgId: decoded.orgId,
      },
    });

    if (!application) {
      return NextResponse.json(
        {
          success: false,
          message: 'Application not found or access denied',
        },
        { status: 404 }
      );
    }

    // Get platform users for this organization
    const platformUsers = await prisma.platformUser.findMany({
      where: { orgId: decoded.orgId },
      orderBy: { signupDate: 'desc' },
    });

    // Calculate analytics
    const totalUsers = platformUsers.length;
    const activeUsers = platformUsers.filter(user => user.active).length;
    const totalRevenue = platformUsers.reduce((sum, user) => sum + (user.monthlySpendUsd || 0), 0);
    const avgSpend = totalUsers > 0 ? totalRevenue / totalUsers : 0;

    // Group users by signup date for chart data
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const signupsByDate = last30Days.map(date => {
      const count = platformUsers.filter(user => 
        user.signupDate.toISOString().split('T')[0] === date
      ).length;
      return {
        date,
        signups: count,
        revenue: platformUsers
          .filter(user => user.signupDate.toISOString().split('T')[0] === date)
          .reduce((sum, user) => sum + (user.monthlySpendUsd || 0), 0)
      };
    });

    // Industry breakdown
    const industryBreakdown = platformUsers.reduce((acc, user) => {
      const industry = user.industry || 'Unknown';
      acc[industry] = (acc[industry] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Age breakdown
    const ageBreakdown = platformUsers.reduce((acc, user) => {
      const age = user.age || 'Unknown';
      acc[age] = (acc[age] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Location breakdown
    const locationBreakdown = platformUsers.reduce((acc, user) => {
      const location = user.location || 'Unknown';
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Recent users
    const recentUsers = platformUsers.slice(0, 10).map(user => ({
      id: user.id,
      company: user.company,
      jobTitle: user.jobTitle,
      industry: user.industry,
      location: user.location,
      age: user.age,
      signupDate: user.signupDate,
      monthlySpendUsd: user.monthlySpendUsd,
      active: user.active,
    }));

    return NextResponse.json(
      {
        success: true,
        data: {
          overview: {
            totalUsers,
            activeUsers,
            totalRevenue,
            avgSpend,
          },
          chartData: signupsByDate,
          demographics: {
            industry: Object.entries(industryBreakdown).map(([name, count]) => ({ name, count })),
            age: Object.entries(ageBreakdown).map(([name, count]) => ({ name, count })),
            location: Object.entries(locationBreakdown).map(([name, count]) => ({ name, count })),
          },
          recentUsers,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get analytics error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}