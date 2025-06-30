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

    // Fetch content for the user's organization
    const content = await prisma.content.findMany({
      where: { orgId: decoded.orgId },
      select: {
        id: true,
        title: true,
        description: true,
        content: true,
        type: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
        campaign: {
          select: {
            id: true,
            name: true,
            persona: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Parse content JSON and add platform info
    const enrichedContent = content.map(item => {
      let parsedContent = null;
      let platform = 'Unknown';
      
      try {
        parsedContent = JSON.parse(item.content);
        platform = parsedContent.platform || 'Unknown';
      } catch (error) {
        console.error('Error parsing content JSON:', error);
      }

      return {
        ...item,
        platform,
        parsedContent,
      };
    });

    return NextResponse.json(
      {
        success: true,
        data: enrichedContent,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get content error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}