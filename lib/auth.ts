import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  orgId: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      name: user.name,
      orgId: user.orgId,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      id: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      orgId: decoded.orgId,
      role: decoded.role,
    };
  } catch (error) {
    return null;
  }
}

export async function createUser(
  email: string,
  password: string,
  name: string,
  accountType: string,
  organizationName?: string,
  existingOrganization?: string
) {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  let organization;
  let userRole: "ADMIN" | "MEMBER" = "MEMBER";

  if (accountType === "organization") {
    // Creating a new organization
    if (!organizationName) {
      throw new Error("Organization name is required for organization accounts");
    }

    organization = await prisma.organization.create({
      data: {
        name: organizationName,
      },
    });
    userRole = "ADMIN"; // Organization creator is admin
  } else {
    // Individual account
    if (existingOrganization) {
      // Try to join existing organization
      const existingOrg = await prisma.organization.findFirst({
        where: {
          name: {
            equals: existingOrganization,
            mode: 'insensitive', // Case-insensitive comparison
          },
        },
      });

      if (!existingOrg) {
        throw new Error(`Organization "${existingOrganization}" does not exist. Please check the name or contact your organization administrator.`);
      }

      organization = existingOrg;
      userRole = "MEMBER"; // Joining existing org as member
    } else {
      // Create personal organization
      organization = await prisma.organization.create({
        data: {
          name: `${name}'s Organization`,
        },
      });
      userRole = "ADMIN"; // Personal org creator is admin
    }
  }

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      orgId: organization.id,
      role: userRole,
    },
    include: {
      organization: true,
    },
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    orgId: user.orgId,
    role: user.role,
  };
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<AuthUser | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      organization: true,
    },
  });

  if (!user) {
    return null;
  }

  const isValidPassword = await verifyPassword(password, user.password);
  if (!isValidPassword) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    orgId: user.orgId,
    role: user.role,
  };
}
