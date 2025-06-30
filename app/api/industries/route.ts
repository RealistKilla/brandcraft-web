import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const industries = await prisma.industries.findMany({
      orderBy: {
        industry: "asc",
      },
    });

    const safeIndustries = industries.map((industry) => ({
      ...industry,
      id: industry.id.toString(), //
      createdAt: industry.createdAt.toISOString(),
    }));

    return NextResponse.json(
      {
        success: true,
        data: safeIndustries,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching industries:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch industries",
      },
      { status: 500 }
    );
  }
}
