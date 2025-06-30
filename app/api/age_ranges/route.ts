import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  // This route is used to fetch age ranges for the platform user form
  try {
    const ageRanges = await prisma.ageRanges.findMany({
      orderBy: { id: "asc" },
    });

    console.log("Fetched age ranges:", ageRanges);

    const safeAgeRanges = ageRanges.map((ageRange) => ({
      ...ageRange,
      id: ageRange.id.toString(),
      createdAt: ageRange.createdAt.toISOString(),
    }));

    return NextResponse.json(
      { success: true, data: safeAgeRanges },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching age ranges:", error);
    return NextResponse.json(
      { error: "Failed to fetch age ranges" },
      { status: 500 }
    );
  }
}
