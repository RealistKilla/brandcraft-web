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

    // Fetch campaigns for the user's organization
    const campaigns = await prisma.campaign.findMany({
      where: { orgId: decoded.orgId },
      select: {
        id: true,
        name: true,
        description: true,
        strategy: true,
        status: true,
        startDate: true,
        endDate: true,
        budget: true,
        createdAt: true,
        updatedAt: true,
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
        persona: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            contents: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: campaigns,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get campaigns error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}