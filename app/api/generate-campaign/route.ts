import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

// Schema for the AI-generated campaign that matches Prisma schema
const campaignSchema = z.object({
  name: z
    .string()
    .describe(
      'A compelling campaign name (e.g., "Tech Professional Engagement Drive")'
    ),
  description: z
    .string()
    .describe("A detailed description of the campaign objectives and approach"),
  strategy: z
    .string()
    .describe(
      "A comprehensive marketing strategy including channels, messaging, timeline, and tactics"
    ),
  budget: z
    .number()
    .optional()
    .describe("Suggested budget in USD for this campaign"),
  startDate: z
    .string()
    .optional()
    .describe("Suggested start date in ISO format"),
  endDate: z.string().optional().describe("Suggested end date in ISO format"),
});

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "No authentication token found",
        },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired token",
        },
        { status: 401 }
      );
    }

    const { personaId } = await request.json();

    if (!personaId) {
      return NextResponse.json(
        {
          success: false,
          message: "Persona ID is required",
        },
        { status: 400 }
      );
    }

    // Verify the persona belongs to the user's organization
    const persona = await prisma.persona.findFirst({
      where: {
        id: personaId,
        orgId: decoded.orgId,
      },
    });

    if (!persona) {
      return NextResponse.json(
        {
          success: false,
          message: "Persona not found or access denied",
        },
        { status: 404 }
      );
    }

    // Generate campaign using Gemini AI
    const result = await generateObject({
      model: google("gemini-1.5-pro"),
      schema: campaignSchema,
      prompt: `
        You are a marketing strategist tasked with creating a comprehensive marketing campaign based on a detailed customer persona.
        
        Based on the following persona data, create a targeted marketing campaign:
        
        PERSONA DETAILS:
        Name: ${persona.name}
        Description: ${persona.description}
        
        DEMOGRAPHICS:
        ${JSON.stringify(persona.demographics, null, 2)}
        
        BEHAVIORS:
        ${JSON.stringify(persona.behaviors, null, 2)}
        
        PREFERENCES:
        ${JSON.stringify(persona.preferences, null, 2)}
        
        Create a campaign that:
        1. Aligns with this persona's communication preferences and behaviors
        2. Addresses their pain points and motivations
        3. Uses appropriate channels and messaging tone
        4. Includes specific tactics and timeline
        5. Suggests a realistic budget range
        6. Please adhere to a date structure that is compatible with Node JS Date objects.

        The strategy should be detailed and actionable, including:
        - Target channels (based on their preferences)
        - Key messaging themes
        - Content types and formats
        - Timeline and phases
        - Success metrics
        - Budget allocation suggestions
        
        Make the campaign practical and executable for a marketing team.
      `,
    });

    // Save the generated campaign to the database
    const savedCampaign = await prisma.campaign.create({
      data: {
        name: result.object.name,
        description: result.object.description,
        strategy: result.object.strategy,
        budget: result.object.budget,
        startDate: result.object.startDate
          ? new Date(result.object.startDate)
          : null,
        endDate: result.object.endDate ? new Date(result.object.endDate) : null,
        status: "DRAFT",
        orgId: decoded.orgId,
        creatorId: decoded.id,
        personaId: personaId,
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
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Campaign generated successfully",
        data: {
          id: savedCampaign.id,
          name: savedCampaign.name,
          description: savedCampaign.description,
          strategy: savedCampaign.strategy,
          status: savedCampaign.status,
          budget: savedCampaign.budget,
          startDate: savedCampaign.startDate,
          endDate: savedCampaign.endDate,
          createdAt: savedCampaign.createdAt,
          creator: savedCampaign.creator,
          persona: savedCampaign.persona,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Generate campaign error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate campaign",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
