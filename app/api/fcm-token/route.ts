import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
      
      const body = await req.json();
      const { fcmToken } = body;

      if (!fcmToken) {
        return NextResponse.json(
          { message: "FCM token is required" },
          { status: 400 }
        );
      }

      // Update user's FCM token
      await prisma.user.update({
        where: { id: decoded.id },
        data: { fcmToken },
      });

      return NextResponse.json({ message: "FCM token registered successfully" });
    } catch (jwtError) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error registering FCM token:", error);
    return NextResponse.json(
      { message: "Failed to register FCM token" },
      { status: 500 }
    );
  }
}