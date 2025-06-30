import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createApplicationSchema = z.object({
  name: z.string().min(1, 'Application name is required'),
});

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

    // Fetch applications for the user's organization
    const applications = await prisma.application.findMany({
      where: { orgId: decoded.orgId },
      select: {
        id: true,
        name: true,
        applicationId: true,
        applicationKey: true,
        createdAt: true,
        creator: {
          select: {
            name: true,
            email: true,
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
        data: applications,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get applications error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    
    // Validate input
    const validatedData = createApplicationSchema.parse(body);

    // Generate unique application ID and key
    const generateId = () => {
      return 'app_' + Math.random().toString(36).substr(2, 16);
    };

    const generateKey = () => {
      return 'sk_' + Math.random().toString(36).substr(2, 32);
    };

    // Create application in database
    const application = await prisma.application.create({
      data: {
        name: validatedData.name,
        applicationId: generateId(),
        applicationKey: generateKey(),
        orgId: decoded.orgId,
        creatorId: decoded.id,
      },
      include: {
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Application created successfully',
        data: {
          id: application.id,
          name: application.name,
          applicationId: application.applicationId,
          applicationKey: application.applicationKey,
          createdAt: application.createdAt,
          creator: application.creator,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create application error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation error',
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}