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
    const validatedData = createPersonaSchema.parse(body);

    // Create persona in database
    const persona = await prisma.persona.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        demographics: validatedData.demographics,
        behaviors: validatedData.behaviors,
        preferences: validatedData.preferences,
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
        _count: {
          select: {
            campaigns: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Persona created successfully',
        data: {
          id: persona.id,
          name: persona.name,
          description: persona.description,
          demographics: persona.demographics,
          behaviors: persona.behaviors,
          preferences: persona.preferences,
          createdAt: persona.createdAt,
          updatedAt: persona.updatedAt,
          creator: persona.creator,
          _count: persona._count,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create persona error:', error);
    
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