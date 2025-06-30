import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createCampaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required'),
  description: z.string().min(1, 'Description is required'),
  strategy: z.string().min(1, 'Strategy is required'),
  personaId: z.string().min(1, 'Persona ID is required'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.number().optional(),
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
    const validatedData = createCampaignSchema.parse(body);

    // Verify the persona belongs to the user's organization
    const persona = await prisma.persona.findFirst({
      where: {
        id: validatedData.personaId,
        orgId: decoded.orgId,
      },
    });

    if (!persona) {
      return NextResponse.json(
        {
          success: false,
          message: 'Persona not found or access denied',
        },
        { status: 404 }
      );
    }

    // Create campaign in database
    const campaign = await prisma.campaign.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        strategy: validatedData.strategy,
        personaId: validatedData.personaId,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : null,
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
        budget: validatedData.budget,
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
        persona: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Campaign created successfully',
        data: {
          id: campaign.id,
          name: campaign.name,
          description: campaign.description,
          strategy: campaign.strategy,
          status: campaign.status,
          startDate: campaign.startDate,
          endDate: campaign.endDate,
          budget: campaign.budget,
          createdAt: campaign.createdAt,
          creator: campaign.creator,
          persona: campaign.persona,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create campaign error:', error);
    
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