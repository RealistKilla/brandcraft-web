import { addToWaitlist } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email) {
    return new NextResponse("Email is required", { status: 400 });
  }

  // Add the email to the waitlist
  await addToWaitlist(email);

  return new NextResponse("Successfully added to waitlist", { status: 200 });
}
