import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createPersonaSchema = z.object({
  name: z.string().min(1, 'Persona name is required'),
  description: z.string().min(1, 'Description is required'),
  demographics: z.object({}).passthrough(),
  behaviors: z.object({}).passthrough(),
  preferences: z.object({}).passthrough(),
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

    // Fetch personas for the user's organization
    const personas = await prisma.persona.findMany({
      where: { orgId: decoded.orgId },
      select: {
        id: true,
        name: true,
        description: true,
        demographics: true,
        behaviors: true,
        preferences: true,
        createdAt: true,
        updatedAt: true,
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            campaigns: true,
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
        data: personas,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get personas error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

