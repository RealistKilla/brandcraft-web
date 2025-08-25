import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  const existingEntry = await prisma.waitlist.findUnique({
    where: { email },
  });

  if (existingEntry) {
    console.log("Email already in waitlist:", email);
    return NextResponse.json(
      {
        success: false,
        message: "Email is already in the waitlist!",
      },
      { status: 400 }
    );
  }

  if (!email) {
    return NextResponse.json(
      { success: false, message: "Email is required" },
      { status: 400 }
    );
  }

  // Add the email to the waitlist
  try {
    await prisma.waitlist.create({
      data: { email },
    });
    return NextResponse.json(
      { success: true, message: "Successfully added to waitlist" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to add to waitlist" },
      { status: 500 }
    );
  }
}
