import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

// Schema for platform-specific content generation
const contentSchema = z.object({
  title: z.string().describe('The title/headline for the content'),
  content: z.string().describe('The main content/copy for the platform'),
  imageDescription: z.string().describe('Detailed description of the ideal image/visual for this content'),
  altText: z.string().describe('Accessibility alt text for the image'),
  hashtags: z.array(z.string()).describe('Relevant hashtags for the platform'),
  callToAction: z.string().describe('Clear call-to-action for the audience'),
  postDescription: z.string().describe('Meta description or post summary'),
  targetAudience: z.string().describe('Specific audience segment this content targets'),
  bestPostingTime: z.string().describe('Recommended posting time for maximum engagement'),
  engagementStrategy: z.string().describe('Strategy to encourage engagement (likes, shares, comments)'),
});

const platformContentSchema = z.object({
  platforms: z.record(z.string(), contentSchema).describe('Content optimized for each specified platform')
});

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

    const { campaignId, title, platforms, additionalContext } = await request.json();

    if (!campaignId || !title || !platforms || platforms.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Campaign ID, title, and platforms are required',
        },
        { status: 400 }
      );
    }

    // Verify the campaign belongs to the user's organization
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: campaignId,
        orgId: decoded.orgId,
      },
      include: {
        persona: true,
      },
    });

    if (!campaign) {
      return NextResponse.json(
        {
          success: false,
          message: 'Campaign not found or access denied',
        },
        { status: 404 }
      );
    }

    // Generate platform-specific content using Gemini AI
    const result = await generateObject({
      model: google('gemini-1.5-pro'),
      schema: platformContentSchema,
      prompt: `
        You are a content marketing expert tasked with creating platform-specific content for a marketing campaign.
        
        CAMPAIGN DETAILS:
        Name: ${campaign.name}
        Description: ${campaign.description}
        Strategy: ${campaign.strategy}
        
        TARGET PERSONA:
        Name: ${campaign.persona.name}
        Description: ${campaign.persona.description}
        Demographics: ${JSON.stringify(campaign.persona.demographics, null, 2)}
        Behaviors: ${JSON.stringify(campaign.persona.behaviors, null, 2)}
        Preferences: ${JSON.stringify(campaign.persona.preferences, null, 2)}
        
        CONTENT REQUIREMENTS:
        Title/Theme: ${title}
        Platforms: ${platforms.join(', ')}
        Additional Context: ${additionalContext || 'None provided'}
        
        Create optimized content for each platform that:
        1. Aligns with the campaign strategy and persona preferences
        2. Follows platform-specific best practices and formats
        3. Uses appropriate tone and messaging for the target audience
        4. Includes platform-optimized visuals descriptions
        5. Incorporates relevant hashtags and engagement strategies
        
        Platform-specific guidelines:
        - Instagram: Visual-first, story-driven, lifestyle-focused, 2-3 hashtags in caption
        - Twitter/X: Concise, conversational, trending topics, 1-2 hashtags
        - LinkedIn: Professional, thought leadership, industry insights, minimal hashtags
        - Facebook: Community-focused, longer form, engaging questions, moderate hashtags
        - TikTok: Trendy, authentic, entertainment value, trending hashtags
        - YouTube: Educational, detailed descriptions, SEO-optimized, relevant tags
        
        Ensure each piece of content:
        - Speaks directly to the persona's pain points and motivations
        - Uses their preferred communication style
        - Includes compelling visuals descriptions
        - Has clear calls-to-action
        - Optimizes for platform algorithms and engagement
      `,
    });

    // Save each platform's content to the database
    const savedContent = [];
    
    for (const [platform, content] of Object.entries(result.object.platforms)) {
      const contentRecord = await prisma.content.create({
        data: {
          title: `${title} - ${platform}`,
          description: content.postDescription,
          content: JSON.stringify({
            platform,
            title: content.title,
            content: content.content,
            imageDescription: content.imageDescription,
            altText: content.altText,
            hashtags: content.hashtags,
            callToAction: content.callToAction,
            postDescription: content.postDescription,
            targetAudience: content.targetAudience,
            bestPostingTime: content.bestPostingTime,
            engagementStrategy: content.engagementStrategy,
          }),
          type: 'SOCIAL_POST',
          status: 'DRAFT',
          orgId: decoded.orgId,
          creatorId: decoded.id,
          campaignId: campaignId,
        },
        include: {
          creator: {
            select: {
              name: true,
              email: true,
            },
          },
          campaign: {
            select: {
              name: true,
            },
          },
        },
      });

      savedContent.push(contentRecord);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Content generated successfully',
        data: {
          contentCount: savedContent.length,
          platforms: platforms,
          content: savedContent.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            platform: JSON.parse(item.content).platform,
            createdAt: item.createdAt,
          })),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Generate content error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to generate content',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}