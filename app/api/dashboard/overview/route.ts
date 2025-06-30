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

    // Get counts for the organization
    const [
      totalApplications,
      totalCampaigns,
      totalPersonas,
      totalPlatformUsers,
      newUsersThisWeek
    ] = await Promise.all([
      // Total applications
      prisma.application.count({
        where: { orgId: decoded.orgId }
      }),
      
      // Total campaigns
      prisma.campaign.count({
        where: { orgId: decoded.orgId }
      }),
      
      // Total personas
      prisma.persona.count({
        where: { orgId: decoded.orgId }
      }),
      
      // Total platform users
      prisma.platformUser.count({
        where: { orgId: decoded.orgId }
      }),
      
      // New users in the last week
      prisma.platformUser.findMany({
        where: {
          orgId: decoded.orgId,
          signupDate: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
          }
        },
        orderBy: { signupDate: 'desc' },
        take: 10,
        select: {
          id: true,
          jobTitle: true,
          location: true,
          age: true,
          industry: true,
          signupDate: true,
          monthlySpendUsd: true,
          active: true
        }
      })
    ]);

    // Calculate revenue data for the chart (last 12 months)
    const monthlyRevenue = [];
    const currentDate = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 1);
      
      const monthlyUsers = await prisma.platformUser.findMany({
        where: {
          orgId: decoded.orgId,
          signupDate: {
            gte: date,
            lt: nextMonth
          }
        },
        select: {
          monthlySpendUsd: true
        }
      });

      const revenue = monthlyUsers.reduce((sum, user) => sum + (user.monthlySpendUsd || 0), 0);
      
      monthlyRevenue.push({
        name: date.toLocaleDateString('en-US', { month: 'short' }),
        total: revenue
      });
    }

    // Calculate total revenue
    const allUsers = await prisma.platformUser.findMany({
      where: { orgId: decoded.orgId },
      select: { monthlySpendUsd: true }
    });
    
    const totalRevenue = allUsers.reduce((sum, user) => sum + (user.monthlySpendUsd || 0), 0);

    return NextResponse.json(
      {
        success: true,
        data: {
          overview: {
            totalApplications,
            totalCampaigns,
            totalPersonas,
            newUsersThisWeek: newUsersThisWeek.length,
            totalRevenue,
            totalPlatformUsers
          },
          chartData: monthlyRevenue,
          recentActivity: newUsersThisWeek.map(user => ({
            id: user.id,
            jobTitle: user.jobTitle || 'Unknown Position',
            location: user.location || 'Unknown Location',
            age: user.age || 'Unknown Age',
            industry: user.industry || 'Unknown Industry',
            signupDate: user.signupDate,
            monthlySpendUsd: user.monthlySpendUsd,
            active: user.active
          }))
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get overview error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}