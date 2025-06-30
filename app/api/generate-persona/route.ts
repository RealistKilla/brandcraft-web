import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

// Schema for the AI-generated persona that matches Prisma schema
const personaSchema = z.object({
  name: z.string().describe('A descriptive name for the persona (e.g., "Tech-Savvy Millennials")'),
  description: z.string().describe('A brief description of this persona'),
  demographics: z.object({
    ageRange: z.string().describe('Age range (e.g., "25-35")'),
    income: z.string().describe('Income range (e.g., "$50k-$80k")'),
    location: z.string().describe('Primary location type (e.g., "Urban areas", "Suburban")'),
    education: z.string().describe('Education level (e.g., "Bachelor\'s degree", "High school")'),
    occupation: z.string().describe('Common job types (e.g., "Software developers", "Marketing professionals")')
  }).describe('Demographic information about this persona'),
  behaviors: z.object({
    digitalHabits: z.array(z.string()).describe('Digital behavior patterns'),
    purchasingBehavior: z.array(z.string()).describe('How they make purchasing decisions'),
    communicationPreferences: z.array(z.string()).describe('Preferred communication channels'),
    painPoints: z.array(z.string()).describe('Common challenges they face'),
    motivations: z.array(z.string()).describe('What drives their decisions')
  }).describe('Behavioral patterns and preferences'),
  preferences: z.object({
    contentTypes: z.array(z.string()).describe('Types of content they prefer'),
    channels: z.array(z.string()).describe('Marketing channels they respond to'),
    messagingTone: z.string().describe('Preferred tone of communication'),
    valuePropositions: z.array(z.string()).describe('What value propositions resonate with them'),
    brandAttributes: z.array(z.string()).describe('Brand characteristics they prefer')
  }).describe('Marketing and content preferences')
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

    const { applicationId } = await request.json();

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

    // Get analytics data for the application
    const platformUsers = await prisma.platformUser.findMany({
      where: { orgId: decoded.orgId },
      orderBy: { signupDate: 'desc' },
    });

    if (platformUsers.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'No platform user data available to generate persona',
        },
        { status: 400 }
      );
    }

    // Prepare analytics summary for AI
    const totalUsers = platformUsers.length;
    const activeUsers = platformUsers.filter(user => user.active).length;
    const totalRevenue = platformUsers.reduce((sum, user) => sum + (user.monthlySpendUsd || 0), 0);
    const avgSpend = totalUsers > 0 ? totalRevenue / totalUsers : 0;

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

    // Job title breakdown
    const jobTitleBreakdown = platformUsers.reduce((acc, user) => {
      const jobTitle = user.jobTitle || 'Unknown';
      acc[jobTitle] = (acc[jobTitle] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Create analytics summary for AI prompt
    const analyticsData = {
      totalUsers,
      activeUsers,
      totalRevenue,
      avgSpend,
      topIndustries: Object.entries(industryBreakdown)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([industry, count]) => ({ industry, count, percentage: (count / totalUsers * 100).toFixed(1) })),
      topAgeGroups: Object.entries(ageBreakdown)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([age, count]) => ({ age, count, percentage: (count / totalUsers * 100).toFixed(1) })),
      topLocations: Object.entries(locationBreakdown)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([location, count]) => ({ location, count, percentage: (count / totalUsers * 100).toFixed(1) })),
      topJobTitles: Object.entries(jobTitleBreakdown)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([jobTitle, count]) => ({ jobTitle, count, percentage: (count / totalUsers * 100).toFixed(1) })),
      recentSignups: platformUsers.slice(0, 10).map(user => ({
        jobTitle: user.jobTitle,
        industry: user.industry,
        location: user.location,
        age: user.age,
        monthlySpend: user.monthlySpendUsd,
        signupDate: user.signupDate
      }))
    };

    // Generate persona using Gemini AI
    const result = await generateObject({
      model: google('gemini-1.5-pro'),
      schema: personaSchema,
      prompt: `
        You are a marketing expert tasked with creating a detailed customer persona based on real user analytics data.
        
        Based on the following analytics data from a platform, create a comprehensive customer persona:
        
        ANALYTICS DATA:
        - Total Users: ${analyticsData.totalUsers}
        - Active Users: ${analyticsData.activeUsers} (${((analyticsData.activeUsers / analyticsData.totalUsers) * 100).toFixed(1)}%)
        - Average Monthly Spend: $${analyticsData.avgSpend.toFixed(2)}
        - Total Revenue: $${analyticsData.totalRevenue.toFixed(2)}
        
        TOP INDUSTRIES:
        ${analyticsData.topIndustries.map(item => `- ${item.industry}: ${item.count} users (${item.percentage}%)`).join('\n')}
        
        TOP AGE GROUPS:
        ${analyticsData.topAgeGroups.map(item => `- ${item.age}: ${item.count} users (${item.percentage}%)`).join('\n')}
        
        TOP LOCATIONS:
        ${analyticsData.topLocations.map(item => `- ${item.location}: ${item.count} users (${item.percentage}%)`).join('\n')}
        
        TOP JOB TITLES:
        ${analyticsData.topJobTitles.map(item => `- ${item.jobTitle}: ${item.count} users (${item.percentage}%)`).join('\n')}
        
        RECENT USER SAMPLE:
        ${analyticsData.recentSignups.slice(0, 5).map(user => 
          `- ${user.jobTitle || 'Unknown'} in ${user.industry || 'Unknown'}, ${user.location || 'Unknown'}, Age: ${user.age || 'Unknown'}, Spend: $${user.monthlySpend || 0}/month`
        ).join('\n')}
        
        Create a persona that represents the most significant segment of this user base. Focus on:
        1. The dominant demographic patterns
        2. Likely behavioral characteristics based on job titles and industries
        3. Communication preferences that would resonate with this audience
        4. Pain points and motivations relevant to their professional context
        5. Marketing preferences that align with their demographic and professional profile
        
        Make the persona actionable for marketing campaigns and content creation.
      `,
    });

    // Save the generated persona to the database
    const savedPersona = await prisma.persona.create({
      data: {
        name: result.object.name,
        description: result.object.description,
        demographics: result.object.demographics,
        behaviors: result.object.behaviors,
        preferences: result.object.preferences,
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
        message: 'Persona generated successfully',
        data: {
          id: savedPersona.id,
          name: savedPersona.name,
          description: savedPersona.description,
          demographics: savedPersona.demographics,
          behaviors: savedPersona.behaviors,
          preferences: savedPersona.preferences,
          createdAt: savedPersona.createdAt,
          creator: savedPersona.creator,
        },
        analyticsUsed: {
          totalUsers: analyticsData.totalUsers,
          topIndustries: analyticsData.topIndustries.slice(0, 3),
          topAgeGroups: analyticsData.topAgeGroups.slice(0, 3),
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Generate persona error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to generate persona',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}