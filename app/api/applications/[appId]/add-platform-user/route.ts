import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ appId: string }> }
) {
  const { appId } = await params;
  const body = await request.json();

  const validApp = await prisma.application.findUnique({
    where: { applicationId: appId },
  });

  // Validate request body
  if (!validApp) {
    return NextResponse.json(
      { error: "Application not found" },
      { status: 404 }
    );
  }

  if (validApp.applicationKey !== body.applicationKey) {
    return NextResponse.json(
      { error: "Invalid application key" },
      { status: 403 }
    );
  }

  try {
    await prisma.platformUser.create({
      data: {
        age: body.age,
        company: body.company,
        industry: body.industry,
        jobTitle: body.jobTitle,
        orgId: validApp.orgId,
        location: body.location,
        monthlySpendUsd: body.monthlySpendUsd,
      },
    });
  } catch (error) {
    console.error("Error adding platform user:", error);
    return NextResponse.json(
      { error: "Failed to add platform user" },
      { status: 500 }
    );
  }

  // Here you would typically add the user to the platform in your database
  // For demonstration, we will just return a success message
  return NextResponse.json(
    { message: "Platform user added successfully" },
    { status: 200 }
  );
}
