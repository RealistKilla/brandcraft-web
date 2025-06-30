import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { appId: string } }
) {
  const { appId } = params;
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

  // Here you would typically add the user to the platform in your database
  // For demonstration, we will just return a success message
  return NextResponse.json(
    { message: "Platform user added successfully" },
    { status: 200 }
  );
}
