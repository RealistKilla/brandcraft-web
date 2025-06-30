import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { appId: string } }
) {
  const { appId } = params;
  const body = await request.json();

  console.log("body", body);

  // Validate request body
  if (!body.applicationId || !body.applicationKey) {
    return new Response("Invalid request", { status: 400 });
  }

  const validApp = await prisma.application.findUnique({
    where: { applicationId: appId },
  });

  if (!validApp) {
    return new Response("Application not found", { status: 404 });
  }
  // Here you would typically add the user to the platform in your database
  // For demonstration, we will just return a success message
  return new Response(
    JSON.stringify({ message: "Platform user added successfully" }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
